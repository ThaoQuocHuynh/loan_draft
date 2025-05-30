"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { DataField, Folder } from "@/types/data-field"
import { 
    getFields, 
    getField, 
    createField, 
    updateField, 
    deleteField, 
    getFolders, 
    getFolder, 
    createFolder, 
    updateFolder, 
    deleteFolder, 
    getFolderTree 
} from "@/services/mock-data-dict-api"

interface DataDictionaryContextType {
    fields: DataField[]
    folders: Folder[]
    folderTree: Folder[]

    // Field operations
    getField: (id: string) => DataField
    addField: (field: Omit<DataField, "id">) => string
    updateField: (id: string, field: Partial<DataField>) => void
    deleteField: (id: string) => void

    // Folder operations
    getFolder: (id: string) => Folder
    addFolder: (folder: Omit<Folder, "id">) => string
    updateFolder: (id: string, folder: Partial<Folder>) => void
    deleteFolder: (id: string) => void

    // Tree operations
    getFieldsForFolder: (folderId: string) => DataField[]
    moveFieldToFolder: (fieldId: string, targetFolderId: string) => void
}

const DataDictionaryContext = createContext<DataDictionaryContextType | undefined>(undefined)

export function DataDictionaryProvider({ children }: { children: ReactNode }) {
    // Initialize state with data from mock API
    const [fields, setFields] = useState<DataField[]>(getFields())
    const [folders, setFolders] = useState<Folder[]>(getFolders())
    const [folderTree, setFolderTree] = useState<Folder[]>(getFolderTree())

    // Update folder tree when fields or folders change
    useEffect(() => {
        setFolderTree(getFolderTree())
    }, [fields, folders])

    // Field operations
    const getFieldById = (id: string) => {
        return getField(id)
    }

    const addNewField = (field: Omit<DataField, "id">) => {
        const newField = createField({ ...field, id: "" } as DataField)
        setFields(prev => [...prev, newField])
        return newField.id
    }

    const updateExistingField = (id: string, field: Partial<DataField>) => {
        const existingField = fields.find(f => f.id === id)
        if (!existingField) return

        const updatedField = { ...existingField, ...field }
        updateField(updatedField)
        setFields(prev => prev.map(f => f.id === id ? updatedField : f))
    }

    const deleteExistingField = (id: string) => {
        deleteField(id)
        setFields(prev => prev.filter(f => f.id !== id))
    }

    // Folder operations
    const getFolderById = (id: string) => {
        return getFolder(id)
    }

    const addNewFolder = (folder: Omit<Folder, "id">) => {
        const newFolder = createFolder({ ...folder, id: "" } as Folder)
        setFolders(prev => [...prev, newFolder])
        return newFolder.id
    }

    const updateExistingFolder = (id: string, folder: Partial<Folder>) => {
        const existingFolder = folders.find(f => f.id === id)
        if (!existingFolder) return

        const updatedFolder = { ...existingFolder, ...folder }
        updateFolder(updatedFolder)
        setFolders(prev => prev.map(f => f.id === id ? updatedFolder : f))
    }

    const deleteExistingFolder = (id: string) => {
        // Find the folder to delete
        const folderToDelete = folders.find(f => f.id === id)
        if (!folderToDelete) return

        // Find all child folders recursively
        const getAllChildFolderIds = (parentId: string): string[] => {
            const directChildren = folders.filter(f => f.parentId === parentId).map(f => f.id)
            const allChildren = [...directChildren]

            directChildren.forEach(childId => {
                allChildren.push(...getAllChildFolderIds(childId))
            })

            return allChildren
        }

        const childFolderIds = getAllChildFolderIds(id)
        const allFolderIdsToDelete = [id, ...childFolderIds]

        // If it's a root folder, mark fields as unassigned
        if (folderToDelete.parentId === null) {
            // Move all fields from the deleted folder and its children to unassigned state
            setFields(prev => 
                prev.map(field => 
                    allFolderIdsToDelete.includes(field.folderId) 
                        ? { ...field, folderId: "" } 
                        : field
                )
            )
        } else {
            // Find the parent folder
            const parentFolderId = folderToDelete.parentId

            // Move all fields from the deleted folder and its children to the parent folder
            setFields(prev => 
                prev.map(field => 
                    allFolderIdsToDelete.includes(field.folderId) 
                        ? { ...field, folderId: parentFolderId } 
                        : field
                )
            )
        }

        // Remove the folder and all its children
        allFolderIdsToDelete.forEach(folderId => {
            deleteFolder(folderId)
        })
        setFolders(prev => prev.filter(folder => !allFolderIdsToDelete.includes(folder.id)))
    }

    // Tree operations
    const getFieldsForFolder = (folderId: string): DataField[] => {
        // If no folder is selected, show unassigned fields
        if (!folderId) {
            const folderIds = new Set(folders.map(f => f.id))
            return fields.filter(field => !folderIds.has(field.folderId))
        }
        return fields.filter(field => field.folderId === folderId)
    }

    const moveFieldToFolder = (fieldId: string, targetFolderId: string) => {
        const field = fields.find(f => f.id === fieldId)
        if (!field) return

        const updatedField = { ...field, folderId: targetFolderId }
        updateField(updatedField)
        setFields(prev => prev.map(f => f.id === fieldId ? updatedField : f))
    }

    const value = {
        fields,
        folders,
        folderTree,

        getField: getFieldById,
        addField: addNewField,
        updateField: updateExistingField,
        deleteField: deleteExistingField,

        getFolder: getFolderById,
        addFolder: addNewFolder,
        updateFolder: updateExistingFolder,
        deleteFolder: deleteExistingFolder,

        getFieldsForFolder,
        moveFieldToFolder
    }

    return (
        <DataDictionaryContext.Provider value={value}>
            {children}
        </DataDictionaryContext.Provider>
    )
}

export function useDataDictionary() {
    const context = useContext(DataDictionaryContext)
    if (context === undefined) {
        throw new Error("useDataDictionary must be used within a DataDictionaryProvider")
    }
    return context
} 