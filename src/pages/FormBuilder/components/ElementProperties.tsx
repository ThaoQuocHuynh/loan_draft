import { ClaimsSelect } from "@/components/Claims/ClaimsSelect";
import { CodeEditor } from "@/components/code-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useDataDictionary } from "@/contexts/DataDictionaryContext";
import { usePermission } from "@/contexts/PermissionContext";
import { useFormBuilder } from "@/pages/FormBuilder/contexts/FormBuilderContext";
import { FormElement } from "@/pages/FormBuilder/types/FormTypes";
import { useEffect, useState } from "react";

function Properties({
  elementId,
  onClose,
}: {
  elementId: string;
  onClose: () => void;
}) {
  const { currentForm: formState, updateElement } = useFormBuilder();
  const { claims } = usePermission();
  const { fields } = useDataDictionary();
  const element = formState.elements.find((e) => e.id === elementId);
  const [localElement, setLocalElement] = useState<FormElement | null>(
    element || null
  );
  const [selectedClaimIds, setSelectedClaimIds] = useState<string[]>(
    localElement?.properties?.permissions || []
  );
  const [hasChanges, setHasChanges] = useState(false);
  const [originalElement, setOriginalElement] = useState<FormElement | null>(
    element || null
  );

  useEffect(() => {
    setLocalElement(element || null);
    setOriginalElement(element || null);
    setSelectedClaimIds(element?.properties?.permissions || []);
    setHasChanges(false);
  }, [element]);

  useEffect(() => {
    if (!localElement || !originalElement) return;

    const hasElementChanged =
      JSON.stringify(localElement) !== JSON.stringify(originalElement);
    setHasChanges(hasElementChanged);
  }, [localElement, originalElement]);

  const handleChange = async (field: string, value: any) => {
    if (!localElement) return;

    const newElement = { ...localElement, [field]: value };
    setLocalElement(newElement);
    await updateElement(newElement);
  };

  const handlePropertyChange = async (field: string, value: any) => {
    if (!localElement) return;

    const newElement = {
      ...localElement,
      properties: {
        ...localElement.properties,
        [field]: value,
      },
    };
    setLocalElement(newElement);
    await updateElement(newElement);
  };

  const handleClaimsChange = (newClaimIds: string[]) => {
    setSelectedClaimIds(newClaimIds);
    handlePropertyChange("permissions", newClaimIds);
  };

  const handleUndo = async () => {
    if (!originalElement) return;
    setLocalElement(originalElement);
    setSelectedClaimIds(originalElement.properties?.permissions || []);
    await updateElement(originalElement);
  };

  if (!localElement) return null;

  return (
    <ScrollArea className="h-[calc(100vh-280px)]">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-medium">Edit Element</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            ×
          </Button>
        </div>

        <Tabs defaultValue="basic">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Basic</TabsTrigger>
            <TabsTrigger value="validation">Validation</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="label">Label</Label>
              <Input
                id="label"
                value={localElement.properties.label}
                onChange={(e) => handleChange("label", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Field Name</Label>
              <Select
                value={localElement.properties.name || ""}
                onValueChange={(value) => handlePropertyChange("name", value)}
              >
                <SelectTrigger id="name">
                  <SelectValue placeholder="Select a field..." />
                </SelectTrigger>
                <SelectContent>
                  {fields.map((field) => (
                    <SelectItem key={field.id} value={field.systemName}>
                      {field.canonicalName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Select a field from the data dictionary
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="placeholder">Placeholder</Label>
              <Input
                id="placeholder"
                value={localElement.properties.placeholder || ""}
                onChange={(e) =>
                  handlePropertyChange("placeholder", e.target.value)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="required">Required Field</Label>
              <Switch
                id="required"
                checked={localElement.properties.required}
                onCheckedChange={(checked) => handleChange("required", checked)}
              />
            </div>

            {(localElement.type === "select" ||
              localElement.type === "multiSelect" ||
              localElement.type === "radio") && (
              <div className="space-y-2">
                <Label>Options</Label>
                <div className="space-y-2">
                  {(localElement.properties.options || []).map(
                    (option: string, index: number) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={option}
                          onChange={(e) => {
                            const newOptions = [
                              ...(localElement.properties.options || []),
                            ];
                            newOptions[index] = e.target.value;
                            handlePropertyChange("options", newOptions);
                          }}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const newOptions = [
                              ...(localElement.properties.options || []),
                            ];
                            newOptions.splice(index, 1);
                            handlePropertyChange("options", newOptions);
                          }}
                        >
                          ×
                        </Button>
                      </div>
                    )
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newOptions = [
                        ...(localElement.properties.options || []),
                        "",
                      ];
                      handlePropertyChange("options", newOptions);
                    }}
                  >
                    Add Option
                  </Button>
                </div>
              </div>
            )}

            {localElement.type === "apiData" && (
              <div className="space-y-2">
                <Label htmlFor="apiEndpoint">API Endpoint</Label>
                <Input
                  id="apiEndpoint"
                  value={localElement.properties.apiEndpoint || ""}
                  onChange={(e) =>
                    handlePropertyChange("apiEndpoint", e.target.value)
                  }
                  placeholder="https://api.example.com/data"
                />
              </div>
            )}
          </TabsContent>

          <TabsContent value="validation" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="validationType">Validation Type</Label>
              <Select
                value={localElement.properties.validationType || ""}
                onValueChange={(value) =>
                  handlePropertyChange("validationType", value)
                }
              >
                <SelectTrigger id="validationType">
                  <SelectValue placeholder="Select validation type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="number">Number</SelectItem>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="phone">Phone</SelectItem>
                  <SelectItem value="api">API</SelectItem>
                  <SelectItem value="javascript">JavaScript</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {localElement.properties.validationType === "custom" && (
              <div className="space-y-2">
                <Label htmlFor="validationPattern">
                  Validation Pattern (RegEx)
                </Label>
                <Input
                  id="validationPattern"
                  value={localElement.properties.validationPattern || ""}
                  onChange={(e) =>
                    handlePropertyChange("validationPattern", e.target.value)
                  }
                  placeholder="^[a-zA-Z0-9]+$"
                />
              </div>
            )}

            {localElement.properties.validationType === "javascript" && (
              <div className="space-y-2">
                <Label htmlFor="validationCode">Validation Code</Label>
                <div className="border rounded-md">
                  <CodeEditor
                    value={localElement.properties.validationCode || ""}
                    onChange={(value) =>
                      handlePropertyChange("validationCode", value)
                    }
                    language="javascript"
                    height="200px"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Write a function that returns true if valid, false if invalid.
                  The function receives the field value as a parameter. Example:{" "}
                  <code>(value) =&gt; value.length &gt; 3</code>
                </p>
              </div>
            )}

            {localElement.properties.validationType &&
              localElement.properties.validationType !== "none" && (
                <div className="space-y-2">
                  <Label htmlFor="validationMessage">
                    Validation Error Message
                  </Label>
                  <Input
                    id="validationMessage"
                    value={localElement.properties.validationMessage || ""}
                    onChange={(e) =>
                      handlePropertyChange("validationMessage", e.target.value)
                    }
                    placeholder="Please enter a valid value"
                  />
                </div>
              )}

            {localElement.properties.validationType === "api" && (
              <div className="space-y-2">
                <Label htmlFor="serverValidation">
                  Server Validation Endpoint
                </Label>
                <Input
                  id="serverValidation"
                  value={localElement.properties.serverValidation || ""}
                  onChange={(e) =>
                    handlePropertyChange("serverValidation", e.target.value)
                  }
                  placeholder="/api/validate/field"
                />
                <p className="text-xs text-muted-foreground">
                  API endpoint for server-side validation
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="description">Help Text</Label>
              <Textarea
                id="description"
                value={localElement.properties.help || ""}
                onChange={(e) =>
                  handlePropertyChange("description", e.target.value)
                }
                placeholder="Additional information about this field"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="defaultValue">Default Value</Label>
              <Input
                id="defaultValue"
                value={localElement.properties.defaultValue || ""}
                onChange={(e) =>
                  handlePropertyChange("defaultValue", e.target.value)
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="permissions">Access Permissions</Label>
              <ClaimsSelect
                claims={claims}
                selectedClaimIds={selectedClaimIds}
                onSelectionChange={handleClaimsChange}
                placeholder="Select required permissions..."
              />
              <p className="text-xs text-muted-foreground">
                Select the claims required to access this field
              </p>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 pt-4">
          {hasChanges && (
            <Button variant="outline" onClick={handleUndo}>
              Undo Changes
            </Button>
          )}
        </div>
      </div>
    </ScrollArea>
  );
}

export default Properties;
