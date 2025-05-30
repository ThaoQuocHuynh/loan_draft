'use client';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertCircle,
  ArrowUpDown,
  CheckCircle2,
  Clock,
  Copy,
  Edit,
  Eye,
  FileText,
  MoreVertical,
  Plus,
  Search,
  Trash2,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Topbar from '@/components/Topbar';

// Define workflow type
interface Workflow {
  id: string;
  name: string;
  description: string;
  version: string;
  status: 'published' | 'draft' | 'archived';
  lastModified: string;
  steps: number;
  createdBy: string;
  completions: number;
}

// Sample workflow data
const sampleWorkflows: Workflow[] = [
  {
    id: '1',
    name: 'Employee Onboarding',
    description: 'Process for onboarding new employees',
    version: '1.2.3',
    status: 'published',
    lastModified: '2023-04-15T10:30:00Z',
    steps: 5,
    createdBy: 'John Doe',
    completions: 128,
  },
  {
    id: '2',
    name: 'Customer Support Request',
    description: 'Workflow for handling customer support tickets',
    version: '2.0.1',
    status: 'published',
    lastModified: '2023-04-10T14:45:00Z',
    steps: 4,
    createdBy: 'Jane Smith',
    completions: 256,
  },
  {
    id: '3',
    name: 'Expense Approval',
    description: 'Process for submitting and approving expenses',
    version: '0.9.0',
    status: 'draft',
    lastModified: '2023-04-14T09:15:00Z',
    steps: 3,
    createdBy: 'John Doe',
    completions: 0,
  },
  {
    id: '4',
    name: 'Leave Request',
    description: 'Workflow for requesting and approving time off',
    version: '1.0.0',
    status: 'published',
    lastModified: '2023-04-08T11:20:00Z',
    steps: 4,
    createdBy: 'Jane Smith',
    completions: 75,
  },
  {
    id: '5',
    name: 'IT Access Request',
    description: 'Process for requesting access to IT systems',
    version: '1.1.0',
    status: 'archived',
    lastModified: '2023-03-20T16:10:00Z',
    steps: 6,
    createdBy: 'John Doe',
    completions: 42,
  },
];

function WorkflowManager() {
  const navigate = useNavigate();
  const [workflows, setWorkflows] = useState<Workflow[]>(sampleWorkflows);
  const [viewMode, setViewMode] = useState('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('lastModified');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [workflowToDelete, setWorkflowToDelete] = useState<Workflow | null>(null);
  const [showNewWorkflowDialog, setShowNewWorkflowDialog] = useState(false);
  const [newWorkflowName, setNewWorkflowName] = useState('');
  const [newWorkflowDescription, setNewWorkflowDescription] = useState('');

  // Filter workflows based on search query and status filter
  const filteredWorkflows = workflows.filter(workflow => {
    const matchesSearch =
      workflow.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      workflow.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || workflow.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Sort workflows
  const sortedWorkflows = [...filteredWorkflows].sort((a, b) => {
    let comparison = 0;

    if (sortBy === 'name') {
      comparison = a.name.localeCompare(b.name);
    } else if (sortBy === 'lastModified') {
      comparison = new Date(a.lastModified).getTime() - new Date(b.lastModified).getTime();
    } else if (sortBy === 'version') {
      comparison = a.version.localeCompare(b.version, undefined, { numeric: true });
    } else if (sortBy === 'completions') {
      comparison = a.completions - b.completions;
    }

    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const handleEditWorkflow = (id: string) => {
    navigate(`/workflow-editor/${id}`);
  };

  const handleDeleteWorkflow = (workflow: Workflow) => {
    setWorkflowToDelete(workflow);
    setShowDeleteDialog(true);
  };

  const confirmDeleteWorkflow = () => {
    if (workflowToDelete) {
      setWorkflows(workflows.filter(w => w.id !== workflowToDelete.id));
      setShowDeleteDialog(false);
      setWorkflowToDelete(null);
    }
  };

  const handleDuplicateWorkflow = (workflow: Workflow) => {
    const newWorkflow = {
      ...workflow,
      id: Date.now().toString(),
      name: `${workflow.name} (Copy)`,
      version: '0.1.0',
      status: 'draft' as const,
      lastModified: new Date().toISOString(),
      completions: 0,
    };
    setWorkflows([...workflows, newWorkflow]);
  };

  const handleCreateWorkflow = () => {
    if (newWorkflowName.trim()) {
      const newWorkflow = {
        id: Date.now().toString(),
        name: newWorkflowName,
        description: newWorkflowDescription,
        version: '0.1.0',
        status: 'draft' as const,
        lastModified: new Date().toISOString(),
        steps: 0,
        createdBy: 'Current User',
        completions: 0,
      };
      setWorkflows([...workflows, newWorkflow]);
      setShowNewWorkflowDialog(false);
      setNewWorkflowName('');
      setNewWorkflowDescription('');

      // Navigate to the workflow editor for the new workflow
      navigate(`/workflow-editor/${newWorkflow.id}`);
    }
  };

  const handleStatusChange = (id: string, newStatus: 'published' | 'draft' | 'archived') => {
    setWorkflows(
      workflows.map(workflow =>
        workflow.id === id
          ? { ...workflow, status: newStatus, lastModified: new Date().toISOString() }
          : workflow
      )
    );
  };

  const getStatusBadge = (status: 'published' | 'draft' | 'archived') => {
    switch (status) {
      case 'published':
        return <Badge className="bg-green-500">Published</Badge>;
      case 'draft':
        return (
          <Badge variant="outline" className="text-amber-500 border-amber-500">
            Draft
          </Badge>
        );
      case 'archived':
        return <Badge variant="secondary">Archived</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <>
      <Topbar
        name="Automated Workflows"
        description="Manage automatic workflows for your application."
      >
        <Dialog open={showNewWorkflowDialog} onOpenChange={setShowNewWorkflowDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4" />
              Create Workflow
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Workflow</DialogTitle>
              <DialogDescription>
                Enter the details for your new workflow. You can customize it further in the editor.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Workflow Name</Label>
                <Input
                  id="name"
                  placeholder="Enter workflow name"
                  value={newWorkflowName}
                  onChange={e => setNewWorkflowName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  placeholder="Enter workflow description"
                  value={newWorkflowDescription}
                  onChange={e => setNewWorkflowDescription(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowNewWorkflowDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateWorkflow}>Create & Edit</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Topbar>
      {/* <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex items-center gap-2 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search workflows..."
              className="pl-8"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div> */}

      <Tabs value={viewMode} onValueChange={setViewMode} className="w-full">
        <div className="flex justify-between mb-4">
          <div className="flex flex-col sm:flex-row justify-between gap-4 w-full">
            <div className="flex items-center gap-2 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-2.5 top-2.5 h-4 w-6 text-muted-foreground" />
                <Input
                  placeholder="Search workflows..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <TabsList className="grid w-[180px] grid-cols-2">
            <TabsTrigger value="grid">Grid</TabsTrigger>
            <TabsTrigger value="table">Table</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="grid" className="mt-0">
          {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedWorkflows.map((workflow) => (
              <WorkflowCard
                key={workflow.id}
                workflow={workflow}
                onEdit={() => handleEditWorkflow(workflow.id)}
                onDelete={() => handleDeleteWorkflow(workflow)}
                onDuplicate={() => handleDuplicateWorkflow(workflow)}
                onStatusChange={(status) => handleStatusChange(workflow.id, status)}
              />
            ))}
          </div>
          {sortedWorkflows.length === 0 && (
            <div className="text-center py-12 border rounded-lg bg-muted/20">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No workflows found</h3>
              <p className="text-muted-foreground">
                {searchQuery || statusFilter !== "all"
                  ? "Try adjusting your search or filters"
                  : "Create your first workflow to get started"}
              </p>
              <Button className="mt-4" onClick={() => setShowNewWorkflowDialog(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Workflow
              </Button>
            </div>
          )} */}
        </TabsContent>

        <TabsContent value="table" className="mt-0">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">
                    <Button
                      variant="ghost"
                      className="p-0 font-medium"
                      onClick={() => handleSort('name')}
                    >
                      Name
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      className="p-0 font-medium"
                      onClick={() => handleSort('version')}
                    >
                      Version
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      className="p-0 font-medium"
                      onClick={() => handleSort('lastModified')}
                    >
                      Last Modified
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>Steps</TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      className="p-0 font-medium"
                      onClick={() => handleSort('completions')}
                    >
                      Completions
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedWorkflows.map(workflow => (
                  <TableRow key={workflow.id}>
                    <TableCell className="font-medium">
                      <div>
                        {workflow.name}
                        <p className="text-sm text-muted-foreground truncate max-w-[250px]">
                          {workflow.description}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(workflow.status)}</TableCell>
                    <TableCell>v{workflow.version}</TableCell>
                    <TableCell>{formatDate(workflow.lastModified)}</TableCell>
                    <TableCell>{workflow.steps}</TableCell>
                    <TableCell>{workflow.completions}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditWorkflow(workflow.id)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => navigate(`/workflow-preview/${workflow.id}`)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            Preview
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDuplicateWorkflow(workflow)}>
                            <Copy className="mr-2 h-4 w-4" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {workflow.status !== 'published' && (
                            <DropdownMenuItem
                              onClick={() => handleStatusChange(workflow.id, 'published')}
                            >
                              <CheckCircle2 className="mr-2 h-4 w-4" />
                              Publish
                            </DropdownMenuItem>
                          )}
                          {workflow.status !== 'draft' && (
                            <DropdownMenuItem
                              onClick={() => handleStatusChange(workflow.id, 'draft')}
                            >
                              <Clock className="mr-2 h-4 w-4" />
                              Revert to Draft
                            </DropdownMenuItem>
                          )}
                          {workflow.status !== 'archived' && (
                            <DropdownMenuItem
                              onClick={() => handleStatusChange(workflow.id, 'archived')}
                            >
                              <AlertCircle className="mr-2 h-4 w-4" />
                              Archive
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDeleteWorkflow(workflow)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {sortedWorkflows.length === 0 && (
              <div className="text-center py-12">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">No workflows found</h3>
                <p className="text-muted-foreground">
                  {searchQuery || statusFilter !== 'all'
                    ? 'Try adjusting your search or filters'
                    : 'Create your first workflow to get started'}
                </p>
                <Button className="mt-4" onClick={() => setShowNewWorkflowDialog(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Workflow
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Workflow</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{workflowToDelete?.name}"? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteWorkflow}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export { WorkflowManager };
