import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Handle, Position } from "@xyflow/react"
import { CheckSquare, FileText, FormInput, List } from "lucide-react"
import { memo } from "react"
import { type WorkflowStep } from "./workflow-context"

function getIconForStepType(title: string) {
  if (title === "Start") return <FileText className="w-4 h-4 mr-2" />
  if (title === "End") return <CheckSquare className="w-4 h-4 mr-2" />

  // Default to form icon
  return <FormInput className="w-4 h-4 mr-2" />
}

interface WorkflowNodeProps {
  data: WorkflowStep;
}

function WorkflowNode({ data }: WorkflowNodeProps) {
  return (
    <Card className="w-64 shadow-md">
      <CardHeader className="p-3">
        <CardTitle className="text-sm flex items-center">
          {getIconForStepType(data.title)}
          {data.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 pt-0 text-xs">
        <p className="text-muted-foreground">{data.description}</p>
        {data.fields && data.fields.length > 0 && (
          <div className="mt-2">
            <div className="flex items-center text-xs text-muted-foreground">
              <List className="w-3 h-3 mr-1" />
              {data.fields.length} field{data.fields.length !== 1 ? "s" : ""}
            </div>
          </div>
        )}
        {data.automatedActions && data.automatedActions.length > 0 && (
          <div className="mt-1 text-xs text-muted-foreground">
            <span className="text-amber-500">⚡</span> Has automated actions
          </div>
        )}
      </CardContent>
      <Handle type="target" position={Position.Top} className="w-3 h-3" />
      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
    </Card>
  )
}

export default memo(WorkflowNode)
