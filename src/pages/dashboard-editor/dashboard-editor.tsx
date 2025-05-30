'use client';

// https://github.com/react-grid-layout/react-grid-layout/blob/master/test/examples/15-drag-from-outside.jsx
import {
  DndContext,
  DragEndEvent,
  DragMoveEvent,
  DragOverlay,
  DragStartEvent,
  DropAnimation,
  MouseSensor,
  TouchSensor,
  defaultDropAnimation,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { useCallback, useState } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import {
  ChevronRight,
  Eye,
  EyeOff,
  GripVertical,
  MoreVertical,
  Save,
  Settings,
  Trash2,
  Undo2,
} from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Toolbar } from '@/components/toolbar/Toolbar';

const ResponsiveGridLayout = WidthProvider(Responsive);

interface Widget {
  id: string;
  title: string;
  content: string;
  layout: {
    i: string;
    x: number;
    y: number;
    w: number;
    h: number;
  };
}

interface WidgetDefinition {
  id: string;
  title: string;
  description: string;
  icon: string;
  defaultSize: {
    w: number;
    h: number;
  };
}

const availableWidgets: WidgetDefinition[] = [
  {
    id: 'text',
    title: 'Text Widget',
    description: 'A simple text widget for displaying content',
    icon: 'Text',
    defaultSize: { w: 3, h: 2 },
  },
  {
    id: 'chart',
    title: 'Chart Widget',
    description: 'A widget for displaying charts and graphs',
    icon: 'BarChart',
    defaultSize: { w: 4, h: 3 },
  },
  {
    id: 'table',
    title: 'Table Widget',
    description: 'A widget for displaying tabular data',
    icon: 'Table',
    defaultSize: { w: 6, h: 4 },
  },
  {
    id: 'calendar',
    title: 'Calendar Widget',
    description: 'A widget for displaying calendar events',
    icon: 'Calendar',
    defaultSize: { w: 4, h: 4 },
  },
];

function DraggableWidget({ widget }: { widget: WidgetDefinition }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: widget.id,
    data: widget,
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="p-3 border rounded-lg bg-card hover:bg-accent cursor-move"
    >
      <div className="flex items-center gap-2">
        <div className="p-2 bg-accent rounded">{widget.icon}</div>
        <div>
          <h3 className="font-medium">{widget.title}</h3>
          <p className="text-sm text-muted-foreground">{widget.description}</p>
        </div>
      </div>
    </div>
  );
}

const dropAnimation: DropAnimation = {
  ...defaultDropAnimation,
};

function DragOverlayContent({ widget }: { widget: WidgetDefinition }) {
  return (
    <div className="p-3 border rounded-lg bg-card shadow-lg opacity-90 w-[200px]">
      <div className="flex items-center gap-2">
        <div className="p-2 bg-accent rounded">{widget.icon}</div>
        <div>
          <h3 className="font-medium">{widget.title}</h3>
          <p className="text-sm text-muted-foreground">{widget.description}</p>
        </div>
      </div>
    </div>
  );
}

function DroppableArea({
  widgets,
  previewMode,
  onLayoutChange,
  setEditingWidget,
  setIsPropertiesDialogOpen,
  deleteWidget,
}: {
  widgets: Widget[];
  previewMode: boolean;
  onLayoutChange: (layout: any) => void;
  setEditingWidget: (widget: Widget | null) => void;
  setIsPropertiesDialogOpen: (open: boolean) => void;
  deleteWidget: (id: string) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: 'droppable',
  });

  return (
    <div ref={setNodeRef} className={`h-full ${isOver ? 'bg-accent/20' : ''}`}>
      <ResponsiveGridLayout
        className="layout"
        layouts={{ lg: widgets.map(w => w.layout) }}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        rowHeight={100}
        isDraggable={!previewMode}
        isResizable={!previewMode}
        onLayoutChange={onLayoutChange}
        draggableHandle=".drag-handle"
        margin={[10, 10]}
        containerPadding={[0, 0]}
        useCSSTransforms={true}
        compactType={null}
      >
        {widgets.map(widget => (
          <div
            key={widget.id}
            className="bg-white rounded-lg shadow-sm border flex flex-col h-full overflow-hidden"
          >
            <div className="flex items-center justify-between p-2 border-b shrink-0">
              <div className="flex items-center gap-2 min-w-0">
                {!previewMode && (
                  <div className="drag-handle cursor-move shrink-0">
                    <GripVertical className="h-4 w-4 text-gray-400" />
                  </div>
                )}
                <span className="font-medium truncate">{widget.title}</span>
              </div>
              {!previewMode && (
                <div className="flex items-center gap-2 shrink-0">
                  {widget.layout.w >= 3 ? (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setEditingWidget(widget);
                          setIsPropertiesDialogOpen(true);
                        }}
                      >
                        <Settings className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => deleteWidget(widget.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-48 p-2">
                        <div className="flex flex-col gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="justify-start"
                            onClick={() => {
                              setEditingWidget(widget);
                              setIsPropertiesDialogOpen(true);
                            }}
                          >
                            <Settings className="h-4 w-4 mr-2" />
                            Properties
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => deleteWidget(widget.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </Button>
                        </div>
                      </PopoverContent>
                    </Popover>
                  )}
                </div>
              )}
            </div>
            <ScrollArea className="flex-1">
              <div className="p-4">{widget.content}</div>
            </ScrollArea>
          </div>
        ))}
      </ResponsiveGridLayout>
    </div>
  );
}

export function DashboardEditor() {
  const [previewMode, setPreviewMode] = useState(false);
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [editingWidget, setEditingWidget] = useState<Widget | null>(null);
  const [isPropertiesDialogOpen, setIsPropertiesDialogOpen] = useState(false);
  const [isWidgetPanelOpen, setIsWidgetPanelOpen] = useState(true);
  const [activeWidget, setActiveWidget] = useState<WidgetDefinition | null>(null);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    })
  );

  const onLayoutChange = useCallback((layout: any) => {
    setWidgets(prevWidgets =>
      prevWidgets.map(widget => {
        const newLayout = layout.find((l: any) => l.i === widget.id);
        if (newLayout) {
          return {
            ...widget,
            layout: newLayout,
          };
        }
        return widget;
      })
    );
  }, []);

  const addWidget = useCallback((widgetDef: WidgetDefinition, x: number, y: number) => {
    const newWidget: Widget = {
      id: uuidv4(),
      title: widgetDef.title,
      content: `Content for ${widgetDef.title}`,
      layout: {
        i: uuidv4(),
        x: Math.max(0, x),
        y: Math.max(0, y),
        w: widgetDef.defaultSize.w,
        h: widgetDef.defaultSize.h,
      },
    };
    setWidgets(prev => [...prev, newWidget]);
  }, []);

  const deleteWidget = useCallback((id: string) => {
    setWidgets(prev => prev.filter(widget => widget.id !== id));
  }, []);

  const updateWidget = useCallback((updatedWidget: Widget) => {
    setWidgets(prev =>
      prev.map(widget => (widget.id === updatedWidget.id ? updatedWidget : widget))
    );
    setIsPropertiesDialogOpen(false);
    setEditingWidget(null);
  }, []);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;
    const widgetDef = availableWidgets.find(w => w.id === active.id);
    if (widgetDef) {
      setActiveWidget(widgetDef);
    }
  }, []);

  const handleDragMove = useCallback((event: DragMoveEvent) => {
    const { active, delta } = event;
    setDragPosition(prev => ({
      x: prev.x + delta.x,
      y: prev.y + delta.y,
    }));
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      const widgetDef = availableWidgets.find(w => w.id === active.id);

      if (widgetDef && over?.id === 'droppable') {
        // Calculate grid position based on drag position
        const gridX = Math.round(dragPosition.x / 100); // Assuming 100px is the width of a grid cell
        const gridY = Math.round(dragPosition.y / 100); // Assuming 100px is the height of a grid cell

        addWidget(widgetDef, gridX, gridY);
      }

      setActiveWidget(null);
      setDragPosition({ x: 0, y: 0 });
    },
    [addWidget, dragPosition]
  );

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragMove={handleDragMove}
      onDragEnd={handleDragEnd}
    >
      <div className="flex h-full">
        <div className="flex-1 space-y-4">
          <Toolbar name="Dashboard Editor" description="Manage the dashboard for your application">
            <Button
              variant={previewMode ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPreviewMode(!previewMode)}
            >
              {previewMode ? (
                <>
                  <EyeOff className="h-4 w-4 mr-1" />
                  Exit Preview
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4 mr-1" />
                  Preview
                </>
              )}
            </Button>
            <Button variant="outline" size="sm">
              <Undo2 className="h-4 w-4 mr-1" />
              Discard Changes
            </Button>
            <Button size="sm">
              <Save className="h-4 w-4 mr-1" />
              Save Changes
            </Button>
          </Toolbar>

          <div className="h-[calc(100vh-200px)]">
            <DroppableArea
              widgets={widgets}
              previewMode={previewMode}
              onLayoutChange={onLayoutChange}
              setEditingWidget={setEditingWidget}
              setIsPropertiesDialogOpen={setIsPropertiesDialogOpen}
              deleteWidget={deleteWidget}
            />
          </div>
        </div>

        <Collapsible
          open={isWidgetPanelOpen}
          onOpenChange={setIsWidgetPanelOpen}
          className="w-80 border-l bg-muted/50"
        >
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="font-semibold">Widget Library</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsWidgetPanelOpen(!isWidgetPanelOpen)}
            >
              <ChevronRight
                className={`h-4 w-4 transition-transform ${isWidgetPanelOpen ? 'rotate-180' : ''}`}
              />
            </Button>
          </div>
          <CollapsibleContent>
            <ScrollArea className="h-[calc(100vh-200px)] p-4">
              <div className="space-y-4">
                {availableWidgets.map(widget => (
                  <DraggableWidget key={widget.id} widget={widget} />
                ))}
              </div>
            </ScrollArea>
          </CollapsibleContent>
        </Collapsible>

        <DragOverlay dropAnimation={dropAnimation}>
          {activeWidget ? <DragOverlayContent widget={activeWidget} /> : null}
        </DragOverlay>

        <Dialog open={isPropertiesDialogOpen} onOpenChange={setIsPropertiesDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Widget Properties</DialogTitle>
            </DialogHeader>
            {editingWidget && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={editingWidget.title}
                    onChange={e => setEditingWidget({ ...editingWidget, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content">Content</Label>
                  <Input
                    id="content"
                    value={editingWidget.content}
                    onChange={e => setEditingWidget({ ...editingWidget, content: e.target.value })}
                  />
                </div>
                <Button onClick={() => updateWidget(editingWidget)}>Save Changes</Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DndContext>
  );
}
