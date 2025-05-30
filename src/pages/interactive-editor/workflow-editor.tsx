"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import WorkflowCanvas from "./workflow-canvas"
import WorkflowSidebar from "./workflow-sidebar"
import WorkflowPreview from "./workflow-preview"
import WorkflowProperties from "./workflow-properties"
import { WorkflowProvider, useWorkflow } from "./workflow-context"
import { CollapsiblePanel } from "./collapsible-panel"

function WorkflowEditorContent() {
  const [workflowName, setWorkflowName] = useState("New Workflow")
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isPropertiesCollapsed, setIsPropertiesCollapsed] = useState(true)
  const { selectedStep } = useWorkflow()

  // Automatically open/close properties panel when a node is selected/deselected
  useEffect(() => {
    setIsPropertiesCollapsed(!selectedStep)
  }, [selectedStep])

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-none p-4 border-b">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label htmlFor="workflow-name">Workflow Name</Label>
            <Input
              id="workflow-name"
              value={workflowName}
              onChange={(e) => setWorkflowName(e.target.value)}
              className="max-w-xs"
            />
          </div>
          <div className="space-x-2">
            <Button variant="outline">Save Draft</Button>
            <Button>Publish Workflow</Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="editor" className="flex-1 flex flex-col min-h-0">
        <div className="flex-none px-4 pt-4">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="editor">Editor</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="editor" className="flex-1 flex flex-col min-h-0 p-4">
          <div className="flex gap-4 flex-1 min-h-0">
            <CollapsiblePanel
              side="left"
              isCollapsed={isSidebarCollapsed}
              onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            >
              <WorkflowSidebar />
            </CollapsiblePanel>

            <div className="flex-1 min-w-0">
              <div className="h-full w-full">
                <WorkflowCanvas />
              </div>
            </div>

            <CollapsiblePanel
              side="right"
              isCollapsed={isPropertiesCollapsed}
              onToggle={() => setIsPropertiesCollapsed(!isPropertiesCollapsed)}
            >
              <WorkflowProperties />
            </CollapsiblePanel>
          </div>
        </TabsContent>
        <TabsContent value="preview" className="flex-1 p-4">
          <WorkflowPreview workflowName={workflowName} />
        </TabsContent>
        <TabsContent value="settings" className="flex-1 p-4">
          <div className="space-y-4 max-w-2xl">
            <h3 className="text-lg font-medium">Workflow Settings</h3>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input id="description" placeholder="Describe the purpose of this workflow" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="completion-message">Completion Message</Label>
              <Input id="completion-message" placeholder="Message to show when workflow is completed" />
            </div>
            <div className="space-y-2">
              <Label>Notifications</Label>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="email-notification" />
                <label htmlFor="email-notification">Send email notification on completion</label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="admin-notification" />
                <label htmlFor="admin-notification">Notify administrators</label>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function WorkflowEditor() {
  return (
    <WorkflowProvider>
      <WorkflowEditorContent />
    </WorkflowProvider>
  )
}

export { WorkflowEditor }
