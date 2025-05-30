import { ComponentInstance } from "./components"
export interface Dashboard {
    id: string
    name: string
    filters: []
    components: ComponentInstance[]
    icon?: string
    order: number
    path: string
    version: string
    status: "published" | "draft" | "archived"
    lastModified: string
    createdBy: string
    tags?: string[],
    steps?: number,
    completions?: number
  }