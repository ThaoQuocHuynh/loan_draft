import React from 'react';
import { useFormBuilder } from '../contexts/FormBuilderContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function VersionControl() {
  const { currentForm: formState, formVersions, publishForm } = useFormBuilder();

  const handlePublish = async () => {
    await publishForm('New version published');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Version Control</h3>
        <Button onClick={handlePublish}>
          Publish New Version
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Current Version</CardTitle>
          <CardDescription>
            {formState.version?.versionNumber
              ? `Version ${formState.version.versionNumber} - Last published on ${new Date(formState.version.timestamp).toLocaleString()}`
              : "Not published yet"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="font-medium">Form Name:</span>
              <span>{formState.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Elements:</span>
              <span>{formState.elements.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Last Modified:</span>
              <span>{formState.lastModified ? new Date(formState.lastModified).toLocaleString() : "Never"}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h4 className="font-medium">Version History</h4>
        {formVersions.length === 0 ? (
          <div className="text-center p-8 border rounded-md">
            <p className="text-muted-foreground">No versions published yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {formVersions.map((version) => (
              <Card key={version.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Version {version.versionNumber}</CardTitle>
                  <CardDescription>{new Date(version.timestamp).toLocaleString()}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{version.notes || "No version notes provided"}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 