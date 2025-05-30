import React from "react";
import { useDroppable } from "@dnd-kit/core";
//todo: need to change the location of the FormBuilderContext file
import { useFormBuilder } from "@/pages/FormBuilder/contexts/FormBuilderContext";
import { FormElement } from "@/pages/FormBuilder/types/FormTypes";
import { Grid2X2 } from "lucide-react";
import ElementRenderer from "./FormElementRenderer";

interface FormCanvasProps {
  elements: FormElement[];
  selectedElement: string | null;
  onSelectElement: (elementId: string) => void;
}

export default function Canvas({
  elements,
  selectedElement,
  onSelectElement,
}: FormCanvasProps) {
  const { removeElement } = useFormBuilder();
  const { setNodeRef } = useDroppable({
    id: "form-canvas",
  });

  const handleRemoveElement = async (elementId: string) => {
    await removeElement(elementId);
  };

  return (
    <div
      ref={setNodeRef}
      id="form-canvas"
      className="min-h-full border-2 border-dashed border-gray-200 rounded-lg p-4 relative"
    >
      {elements.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-8">
          <Grid2X2 className="h-12 w-12 mb-4 opacity-20" />
          <h3 className="text-lg font-medium">Your form is empty</h3>
          <p className="max-w-md">
            Drag and drop elements from the sidebar to start building your form.
          </p>
        </div>
      ) : (
        <>
          {elements.map((element) => (
            <ElementRenderer
              key={element.id}
              element={element}
              isSelected={selectedElement === element.id}
              onSelect={() => onSelectElement(element.id)}
              onRemove={() => handleRemoveElement(element.id)}
            />
          ))}
        </>
      )}
    </div>
  );
}
