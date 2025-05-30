import { useState } from 'react';
import { ChevronRight, Filter, Lock, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Topbar from '@/components/Topbar';
import { useDataDictionary } from '@/contexts/DataDictionaryContext';
import type { DataField, Folder } from '@/types/data-field';
import { DataFieldDialog } from './data-field-dialog';
import { FolderTree as FolderTreeComponent } from './folder-tree';

function DataDictionary() {
  const {
    fields,
    folders,
    folderTree,
    addField,
    updateField,
    deleteField,
    addFolder,
    updateFolder,
    deleteFolder,
    getFieldsForFolder,
    moveFieldToFolder,
  } = useDataDictionary();

  const [selectedFolderId, setSelectedFolderId] = useState<string>(folders[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentField, setCurrentField] = useState<DataField | null>(null);
  const [dataTypeFilter, setDataTypeFilter] = useState<string>('all');
  const [systemFieldFilter, setSystemFieldFilter] = useState<string>('all');

  const itemsPerPage = 10;

  // Get folder path for breadcrumb
  const getFolderPath = (folderId: string): Folder[] => {
    const path: Folder[] = [];
    let currentId = folderId;

    while (currentId) {
      const folder = folders.find(f => f.id === currentId);
      if (folder) {
        path.unshift(folder);
        currentId = folder.parentId || '';
      } else {
        break;
      }
    }

    return path;
  };

  // Filter fields based on search query and filters
  const filteredFields = getFieldsForFolder(selectedFolderId).filter(field => {
    const matchesSearch =
      field.canonicalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      field.systemName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDataType = dataTypeFilter === 'all' || field.dataType === dataTypeFilter;

    const matchesSystemField =
      systemFieldFilter === 'all' ||
      (systemFieldFilter === 'system' && field.isSystemRequired) ||
      (systemFieldFilter === 'custom' && !field.isSystemRequired);

    return matchesSearch && matchesDataType && matchesSystemField;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredFields.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedFields = filteredFields.slice(startIndex, startIndex + itemsPerPage);

  // Handle adding a new field
  const handleAddField = (field: DataField) => {
    addField({
      canonicalName: field.canonicalName,
      systemName: field.systemName,
      dataType: field.dataType,
      isSystemRequired: field.isSystemRequired,
      folderId: field.folderId,
    });
    setIsAddDialogOpen(false);
  };

  // Handle editing a field
  const handleEditField = (field: DataField) => {
    updateField(field.id, {
      canonicalName: field.canonicalName,
      systemName: field.systemName,
      dataType: field.dataType,
      isSystemRequired: field.isSystemRequired,
      folderId: field.folderId,
    });
    setIsEditDialogOpen(false);
    setCurrentField(null);
  };

  // Handle deleting a field
  const handleDeleteField = () => {
    if (currentField) {
      deleteField(currentField.id);
      setIsDeleteDialogOpen(false);
      setCurrentField(null);
    }
  };

  // Open edit dialog for a field
  const openEditDialog = (field: DataField) => {
    setCurrentField(field);
    setIsEditDialogOpen(true);
  };

  // Open delete dialog for a field
  const openDeleteDialog = (field: DataField) => {
    setCurrentField(field);
    setIsDeleteDialogOpen(true);
  };

  // Handle adding a new folder
  const handleAddFolder = (folder: Folder) => {
    addFolder({
      name: folder.name,
      parentId: folder.parentId,
      isExpanded: folder.isExpanded,
    });
  };

  // Handle renaming a folder
  const handleRenameFolder = (folderId: string, newName: string) => {
    updateFolder(folderId, { name: newName });
  };

  // Handle deleting a folder
  const handleDeleteFolder = (folderId: string) => {
    deleteFolder(folderId);

    // If the deleted folder was selected, select its parent or the first available folder
    if (selectedFolderId === folderId) {
      const folderToDelete = folders.find(f => f.id === folderId);
      if (folderToDelete?.parentId) {
        setSelectedFolderId(folderToDelete.parentId);
      } else {
        const remainingFolders = folders.filter(f => f.id !== folderId);
        setSelectedFolderId(remainingFolders[0]?.id || '');
      }
    }
  };

  // Handle moving a field to a different folder
  const handleMoveField = (fieldId: string, targetFolderId: string) => {
    moveFieldToFolder(fieldId, targetFolderId);
  };

  // Get unique data types for filter
  const dataTypes = Array.from(new Set(fields.map(field => field.dataType)));

  // Handle folder selection
  const handleFolderSelect = (folderId: string) => {
    setSelectedFolderId(folderId);
    setCurrentPage(1);
  };

  // Get folder name for display
  const getSelectedFolderName = () => {
    const folder = folders.find(f => f.id === selectedFolderId);
    return folder ? folder.name : 'Unassigned Fields';
  };

  return (
    <div className="flex flex-col h-full">
      <Topbar name="Data Dictionary" description="Manage data dictionary for your application.">
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="h-4 w-4" />
          Create Field
        </Button>
      </Topbar>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search fields..."
              className="pl-8"
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select
                value={dataTypeFilter}
                onValueChange={value => {
                  setDataTypeFilter(value);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Data Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Data Types</SelectItem>
                  {dataTypes.map(type => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-muted-foreground" />
              <Select
                value={systemFieldFilter}
                onValueChange={value => {
                  setSystemFieldFilter(value);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Field Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Fields</SelectItem>
                  <SelectItem value="system">System Required</SelectItem>
                  <SelectItem value="custom">Custom Fields</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6">
          {/* Folder Tree */}
          <FolderTreeComponent
            folders={folderTree}
            onFolderSelect={handleFolderSelect}
            selectedFolderId={selectedFolderId}
            onAddFolder={handleAddFolder}
            onRenameFolder={handleRenameFolder}
            onDeleteFolder={handleDeleteFolder}
            onMoveField={handleMoveField}
          />

          {/* Fields Table */}
          <div className="space-y-4">
            {/* Breadcrumb */}
            <nav className="flex mb-4" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-2">
                {getFolderPath(selectedFolderId).map((folder, index, array) => (
                  <li key={folder.id} className="flex items-center">
                    <button
                      onClick={() => handleFolderSelect(folder.id)}
                      className="text-sm hover:underline cursor-pointer"
                    >
                      {folder.name}
                    </button>
                    {index < array.length - 1 && (
                      <span className="mx-2 text-muted-foreground">
                        <ChevronRight className="h-4 w-4" />
                      </span>
                    )}
                  </li>
                ))}
                {getFolderPath(selectedFolderId).length === 0 && (
                  <li className="flex items-center">
                    <span className="text-sm">Unassigned Fields</span>
                  </li>
                )}
              </ol>
            </nav>

            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">Canonical Name</TableHead>
                    <TableHead className="w-[250px]">System Name (Key)</TableHead>
                    <TableHead>Data Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedFields.length > 0 ? (
                    paginatedFields.map(field => (
                      <TableRow key={field.id}>
                        <TableCell className="font-medium">{field.canonicalName}</TableCell>
                        <TableCell>{field.systemName}</TableCell>
                        <TableCell>{field.dataType}</TableCell>
                        <TableCell>
                          {field.isSystemRequired ? (
                            <Badge variant="secondary" className="flex items-center gap-1 w-fit">
                              <Lock className="h-3 w-3" />
                              System Required
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="w-fit">
                              Custom
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openEditDialog(field)}
                              disabled={field.isSystemRequired}
                              title={
                                field.isSystemRequired
                                  ? 'System fields cannot be edited'
                                  : 'Edit field'
                              }
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openDeleteDialog(field)}
                              disabled={field.isSystemRequired}
                              title={
                                field.isSystemRequired
                                  ? 'System fields cannot be deleted'
                                  : 'Delete field'
                              }
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center">
                        No fields found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {totalPages > 1 && (
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>

                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    // Show pages around current page
                    let pageNum = currentPage;
                    if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    if (pageNum > 0 && pageNum <= totalPages) {
                      return (
                        <PaginationItem key={pageNum}>
                          <PaginationLink
                            isActive={currentPage === pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                          >
                            {pageNum}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    }
                    return null;
                  })}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </div>
        </div>

        {/* Add Field Dialog */}
        <DataFieldDialog
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          onSave={handleAddField}
          title="Add New Field"
          description="Add a new field to the data dictionary."
          field={null}
          folders={folderTree}
          currentFolderId={selectedFolderId}
        />

        {/* Edit Field Dialog */}
        <DataFieldDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onSave={handleEditField}
          title="Edit Field"
          description="Edit an existing field in the data dictionary."
          field={currentField}
          folders={folderTree}
          currentFolderId={selectedFolderId}
        />

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Field</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete the field "{currentField?.canonicalName}"? This
                action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteField}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export { DataDictionary };
