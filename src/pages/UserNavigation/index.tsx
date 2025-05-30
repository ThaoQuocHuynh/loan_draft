import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  UniqueIdentifier,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Eye,
  GripVertical,
  Plus,
  Save,
  Trash2,
  Undo2,
  User,
  Users,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Toaster } from '@/components/ui/sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { ClaimsSelect } from '@/components/Claims/ClaimsSelect';
import Topbar from '@/components/Topbar';
import { useNavigation } from '@/contexts/NavigationContext';
import { usePermission } from '@/contexts/PermissionContext';
import { evaluateVisibilityExpression } from '@/utils/expressionEvaluator';
import { getIconByName } from '@/utils/iconUtils';
import { NavItem } from '@/types/navigation';
import { UserType } from '@/types/user';
import { actionTypes, availableActions, availableForms, roles, users } from './mock';

// Helper function to find an item by ID in the navigation tree
const findItemById = (items: NavItem[], id: string): NavItem | null => {
  for (const item of items) {
    if (item.id === id) {
      return item;
    }
    if (item.children && item.children.length > 0) {
      const found = findItemById(item.children, id);
      if (found) return found;
    }
  }
  return null;
};

// Helper function to find the parent of an item by ID
const findParentById = (
  items: NavItem[],
  id: string,
  parent: NavItem | null = null
): NavItem | null => {
  for (const item of items) {
    if (item.id === id) {
      return parent;
    }
    if (item.children && item.children.length > 0) {
      const found = findParentById(item.children, id, item);
      if (found) return found;
    }
  }
  return null;
};

// Helper function to get the path to an item
const getItemPath = (
  items: NavItem[],
  id: string,
  path: (number | string)[] = []
): (number | string)[] | null => {
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (item.id === id) {
      return [...path, i];
    }
    if (item.children && item.children.length > 0) {
      const childPath = getItemPath(item.children, id, [...path, i, 'children']);
      if (childPath) return childPath;
    }
  }
  return null;
};

function SidebarManager() {
  const { navTree, updateNavTree, resetNavTree } = useNavigation();
  const { claims } = usePermission();
  const [selectedItem, setSelectedItem] = useState<NavItem | null>(null);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [expandedClaims, setExpandedClaims] = useState<Record<string, boolean>>({});
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewType, setPreviewType] = useState('role'); // "role" or "user"
  const [selectedRoleId, setSelectedRoleId] = useState('');
  const [selectedUserId, setSelectedUserId] = useState('');
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const activeItem = findItemById(navTree, active.id.toString());
      const overItem = findItemById(navTree, over.id.toString());

      if (activeItem && overItem) {
        const activeParent = findParentById(navTree, active.id.toString());
        const overParent = findParentById(navTree, over.id.toString());

        if (activeParent?.id === overParent?.id) {
          // Reordering within the same parent
          const parent = activeParent || { children: navTree };
          const oldIndex = parent.children.findIndex(item => item.id === active.id.toString());
          const newIndex = parent.children.findIndex(item => item.id === over.id.toString());

          reorderItems(oldIndex, newIndex, activeParent?.id || undefined);
        } else {
          // Moving between different parents
          moveItem(active.id.toString(), over.id.toString(), overParent?.id || undefined);
        }
      }
    }

    setActiveId(null);
  };

  const handleSave = async () => {
    try {
      await updateNavTree(navTree);
      toast.success('Navigation saved', {
        description: 'Your sidebar navigation has been saved successfully.',
      });
    } catch (error) {
      toast.error('Failed to save navigation', {
        description: error instanceof Error ? error.message : 'An unknown error occurred',
      });
    }
  };

  const handleAddItem = (parentId: string | null = null) => {
    const newItem: NavItem = {
      id: `new-${Date.now()}`,
      label: 'New Item',
      icon: 'Settings',
      type: 'item',
      actionType: 'none',
      actionValue: '',
      claims: [],
      children: [],
    };

    if (!parentId) {
      updateNavTree([...navTree, newItem]);
    } else {
      const updatedItems = [...navTree];
      const addChildToParent = (items: NavItem[], id: string): NavItem[] => {
        return items.map(item => {
          if (item.id === id) {
            return {
              ...item,
              children: [...item.children, newItem],
            };
          }
          if (item.children.length) {
            return {
              ...item,
              children: addChildToParent(item.children, id),
            };
          }
          return item;
        });
      };
      updateNavTree(addChildToParent(updatedItems, parentId));

      // Expand the parent
      if (!expandedItems.includes(parentId)) {
        setExpandedItems([...expandedItems, parentId]);
      }
    }
  };

  const handleDeleteItem = (id: string) => {
    const removeItem = (items: NavItem[]): NavItem[] => {
      return items.filter(item => {
        if (item.id === id) {
          return false;
        }
        if (item.children.length) {
          item.children = removeItem(item.children);
        }
        return true;
      });
    };

    const updatedItems = removeItem(navTree);
    updateNavTree(updatedItems);

    if (selectedItem && selectedItem.id === id) {
      setSelectedItem(null);
    }

    toast.success('Item deleted', {
      description: 'Navigation item has been removed.',
    });
  };

  const handleUpdateItem = (updatedItem: NavItem) => {
    // Validate if changing to button type with children
    if (updatedItem.type === 'button' && updatedItem.children.length > 0) {
      toast.error('Cannot convert to button type', {
        description: 'Button items cannot have children. Please remove all children first.',
      });
      return;
    }

    const updateItemInTree = (items: NavItem[]): NavItem[] => {
      return items.map(item => {
        if (item.id === updatedItem.id) {
          return updatedItem;
        }
        if (item.children.length) {
          return {
            ...item,
            children: updateItemInTree(item.children),
          };
        }
        return item;
      });
    };

    updateNavTree(updateItemInTree(navTree));
    setSelectedItem(updatedItem);

    toast.success('Item updated', {
      description: 'Navigation item has been updated.',
    });
  };

  const handleDiscardChanges = async () => {
    try {
      await resetNavTree();
      toast.success('Changes discarded', {
        description: 'Navigation has been reset to its original state.',
      });
    } catch (error) {
      toast.error('Failed to discard changes', {
        description: error instanceof Error ? error.message : 'An unknown error occurred',
      });
    }
  };

  const toggleExpand = (id: string) => {
    if (expandedItems.includes(id)) {
      setExpandedItems(expandedItems.filter(itemId => itemId !== id));
    } else {
      setExpandedItems([...expandedItems, id]);
    }
  };

  // Function to move an item within the navigation tree
  const moveItem = (
    dragId: string,
    hoverId: string,
    targetParentId: string | undefined = undefined
  ) => {
    // Clone the current items
    let newItems = JSON.parse(JSON.stringify(navTree));

    // Find the item being dragged
    const dragItem = findItemById(navTree, dragId);
    if (!dragItem) return;

    // Find the current parent of the dragged item
    const dragParent = findParentById(navTree, dragId);

    // Remove the dragged item from its current position
    if (dragParent) {
      // Item is a child of another item
      dragParent.children = dragParent.children.filter((item: NavItem) => item.id !== dragId);
    } else {
      // Item is at the root level
      newItems = newItems.filter((item: NavItem) => item.id !== dragId);
    }

    if (targetParentId) {
      // Moving to be a child of another item
      const targetParent = findItemById(newItems, targetParentId);
      if (targetParent) {
        if (hoverId) {
          // Insert at a specific position among siblings
          const hoverIndex = targetParent.children.findIndex(item => item.id === hoverId);
          if (hoverIndex !== -1) {
            targetParent.children.splice(hoverIndex, 0, dragItem);
          } else {
            targetParent.children.push(dragItem);
          }
        } else {
          // Add to the end of children
          targetParent.children.push(dragItem);
        }
      }
    } else {
      // Moving at the root level
      if (hoverId) {
        const hoverIndex = newItems.findIndex((item: NavItem) => item.id === hoverId);
        if (hoverIndex !== -1) {
          newItems.splice(hoverIndex, 0, dragItem);
        } else {
          newItems.push(dragItem);
        }
      } else {
        newItems.push(dragItem);
      }
    }

    updateNavTree(newItems);

    toast.success('Item moved', {
      description: 'Navigation item has been reordered.',
    });
  };

  // Function to handle reordering within the same parent
  const reorderItems = (
    dragIndex: number,
    hoverIndex: number,
    parentId: string | undefined = undefined
  ) => {
    // Clone the current items
    const newItems = JSON.parse(JSON.stringify(navTree));

    let itemsToReorder: NavItem[];

    if (parentId) {
      // Find the parent item
      const parent = findItemById(newItems, parentId);
      if (!parent) return;
      itemsToReorder = parent.children;
    } else {
      // Reordering at root level
      itemsToReorder = newItems;
    }

    // Perform the reordering
    const [movedItem] = itemsToReorder.splice(dragIndex, 1);
    itemsToReorder.splice(hoverIndex, 0, movedItem);

    // Update the state
    updateNavTree(newItems);
  };

  // Recursive component for rendering draggable navigation items
  const DraggableNavItem = ({
    item,
    index,
    depth = 0,
    parentId = undefined,
  }: {
    item: NavItem;
    index: number;
    depth?: number;
    parentId?: string | undefined;
  }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
      id: item.id,
      data: {
        item,
        index,
        parentId,
        depth,
      },
    });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.4 : 1,
    };

    return (
      <div ref={setNodeRef} style={style} className="nav-item">
        <div
          className={`flex items-center py-2 px-2 rounded-md group ${
            selectedItem && selectedItem.id === item.id ? 'bg-accent' : 'hover:bg-accent/50'
          } transition-colors duration-200`}
          style={{ paddingLeft: `${depth * 16 + 8}px` }}
          onClick={() => setSelectedItem(item)}
        >
          <div
            className="cursor-grab active:cursor-grabbing p-1 mr-1 hover:bg-accent/70 rounded"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </div>

          {item.children.length > 0 && (
            <button
              className="mr-1 p-1 rounded-sm hover:bg-accent"
              onClick={e => {
                e.stopPropagation();
                toggleExpand(item.id);
              }}
            >
              {expandedItems.includes(item.id) ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
          )}

          {item.type !== 'group' && item.icon && getIconByName(item.icon, 'h-4 w-4 mr-2')}

          <span className="flex-1">{item.label}</span>

          {item.type === 'button' && (
            <Badge variant="secondary" className="mr-2">
              Button
            </Badge>
          )}

          {item.type !== 'button' && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              onClick={e => {
                e.stopPropagation();
                handleAddItem(item.id);
              }}
            >
              <Plus className="h-4 w-4" />
              <span className="sr-only">Add child</span>
            </Button>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-destructive opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            onClick={e => {
              e.stopPropagation();
              handleDeleteItem(item.id);
            }}
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete</span>
          </Button>
        </div>

        {item.children.length > 0 && expandedItems.includes(item.id) && (
          <div className="children">
            <SortableContext
              items={item.children.map(child => child.id)}
              strategy={verticalListSortingStrategy}
            >
              {item.children.map((child, childIndex) => (
                <DraggableNavItem
                  key={child.id}
                  item={child}
                  index={childIndex}
                  depth={depth + 1}
                  parentId={item.id}
                />
              ))}
            </SortableContext>
          </div>
        )}
      </div>
    );
  };

  const handleApplyChanges = () => {
    if (selectedItem) {
      handleUpdateItem(selectedItem);
      toast.success('Changes applied', {
        description: 'Your changes have been applied to the navigation item.',
      });
    }
  };

  const handleClaimCheckboxChange = (claimId: string, checked: boolean) => {
    if (!selectedItem) return;

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
      const updatedClaims = [...new Set([...selectedItem.claims, claimId, ...descendantIds])];
      handleUpdateItem({ ...selectedItem, claims: updatedClaims });
    } else {
      // Deselect this claim and all its descendants
      const descendantIds = getAllDescendantIds(claimId);
      const updatedClaims = selectedItem.claims.filter(
        id => id !== claimId && !descendantIds.includes(id)
      );
      handleUpdateItem({ ...selectedItem, claims: updatedClaims });
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <>
        {/* <Toolbar
          name="Sidebar Navigation Manager"
          description="Manage the sidebar navigation for your application."
        >
          <Button variant="outline" size="sm" onClick={() => setShowPreviewModal(true)}>
            <Eye className="h-4 w-4 mr-1" />
            Preview
          </Button>

          <Button variant="outline" size="sm" onClick={handleDiscardChanges}>
            <Undo2 className="h-4 w-4 mr-1" />
            Discard Changes
          </Button>

          <Button size="sm" onClick={handleSave}>
            <Save className="h-4 w-4 mr-1" />
            Save Changes
          </Button>
        </Toolbar> */}

        <Topbar
          name="Sidebar Navigation Manager"
          description="Manage the sidebar navigation for your application."
        >
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={() => setShowPreviewModal(true)}>
              <Eye className="h-4 w-4 mr-1" />
              Preview
            </Button>

            <Button variant="outline" size="sm" onClick={handleDiscardChanges}>
              <Undo2 className="h-4 w-4 mr-1" />
              Discard Changes
            </Button>

            <Button size="sm" onClick={handleSave}>
              <Save className="h-4 w-4 mr-1" />
              Save Changes
            </Button>
          </div>
        </Topbar>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Navigation Structure</CardTitle>
                <CardDescription>
                  Drag items by the grip handle to reorder. Click to edit.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SortableContext
                  items={navTree.map(item => item.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {navTree.map((item, index) => (
                    <DraggableNavItem key={item.id} item={item} index={index} />
                  ))}
                </SortableContext>

                <Button variant="outline" className="w-full mt-4" onClick={() => handleAddItem()}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Root Item
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-2">
            {selectedItem ? (
              <Card>
                <CardHeader>
                  <CardTitle>Edit Navigation Item</CardTitle>
                  <CardDescription>Configure the selected navigation item</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="basic">
                    <TabsList className="mb-4">
                      <TabsTrigger value="basic">Basic Info</TabsTrigger>
                      <TabsTrigger value="action" disabled={selectedItem.type === 'group'}>
                        Action
                      </TabsTrigger>
                      <TabsTrigger value="permissions">Permissions</TabsTrigger>
                    </TabsList>

                    <TabsContent value="basic" className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="label">Label</Label>
                        <Input
                          id="label"
                          value={selectedItem.label}
                          onChange={e =>
                            handleUpdateItem({ ...selectedItem, label: e.target.value })
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="type">Type</Label>
                        <Select
                          value={selectedItem.type}
                          onValueChange={value =>
                            handleUpdateItem({
                              ...selectedItem,
                              type: value as 'group' | 'item' | 'button',
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="group">Group</SelectItem>
                            <SelectItem value="item">Item</SelectItem>
                            <SelectItem value="button">Button</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="icon">Icon</Label>
                        <Select
                          value={selectedItem.icon}
                          onValueChange={value =>
                            handleUpdateItem({ ...selectedItem, icon: value })
                          }
                          disabled={selectedItem.type === 'group'}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select icon" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Layers">Layers</SelectItem>
                            <SelectItem value="Settings">Settings</SelectItem>
                            <SelectItem value="FileText">File Text</SelectItem>
                            <SelectItem value="ExternalLink">External Link</SelectItem>
                          </SelectContent>
                        </Select>
                        {selectedItem.type === 'group' && (
                          <p className="text-xs text-muted-foreground">
                            Icons are not available for group items
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">Description (Optional)</Label>
                        <Textarea
                          id="description"
                          placeholder="Enter a description for this navigation item"
                          value={selectedItem.description || ''}
                          onChange={e =>
                            handleUpdateItem({ ...selectedItem, description: e.target.value })
                          }
                        />
                      </div>
                    </TabsContent>

                    <TabsContent value="action" className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="actionType">Action Type</Label>
                        <Select
                          value={selectedItem.actionType}
                          onValueChange={(value: NavItem['actionType']) =>
                            handleUpdateItem({
                              ...selectedItem,
                              actionType: value,
                              actionValue: '',
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select action type" />
                          </SelectTrigger>
                          <SelectContent>
                            {actionTypes.map(type => (
                              <SelectItem key={type.id} value={type.id}>
                                {type.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {selectedItem.actionType === 'form' && (
                        <div className="space-y-2">
                          <Label htmlFor="formId">Form</Label>
                          <Select
                            value={selectedItem.actionValue}
                            onValueChange={value =>
                              handleUpdateItem({ ...selectedItem, actionValue: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select form" />
                            </SelectTrigger>
                            <SelectContent>
                              {availableForms.map(form => (
                                <SelectItem key={form.id} value={form.id}>
                                  {form.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      {selectedItem.actionType === 'action' && (
                        <div className="space-y-2">
                          <Label htmlFor="actionId">Action</Label>
                          <Select
                            value={selectedItem.actionValue}
                            onValueChange={value =>
                              handleUpdateItem({ ...selectedItem, actionValue: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select action" />
                            </SelectTrigger>
                            <SelectContent>
                              {availableActions.map(action => (
                                <SelectItem key={action.id} value={action.id}>
                                  {action.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      {selectedItem.actionType === 'url' && (
                        <div className="space-y-2">
                          <Label htmlFor="url">URL</Label>
                          <Input
                            id="url"
                            type="url"
                            placeholder="https://example.com"
                            value={selectedItem.actionValue}
                            onChange={e =>
                              handleUpdateItem({ ...selectedItem, actionValue: e.target.value })
                            }
                          />
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="permissions" className="space-y-4">
                      <div className="space-y-2">
                        <Label>Required Claims</Label>
                        <p className="text-sm text-muted-foreground mb-2">
                          Select the claims required to view this navigation item. Child claims are
                          grouped under their parents.
                        </p>

                        <ClaimsSelect
                          claims={claims}
                          selectedClaimIds={selectedItem?.claims || []}
                          onSelectionChange={selectedIds => {
                            if (selectedItem) {
                              handleUpdateItem({ ...selectedItem, claims: selectedIds });
                            }
                          }}
                          placeholder="Select required claims..."
                        />
                      </div>

                      <Separator />

                      <div className="space-y-2">
                        <Label htmlFor="visibilityLogic">Advanced Visibility Logic</Label>
                        <Textarea
                          id="visibilityLogic"
                          placeholder="Enter custom JavaScript expression for visibility logic"
                          value={selectedItem?.visibilityLogic || ''}
                          onChange={e =>
                            handleUpdateItem({ ...selectedItem!, visibilityLogic: e.target.value })
                          }
                          className="font-mono text-sm"
                        />
                        <p className="text-xs text-muted-foreground">
                          Example:{' '}
                          <code>
                            user.hasAnyRole(['admin', 'manager']) && user.department === 'IT'
                          </code>
                        </p>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={() => setSelectedItem(null)}>
                    Cancel
                  </Button>
                  <Button onClick={handleApplyChanges}>Apply Changes</Button>
                </CardFooter>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Navigation Item Details</CardTitle>
                  <CardDescription>
                    Select an item from the navigation structure to edit its details
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-center h-64 text-muted-foreground">
                  No item selected
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </>
      <DragOverlay>
        {activeId ? (
          <div className="flex items-center py-2 px-2 rounded-md bg-accent/50">
            <GripVertical className="h-4 w-4 text-muted-foreground mr-2" />
            {findItemById(navTree, activeId.toString())?.label}
          </div>
        ) : null}
      </DragOverlay>
      <Toaster />
      {showPreviewModal && (
        <PreviewModal
          navItems={navTree}
          onClose={() => setShowPreviewModal(false)}
          previewType={previewType}
          setPreviewType={setPreviewType}
          selectedRoleId={selectedRoleId}
          setSelectedRoleId={setSelectedRoleId}
          selectedUserId={selectedUserId}
          setSelectedUserId={setSelectedUserId}
        />
      )}
    </DndContext>
  );
}

function PreviewModal({
  navItems,
  onClose,
  previewType,
  setPreviewType,
  selectedRoleId,
  setSelectedRoleId,
  selectedUserId,
  setSelectedUserId,
}: {
  navItems: NavItem[];
  onClose: () => void;
  previewType: string;
  setPreviewType: (type: string) => void;
  selectedRoleId: string;
  setSelectedRoleId: (id: string) => void;
  selectedUserId: string;
  setSelectedUserId: (id: string) => void;
}) {
  // Get the claims based on selected role or user
  const getActiveClaims = () => {
    if (previewType === 'role') {
      const role = roles.find(r => r.id === selectedRoleId);
      return role ? role.claims : [];
    } else {
      const user = users.find(u => u.id === selectedUserId);
      return user ? user.claims : [];
    }
  };

  const activeClaims = getActiveClaims();

  // Create a mock user object for the expression context
  const mockUser = {
    id: selectedUserId || selectedRoleId,
    name:
      previewType === 'role'
        ? roles.find(r => r.id === selectedRoleId)?.name || 'Unknown Role'
        : users.find(u => u.id === selectedUserId)?.name || 'Unknown User',
    email: 'mock@example.com',
    type: (previewType === 'role' ? 'admin' : 'internal') as UserType,
    permissions: {
      roles:
        previewType === 'role'
          ? [selectedRoleId]
          : users.find(u => u.id === selectedUserId)?.roles || [],
      claims: activeClaims,
      policies: [] as string[],
    },
  };

  // Helper functions for the expression context
  const hasRole = (role: string) => mockUser.permissions.roles.includes(role);
  const hasClaim = (claim: string) => mockUser.permissions.claims.includes(claim);
  const hasPolicy = (policy: string) => mockUser.permissions.policies.includes(policy);

  // Filter navigation items based on permissions and visibility logic
  const filterNavItems = (items: NavItem[]): NavItem[] => {
    return items
      .filter((item: NavItem) => {
        // If no claims are required and no visibility logic, show the item
        if ((!item.claims || item.claims.length === 0) && !item.visibilityLogic) {
          return true;
        }

        // Check if user/role has any of the required claims
        const hasRequiredClaims =
          !item.claims ||
          item.claims.length === 0 ||
          item.claims.some((claim: string) => activeClaims.includes(claim));

        // If there's visibility logic, evaluate it
        if (item.visibilityLogic) {
          const context = {
            user: mockUser,
            hasRole,
            hasClaim,
            hasPolicy,
          };
          const isVisibleByLogic = evaluateVisibilityExpression(item.visibilityLogic, context);
          return hasRequiredClaims && isVisibleByLogic;
        }

        return hasRequiredClaims;
      })
      .map(
        (item: NavItem): NavItem => ({
          ...item,
          children: item.children ? filterNavItems(item.children) : [],
        })
      );
  };

  const filteredNavItems = filterNavItems(navItems);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background rounded-lg w-full max-w-3xl max-h-[90vh] flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">Navigation Preview</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </div>

        <div className="p-4 border-b">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="preview-type" className="mb-2 block">
                Preview As
              </Label>
              <Tabs value={previewType} onValueChange={setPreviewType} className="w-full">
                <TabsList className="grid grid-cols-2 w-full">
                  <TabsTrigger value="role">
                    <Users className="mr-2 h-4 w-4" />
                    Role
                  </TabsTrigger>
                  <TabsTrigger value="user">
                    <User className="mr-2 h-4 w-4" />
                    User
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="flex-1">
              {previewType === 'role' ? (
                <div>
                  <Label htmlFor="role-select" className="mb-2 block">
                    Select Role
                  </Label>
                  <Select value={selectedRoleId} onValueChange={setSelectedRoleId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map(role => (
                        <SelectItem key={role.id} value={role.id}>
                          {role.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <div>
                  <Label htmlFor="user-select" className="mb-2 block">
                    Select User
                  </Label>
                  <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a user" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map(user => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </div>

          {(previewType === 'role' && selectedRoleId) ||
          (previewType === 'user' && selectedUserId) ? (
            <div className="mt-4 p-3 bg-muted rounded-md">
              <h3 className="text-sm font-medium mb-1">Active Claims:</h3>
              <div className="flex flex-wrap gap-1">
                {activeClaims.length > 0 ? (
                  activeClaims.map(claim => (
                    <Badge key={claim} variant="secondary" className="text-xs">
                      {claim}
                    </Badge>
                  ))
                ) : (
                  <span className="text-xs text-muted-foreground">No claims</span>
                )}
              </div>
            </div>
          ) : null}
        </div>

        <div className="flex-1 overflow-auto p-4 flex">
          <div className="w-64 border rounded-md h-96 overflow-y-auto p-2 bg-background">
            <div className="font-semibold mb-4 px-2">Navigation Preview</div>
            {(previewType === 'role' && !selectedRoleId) ||
            (previewType === 'user' && !selectedUserId) ? (
              <div className="text-center text-muted-foreground p-4">
                Please select a {previewType} to preview
              </div>
            ) : filteredNavItems.length === 0 ? (
              <div className="text-center text-muted-foreground p-4">
                No navigation items visible with current permissions
              </div>
            ) : (
              <SidebarPreview items={filteredNavItems} />
            )}
          </div>

          <div className="flex-1 ml-6">
            <div className="border rounded-md p-4 h-full">
              <h3 className="font-medium mb-2">Preview Information</h3>
              {(previewType === 'role' && selectedRoleId) ||
              (previewType === 'user' && selectedUserId) ? (
                <>
                  <p className="text-sm mb-4">
                    This preview shows how the navigation will appear for the selected {previewType}
                    . Only items that match the permission requirements will be displayed.
                  </p>

                  <div className="space-y-2">
                    <div>
                      <span className="text-sm font-medium">Total Navigation Items: </span>
                      <span className="text-sm">{countItems(navItems)}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Visible Navigation Items: </span>
                      <span className="text-sm">{countItems(filteredNavItems)}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Hidden Navigation Items: </span>
                      <span className="text-sm">
                        {countItems(navItems) - countItems(filteredNavItems)}
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Select a {previewType} to see how the navigation will appear with their
                  permissions.
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="p-4 border-t flex justify-end">
          <Button onClick={onClose}>Close Preview</Button>
        </div>
      </div>
    </div>
  );
}

function SidebarPreview({ items }: { items: NavItem[] }) {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpand = (id: string) => {
    if (expandedItems.includes(id)) {
      setExpandedItems(expandedItems.filter(itemId => itemId !== id));
    } else {
      setExpandedItems([...expandedItems, id]);
    }
  };

  const renderItems = (items: NavItem[], depth = 0) => {
    return items.map(item => (
      <div key={item.id} className="nav-item">
        <div
          className={`flex items-center py-2 px-2 rounded-md hover:bg-accent/50 cursor-pointer`}
          style={{ paddingLeft: `${depth * 16 + 8}px` }}
        >
          {item.children.length > 0 && (
            <button
              className="mr-1 p-1 rounded-sm hover:bg-accent"
              onClick={e => {
                e.stopPropagation();
                toggleExpand(item.id);
              }}
            >
              {expandedItems.includes(item.id) ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
          )}

          {item.type !== 'group' && item.icon && getIconByName(item.icon, 'h-4 w-4 mr-2')}

          <span className="flex-1">{item.label}</span>

          {item.actionType === 'url' && <ExternalLink className="h-3 w-3 text-muted-foreground" />}
        </div>

        {item.children.length > 0 && expandedItems.includes(item.id) && (
          <div className="children">{renderItems(item.children, depth + 1)}</div>
        )}
      </div>
    ));
  };

  return <div>{renderItems(items)}</div>;
}

// Helper function to count total items in the navigation tree
function countItems(items: NavItem[]): number {
  return items.reduce((count, item) => {
    return count + 1 + (item.children ? countItems(item.children) : 0);
  }, 0);
}

export default SidebarManager;
