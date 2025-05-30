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
import Topbar from '@/components/Topbar';
import { sampleDashboards } from '@/services/data/sample-dashboards';
import { Dashboard } from '@/types/dashboard';

function DashboardManager() {
  const navigate = useNavigate();
  const [dashboards, setDashboards] = useState<Dashboard[]>(sampleDashboards);
  const [viewMode, setViewMode] = useState('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('lastModified');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [dashboardToDelete, setDashboardToDelete] = useState<Dashboard | null>(null);
  const [showNewDashboardDialog, setShowNewDashboardDialog] = useState(false);
  const [newDashboardName, setNewDashboardName] = useState('');
  const [newDashboardPath, setNewDashboardPath] = useState('');

  // Filter dashboards based on search query and status filter
  const filteredDashboards = dashboards.filter(dashboard => {
    const matchesSearch = dashboard.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || dashboard.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Sort dashboards
  const sortedDashboards = [...filteredDashboards].sort((a, b) => {
    let comparison = 0;

    if (sortBy === 'name') {
      comparison = a.name.localeCompare(b.name);
    } else if (sortBy === 'lastModified') {
      comparison = new Date(a.lastModified).getTime() - new Date(b.lastModified).getTime();
    } else if (sortBy === 'version') {
      comparison = a.version.localeCompare(b.version, undefined, { numeric: true });
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

  const handleEditDashboard = (id: string) => {
    navigate(`/dashboard-editor/${id}`);
  };

  const handleDeleteDashboard = (dashboard: Dashboard) => {
    setDashboardToDelete(dashboard);
    setShowDeleteDialog(true);
  };

  const confirmDeleteDashboard = () => {
    if (dashboardToDelete) {
      setDashboards(dashboards.filter(d => d.id !== dashboardToDelete.id));
      setShowDeleteDialog(false);
      setDashboardToDelete(null);
    }
  };

  const handleDuplicateDashboard = (dashboard: Dashboard) => {
    const newDashboard = {
      ...dashboard,
      id: Date.now().toString(),
      name: `${dashboard.name} (Copy)`,
      version: '0.1.0',
      status: 'draft' as const,
      lastModified: new Date().toISOString(),
      completions: 0,
    };
    setDashboards([...dashboards, newDashboard]);
  };

  const handleCreateDashboard = () => {
    if (newDashboardName.trim() && newDashboardPath.trim()) {
      const newDashboard: Dashboard = {
        id: Date.now().toString(),
        name: newDashboardName,
        filters: [] as [],
        components: [] as [],
        order: dashboards.length + 1,
        path: newDashboardPath,
        version: '0.1.0',
        status: 'draft' as const,
        lastModified: new Date().toISOString(),
        createdBy: 'Current User',
        tags: [],
      };
      setDashboards([...dashboards, newDashboard]);
      setShowNewDashboardDialog(false);
      setNewDashboardName('');
      setNewDashboardPath('');

      // Navigate to the dashboard editor for the new dashboard
      navigate(`/dashboard-editor/${newDashboard.id}`);
    }
  };

  const handleStatusChange = (id: string, newStatus: 'published' | 'draft' | 'archived') => {
    setDashboards(
      dashboards.map(dashboard =>
        dashboard.id === id
          ? { ...dashboard, status: newStatus, lastModified: new Date().toISOString() }
          : dashboard
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
      {/* <Toolbar name="Dashboard Manager" description="Manage the dashboards for your application">
          <Dialog open={showNewDashboardDialog} onOpenChange={setShowNewDashboardDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Dashboard
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Dashboard</DialogTitle>
                <DialogDescription>
                  Enter the details for your new dashboard. You can customize it further in the
                  editor.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Dashboard Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter dashboard name"
                    value={newDashboardName}
                    onChange={e => setNewDashboardName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="path">Dashboard Path</Label>
                  <Input
                    id="path"
                    placeholder="Enter dashboard path (e.g. /dashboard/loan-pipeline)"
                    value={newDashboardPath}
                    onChange={e => setNewDashboardPath(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowNewDashboardDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateDashboard}>Create & Edit</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </Toolbar> */}
      <Topbar name="Dashboard Manager" description="Manage the dashboards for your application.">
        <Dialog open={showNewDashboardDialog} onOpenChange={setShowNewDashboardDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4" />
              Create Dashboard
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Dashboard</DialogTitle>
              <DialogDescription>
                Enter the details for your new dashboard. You can customize it further in the
                editor.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Dashboard Name</Label>
                <Input
                  id="name"
                  placeholder="Enter dashboard name"
                  value={newDashboardName}
                  onChange={e => setNewDashboardName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="path">Dashboard Path</Label>
                <Input
                  id="path"
                  placeholder="Enter dashboard path (e.g. /dashboard/loan-pipeline)"
                  value={newDashboardPath}
                  onChange={e => setNewDashboardPath(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowNewDashboardDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateDashboard}>Create & Edit</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Topbar>
      <div className="flex flex-col sm:flex-row justify-between gap-4 pb-6">
        <div className="flex items-center gap-2 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search dashboards..."
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
              <TableHead>Tags</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedDashboards.map(dashboard => (
              <TableRow key={dashboard.id}>
                <TableCell className="font-medium">
                  <div>
                    {dashboard.name}
                    <p className="text-sm text-muted-foreground truncate max-w-[250px]">
                      {dashboard.path}
                    </p>
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(dashboard.status)}</TableCell>
                <TableCell>v{dashboard.version}</TableCell>
                <TableCell>{formatDate(dashboard.lastModified)}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {(dashboard.tags || []).map(tag => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEditDashboard(dashboard.id)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => navigate(`/dashboard-preview/${dashboard.id}`)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        Preview
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDuplicateDashboard(dashboard)}>
                        <Copy className="mr-2 h-4 w-4" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {dashboard.status !== 'published' && (
                        <DropdownMenuItem
                          onClick={() => handleStatusChange(dashboard.id, 'published')}
                        >
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                          Publish
                        </DropdownMenuItem>
                      )}
                      {dashboard.status !== 'draft' && (
                        <DropdownMenuItem onClick={() => handleStatusChange(dashboard.id, 'draft')}>
                          <Clock className="mr-2 h-4 w-4" />
                          Revert to Draft
                        </DropdownMenuItem>
                      )}
                      {dashboard.status !== 'archived' && (
                        <DropdownMenuItem
                          onClick={() => handleStatusChange(dashboard.id, 'archived')}
                        >
                          <AlertCircle className="mr-2 h-4 w-4" />
                          Archive
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => handleDeleteDashboard(dashboard)}
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
        {sortedDashboards.length === 0 && (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">No dashboards found</h3>
            <p className="text-muted-foreground">
              {searchQuery || statusFilter !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Create your first dashboard to get started'}
            </p>
            <Button className="mt-4" onClick={() => setShowNewDashboardDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Dashboard
            </Button>
          </div>
        )}
      </div>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Dashboard</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{dashboardToDelete?.name}"? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteDashboard}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export { DashboardManager };
