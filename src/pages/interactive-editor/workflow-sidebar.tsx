"use client"

import { useState } from "react"
import { useWorkflow, type WorkflowStep, type FormField } from "./workflow-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Trash2, FormInput, ListChecks, Calendar, FileText } from "lucide-react"
import { v4 as uuidv4 } from "uuid"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function WorkflowSidebar() {
  const { steps, addStep, updateStep, removeStep, selectedStep } = useWorkflow()
  const [newFieldType, setNewFieldType] = useState("text")

  const selectedStepData = selectedStep ? steps.find((step) => step.id === selectedStep) : null

  const handleAddStep = (type: string) => {
    const newStep: WorkflowStep = {
      id: uuidv4(),
      title: `New ${type} Step`,
      description: `Description for the ${type} step`,
      fields: [],
    }
    addStep(newStep)
  }

  const handleAddField = () => {
    if (!selectedStep) return

    const newField: FormField = {
      id: uuidv4(),
      type: newFieldType,
      label: `New ${newFieldType} field`,
      placeholder: `Enter ${newFieldType}`,
      required: false,
    }

    const currentStep = steps.find((step) => step.id === selectedStep)
    if (currentStep) {
      updateStep(selectedStep, {
        fields: [...currentStep.fields, newField],
      })
    }
  }

  const handleRemoveField = (fieldId: string) => {
    if (!selectedStep) return

    const currentStep = steps.find((step) => step.id === selectedStep)
    if (currentStep) {
      updateStep(selectedStep, {
        fields: currentStep.fields.filter((field) => field.id !== fieldId),
      })
    }
  }

  const handleUpdateField = (fieldId: string, updates: Partial<FormField>) => {
    if (!selectedStep) return

    const currentStep = steps.find((step) => step.id === selectedStep)
    if (currentStep) {
      updateStep(selectedStep, {
        fields: currentStep.fields.map((field) => (field.id === fieldId ? { ...field, ...updates } : field)),
      })
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-none p-4 border-b bg-muted/50">
        <h3 className="font-medium">Workflow Components</h3>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <Card className="cursor-pointer hover:bg-muted/50" onClick={() => handleAddStep("Form")}>
              <CardContent className="p-4 flex flex-col items-center justify-center">
                <FormInput className="h-8 w-8 mb-2 text-primary" />
                <p className="text-sm font-medium">Form Step</p>
              </CardContent>
            </Card>
            <Card className="cursor-pointer hover:bg-muted/50" onClick={() => handleAddStep("Decision")}>
              <CardContent className="p-4 flex flex-col items-center justify-center">
                <ListChecks className="h-8 w-8 mb-2 text-primary" />
                <p className="text-sm font-medium">Decision</p>
              </CardContent>
            </Card>
            <Card className="cursor-pointer hover:bg-muted/50" onClick={() => handleAddStep("Approval")}>
              <CardContent className="p-4 flex flex-col items-center justify-center">
                <Calendar className="h-8 w-8 mb-2 text-primary" />
                <p className="text-sm font-medium">Approval</p>
              </CardContent>
            </Card>
            <Card className="cursor-pointer hover:bg-muted/50" onClick={() => handleAddStep("Document")}>
              <CardContent className="p-4 flex flex-col items-center justify-center">
                <FileText className="h-8 w-8 mb-2 text-primary" />
                <p className="text-sm font-medium">Document</p>
              </CardContent>
            </Card>
          </div>

          <div className="text-sm text-muted-foreground">
            <p>Drag and drop components onto the canvas or click to add them.</p>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}
