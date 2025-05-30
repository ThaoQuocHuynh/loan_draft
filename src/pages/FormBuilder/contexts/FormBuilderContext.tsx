"use client";

import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import type {
  FormElement,
  FormMetadata,
  FormVersion,
  FormDataProviderInterface,
} from "../types/FormTypes";
import { MockFormDataProvider } from "../providers/MockFormDataProvider";

type FormBuilderContextType = {
  currentForm: FormMetadata;
  formVersions: FormVersion[];
  isFormModified: boolean;
  isLoading: boolean;
  error: string | null;

  // Form operations
  loadForm: (id: string) => Promise<void>;
  saveForm: () => Promise<void>;
  createNewForm: (
    form: Omit<FormMetadata, "id" | "lastModified">
  ) => Promise<void>;

  // Element operations
  // Questionable if these are needed, but they are here for now
  // it makes sense for these to be part of the designer, maybe as hook rather than part of the data provider
  addElement: (element: Omit<FormElement, "id">) => Promise<void>;
  updateElement: (element: FormElement) => Promise<void>;
  removeElement: (elementId: string) => Promise<void>;

  // Form settings
  updateFormSettings: (settings: Partial<FormMetadata>) => Promise<void>;

  // Version operations
  publishForm: (notes?: string) => Promise<void>;
  restoreVersion: (versionId: string) => Promise<void>;
  loadVersions: () => Promise<void>;
};

const FormBuilderContext = createContext<FormBuilderContextType | undefined>(
  undefined
);

interface FormBuilderProviderProps {
  children: React.ReactNode;
  dataProvider?: FormDataProviderInterface;
  initialFormId?: string;
}

export function FormBuilderProvider({
  children,
  dataProvider = new MockFormDataProvider(),
  initialFormId = "form-1",
}: FormBuilderProviderProps) {
  const [formState, setFormState] = useState<FormMetadata>({
    id: "",
    name: "",
    description: "",
    elements: [],
    lastModified: new Date().toISOString(),
    //submitButtonText: 'Submit',
    //successMessage: 'Form submitted successfully!',
    //enableProgressBar: false,
    //layout: 'standard',
    //theme: 'default',
    accessControl: "public",
    enableVersioning: true,
    enableChangeLogging: true,
    enableDataMapping: true,
  });

  const [formVersions, setFormVersions] = useState<FormVersion[]>([]);
  const [lastSavedState, setLastSavedState] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isFormModified = JSON.stringify(formState) !== lastSavedState;

  // Initialize with sample data
  useEffect(() => {
    const initializeData = async () => {
      try {
        setIsLoading(true);
        if (dataProvider instanceof MockFormDataProvider) {
          await dataProvider.initializeWithSampleData();
        }
        await loadForm(initialFormId);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to initialize data"
        );
      } finally {
        setIsLoading(false);
      }
    };

    initializeData();
  }, [initialFormId]);

  const loadForm = async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const form = await dataProvider.getForm(id);
      if (form) {
        setFormState(form);
        setLastSavedState(JSON.stringify(form));
        await loadVersions();
      } else {
        throw new Error(`Form with id ${id} not found`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load form");
    } finally {
      setIsLoading(false);
    }
  };

  const saveForm = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const updatedForm = await dataProvider.updateForm(
        formState.id,
        formState
      );
      setFormState(updatedForm);
      setLastSavedState(JSON.stringify(updatedForm));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save form");
    } finally {
      setIsLoading(false);
    }
  };

  const createNewForm = async (
    form: Omit<FormMetadata, "id" | "lastModified">
  ) => {
    try {
      setIsLoading(true);
      setError(null);
      const newForm = await dataProvider.createForm(form);
      setFormState(newForm);
      setLastSavedState(JSON.stringify(newForm));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create form");
    } finally {
      setIsLoading(false);
    }
  };

  const addElement = async (element: Omit<FormElement, "id">) => {
    try {
      setError(null);
      await dataProvider.addElement(formState.id, element);
      // Refresh the form state from the provider to get updated elements
      const updatedForm = await dataProvider.getForm(formState.id);
      if (updatedForm) {
        setFormState(updatedForm);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add element");
    }
  };

  const updateElement = async (element: FormElement) => {
    try {
      setError(null);
      const updatedElement = await dataProvider.updateElement(
        formState.id,
        element.id,
        element
      );
      setFormState((prev) => ({
        ...prev,
        elements: prev.elements.map((el) =>
          el.id === element.id ? updatedElement : el
        ),
        lastModified: new Date().toISOString(),
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update element");
    }
  };

  const removeElement = async (elementId: string) => {
    try {
      setError(null);
      const success = await dataProvider.removeElement(formState.id, elementId);
      if (success) {
        setFormState((prev) => ({
          ...prev,
          elements: prev.elements.filter((el) => el.id !== elementId),
          lastModified: new Date().toISOString(),
        }));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to remove element");
    }
  };

  const updateFormSettings = async (settings: Partial<FormMetadata>) => {
    try {
      setError(null);
      const updatedForm = await dataProvider.updateForm(formState.id, settings);
      setFormState(updatedForm);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update form settings"
      );
    }
  };

  const publishForm = async (notes?: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const newVersion = await dataProvider.publishVersion(formState.id, notes);
      setFormVersions((prev) => [newVersion, ...prev]);

      // Update the current form with version info
      setFormState((prev) => ({
        ...prev,
        version: {
          id: newVersion.id,
          versionNumber: newVersion.versionNumber,
          timestamp: newVersion.timestamp,
        },
      }));

      setLastSavedState(
        JSON.stringify({
          ...formState,
          version: {
            id: newVersion.id,
            versionNumber: newVersion.versionNumber,
            timestamp: newVersion.timestamp,
          },
        })
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to publish form");
    } finally {
      setIsLoading(false);
    }
  };

  const restoreVersion = async (versionId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const restoredForm = await dataProvider.restoreVersion(
        formState.id,
        versionId
      );
      setFormState(restoredForm);
      setLastSavedState(JSON.stringify(restoredForm));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to restore version"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const loadVersions = async () => {
    try {
      setError(null);
      const versions = await dataProvider.getVersions(formState.id);
      setFormVersions(versions);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load versions");
    }
  };

  return (
    <FormBuilderContext.Provider
      value={{
        currentForm: formState,
        formVersions,
        isFormModified,
        isLoading,
        error,
        loadForm,
        saveForm,
        createNewForm,
        addElement,
        updateElement,
        removeElement,
        updateFormSettings,
        publishForm,
        restoreVersion,
        loadVersions,
      }}
    >
      {children}
    </FormBuilderContext.Provider>
  );
}

export function useFormBuilder() {
  const context = useContext(FormBuilderContext);
  if (context === undefined) {
    throw new Error("useFormBuilder must be used within a FormBuilderProvider");
  }
  return context;
}
