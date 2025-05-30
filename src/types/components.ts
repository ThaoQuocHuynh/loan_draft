export type ComponentType =
  | "loanQueue"
  | "taskList"
  | "documentUpload"
  | "loanStatus"
  | "analytics"
  | "calendar"
  | "custom"

export interface ComponentDefinition {
  id: string
  type: ComponentType
  title: string
  description: string
  icon: string
  defaultSize: {
    w: number
    h: number
  }
  configOptions: ComponentConfigOption[]
}

export interface ComponentConfigOption {
  id: string
  label: string
  type: "toggle" | "select" | "input" | "radio" | "checkbox" | "multiselect"
  options?: { value: string; label: string }[]
  defaultValue?: any
}

export interface ComponentInstance {
  id: string
  definitionId: string
  title: string
  position: {
    x: number
    y: number
    w: number
    h: number
  }
  config: Record<string, any>
}

export interface ComponentInstance {
    id: string
    definitionId: string
    title: string
    position: {
        x: number
        y: number
        w: number
        h: number
    }
    config: Record<string, any>
}

export interface GridPosition {
    i: string
    x: number
    y: number
    w: number
    h: number
    minW?: number
    minH?: number
    maxW?: number
    maxH?: number
    static?: boolean
}