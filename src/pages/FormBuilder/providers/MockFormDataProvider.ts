import type {
  FormDataProviderInterface,
  FormMetadata,
  FormElement,
  FormVersion,
} from "../types/FormTypes";
import {
  mockFormState,
  mockFormVersions,
  mockFormElements,
} from "../data/MockData";
import { generateId } from "@/utils/id";

export class MockFormDataProvider implements FormDataProviderInterface {
  private forms: FormMetadata[] = [mockFormState];
  private versions: FormVersion[] = mockFormVersions;

  async getForms(): Promise<FormMetadata[]> {
    return Promise.resolve([...this.forms]);
  }

  async getForm(id: string): Promise<FormMetadata | null> {
    const form = this.forms.find((f) => f.id === id);
    return Promise.resolve(form ? { ...form } : null);
  }

  async createForm(
    form: Omit<FormMetadata, "id" | "lastModified">
  ): Promise<FormMetadata> {
    const newForm: FormMetadata = {
      ...form,
      id: `form-${Date.now()}`,
      lastModified: new Date().toISOString(),
    };
    this.forms.push(newForm);
    return Promise.resolve({ ...newForm });
  }

  async updateForm(
    id: string,
    updates: Partial<FormMetadata>
  ): Promise<FormMetadata> {
    const formIndex = this.forms.findIndex((f) => f.id === id);
    if (formIndex === -1) {
      throw new Error(`Form with id ${id} not found`);
    }

    this.forms[formIndex] = {
      ...this.forms[formIndex],
      ...updates,
      lastModified: new Date().toISOString(),
    };

    return Promise.resolve({ ...this.forms[formIndex] });
  }

  async deleteForm(id: string): Promise<boolean> {
    const formIndex = this.forms.findIndex((f) => f.id === id);
    if (formIndex === -1) {
      return Promise.resolve(false);
    }

    this.forms.splice(formIndex, 1);
    return Promise.resolve(true);
  }

  async addElement(
    formId: string,
    element: Omit<FormElement, "id">
  ): Promise<FormElement> {
    const form = this.forms.find((f) => f.id === formId);
    if (!form) {
      throw new Error(`Form with id ${formId} not found`);
    }
    const id = generateId("element");

    const newElement = {
      ...element,
      id,
    } as FormElement;

    form.elements.push(newElement);
    form.lastModified = new Date().toISOString();

    return Promise.resolve({ ...newElement });
  }

  async updateElement(
    formId: string,
    elementId: string,
    updates: Partial<FormElement>
  ): Promise<FormElement> {
    const form = this.forms.find((f) => f.id === formId);
    if (!form) {
      throw new Error(`Form with id ${formId} not found`);
    }

    const elementIndex = form.elements.findIndex((e) => e.id === elementId);
    if (elementIndex === -1) {
      throw new Error(`Element with id ${elementId} not found`);
    }

    form.elements[elementIndex] = {
      ...form.elements[elementIndex],
      ...updates,
    } as FormElement;
    form.lastModified = new Date().toISOString();

    return Promise.resolve({ ...form.elements[elementIndex] });
  }

  async removeElement(formId: string, elementId: string): Promise<boolean> {
    const form = this.forms.find((f) => f.id === formId);
    if (!form) {
      return Promise.resolve(false);
    }

    const elementIndex = form.elements.findIndex((e) => e.id === elementId);
    if (elementIndex === -1) {
      return Promise.resolve(false);
    }

    form.elements.splice(elementIndex, 1);
    form.lastModified = new Date().toISOString();

    return Promise.resolve(true);
  }

  async getVersions(formId: string): Promise<FormVersion[]> {
    const formVersions = this.versions.filter((v) => v.formId === formId);
    return Promise.resolve([...formVersions]);
  }

  async publishVersion(formId: string, notes?: string): Promise<FormVersion> {
    const form = this.forms.find((f) => f.id === formId);
    if (!form) {
      throw new Error(`Form with id ${formId} not found`);
    }

    const existingVersions = this.versions.filter((v) => v.formId === formId);
    const newVersionNumber = existingVersions.length + 1;

    const newVersion: FormVersion = {
      id: `version-${Date.now()}`,
      formId,
      versionNumber: newVersionNumber,
      timestamp: new Date().toISOString(),
      notes: notes || "",
      publishedBy: "Current User",
      formData: JSON.parse(JSON.stringify(form)),
      changes: [{ type: "Publish", description: "Form published" }],
    };

    this.versions.push(newVersion);

    // Update the form with version info
    form.version = {
      id: newVersion.id,
      versionNumber: newVersion.versionNumber,
      timestamp: newVersion.timestamp,
    };

    return Promise.resolve({ ...newVersion });
  }

  async restoreVersion(
    formId: string,
    versionId: string
  ): Promise<FormMetadata> {
    const version = this.versions.find(
      (v) => v.id === versionId && v.formId === formId
    );
    if (!version) {
      throw new Error(`Version with id ${versionId} not found`);
    }

    const formIndex = this.forms.findIndex((f) => f.id === formId);
    if (formIndex === -1) {
      throw new Error(`Form with id ${formId} not found`);
    }

    // Restore the form state from the version
    this.forms[formIndex] = {
      ...version.formData,
      lastModified: new Date().toISOString(),
    };

    return Promise.resolve({ ...this.forms[formIndex] });
  }

  // Helper method to initialize with sample data
  async initializeWithSampleData(): Promise<void> {
    if (this.forms[0] && this.forms[0].elements.length === 0) {
      this.forms[0].elements = [...mockFormElements];
      this.forms[0].lastModified = new Date().toISOString();
    }
  }
}
