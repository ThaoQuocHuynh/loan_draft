"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { DataField, Folder } from "@/types/data-field"

interface DataFieldDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (field: DataField) => void
  title: string
  description: string
  field: DataField | null
  folders: Folder[]
  currentFolderId: string
}

export function DataFieldDialog({
  open,
  onOpenChange,
  onSave,
  title,
  description,
  field,
  folders,
  currentFolderId,
}: DataFieldDialogProps) {
  const [formData, setFormData] = useState<DataField>({
    id: "",
    canonicalName: "",
    systemName: "",
    dataType: "string",
    isSystemRequired: false,
    folderId: currentFolderId,
  })

  const [errors, setErrors] = useState({
    canonicalName: "",
    systemName: "",
  })

  // Reset form when dialog opens/closes or field changes
  useEffect(() => {
    if (open && field) {
      setFormData(field)
    } else if (open) {
      setFormData({
        id: "",
        canonicalName: "",
        systemName: "",
        dataType: "string",
        isSystemRequired: false,
        folderId: currentFolderId,
      })
    }

    setErrors({
      canonicalName: "",
      systemName: "",
    })
  }, [open, field, currentFolderId])

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    // Clear error when user types
    if (field === "canonicalName" || field === "systemName") {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }

    // Auto-generate system name from canonical name if empty
    if (field === "canonicalName" && !formData.systemName) {
      const systemName = (value as string)
        .toLowerCase()
        .replace(/\s+/g, "_")
        .replace(/[^a-z0-9_]/g, "")

      setFormData((prev) => ({ ...prev, systemName }))
    }
  }

  const validateForm = () => {
    const newErrors = {
      canonicalName: "",
      systemName: "",
    }

    if (!formData.canonicalName.trim()) {
      newErrors.canonicalName = "Canonical name is required"
    }

    if (!formData.systemName.trim()) {
      newErrors.systemName = "System name is required"
    } else if (!/^[a-z][a-z0-9_]*$/.test(formData.systemName)) {
      newErrors.systemName =
        "System name must start with a letter and contain only lowercase letters, numbers, and underscores"
    }

    setErrors(newErrors)
    return !newErrors.canonicalName && !newErrors.systemName
  }

  const handleSubmit = () => {
    if (validateForm()) {
      onSave(formData)
    }
  }

  // Get flat list of folders for the dropdown
  const getFolderOptions = (
    folders: Folder[],
    level = 0,
    result: { id: string; name: string; level: number }[] = [],
  ) => {
    folders.forEach((folder) => {
      if (folder.id !== "root") {
        result.push({
          id: folder.id,
          name: folder.name,
          level,
        })
      }

      // If this is a folder with children, recursively add them
      if ("children" in folder && Array.isArray(folder.children)) {
        getFolderOptions(folder.children, level + 1, result)
      }
    })

    return result
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="canonicalName">Canonical Name</Label>
            <Input
              id="canonicalName"
              value={formData.canonicalName}
              onChange={(e) => handleChange("canonicalName", e.target.value)}
              placeholder="e.g. Customer First Name"
            />
            {errors.canonicalName && <p className="text-sm text-destructive">{errors.canonicalName}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="systemName">System Name (Key)</Label>
            <Input
              id="systemName"
              value={formData.systemName}
              onChange={(e) => handleChange("systemName", e.target.value)}
              placeholder="e.g. customer_first_name"
            />
            {errors.systemName && <p className="text-sm text-destructive">{errors.systemName}</p>}
            <p className="text-xs text-muted-foreground">
              Used as a unique identifier in the system. Must start with a letter and contain only lowercase letters,
              numbers, and underscores.
            </p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="dataType">Data Type</Label>
            <Select value={formData.dataType} onValueChange={(value) => handleChange("dataType", value)}>
              <SelectTrigger id="dataType">
                <SelectValue placeholder="Select data type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="string">String</SelectItem>
                <SelectItem value="number">Number</SelectItem>
                <SelectItem value="boolean">Boolean</SelectItem>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="datetime">DateTime</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="phone">Phone</SelectItem>
                <SelectItem value="url">URL</SelectItem>
                <SelectItem value="json">JSON</SelectItem>
                <SelectItem value="array">Array</SelectItem>
                <SelectItem value="object">Object</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="folder">Folder</Label>
            <Select value={formData.folderId} onValueChange={(value) => handleChange("folderId", value)}>
              <SelectTrigger id="folder">
                <SelectValue placeholder="Select folder" />
              </SelectTrigger>
              <SelectContent>
                {getFolderOptions(folders).map((folderOption) => (
                  <SelectItem key={folderOption.id} value={folderOption.id}>
                    {Array(folderOption.level).fill("—").join("")} {folderOption.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
