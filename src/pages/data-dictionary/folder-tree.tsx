"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import type { Folder } from "@/types/data-field"
import { ChevronDown, ChevronRight, Edit, File, FolderIcon, FolderPlus, Plus, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"

interface FolderTreeProps {
  folders: Folder[]
  onFolderSelect: (folderId: string) => void
  selectedFolderId: string
  onAddFolder: (folder: Folder) => void
  onRenameFolder: (folderId: string, newName: string) => void
  onDeleteFolder: (folderId: string) => void
  onMoveField: (fieldId: string, targetFolderId: string) => void
}

export function FolderTree({
  folders,
  onFolderSelect,
  selectedFolderId,
  onAddFolder,
  onRenameFolder,
  onDeleteFolder,
  onMoveField,
}: FolderTreeProps) {
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({})
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isAddRootDialogOpen, setIsAddRootDialogOpen] = useState(false)
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [newFolderName, setNewFolderName] = useState("")
  const [currentFolder, setCurrentFolder] = useState<Folder | null>(null)
  const [draggedField, setDraggedField] = useState<string | null>(null)

  // Initialize expanded state for all folders
  useEffect(() => {
    const initializeExpandedState = (folders: Folder[], expanded: Record<string, boolean>) => {
      folders.forEach((folder) => {
        expanded[folder.id] = folder.isExpanded || false
        if (folder.children) {
          initializeExpandedState(folder.children, expanded)
        }
      })
    }

    const expanded: Record<string, boolean> = {}
    folders.forEach((folder) => {
      expanded[folder.id] = folder.isExpanded || false
      if (folder.children) {
        initializeExpandedState(folder.children, expanded)
      }
    })

    setExpandedFolders(expanded)
  }, [folders]) // Re-initialize when folders change

  const toggleFolder = (folderId: string) => {
    setExpandedFolders((prev) => ({
      ...prev,
      [folderId]: !prev[folderId],
    }))
  }

  const handleAddFolder = () => {
    if (newFolderName.trim() && currentFolder) {
      const newFolder: Folder = {
        id: `folder_${Date.now()}`,
        name: newFolderName,
        parentId: currentFolder.id,
      }
      onAddFolder(newFolder)
      setNewFolderName("")
      setIsAddDialogOpen(false)

      // Expand the parent folder
      setExpandedFolders((prev) => ({
        ...prev,
        [currentFolder.id]: true,
      }))
    }
  }

  const handleAddRootFolder = () => {
    if (newFolderName.trim()) {
      const newFolder: Folder = {
        id: `folder_${Date.now()}`,
        name: newFolderName,
        parentId: null,
      }
      onAddFolder(newFolder)
      setNewFolderName("")
      setIsAddRootDialogOpen(false)
    }
  }

  const handleRenameFolder = () => {
    if (newFolderName.trim() && currentFolder) {
      onRenameFolder(currentFolder.id, newFolderName)
      setNewFolderName("")
      setIsRenameDialogOpen(false)
    }
  }

  const handleDeleteFolder = () => {
    if (currentFolder) {
      onDeleteFolder(currentFolder.id)
      setIsDeleteDialogOpen(false)
    }
  }

  const openAddDialog = (folder: Folder) => {
    setCurrentFolder(folder)
    setNewFolderName("")
    setIsAddDialogOpen(true)
  }

  const openAddRootDialog = () => {
    setNewFolderName("")
    setIsAddRootDialogOpen(true)
  }

  const openRenameDialog = (folder: Folder) => {
    setCurrentFolder(folder)
    setNewFolderName(folder.name)
    setIsRenameDialogOpen(true)
  }

  const openDeleteDialog = (folder: Folder) => {
    setCurrentFolder(folder)
    setIsDeleteDialogOpen(true)
  }

  const handleDragStart = (fieldId: string) => {
    setDraggedField(fieldId)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent, folderId: string) => {
    e.preventDefault()
    if (draggedField) {
      onMoveField(draggedField, folderId)
      setDraggedField(null)
    }
  }

  const renderFolderTree = (folders: Folder[], level = 0) => {
    return folders.map((folder) => {
      const isExpanded = expandedFolders[folder.id] || false
      const isSelected = selectedFolderId === folder.id
      const fieldsInFolder = folder.fields || []

      return (
        <div key={folder.id} className="select-none">
          <div
            className={cn(
              "flex items-center py-1 px-2 rounded-md hover:bg-muted/50 cursor-pointer",
              isSelected && "bg-muted",
            )}
            style={{ paddingLeft: `${level * 12 + 4}px` }}
            onClick={(e) => {
              e.stopPropagation()
              onFolderSelect(folder.id)
            }}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, folder.id)}
          >
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5 p-0 mr-1"
              onClick={(e) => {
                e.stopPropagation()
                toggleFolder(folder.id)
              }}
            >
              {folder.children && folder.children.length > 0 ? (
                isExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )
              ) : (
                <div className="w-4" />
              )}
            </Button>
            <FolderIcon className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="text-sm flex-grow truncate">{folder.name}</span>
            <span className="text-xs text-muted-foreground mr-2">{fieldsInFolder.length}</span>
            <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 p-0"
                onClick={(e) => {
                  e.stopPropagation()
                  openRenameDialog(folder)
                }}
              >
                <Edit className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 p-0"
                onClick={(e) => {
                  e.stopPropagation()
                  openDeleteDialog(folder)
                }}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 p-0 ml-1"
              onClick={(e) => {
                e.stopPropagation()
                openAddDialog(folder)
              }}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>

          {isExpanded && (
            <>
              {folder.children && folder.children.length > 0 && renderFolderTree(folder.children, level + 1)}

              {isSelected && fieldsInFolder.length > 0 && (
                <div className="ml-6 pl-4 border-l border-muted">
                  {fieldsInFolder.map((field) => (
                    <div
                      key={field.id}
                      className="flex items-center py-1 px-2 text-sm text-muted-foreground hover:bg-muted/30 rounded-md cursor-pointer"
                      style={{ paddingLeft: `${level * 12 + 16}px` }}
                      draggable
                      onDragStart={() => handleDragStart(field.id)}
                    >
                      <File className="h-3 w-3 mr-2" />
                      <span className="truncate">{field.canonicalName}</span>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )
    })
  }

  return (
    <div className="h-full overflow-auto border rounded-md p-2">
      <div className="flex items-center justify-between mb-2 px-2">
        <div className="font-medium">Folders</div>
        <Button variant="ghost" size="sm" className="h-8 px-2" onClick={openAddRootDialog}>
          <FolderPlus className="h-4 w-4 mr-1" />
          New Root Folder
        </Button>
      </div>
      {renderFolderTree(folders)}

      {/* Add Folder Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Folder</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Input
                id="name"
                placeholder="Folder name"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddFolder}>Add Folder</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Root Folder Dialog */}
      <Dialog open={isAddRootDialogOpen} onOpenChange={setIsAddRootDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Root Folder</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Input
                id="name"
                placeholder="Root folder name"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddRootDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddRootFolder}>Add Root Folder</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rename Folder Dialog */}
      <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Rename Folder</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Input
                id="name"
                placeholder="Folder name"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRenameDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleRenameFolder}>Rename</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Folder Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Folder</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>
              Are you sure you want to delete the folder "{currentFolder?.name}"?
              {currentFolder?.parentId === null
                ? " This will delete all subfolders and move all fields to an unassigned state."
                : " This will move all fields in this folder to the parent folder."}
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteFolder}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
