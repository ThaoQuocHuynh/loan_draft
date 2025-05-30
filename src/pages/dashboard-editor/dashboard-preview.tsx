"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useAdminDashboard } from "@/pages/dashboard-editor/deprecated/contexts/editor-context"
import type { Component } from "@/types/views"
import { EyeOff } from "lucide-react"
// import { LoanQueue } from "@/pages/dashboard-editor/components/widgets/loan-queue"
// import { TaskList } from "@/pages/dashboard-editor/components/widgets/task-list"
// import { DocumentUpload } from "@/pages/dashboard-editor/components/widgets/document-upload"

export function DashboardPreview() {
  const { currentView, setPreviewMode, currentDashboardConfig } = useAdminDashboard()

  if (!currentView || !currentDashboardConfig) {
    return (
      <div className="p-8 text-center">
        <p>No dashboard configuration found to preview.</p>
      </div>
    )
  }

  const renderComponent = (component: Component) => {
    switch (component.definitionId) {
      case "loanQueue":
        // return <LoanQueue />
        return <div>Loan Queue</div>
      case "taskList":
        // return <TaskList />
        return <div>Task List</div>
      case "documentUpload":
        // return <DocumentUpload />
        return <div>Document Upload</div>
      default:
        return (
          <Card>
            <CardContent className="p-4">
              <div className="text-center py-8">
                <p className="text-lg font-medium">{component.title}</p>
                <p className="text-sm text-muted-foreground">{component.definitionId} component preview</p>
              </div>
            </CardContent>
          </Card>
        )
    }
  }

  return (
    <div className="space-y-4 w-full">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{currentView.name}</h1>
        <Button onClick={() => setPreviewMode(false)}>
          <EyeOff className="h-4 w-4 mr-2" />
          Exit Preview
        </Button>
      </div>

      <div className="grid gap-4 grid-cols-12 w-full">
        {currentView.components.map((component) => (
          <div
            key={component.id}
            className="col-span-12"
            style={{
              gridColumn: `span ${component.position.w} / span ${component.position.w}`,
              gridRow: `span ${component.position.h} / span ${component.position.h}`,
              order: component.position.y * 12 + component.position.x,
            }}
          >
            {renderComponent(component)}
          </div>
        ))}
      </div>
    </div>
  )
}
