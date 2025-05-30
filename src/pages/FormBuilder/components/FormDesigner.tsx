import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useState } from "react";
import Properties from "./ElementProperties";
import Toolbox from "./ElementToolbox";
import { generateId } from "@/utils/id";
import { FormElement, FormElementType } from "../types/FormTypes";
import { useFormBuilder } from "../contexts/FormBuilderContext";
import { ELEMENT_TYPES } from "../data/ElementTypes";
import Canvas from "./FormCanvas";

export default function Designer() {
  const {
    currentForm: formState,
    addElement,
    updateElement,
  } = useFormBuilder();
  const [activeElement, setActiveElement] = useState<FormElement | null>(null);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 10,
    },
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 300,
      tolerance: 5,
    },
  });
  const sensors = useSensors(mouseSensor, touchSensor);

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;

    // Check if this is a canvas element being dragged
    if (active.data.current?.type === "canvas-element") {
      const element = active.data.current.element;
      setActiveElement(element);
      return;
    }

    // Otherwise, it's a new element from the toolbox
    const elementType = active.id as FormElementType;
    const elementTypeConfig = ELEMENT_TYPES.find((e) => e.type === elementType);
    if (elementTypeConfig) {
      // Creating a new element
      const uniqueId = generateId("element");
      setActiveElement({
        id: uniqueId,
        type: elementType,
        properties: {
          label: elementTypeConfig.label,
          required: false,
          placeholder: `Enter ${elementTypeConfig.label.toLowerCase()}...`,
        },
      } as FormElement);
    } else {
      // Moving an existing element
      const existingElement = formState.elements.find(
        (e) => e.id === active.id
      );
      if (existingElement) {
        setActiveElement(existingElement);
      }
    }
  }

  async function handleDragEnd(event: DragEndEvent) {
    console.log("handleDragEnd", event, activeElement);
    const { active, over } = event;

    if (!over || !activeElement) return;

    if (over.id === "form-canvas") {
      // Check if this is a canvas element being moved
      if (active.data.current?.type === "canvas-element") {
        console.log("Moving canvas element");

        // Handle moving existing canvas element
        const draggedElement = active.data.current.element;
        if (draggedElement && draggedElement.position) {
          // Calculate new position using the drag delta
          const delta = event.delta;
          const newX = draggedElement.position.x + delta.x;
          const newY = draggedElement.position.y + delta.y;

          // Update element position
          const updatedElement = {
            ...draggedElement,
            position: {
              x: Math.max(0, newX),
              y: Math.max(0, newY),
            },
          };

          console.log("Moving canvas element:", {
            draggedElement,
            updatedElement,
          });
          await updateElement(updatedElement);
        }
      } else {
        // Handle adding new element from toolbox
        const elementTypeConfig = ELEMENT_TYPES.find(
          (e) => e.type === active.id
        );
        if (elementTypeConfig) {
          // Get the drop position relative to the canvas
          const canvasElement = document.getElementById("form-canvas");
          const canvasRect = canvasElement?.getBoundingClientRect();

          // Calculate position relative to canvas using the final position
          const activeRect = event.active.rect.current.translated;
          const dropX = activeRect
            ? activeRect.left - (canvasRect?.left || 0)
            : 0;
          const dropY = activeRect
            ? activeRect.top - (canvasRect?.top || 0)
            : 0;

          // Add new element
          const newElement = {
            id: activeElement.id, // Use the unique ID generated in handleDragStart
            type: activeElement.type,
            properties: {
              ...activeElement.properties,
              size: {
                width: "200px",
                height: "50px",
              },
              position: {
                x: Math.max(0, dropX), // Subtract padding (16px) + border (2px)
                y: Math.max(0, dropY), // Subtract padding (16px) + border (2px)
              },
            },

          };
          await addElement(newElement);
        }
      }
    }

    setActiveElement(null);
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex h-[calc(100vh-220px)]">
        <Toolbox />
        <div className="flex-1 flex">
          <div className="flex-1 p-4 overflow-auto">
            <Canvas
              elements={formState.elements}
              selectedElement={selectedElement}
              onSelectElement={setSelectedElement}
            />

            <DragOverlay dropAnimation={null}>
              {activeElement && (
                <div
                  className="drag-overlay border rounded-md p-3 bg-white shadow-md opacity-80 w-64"
                  style={{ zIndex: 999, pointerEvents: "none" }}
                >
                  <div className="flex items-center gap-2">
                    {
                      ELEMENT_TYPES.find((e) => e.type === activeElement.type)
                        ?.icon
                    }
                    <span>{activeElement.properties?.label}</span>
                  </div>
                </div>
              )}
            </DragOverlay>
          </div>

          {selectedElement && (
            <div className="w-80 border-l p-4">
              <Properties
                elementId={selectedElement}
                onClose={() => setSelectedElement(null)}
              />
            </div>
          )}
        </div>
      </div>
    </DndContext>
  );
}
