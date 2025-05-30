'use client';

import { useState } from 'react';
import { Edit, Plus, ShieldAlert, Trash2, UserIcon } from 'lucide-react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ClaimsTree } from '@/components/Claims/ClaimsTree';
import Topbar from '@/components/Topbar';
import { usePermission } from '@/contexts/PermissionContext';
import { useUser } from '@/contexts/UserContext';
import { Claim } from '@/types/authorization';
import { User } from '@/types/user';

function UserManager() {
  const {
    getUsers,
    addUser,
    updateUser,
    deleteUser,
    addClaimToUser,
    addRoleToUser,
    addPolicyToUser,
    removeClaimFromUser,
    removeRoleFromUser,
    removePolicyFromUser,
  } = useUser();

  const { claims, roles, policies } = usePermission();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });

  // State for role assignments
  const [selectedRoleIds, setSelectedRoleIds] = useState<string[]>([]);

  // State for claim assignments
  const [selectedClaimIds, setSelectedClaimIds] = useState<string[]>([]);

  // State for policy assignments
  const [selectedPolicyIds, setSelectedPolicyIds] = useState<string[]>([]);

  const handleAddUser = () => {
    // Create a new user with the form data
    const newUser: User = {
      id: crypto.randomUUID(), // Generate a unique ID
      name: formData.name,
      email: formData.email,
      type: 'internal',
      permissions: {
        roles: selectedRoleIds,
        claims: selectedClaimIds,
        policies: selectedPolicyIds,
      },
    };

    // Add the new user using the context
    addUser(newUser);

    // Reset form and state
    setFormData({ name: '', email: '' });
    setSelectedRoleIds([]);
    setSelectedClaimIds([]);
    setSelectedPolicyIds([]);
    setIsAddDialogOpen(false);
  };

  const handleEditUser = () => {
    if (selectedUser) {
      // Update the user using the context
      const updatedUser = {
        ...selectedUser,
        name: formData.name,
        email: formData.email,
        permissions: {
          roles: selectedRoleIds,
          claims: selectedClaimIds,
          policies: selectedPolicyIds,
        },
      };
      updateUser(updatedUser);
      setIsEditDialogOpen(false);
    }
  };

  const handleDeleteUser = () => {
    if (selectedUser) {
      // Delete the user using the context
      deleteUser(selectedUser.id);
      setIsDeleteDialogOpen(false);
    }
  };

  const openEditDialog = (user: User) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
    });

    // Set selected roles based on current assignments
    const assignedRoleIds = user.permissions?.roles || [];
    setSelectedRoleIds(assignedRoleIds);

    // Set selected claims based on current assignments
    const assignedClaimIds = user.permissions?.claims || [];
    setSelectedClaimIds(assignedClaimIds);

    // Set selected policies based on current assignments
    const assignedPolicyIds = user.permissions?.policies || [];
    setSelectedPolicyIds(assignedPolicyIds);

    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (user: User) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const rootClaims = claims;

  // Get child claims for a parent
  const getChildClaims = (parentId: string): Claim[] => {
    return claims.filter(claim => claim.parentId === parentId);
  };

  // Handle role checkbox change
  const handleRoleCheckboxChange = (roleId: string, checked: boolean) => {
    if (checked) {
      setSelectedRoleIds(prev => [...prev, roleId]);
      if (selectedUser) {
        addRoleToUser(selectedUser.id, roleId);
      }
    } else {
      setSelectedRoleIds(prev => prev.filter(id => id !== roleId));
      if (selectedUser) {
        removeRoleFromUser(selectedUser.id, roleId);
      }
    }
  };

  // Handle claim checkbox change with descendants
  const handleClaimCheckboxChange = (claimId: string, checked: boolean) => {
    if (checked) {
      setSelectedClaimIds(prev => [...new Set([...prev, claimId])]);
      if (selectedUser) {
        addClaimToUser(selectedUser.id, claimId);
      }
    } else {
      setSelectedClaimIds(prev => prev.filter(id => id !== claimId));
      if (selectedUser) {
        removeClaimFromUser(selectedUser.id, claimId);
      }
    }
  };

  // Handle policy checkbox change
  const handlePolicyCheckboxChange = (policyId: string, checked: boolean) => {
    if (checked) {
      setSelectedPolicyIds(prev => [...prev, policyId]);
      if (selectedUser) {
        addPolicyToUser(selectedUser.id, policyId);
      }
    } else {
      setSelectedPolicyIds(prev => prev.filter(id => id !== policyId));
      if (selectedUser) {
        removePolicyFromUser(selectedUser.id, policyId);
      }
    }
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
      <Topbar
        name="User Management"
        description="Manage users and their assigned roles, claims, and policies."
      >
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4" />
              Create User
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
              <DialogDescription>Create a new user and assign permissions.</DialogDescription>
            </DialogHeader>

            <Tabs defaultValue="details" className="mt-4">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="details">User Details</TabsTrigger>
                <TabsTrigger value="roles">Roles</TabsTrigger>
                <TabsTrigger value="claims">Claims</TabsTrigger>
                <TabsTrigger value="policies">Policies</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-4 pt-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. John Doe"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. john@example.com"
                  />
                </div>
              </TabsContent>

              <TabsContent value="roles" className="space-y-4 pt-4">
                <div className="border rounded-md p-4 max-h-96 overflow-y-auto">
                  <div className="mb-4">
                    <h3 className="text-sm font-medium mb-2">Assign Roles</h3>
                    <p className="text-xs text-muted-foreground mb-4">
                      Select the roles to assign to this user.
                    </p>
                    <div className="space-y-2">
                      {roles.map(role => (
                        <div key={role.id} className="flex items-center">
                          <Checkbox
                            id={`role-${role.id}`}
                            checked={selectedRoleIds.includes(role.id)}
                            onCheckedChange={checked =>
                              handleRoleCheckboxChange(role.id, checked === true)
                            }
                          />
                          <Label htmlFor={`role-${role.id}`} className="ml-2 cursor-pointer">
                            {role.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="claims" className="space-y-4 pt-4">
                <div className="border rounded-md p-4 h-[calc(100vh-400px)] overflow-y-auto">
                  <div className="mb-4">
                    <h3 className="text-sm font-medium mb-2">Assign Claims</h3>
                    <p className="text-xs text-muted-foreground mb-4">
                      Select the claims to assign directly to this user. Child claims are grouped
                      under their parents.
                    </p>
                    <ClaimsTree
                      claims={rootClaims}
                      selectedClaimIds={selectedClaimIds}
                      onClaimChange={handleClaimCheckboxChange}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="policies" className="space-y-4 pt-4">
                <div className="border rounded-md p-4 max-h-96 overflow-y-auto">
                  <div className="mb-4">
                    <h3 className="text-sm font-medium mb-2">Assign Policies</h3>
                    <p className="text-xs text-muted-foreground mb-4">
                      Select the policies to assign directly to this user.
                    </p>
                    <div className="space-y-2">
                      {policies.map(policy => (
                        <div key={policy.id} className="flex items-center">
                          <Checkbox
                            id={`policy-${policy.id}`}
                            checked={selectedPolicyIds.includes(policy.id)}
                            onCheckedChange={checked =>
                              handlePolicyCheckboxChange(policy.id, checked === true)
                            }
                          />
                          <Label htmlFor={`policy-${policy.id}`} className="ml-2 cursor-pointer">
                            {policy.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <DialogFooter className="mt-6">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddUser}>Create User</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Topbar>

      <div className="rounded-md border">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="py-3 px-4 text-left font-medium">Name</th>
              <th className="py-3 px-4 text-left font-medium">Email</th>
              <th className="py-3 px-4 text-left font-medium">Roles</th>
              <th className="py-3 px-4 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {getUsers().length === 0 ? (
              <tr>
                <td colSpan={4} className="py-6 text-center text-muted-foreground">
                  No users found. Create your first user to get started.
                </td>
              </tr>
            ) : (
              getUsers().map((user, index) => (
                <tr key={user.id} className={index !== getUsers().length - 1 ? 'border-b' : ''}>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <UserIcon className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{user.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">{user.email}</td>
                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-1">
                      {user.permissions.roles.length > 0 ? (
                        user.permissions.roles.map(role => (
                          <Badge key={role} variant="secondary" className="mr-1 mb-1">
                            {role}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-sm text-muted-foreground">No roles assigned</span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Dialog
                        open={isEditDialogOpen && selectedUser?.id === user.id}
                        onOpenChange={open => !open && setIsEditDialogOpen(false)}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => openEditDialog(user)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl">
                          <DialogHeader>
                            <DialogTitle>Edit User</DialogTitle>
                            <DialogDescription>
                              Update user details and permissions.
                            </DialogDescription>
                          </DialogHeader>

                          <Tabs defaultValue="details" className="mt-4">
                            <TabsList className="grid w-full grid-cols-4">
                              <TabsTrigger value="details">User Details</TabsTrigger>
                              <TabsTrigger value="roles">Roles</TabsTrigger>
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
                                <Label htmlFor="edit-email">Email</Label>
                                <Input
                                  id="edit-email"
                                  type="email"
                                  value={formData.email}
                                  onChange={e =>
                                    setFormData({ ...formData, email: e.target.value })
                                  }
                                />
                              </div>
                            </TabsContent>

                            <TabsContent value="roles" className="space-y-4 pt-4">
                              <div className="border rounded-md p-4 max-h-96 overflow-y-auto">
                                <div className="mb-4">
                                  <h3 className="text-sm font-medium mb-2">Assign Roles</h3>
                                  <p className="text-xs text-muted-foreground mb-4">
                                    Select the roles to assign to this user.
                                  </p>
                                  <div className="space-y-2">
                                    {roles.map(role => (
                                      <div key={role.id} className="flex items-center">
                                        <Checkbox
                                          id={`edit-role-${role.id}`}
                                          checked={selectedRoleIds.includes(role.id)}
                                          onCheckedChange={checked =>
                                            handleRoleCheckboxChange(role.id, checked === true)
                                          }
                                        />
                                        <Label
                                          htmlFor={`edit-role-${role.id}`}
                                          className="ml-2 cursor-pointer"
                                        >
                                          {role.name}
                                        </Label>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </TabsContent>

                            <TabsContent value="claims" className="space-y-4 pt-4">
                              <div className="border rounded-md p-4 h-[calc(100vh-400px)] overflow-y-auto">
                                <div className="mb-4">
                                  <h3 className="text-sm font-medium mb-2">Assign Claims</h3>
                                  <p className="text-xs text-muted-foreground mb-4">
                                    Select the claims to assign directly to this user. Child claims
                                    are grouped under their parents.
                                  </p>
                                  <ClaimsTree
                                    claims={rootClaims}
                                    selectedClaimIds={selectedClaimIds}
                                    onClaimChange={handleClaimCheckboxChange}
                                  />
                                </div>
                              </div>
                            </TabsContent>

                            <TabsContent value="policies" className="space-y-4 pt-4">
                              <div className="border rounded-md p-4 max-h-96 overflow-y-auto">
                                <div className="mb-4">
                                  <h3 className="text-sm font-medium mb-2">Assign Policies</h3>
                                  <p className="text-xs text-muted-foreground mb-4">
                                    Select the policies to assign directly to this user.
                                  </p>
                                  <div className="space-y-2">
                                    {policies.map(policy => (
                                      <div key={policy.id} className="flex items-center">
                                        <Checkbox
                                          id={`edit-policy-${policy.id}`}
                                          checked={selectedPolicyIds.includes(policy.id)}
                                          onCheckedChange={checked =>
                                            handlePolicyCheckboxChange(policy.id, checked === true)
                                          }
                                        />
                                        <Label
                                          htmlFor={`edit-policy-${policy.id}`}
                                          className="ml-2 cursor-pointer"
                                        >
                                          {policy.name}
                                        </Label>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </TabsContent>
                          </Tabs>

                          <DialogFooter className="mt-6">
                            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                              Cancel
                            </Button>
                            <Button onClick={handleEditUser}>Save Changes</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>

                      <Dialog
                        open={isDeleteDialogOpen && selectedUser?.id === user.id}
                        onOpenChange={open => !open && setIsDeleteDialogOpen(false)}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => openDeleteDialog(user)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Delete User</DialogTitle>
                            <DialogDescription>
                              Are you sure you want to delete this user? This action cannot be
                              undone.
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                              Cancel
                            </Button>
                            <Button variant="destructive" onClick={handleDeleteUser}>
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

export { UserManager };
