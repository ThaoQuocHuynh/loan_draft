"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

export type FormField = {
  id: string
  type: string
  label: string
  placeholder?: string
  required?: boolean
  options?: string[]
}

export type WorkflowStep = {
  id: string
  title: string
  description: string
  fields: FormField[]
  nextStepId?: string
  automatedActions?: {
    type: string
    config: Record<string, any>
  }[]
}

type WorkflowContextType = {
  steps: WorkflowStep[]
  connections: { source: string; target: string }[]
  selectedStep: string | null
  addStep: (step: WorkflowStep) => void
  updateStep: (id: string, step: Partial<WorkflowStep>) => void
  removeStep: (id: string) => void
  addConnection: (source: string, target: string) => void
  removeConnection: (source: string, target: string) => void
  selectStep: (id: string | null) => void
}

const WorkflowContext = createContext<WorkflowContextType | undefined>(undefined)

export function WorkflowProvider({ children }: { children: ReactNode }) {
  const [steps, setSteps] = useState<WorkflowStep[]>([
    {
      id: "start",
      title: "Start",
      description: "Beginning of the workflow",
      fields: [],
    },
    {
      id: "end",
      title: "End",
      description: "End of the workflow",
      fields: [],
    },
  ])

  const [connections, setConnections] = useState<{ source: string; target: string }[]>([])
  const [selectedStep, setSelectedStep] = useState<string | null>(null)

  const addStep = (step: WorkflowStep) => {
    setSteps([...steps, step])
  }

  const updateStep = (id: string, updatedFields: Partial<WorkflowStep>) => {
    setSteps(steps.map((step) => (step.id === id ? { ...step, ...updatedFields } : step)))
  }

  const removeStep = (id: string) => {
    if (id === "start" || id === "end") return // Prevent removing start/end nodes
    setSteps(steps.filter((step) => step.id !== id))
    setConnections(connections.filter((conn) => conn.source !== id && conn.target !== id))
  }

  const addConnection = (source: string, target: string) => {
    // Remove any existing connections from the source
    const filteredConnections = connections.filter((conn) => conn.source !== source)
    setConnections([...filteredConnections, { source, target }])

    // Update the nextStepId of the source step
    updateStep(source, { nextStepId: target })
  }

  const removeConnection = (source: string, target: string) => {
    setConnections(connections.filter((conn) => !(conn.source === source && conn.target === target)))

    // Clear the nextStepId of the source step
    const sourceStep = steps.find((step) => step.id === source)
    if (sourceStep && sourceStep.nextStepId === target) {
      updateStep(source, { nextStepId: undefined })
    }
  }

  const selectStep = (id: string | null) => {
    setSelectedStep(id)
  }

  return (
    <WorkflowContext.Provider
      value={{
        steps,
        connections,
        selectedStep,
        addStep,
        updateStep,
        removeStep,
        addConnection,
        removeConnection,
        selectStep,
      }}
    >
      {children}
    </WorkflowContext.Provider>
  )
}

export function useWorkflow() {
  const context = useContext(WorkflowContext)
  if (context === undefined) {
    throw new Error("useWorkflow must be used within a WorkflowProvider")
  }
  return context
}
