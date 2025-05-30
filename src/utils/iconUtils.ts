import React from "react"
import {
  Activity,
  BarChart,
  BarChart3,
  Calendar,
  CheckSquare,
  FileKey2,
  FileText,
  GitBranch,
  Handshake,
  Home,
  Inbox,
  KeyRound,
  LayoutDashboard,
  ListChecks,
  MousePointerClick,
  PanelLeft,
  Settings,
  Upload,
  Users,
  VenetianMask,
  Workflow,
  LucideIcon,
  TableOfContents,
  BookA,
  SquareChevronRight
} from "lucide-react"

// Map of icon names to their components
const iconMap: Record<string, LucideIcon> = {
  Activity,
  BarChart,
  BarChart3,
  Calendar,
  CheckSquare,
  FileKey2,
  FileText,
  GitBranch,
  Handshake,
  Home,
  Inbox,
  KeyRound,
  LayoutDashboard,
  ListChecks,
  MousePointerClick,
  PanelLeft,
  Settings,
  Upload,
  Users,
  VenetianMask,
  Workflow,
  TableOfContents,
  BookA,
  SquareChevronRight
}

/**
 * Get an icon component by name
 * @param iconName The name of the icon to get
 * @param className Optional className to apply to the icon
 * @returns The icon component or a default icon if not found
 */
export function getIconByName(iconName: string, className?: string): React.ReactElement {
  const IconComponent = iconMap[iconName] || FileText // Default to FileText if not found
  
  if (className) {
    return React.createElement(IconComponent, { className })
  }
  
  return React.createElement(IconComponent)
}

/**
 * Get an icon component by name with default size
 * @param iconName The name of the icon to get
 * @param size The size to apply to the icon (e.g., "h-4 w-4")
 * @returns The icon component or a default icon if not found
 */
export function getIconWithSize(iconName: string, size: string = "h-4 w-4"): React.ReactElement {
  return getIconByName(iconName, size)
}

/**
 * Get an icon component by name with default size and margin
 * @param iconName The name of the icon to get
 * @param size The size to apply to the icon (e.g., "h-4 w-4")
 * @param margin The margin to apply to the icon (e.g., "mr-2")
 * @returns The icon component or a default icon if not found
 */
export function getIconWithSizeAndMargin(iconName: string, size: string = "h-4 w-4", margin: string = "mr-2"): React.ReactElement {
  return getIconByName(iconName, `${size} ${margin}`)
}

/**
 * Get an icon component for a workflow step type
 * @param stepType The type of workflow step
 * @returns The icon component for the workflow step
 */
export function getWorkflowIcon(stepType: string): React.ReactElement {
  const iconMap: Record<string, string> = {
    Form: "FormInput",
    Decision: "GitBranch",
    Approval: "CheckSquare",
    Document: "FileText"
  }
  
  const iconName = iconMap[stepType] || "FileText"
  return getIconWithSize(iconName, "h-8 w-8 mb-2 text-primary")
} 