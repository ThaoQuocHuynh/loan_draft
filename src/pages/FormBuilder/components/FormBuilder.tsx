"use client";

import { useState } from "react";
import { FormPreview } from "./FormPreview";
import { VersionControl } from "./VersionControl";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Undo2, Save, AlertCircle } from "lucide-react";
import { Toolbar } from "@/components/toolbar/Toolbar";
import { useFormBuilder } from "../contexts/FormBuilderContext";
import SettingsTab from "./SettingsTab";
import AdvancedTab from "./AdvancedTab";
import { DebugTab } from "./DebugTab";
import Designer from "./FormDesigner";

export function FormBuilder() {
  const [activeTab, setActiveTab] = useState("design");
  const [previewMode, setPreviewMode] = useState(false);
  const {
    currentForm: formState,
    updateFormSettings,
    saveForm,
    isFormModified,
    isLoading,
    error,
  } = useFormBuilder();

  const [localSettings, setLocalSettings] = useState({
    name: formState.name || "",
    description: formState.description || "",
    redirectUrl: formState.redirectUrl || "",
    allowSaveAsDraft: formState.allowSaveAsDraft || false,
    accessControl: formState.accessControl || "public",
    enableVersioning: formState.enableVersioning !== false,
    enableChangeLogging: formState.enableChangeLogging !== false,
    enableDataMapping: formState.enableDataMapping !== false,
  });

  const handleChange = (field: string, value: any) => {
    setLocalSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveSettings = async () => {
    await updateFormSettings(localSettings);
  };

  const handleSaveForm = async () => {
    await saveForm();
  };

  const handleDiscardChanges = () => {
    // Reset local settings to form state
    setLocalSettings({
      name: formState.name || "",
      description: formState.description || "",
      redirectUrl: formState.redirectUrl || "",
      allowSaveAsDraft: formState.allowSaveAsDraft || false,
      accessControl: formState.accessControl || "public",
      enableVersioning: formState.enableVersioning !== false,
      enableChangeLogging: formState.enableChangeLogging !== false,
      enableDataMapping: formState.enableDataMapping !== false,
    });
  };

  return (
    <>
      <Toolbar
        name="Form Editor"
        description={`${formState.name || "Untitled Form"}${
          isFormModified ? " • Modified" : ""
        }`}
      >
        <Button
          variant={previewMode ? "default" : "outline"}
          size="sm"
          onClick={() => setPreviewMode(!previewMode)}
          disabled={isLoading}
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
        <Button
          variant="outline"
          size="sm"
          disabled={!isFormModified || isLoading}
          onClick={handleDiscardChanges}
        >
          <Undo2 className="h-4 w-4 mr-1" />
          Discard Changes
        </Button>
        <Button
          size="sm"
          disabled={!isFormModified || isLoading}
          onClick={handleSaveForm}
        >
          <Save className="h-4 w-4 mr-1" />
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </Toolbar>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <div className="flex items-center">
            <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
            <span className="text-red-700">{error}</span>
          </div>
        </div>
      )}

      <div className="border rounded-lg shadow-sm mt-4">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full h-full"
        >
          <div className="border-b p-2">
            <TabsList className="grid grid-cols-5 w-full max-w-md">
              <TabsTrigger value="design">Design</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
              <TabsTrigger value="versions">Versions</TabsTrigger>
              <TabsTrigger value="debug">Debug</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="design" className="p-4">
            {previewMode ? <FormPreview /> : <Designer />}
          </TabsContent>

          <TabsContent value="settings" className="p-4">
            <SettingsTab
              localSettings={localSettings}
              handleChange={handleChange}
            />
          </TabsContent>

          <TabsContent value="advanced" className="p-4">
            <AdvancedTab
              localSettings={localSettings}
              handleChange={handleChange}
            />
          </TabsContent>

          <TabsContent value="versions" className="p-4">
            <VersionControl />
          </TabsContent>

          <TabsContent value="debug" className="p-4">
            <DebugTab />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
