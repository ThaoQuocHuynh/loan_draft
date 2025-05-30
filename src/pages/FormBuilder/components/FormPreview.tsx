import React from "react";
import { useFormBuilder } from "../contexts/FormBuilderContext";

export function FormPreview() {
  const { currentForm: formState } = useFormBuilder();

  return (
    <div className="p-4">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">
          {formState.name || "Form Preview"}
        </h2>
        {formState.description && (
          <p className="text-muted-foreground mb-6">{formState.description}</p>
        )}

        <div className="space-y-4">
          {formState.elements.map((element) => (
            <div key={element.id} className="border rounded-md p-4">
              {element.type === "divider" ? (
                <hr className="border-t border-gray-300" />
              ) : element.type === "label" ? (
                <div className="text-lg font-medium">
                  {element.properties.text || element.properties.label}
                </div>
              ) : (
                <div className="font-medium mb-2">
                  {element.properties?.label}
                  {element.properties?.required && (
                    <span className="text-red-500 ml-1">*</span>
                  )}
                </div>
              )}

              <div className="text-sm text-muted-foreground">
                Type: {element.type}
              </div>
            </div>
          ))}
        </div>

        {formState.elements.length === 0 && (
          <div className="text-center text-muted-foreground py-8">
            No elements to preview. Add some elements in the design tab.
          </div>
        )}
      </div>
    </div>
  );
}
