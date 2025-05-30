import { useState } from 'react';
import { Edit, Plus, Trash2 } from 'lucide-react';
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
import { Textarea } from '@/components/ui/textarea';
import Topbar from '@/components/Topbar';
import { usePermission } from '@/contexts/PermissionContext';
import { Policy } from '@/types/authorization';

export default function PoliciesPage() {
  const { policies, addPolicy, updatePolicy, deletePolicy } = usePermission();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentPolicy, setCurrentPolicy] = useState<Policy | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    conditions: '{}',
  });

  const handleAddPolicy = () => {
    try {
      // Validate JSON
      JSON.parse(formData.conditions);

      addPolicy({
        name: formData.name,
        description: formData.description,
        conditions: formData.conditions,
      });
      setFormData({ name: '', description: '', conditions: '{}' });
      setIsAddDialogOpen(false);
    } catch (error) {
      alert('Invalid JSON in conditions');
    }
  };

  const handleEditPolicy = () => {
    if (currentPolicy) {
      try {
        // Validate JSON
        JSON.parse(formData.conditions);

        updatePolicy(currentPolicy.id, {
          name: formData.name,
          description: formData.description,
          conditions: formData.conditions,
        });
        setIsEditDialogOpen(false);
      } catch (error) {
        alert('Invalid JSON in conditions');
      }
    }
  };

  const handleDeletePolicy = () => {
    if (currentPolicy) {
      deletePolicy(currentPolicy.id);
      setIsDeleteDialogOpen(false);
    }
  };

  const openEditDialog = (policy: Policy) => {
    setCurrentPolicy(policy);
    setFormData({
      name: policy.name,
      description: policy.description,
      conditions: policy.conditions,
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (policy: Policy) => {
    setCurrentPolicy(policy);
    setIsDeleteDialogOpen(true);
  };

  const formatConditions = (conditions: string) => {
    try {
      return JSON.stringify(JSON.parse(conditions), null, 2);
    } catch (error) {
      return conditions;
    }
  };

  return (
    <>
      <Topbar
        name="Policies"
        description="Create policies with conditions that grant access to resources."
      >
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4" />
              Create Policy
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Policy</DialogTitle>
              <DialogDescription>
                Create a new policy with conditions for your permission system.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. AdminAccess"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe what this policy grants access to"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="conditions">Conditions (JSON)</Label>
                <Textarea
                  id="conditions"
                  value={formData.conditions}
                  onChange={e => setFormData({ ...formData, conditions: e.target.value })}
                  placeholder='{"type":"AND","conditions":[...]}'
                  className="font-mono text-sm h-40"
                />
                <p className="text-xs text-muted-foreground">
                  Define the conditions for this policy in JSON format. Use logical operators (AND,
                  OR) and claim comparisons.
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddPolicy}>Create Policy</Button>
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
              <th className="py-3 px-4 text-left font-medium">Conditions</th>
              <th className="py-3 px-4 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {policies.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-6 text-center text-muted-foreground">
                  No policies found. Create your first policy to get started.
                </td>
              </tr>
            ) : (
              policies.map((policy, index) => (
                <tr key={policy.id} className={index !== policies.length - 1 ? 'border-b' : ''}>
                  <td className="py-3 px-4 font-medium">{policy.name}</td>
                  <td className="py-3 px-4 text-muted-foreground">{policy.description}</td>
                  <td className="py-3 px-4">
                    <div className="rounded-md bg-muted p-2 max-w-md">
                      <pre className="text-xs overflow-auto max-h-20">
                        {formatConditions(policy.conditions)}
                      </pre>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Dialog
                        open={isEditDialogOpen && currentPolicy?.id === policy.id}
                        onOpenChange={open => !open && setIsEditDialogOpen(false)}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => openEditDialog(policy)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Edit Policy</DialogTitle>
                            <DialogDescription>
                              Update the details for this policy.
                            </DialogDescription>
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
                              <Label htmlFor="edit-description">Description</Label>
                              <Textarea
                                id="edit-description"
                                value={formData.description}
                                onChange={e =>
                                  setFormData({ ...formData, description: e.target.value })
                                }
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="edit-conditions">Conditions (JSON)</Label>
                              <Textarea
                                id="edit-conditions"
                                value={formData.conditions}
                                onChange={e =>
                                  setFormData({ ...formData, conditions: e.target.value })
                                }
                                className="font-mono text-sm h-40"
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                              Cancel
                            </Button>
                            <Button onClick={handleEditPolicy}>Save Changes</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>

                      <Dialog
                        open={isDeleteDialogOpen && currentPolicy?.id === policy.id}
                        onOpenChange={open => !open && setIsDeleteDialogOpen(false)}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => openDeleteDialog(policy)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Delete Policy</DialogTitle>
                            <DialogDescription>
                              Are you sure you want to delete this policy? This action cannot be
                              undone.
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                              Cancel
                            </Button>
                            <Button variant="destructive" onClick={handleDeletePolicy}>
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
