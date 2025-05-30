'use client';

import { useState } from 'react';
import { Edit, Plus, ShieldAlert, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ClaimsTree } from '@/components/Claims/ClaimsTree';
import Topbar from '@/components/Topbar';
import { usePermission } from '@/contexts/PermissionContext';
import { Claim, Role } from '@/types/authorization';

export default function RolesPage() {
  const { roles, addRole, updateRole, deleteRole } = usePermission();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState<Role | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  const [selectedPolicy, setSelectedPolicy] = useState('');
  const [selectedClaimIds, setSelectedClaimIds] = useState<string[]>([]);

  const {
    claims,
    policies,
    addClaimToRole,
    addPolicyToRole,
    removeClaimFromRole,
    removePolicyFromRole,
    getRoleClaims,
    getRolePolicies,
  } = usePermission();

  // Get root level claims (no parent)
  const rootClaims = claims.filter(claim => claim.parentId === null);

  // Get child claims for a parent
  const getChildClaims = (parentId: string) => {
    return claims.filter(claim => claim.parentId === parentId);
  };

  const getRoleClaimAssignments = (roleId: string) => {
    return getRoleClaims(roleId);
  };

  const getRolePolicyAssignments = (roleId: string) => {
    return getRolePolicies(roleId);
  };

  const handleAddRole = () => {
    addRole({
      name: formData.name,
      description: formData.description,
      key: formData.name.toLowerCase().replace(/\s+/g, '-'),
      type: 'internal',
    });
    setFormData({ name: '', description: '' });
    setIsAddDialogOpen(false);
  };

  const handleEditRole = () => {
    if (currentRole) {
      updateRole(currentRole.id, {
        name: formData.name,
        description: formData.description,
      });
      setIsEditDialogOpen(false);
    }
  };

  const handleDeleteRole = () => {
    if (currentRole) {
      deleteRole(currentRole.id);
      setIsDeleteDialogOpen(false);
    }
  };

  const openEditDialog = (role: Role) => {
    setCurrentRole(role);
    setFormData({
      name: role.name,
      description: role.description,
    });
    setSelectedPolicy('');

    // Set selected claims based on current assignments
    const assignedClaimIds = getRoleClaimAssignments(role.id).map(ca => ca.id);
    setSelectedClaimIds(assignedClaimIds);

    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (role: Role) => {
    setCurrentRole(role);
    setIsDeleteDialogOpen(true);
  };

  // Add a function to select/deselect a claim and all its descendants
  const handleClaimCheckboxChange = (claimId: string, checked: boolean) => {
    // Get all descendant claim IDs
    const getAllDescendantIds = (parentId: string): string[] => {
      const directChildren = claims.filter(c => c.parentId === parentId);
      const childIds = directChildren.map(c => c.id);
      const descendantIds = directChildren.flatMap(c => getAllDescendantIds(c.id));
      return [...childIds, ...descendantIds];
    };

    if (checked) {
      // Select this claim and all its descendants
      const descendantIds = getAllDescendantIds(claimId);
      setSelectedClaimIds(prev => [...new Set([...prev, claimId, ...descendantIds])]);
    } else {
      // Deselect this claim and all its descendants
      const descendantIds = getAllDescendantIds(claimId);
      setSelectedClaimIds(prev => prev.filter(id => id !== claimId && !descendantIds.includes(id)));
    }
  };

  const handleSaveClaimAssignments = () => {
    if (!currentRole) return;

    // Get current assignments
    const currentAssignments = getRoleClaimAssignments(currentRole.id);

    // Remove assignments that are no longer selected
    currentAssignments.forEach(assignment => {
      if (!selectedClaimIds.includes(assignment.id)) {
        removeClaimFromRole(currentRole.id, assignment.id);
      }
    });

    // Add new assignments
    selectedClaimIds.forEach(claimId => {
      const exists = currentAssignments.some(ca => ca.id === claimId);
      if (!exists) {
        addClaimToRole(currentRole.id, claimId);
      }
    });
  };

  // Render claim hierarchy with checkboxes for selection
  const renderClaimItem = (claim: Claim, level = 0) => {
    const children = getChildClaims(claim.id);
    const hasChildClaims = children.length > 0;
    const isSelected = selectedClaimIds.includes(claim.id);

    return (
      <div key={claim.id}>
        <div
          className="flex items-center py-2"
          style={{ paddingLeft: level > 0 ? `${level * 20}px` : '0' }}
        >
          <Checkbox
            id={`claim-${claim.id}`}
            checked={isSelected}
            onCheckedChange={checked => handleClaimCheckboxChange(claim.id, checked === true)}
          />
          <Label htmlFor={`claim-${claim.id}`} className="ml-2 cursor-pointer flex items-center">
            {claim.name}
            <span className="ml-2 text-xs text-muted-foreground">({claim.key})</span>
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
                    <p>System-defined claim</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </Label>
        </div>

        {hasChildClaims && <div>{children.map(child => renderClaimItem(child, level + 1))}</div>}
      </div>
    );
  };

  return (
    <>
      <Topbar name="Roles" description="Create and manage roles that users can be assigned to.">
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4" />
              Create Role
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Role</DialogTitle>
              <DialogDescription>
                Create a new role or group for your permission system.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Administrator"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the purpose of this role"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddRole}>Create Role</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Topbar>
      <div className="rounded-md border">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="py-3 px-4 text-left font-medium">Name</th>
              <th className="py-3 px-4 text-left font-medium">Description</th>
              <th className="py-3 px-4 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {roles.length === 0 ? (
              <tr>
                <td colSpan={3} className="py-6 text-center text-muted-foreground">
                  No roles found. Create your first role to get started.
                </td>
              </tr>
            ) : (
              roles.map((role, index) => (
                <tr key={role.id} className={index !== roles.length - 1 ? 'border-b' : ''}>
                  <td className="py-3 px-4 font-medium">{role.name}</td>
                  <td className="py-3 px-4 text-muted-foreground">{role.description}</td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Dialog
                        open={isEditDialogOpen && currentRole?.id === role.id}
                        onOpenChange={open => !open && setIsEditDialogOpen(false)}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => openEditDialog(role)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
                          <DialogHeader>
                            <DialogTitle>Edit Role</DialogTitle>
                            <DialogDescription>
                              Update the details for this role and manage its permissions.
                            </DialogDescription>
                          </DialogHeader>
                          <Tabs
                            defaultValue="details"
                            className="mt-4 flex-1 flex flex-col min-h-0"
                          >
                            <TabsList className="grid w-full grid-cols-3">
                              <TabsTrigger value="details">Role Details</TabsTrigger>
                              <TabsTrigger value="claims">Claims</TabsTrigger>
                              <TabsTrigger value="policies">Policies</TabsTrigger>
                            </TabsList>
                            <TabsContent value="details" className="space-y-4 pt-4">
                              <div className="grid gap-2">
                                <Label htmlFor="edit-name">Name</Label>
                                <Input
                                  id="edit-name"
                                  value={formData.name}
                                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                              </div>
                              <div className="grid gap-2">
                                <Label htmlFor="edit-description">Description</Label>
                                <Textarea
                                  id="edit-description"
                                  value={formData.description}
                                  onChange={e =>
                                    setFormData({ ...formData, description: e.target.value })
                                  }
                                />
                              </div>
                            </TabsContent>
                            <TabsContent
                              value="claims"
                              className="space-y-4 pt-4 flex-1 flex flex-col min-h-0"
                            >
                              <div className="flex-1 flex flex-col min-h-0">
                                <div className="mb-4">
                                  <h3 className="text-sm font-medium mb-2">Assign Claims</h3>
                                  <p className="text-xs text-muted-foreground mb-4">
                                    Select the claims to assign to this role. Child claims are
                                    grouped under their parents.
                                  </p>
                                </div>
                                <div className="flex-1 border rounded-md overflow-hidden">
                                  <ClaimsTree
                                    claims={claims}
                                    selectedClaimIds={selectedClaimIds}
                                    onClaimChange={handleClaimCheckboxChange}
                                    className="h-full"
                                  />
                                </div>
                              </div>
                              <Button onClick={handleSaveClaimAssignments}>
                                Save Claim Assignments
                              </Button>
                            </TabsContent>
                            <TabsContent value="policies" className="space-y-4 pt-4">
                              <div className="grid gap-4">
                                <div className="grid gap-2">
                                  <Label htmlFor="policy">Select Policy</Label>
                                  <Select value={selectedPolicy} onValueChange={setSelectedPolicy}>
                                    <SelectTrigger id="policy">
                                      <SelectValue placeholder="Select a policy" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {policies.map(policy => (
                                        <SelectItem key={policy.id} value={policy.id}>
                                          {policy.name}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <Button
                                  onClick={() => {
                                    if (currentRole && selectedPolicy) {
                                      addPolicyToRole(currentRole.id, selectedPolicy);
                                      setSelectedPolicy('');
                                    }
                                  }}
                                  disabled={!selectedPolicy}
                                >
                                  Assign Policy
                                </Button>
                              </div>
                              <div className="mt-4">
                                <h3 className="text-sm font-medium mb-2">Assigned Policies</h3>
                                <div className="rounded-md border p-4 max-h-40 overflow-y-auto">
                                  {currentRole &&
                                  getRolePolicyAssignments(currentRole.id).length > 0 ? (
                                    <div className="space-y-2">
                                      {getRolePolicyAssignments(currentRole.id).map(policy => {
                                        return (
                                          <div
                                            key={policy.id}
                                            className="flex items-center justify-between"
                                          >
                                            <Badge variant="outline">{policy.name}</Badge>
                                            <Button
                                              variant="ghost"
                                              size="icon"
                                              onClick={() =>
                                                removePolicyFromRole(currentRole.id, policy.id)
                                              }
                                            >
                                              <Trash2 className="h-4 w-4" />
                                            </Button>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  ) : (
                                    <p className="text-sm text-muted-foreground">
                                      No policies assigned to this role.
                                    </p>
                                  )}
                                </div>
                              </div>
                            </TabsContent>
                          </Tabs>
                          <DialogFooter className="mt-6">
                            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                              Cancel
                            </Button>
                            <Button onClick={handleEditRole}>Save Changes</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>

                      <Dialog
                        open={isDeleteDialogOpen && currentRole?.id === role.id}
                        onOpenChange={open => !open && setIsDeleteDialogOpen(false)}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => openDeleteDialog(role)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Delete Role</DialogTitle>
                            <DialogDescription>
                              Are you sure you want to delete this role? This action cannot be
                              undone.
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                              Cancel
                            </Button>
                            <Button variant="destructive" onClick={handleDeleteRole}>
                              Delete
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
