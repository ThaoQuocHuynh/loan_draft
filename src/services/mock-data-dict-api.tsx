import { DataField, Folder } from "@/types/data-field";
import { buildFolderTree, mockDataFields, mockFolders } from "@/services/data/sample-field-data";
import { generateId } from "@/utils/id";

const STORAGE_KEYS = {
    FIELDS: 'loan-os-data-fields',
    FOLDERS: 'loan-os-data-folders'
};

// Initialize data fields from localStorage or use sample fields if none exist
const dataFields: DataField[] = (() => {
    const storedFields = localStorage.getItem(STORAGE_KEYS.FIELDS);
    if (storedFields) {
        return JSON.parse(storedFields);
    }
    // Store initial sample fields
    localStorage.setItem(STORAGE_KEYS.FIELDS, JSON.stringify(mockDataFields));
    return mockDataFields;
})();

// Initialize folders from localStorage or use sample folders if none exist
const folders: Folder[] = (() => {
    const storedFolders = localStorage.getItem(STORAGE_KEYS.FOLDERS);
    if (storedFolders) {
        return JSON.parse(storedFolders);
    }
    // Store initial sample folders
    localStorage.setItem(STORAGE_KEYS.FOLDERS, JSON.stringify(mockFolders));
    return mockFolders;
})();

function getFields(): DataField[] {
    return dataFields;
}

function getField(id: string): DataField {
    const field = dataFields.find(f => f.id === id);
    if (!field) {
        throw new Error(`Field with id ${id} not found`);
    }
    return field;
}

function createField(field: DataField): DataField {
    const newField = { ...field, id: generateId("field") };
    dataFields.push(newField);
    // Update localStorage
    localStorage.setItem(STORAGE_KEYS.FIELDS, JSON.stringify(dataFields));
    return newField;
}

function updateField(field: DataField): DataField {
    const index = dataFields.findIndex(f => f.id === field.id);
    if (index === -1) {
        throw new Error(`Field with id ${field.id} not found`);
    }
    dataFields[index] = field;
    // Update localStorage
    localStorage.setItem(STORAGE_KEYS.FIELDS, JSON.stringify(dataFields));
    return field;
}

function deleteField(id: string) {
    const index = dataFields.findIndex(f => f.id === id);
    if (index === -1) {
        throw new Error(`Field with id ${id} not found`);
    }
    dataFields.splice(index, 1);
    // Update localStorage
    localStorage.setItem(STORAGE_KEYS.FIELDS, JSON.stringify(dataFields));
}

function getFolders(): Folder[] {
    return folders;
}

function getFolder(id: string): Folder {
    const folder = folders.find(f => f.id === id);
    if (!folder) {
        throw new Error(`Folder with id ${id} not found`);
    }
    return folder;
}

function createFolder(folder: Folder): Folder {
    const newFolder = { ...folder, id: generateId("folder") };
    folders.push(newFolder);
    // Update localStorage
    localStorage.setItem(STORAGE_KEYS.FOLDERS, JSON.stringify(folders));
    return newFolder;
}

function updateFolder(folder: Folder): Folder {
    const index = folders.findIndex(f => f.id === folder.id);
    if (index === -1) {
        throw new Error(`Folder with id ${folder.id} not found`);
    }
    folders[index] = folder;
    // Update localStorage
    localStorage.setItem(STORAGE_KEYS.FOLDERS, JSON.stringify(folders));
    return folder;
}

function deleteFolder(id: string) {
    const index = folders.findIndex(f => f.id === id);
    if (index === -1) {
        throw new Error(`Folder with id ${id} not found`);
    }
    folders.splice(index, 1);
    // Update localStorage
    localStorage.setItem(STORAGE_KEYS.FOLDERS, JSON.stringify(folders));
}

function getFolderTree(): Folder[] {
    return buildFolderTree(folders, dataFields);
}

export { 
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
};