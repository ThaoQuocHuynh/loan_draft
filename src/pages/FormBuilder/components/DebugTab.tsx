import ReactJson from 'react-json-view'
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"
import { useFormBuilder } from '../contexts/FormBuilderContext'

export function DebugTab() {
  const { currentForm: formState, updateFormSettings } = useFormBuilder()

  const handleEdit = (edit: any) => {
    // Create a new object with the updated value
    const updatedState = { ...formState }
    const path = edit.name.split('.')
    let current: any = updatedState
    
    // Navigate to the nested property
    for (let i = 0; i < path.length - 1; i++) {
      current = current[path[i]]
    }
    
    // Update the value
    current[path[path.length - 1]] = edit.new_value
    
    // Update the form state
    updateFormSettings(updatedState)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Form Metadata Debug</h3>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => window.location.reload()}
        >
          <RefreshCw className="h-4 w-4 mr-1" />
          Refresh
        </Button>
      </div>
      <div className="bg-muted p-4 rounded-lg">
        <ReactJson
          src={formState}
          theme="monokai"
          name="formState"
          enableClipboard={true}
          displayDataTypes={false}
          onEdit={handleEdit}
          onAdd={handleEdit}
          onDelete={handleEdit}
        />
      </div>
    </div>
  )
} 