import { useWorkflow } from "./workflow-context"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function WorkflowProperties() {
  const { selectedStep, steps, updateStep, removeStep } = useWorkflow()
  const selectedStepData = selectedStep ? steps.find((step) => step.id === selectedStep) : null

  if (!selectedStepData || !selectedStep) return null

  return (
    <div className="flex flex-col h-full">
      <div className="flex-none p-4 border-b">
        <h3 className="font-medium">Properties</h3>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="step-title">Title</Label>
            <Input
              id="step-title"
              value={selectedStepData.title}
              onChange={(e) => updateStep(selectedStep, { title: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="step-description">Description</Label>
            <Textarea
              id="step-description"
              value={selectedStepData.description}
              onChange={(e) => updateStep(selectedStep, { description: e.target.value })}
            />
          </div>

          {selectedStep !== "start" && selectedStep !== "end" && (
            <Button variant="destructive" size="sm" className="w-full" onClick={() => removeStep(selectedStep)}>
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Step
            </Button>
          )}
        </div>
      </ScrollArea>
    </div>
  )
} 