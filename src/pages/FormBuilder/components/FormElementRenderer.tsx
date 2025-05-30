import { FormElement } from "@/pages/FormBuilder/types/FormTypes";
import {
  TextareaElement,
  SelectElement,
  CheckboxElement,
  BaseFormElement,
  BaseFormElementProps,
  TextInputElement,
} from "./form-elements";

interface ElementRendererProps {
  element: FormElement;
  isSelected: boolean;
  onSelect: () => void;
  onRemove: () => void;
}

function ElementRenderer({
  element,
  isSelected,
  onSelect,
  onRemove,
}: ElementRendererProps) {
  const baseProps: BaseFormElementProps = {
    element,
    isSelected,
    onSelect,
    onRemove,
  };

  switch (element.type) {
    case "text":
    case "number":
    case "date":
    case "time":
    case "password":
      return <TextInputElement {...baseProps} />;

    case "textarea":
    case "memo":
      return <TextareaElement {...baseProps} />;

    case "select":
    case "multiSelect":
      return <SelectElement {...baseProps} />;

    case "checkbox":
      return <CheckboxElement {...baseProps} />;

    case "radio":
      return (
        <BaseFormElement {...baseProps}>
          <div className="space-y-2">
            {(element.properties.options || ["Option 1", "Option 2"]).map(
              (option: string, index: number) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    disabled
                    className="pointer-events-none"
                  />
                  <span className="text-sm">{option}</span>
                </div>
              )
            )}
          </div>
        </BaseFormElement>
      );

    case "fileUpload":
      return (
        <BaseFormElement {...baseProps}>
          <div className="border-2 border-dashed rounded-md p-4 text-center text-muted-foreground">
            <div className="text-sm">File Upload Area</div>
            <div className="text-xs">Click or drag files here</div>
          </div>
        </BaseFormElement>
      );

    case "label":
      return (
        <BaseFormElement {...baseProps}>
          <div className="text-lg font-medium">
            {element.properties.text || element.properties.label}
          </div>
        </BaseFormElement>
      );

    case "divider":
      return (
        <BaseFormElement {...baseProps}>
          <hr className="border-t border-gray-300" />
        </BaseFormElement>
      );

    case "button":
      return (
        <BaseFormElement {...baseProps}>
          <button
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md pointer-events-none"
            disabled
          >
            {element.properties.buttonText || element.properties.label}
          </button>
        </BaseFormElement>
      );

    case "image":
      return (
        <BaseFormElement {...baseProps}>
          <div className="border rounded-md p-4 text-center text-muted-foreground bg-gray-50">
            <div className="text-sm">Image Placeholder</div>
            <div className="text-xs">
              {element.properties.imageUrl || "No image selected"}
            </div>
          </div>
        </BaseFormElement>
      );

    default:
      return (
        <BaseFormElement {...baseProps}>
          <div className="text-muted-foreground text-sm">
            Unsupported element type: {element.type}
          </div>
        </BaseFormElement>
      );
  }
}

export default ElementRenderer;
