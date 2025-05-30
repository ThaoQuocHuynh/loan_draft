export interface DataField {
  id: string
  canonicalName: string
  systemName: string
  dataType: string
  isSystemRequired: boolean
  folderId: string // Added folder ID to associate fields with folders
}

export interface Folder {
  id: string
  name: string
  parentId: string | null
  isExpanded?: boolean
  children?: Folder[]
  fields?: DataField[]
}
