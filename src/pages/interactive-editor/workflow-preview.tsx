"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, ArrowRight, Check } from "lucide-react"
import { useState } from "react"
import { useWorkflow, type FormField } from "./workflow-context"

export default function WorkflowPreview({ workflowName }: { workflowName: string }) {
  const { steps, connections } = useWorkflow()
  const [currentStepId, setCurrentStepId] = useState("start")
  const [formData, setFormData] = useState<Record<string, string | boolean | number>>({})

  // Find the current step
  const currentStep = steps.find((step) => step.id === currentStepId)

  // Find the next step based on connections
  const nextStepId = connections.find((conn) => conn.source === currentStepId)?.target

  // Calculate progress percentage
  const totalSteps = steps.length - 2 // Exclude start and end
  const currentStepIndex = steps.findIndex((step) => step.id === currentStepId)
  const progress = totalSteps > 0 ? Math.max(0, ((currentStepIndex - 1) / totalSteps) * 100) : 0

  const handleNext = () => {
    if (nextStepId) {
      setCurrentStepId(nextStepId)
    }
  }

  const handlePrevious = () => {
    // Find the step that connects to the current step
    const prevStepId = connections.find((conn) => conn.target === currentStepId)?.source
    if (prevStepId) {
      setCurrentStepId(prevStepId)
    }
  }

  const handleInputChange = (fieldId: string, value: string | boolean | number) => {
    setFormData({
      ...formData,
      [`${currentStepId}_${fieldId}`]: value,
    })
  }

  const renderField = (field: FormField) => {
    const fieldId = `${currentStepId}_${field.id}`
    const value = formData[fieldId] ?? ""

    switch (field.type) {
      case "text":
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={fieldId}>
              {field.label}
              {field.required && <span className="text-red-500">*</span>}
            </Label>
            <Input
              id={fieldId}
              placeholder={field.placeholder}
              value={value as string}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
            />
          </div>
        )
      case "textarea":
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={fieldId}>
              {field.label}
              {field.required && <span className="text-red-500">*</span>}
            </Label>
            <Textarea
              id={fieldId}
              placeholder={field.placeholder}
              value={value as string}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
            />
          </div>
        )
      case "number":
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={fieldId}>
              {field.label}
              {field.required && <span className="text-red-500">*</span>}
            </Label>
            <Input
              id={fieldId}
              type="number"
              placeholder={field.placeholder}
              value={value as string}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
            />
          </div>
        )
      case "checkbox":
        return (
          <div key={field.id} className="flex items-center space-x-2 py-2">
            <Checkbox
              id={fieldId}
              checked={value === true}
              onCheckedChange={(checked) => handleInputChange(field.id, checked === true)}
            />
            <Label htmlFor={fieldId}>
              {field.label}
              {field.required && <span className="text-red-500">*</span>}
            </Label>
          </div>
        )
      case "date":
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={fieldId}>
              {field.label}
              {field.required && <span className="text-red-500">*</span>}
            </Label>
            <Input
              id={fieldId}
              type="date"
              value={value as string}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
            />
          </div>
        )
      case "select":
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={fieldId}>
              {field.label}
              {field.required && <span className="text-red-500">*</span>}
            </Label>
            <select
              id={fieldId}
              value={value as string}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              <option value="">Select an option</option>
              {field.options?.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-xl font-bold">{workflowName} Preview</h2>
        <p className="text-muted-foreground">This is how end users will see your workflow</p>
      </div>

      <div className="mb-6">
        <Progress value={progress} className="h-2" />
        <div className="flex justify-between mt-2 text-sm text-muted-foreground">
          <span>Start</span>
          <span>Progress: {Math.round(progress)}%</span>
          <span>Complete</span>
        </div>
      </div>

      <Card className="w-full">
        {currentStepId === "start" ? (
          <>
            <CardHeader>
              <CardTitle>Welcome to {workflowName}</CardTitle>
              <CardDescription>Follow the steps to complete this workflow</CardDescription>
            </CardHeader>
            <CardFooter className="flex justify-end">
              <Button onClick={handleNext}>
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </>
        ) : currentStepId === "end" ? (
          <>
            <CardHeader>
              <CardTitle>Workflow Complete</CardTitle>
              <CardDescription>Thank you for completing this workflow</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center p-6">
                <div className="rounded-full bg-green-100 p-3">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <div className="text-center">
                <p>All steps have been completed successfully. Your information has been submitted.</p>
                <p className="text-muted-foreground mt-2">A confirmation has been sent to your email address.</p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button variant="outline" onClick={() => setCurrentStepId("start")}>
                Start Over
              </Button>
            </CardFooter>
          </>
        ) : (
          <>
            <CardHeader>
              <CardTitle>{currentStep?.title}</CardTitle>
              <CardDescription>{currentStep?.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">{currentStep?.fields.map((field) => renderField(field))}</div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handlePrevious}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>
              <Button onClick={handleNext}>
                {nextStepId === "end" ? "Complete" : "Next"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </>
        )}
      </Card>
    </div>
  )
}
