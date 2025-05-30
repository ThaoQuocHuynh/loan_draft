import { useState } from 'react';
import { ChevronDown, ChevronRight, Edit, Plus, ShieldAlert, Trash2 } from 'lucide-react';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import Topbar from '@/components/Topbar';
import { usePermission } from '@/contexts/PermissionContext';
import { Claim } from '@/types/authorization';

export default function ClaimsPage() {
  const { claims, addClaim, updateClaim, deleteClaim } = usePermission();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentClaim, setCurrentClaim] = useState<Claim | null>(null);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  const [formData, setFormData] = useState({
    name: '',
    key: '',
    description: '',
    parentId: '',
  });
  const [showSystemClaims, setShowSystemClaims] = useState(true);
  const [showUserClaims, setShowUserClaims] = useState(true);

  const handleAddClaim = () => {
    addClaim({
      name: formData.name,
      key: formData.key,
      description: formData.description,
      parentId: formData.parentId === '' ? null : formData.parentId,
    });
    setFormData({ name: '', key: '', description: '', parentId: '' });
    setIsAddDialogOpen(false);
  };

  const handleEditClaim = () => {
    if (currentClaim) {
      updateClaim(currentClaim.id, {
        name: formData.name,
        key: formData.key,
        description: formData.description,
        parentId: formData.parentId === '' ? null : formData.parentId,
      });
      setIsEditDialogOpen(false);
    }
  };

  const handleDeleteClaim = () => {
    if (currentClaim) {
      // Get all direct children of the claim
      const directChildren = claims.filter(c => c.parentId === currentClaim.id);

      // Show a confirmation dialog if there are children
      if (directChildren.length > 0) {
        const confirmDelete = window.confirm(
          `This claim has ${directChildren.length} direct child claims. Deleting it will move all children to the root level. Continue?`
        );
        if (!confirmDelete) return;
      }

      deleteClaim(currentClaim.id);
      setIsDeleteDialogOpen(false);
    }
  };

  const openEditDialog = (claim: Claim) => {
    if (claim.isSystem) {
      // Show a message that system claims cannot be edited
      alert('System-defined claims cannot be modified.');
      return;
    }

    setCurrentClaim(claim);
    setFormData({
      name: claim.name,
      key: claim.key,
      description: claim.description,
      parentId: claim.parentId || '',
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (claim: Claim) => {
    if (claim.isSystem) {
      // Show a message that system claims cannot be deleted
      alert('System-defined claims cannot be deleted.');
      return;
    }

    setCurrentClaim(claim);
    setIsDeleteDialogOpen(true);
  };

  const toggleGroup = (id: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Filter claims based on visibility settings
  const filteredClaims = claims.filter(claim => {
    if (claim.isSystem && !showSystemClaims) return false;
    if (!claim.isSystem && !showUserClaims) return false;
    return true;
  });

  // Get root level claims (no parent)
  const rootClaims = filteredClaims.filter(claim => claim.parentId === null);

  // Get child claims for a parent
  const getChildClaims = (parentId: string) => {
    return filteredClaims.filter(claim => claim.parentId === parentId);
  };

  // Check if a claim has children
  const hasChildren = (claimId: string) => {
    return filteredClaims.some(claim => claim.parentId === claimId);
  };

  // Render a claim row with its children
  const renderClaimRow = (claim: Claim, level = 0) => {
    const children = getChildClaims(claim.id);
    const hasChildClaims = children.length > 0;
    const isExpanded = expandedGroups[claim.id] || false;

    return (
      <div key={claim.id}>
        <div
          className={`border-b flex items-center ${level > 0 ? 'pl-' + level * 8 : ''}`}
          style={{ paddingLeft: level > 0 ? `${level * 24}px` : '0' }}
        >
          <div className="py-3 px-4 flex-1 flex items-center">
            {hasChildClaims ? (
              <button
                onClick={() => toggleGroup(claim.id)}
                className="mr-2 p-1 rounded-sm hover:bg-muted focus:outline-none"
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>
            ) : (
              <div className="w-6" />
            )}
            <span className="font-medium flex items-center">
              {claim.name}
              {claim.isSystem && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge
                        variant="outline"
                        className="ml-2 bg-amber-50 text-amber-700 border-amber-200"
                      >
                        <ShieldAlert className="h-3 w-3 mr-1" />
                        System
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>System-defined claims cannot be modified</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </span>
          </div>
          <div className="py-3 px-4 flex-1">
            <code className="bg-muted px-1 py-0.5 rounded text-sm">{claim.key}</code>
          </div>
          <div className="py-3 px-4 flex-1 text-muted-foreground">{claim.description}</div>
          <div className="py-3 px-4 flex justify-end gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => openEditDialog(claim)}
              disabled={claim.isSystem}
              className={claim.isSystem ? 'opacity-50 cursor-not-allowed' : ''}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => openDeleteDialog(claim)}
              disabled={claim.isSystem}
              className={claim.isSystem ? 'opacity-50 cursor-not-allowed' : ''}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {hasChildClaims && isExpanded && (
          <div>{children.map(child => renderClaimRow(child, level + 1))}</div>
        )}
      </div>
    );
  };

  // Check if a claim is a descendant of another claim
  // This prevents circular references when selecting a parent
  const isDescendantOf = (claimId: string, potentialAncestorId: string): boolean => {
    // If they're the same, it would create a circular reference
    if (claimId === potentialAncestorId) return true;

    const claim = claims.find(c => c.id === claimId);
    if (!claim || !claim.parentId) return false;
    if (claim.parentId === potentialAncestorId) return true;

    // Recursively check if any ancestor is the potential ancestor
    return isDescendantOf(claim.parentId, potentialAncestorId);
  };

  return (
    <>
      <Topbar
        name="Claims"
        description="Define and manage claims that represent permissions in your system."
      >
        <div className="flex gap-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="showSystemClaims"
              checked={showSystemClaims}
              onChange={e => setShowSystemClaims(e.target.checked)}
              className="rounded border-gray-300"
            />
            <label htmlFor="showSystemClaims" className="text-sm">
              Show System Claims
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="showUserClaims"
              checked={showUserClaims}
              onChange={e => setShowUserClaims(e.target.checked)}
              className="rounded border-gray-300"
            />
            <label htmlFor="showUserClaims" className="text-sm">
              Show User Claims
            </label>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4" />
                Create Claim
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Claim</DialogTitle>
                <DialogDescription>
                  Create a new claim definition for your permission system.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. View Users"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="key">Key</Label>
                  <Input
                    id="key"
                    value={formData.key}
                    onChange={e => setFormData({ ...formData, key: e.target.value })}
                    placeholder="e.g. users.view"
                  />
                  <p className="text-xs text-muted-foreground">
                    The system identifier used for permission checks. Use dot notation for
                    hierarchical keys.
                  </p>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe what this claim represents"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="parent">Parent Claim (Optional)</Label>
                  <Select
                    value={formData.parentId}
                    onValueChange={value => setFormData({ ...formData, parentId: value })}
                  >
                    <SelectTrigger id="parent">
                      <SelectValue placeholder="No parent (root level)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No parent (root level)</SelectItem>
                      {claims.map(claim => (
                        <SelectItem key={claim.id} value={claim.id}>
                          {claim.name} {claim.isSystem && '(System)'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Organize claims hierarchically by selecting a parent. Leave empty for root-level
                    claims.
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddClaim}>Create Claim</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </Topbar>
      <div className="rounded-md border">
        <div className="bg-muted/50 py-3 px-4 grid grid-cols-3 gap-4 font-medium border-b">
          <div>Name</div>
          <div>Key</div>
          <div>Description</div>
        </div>
        <div>
          {filteredClaims.length === 0 ? (
            <div className="py-6 text-center text-muted-foreground">
              No claims found. Create your first claim to get started.
            </div>
          ) : (
            <div>{rootClaims.map(claim => renderClaimRow(claim))}</div>
          )}
        </div>
      </div>
      <Dialog open={isEditDialogOpen} onOpenChange={open => !open && setIsEditDialogOpen(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Claim</DialogTitle>
            <DialogDescription>Update the details for this claim.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-key">Key</Label>
              <Input
                id="edit-key"
                value={formData.key}
                onChange={e => setFormData({ ...formData, key: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-parent">Parent Claim (Optional)</Label>
              <Select
                value={formData.parentId}
                onValueChange={value => setFormData({ ...formData, parentId: value })}
              >
                <SelectTrigger id="edit-parent">
                  <SelectValue placeholder="No parent (root level)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No parent (root level)</SelectItem>
                  {currentClaim &&
                    claims
                      .filter(
                        c => c.id !== currentClaim.id && !isDescendantOf(c.id, currentClaim.id)
                      )
                      .map(c => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name} {c.isSystem && '(System)'}
                        </SelectItem>
                      ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditClaim}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog
        open={isDeleteDialogOpen}
        onOpenChange={open => !open && setIsDeleteDialogOpen(false)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Claim</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this claim?{' '}
              {currentClaim &&
                hasChildren(currentClaim.id) &&
                'Child claims will be moved to root level.'}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteClaim}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
