export type FormElementType =
  | 'text' // Text input field **DEFINED
  | 'textarea' // Multi-line text area
  | 'number' // Number input **DEFINED
  | 'date' // Date picker
  | 'time' // Time picker
  | 'password' // Password input
  | 'label' // Static label/text **DEFINED
  | 'divider' // Visual divider **DEFINED
  | 'button' // Button element
  | 'image' // Image display
  | 'tableInput' // Table input widget **DEFINED
  | 'select' // Single select dropdown **DEFINED
  | 'multiSelect' // Multi-select dropdown **DEFINED
  | 'fileUpload' // File upload widget
  | 'checkbox' // Checkbox input
  | 'radio' // Radio button group **DEFINED
  | 'group' // Element grouping container **DEFINED
  | 'panel' // Panel container **DEFINED
  | 'repeatable' // Repeatable section **DEFINED
  | 'conditional' // Conditional logic element
  | 'layoutGrid' // Grid layout container
  | 'progressBar' // Progress indicator
  | 'memo' // Memo/notes field
  | 'documentViewer' // Document viewer
  | 'apiData'; // API data source **DEFINED

type FormElementValidationType =
  | 'none'
  | 'email'
  | 'number'
  | 'date'
  | 'phone'
  | 'api'
  | 'javascript'
  | 'custom';

interface BaseProperties {
  name?: string;
  label?: string;
  help?: string;
  required?: boolean;
  placeholder?: string;
  validationType?: FormElementValidationType;
  validationMessage?: string;
  validationPattern?: string;
  validationCode?: string;
  serverValidation?: string;
  size?: {
    width: string;
    height: string;
  };
  position?: {
    x: number;
    y: number;
  };
  permissions?: string[];
  [key: string]: any;
}

interface OtherElement {
  id: string;
  type: Exclude<
    FormElementType,
    | 'text'
    | 'select'
    | 'repeatable'
    | 'apiData'
    | 'divider'
    | 'label'
    | 'radio'
    | 'multiSelect'
    | 'group'
    | 'panel'
    | 'tableInput'
    | 'number'
  >;
  properties: BaseProperties;
}

interface NumberElement {
  id: string;
  type: 'number';
  properties: BaseProperties & {
    readonly?: boolean;
  };
}

interface TableInputElement {
  id: string;
  type: 'tableInput';
  properties: BaseProperties & {
    /**
     * Customize the "Add more row" button
     */
    addButton?: {
      icon?: any;
      grid?: { top: any; left: any; bottom: any; right: any };
      width?: any;
      label?: string;
      render?: () => React.ReactNode;
    };
    /**
     * Customize the "Delete single item" button
     */
    deleteItemButton?: {
      icon?: any;
      grid?: { top: any; left: any; bottom: any; right: any };
      width?: any;
      label?: string;
      render?: () => React.ReactNode;
    };
    min?: number;
    max?: number;
  };
  elements: FormElement[];
}

interface PanelElement {
  id: string;
  type: 'panel';
  properties: BaseProperties & {
    collapsible?: boolean;
  };
  elements: FormElement[];
}

interface GroupElement {
  id: string;
  type: 'group';
  properties: BaseProperties;
  elements: FormElement[];
}

interface MultiSelectElement {
  id: string;
  type: 'multiSelect';
  properties: BaseProperties & {
    options: string[];
    defaultValue?: string[]; // Maybe default is an array?
  };
}

interface RadioElement {
  id: string;
  type: 'radio';
  properties: BaseProperties & {
    options: string[];
    defaultValue?: string;
  };
}
interface LabelElement {
  id: string;
  type: 'label';
  properties: BaseProperties & {
    text: string;
  };
}

interface DividerElement {
  id: string;
  type: 'divider';
  properties?: any;
}

interface ApiDataElement {
  id: string;
  type: 'apiData';
  properties: BaseProperties & {
    apiEndpoint: string;
  };
}

interface RepeatableElement {
  id: string;
  type: 'repeatable';
  properties: BaseProperties & {
    addButton?: {
      icon?: any;
      grid?: { top: any; left: any; bottom: any; right: any };
      width?: any;
      label?: string;
      render?: () => React.ReactNode;
    };
    min?: number;
    max?: number;
  };
  elements: FormElement[];
}

interface SelectElement {
  id: string;
  type: 'select';
  properties: BaseProperties & {
    options: string[];
    defaultValue?: string;
  };
}

interface TextElement {
  id: string;
  type: 'text';
  properties: BaseProperties & {
    defaultValue?: string;
    readonly?: boolean;
  };
}

export type FormElement =
  | TextElement
  | SelectElement
  | RepeatableElement
  | ApiDataElement
  | DividerElement
  | LabelElement
  | MultiSelectElement
  | RadioElement
  | GroupElement
  | PanelElement
  | TableInputElement
  | NumberElement
  | OtherElement; //Will add more Element Type when properties are clearer

export interface FormMetadata {
  id: string;
  name: string;
  description?: string;
  elements: FormElement[];
  lastModified?: string;
  version?: {
    id: string;
    versionNumber: number;
    timestamp: string;
  };
  redirectUrl?: string;
  allowSaveAsDraft?: boolean;
  layout?: string;
  theme?: string;
  accessControl?: string;
  enableVersioning?: boolean;
  enableChangeLogging?: boolean;
  enableDataMapping?: boolean;
}

export interface FormVersion {
  id: string;
  formId: string;
  versionNumber: number;
  timestamp: string;
  notes: string;
  publishedBy: string;
  formData: FormMetadata;
  changes?: Array<{
    type: string;
    description: string;
  }>;
}

export interface FormDataProviderInterface {
  // Form CRUD operations
  getForms(): Promise<FormMetadata[]>;
  getForm(id: string): Promise<FormMetadata | null>;
  createForm(form: Omit<FormMetadata, 'id' | 'lastModified'>): Promise<FormMetadata>;
  updateForm(id: string, form: Partial<FormMetadata>): Promise<FormMetadata>;
  deleteForm(id: string): Promise<boolean>;

  // Element operations
  // I am not sure if this is needed, but it is here for now
  // it makes sense for these to be part of the designer, maybe as hook rather than part of the data provider
  addElement(formId: string, element: Omit<FormElement, 'id'>): Promise<FormElement>;
  updateElement(
    formId: string,
    elementId: string,
    element: Partial<FormElement>
  ): Promise<FormElement>;
  removeElement(formId: string, elementId: string): Promise<boolean>;

  // Version operations
  getVersions(formId: string): Promise<FormVersion[]>;
  publishVersion(formId: string, notes?: string): Promise<FormVersion>;
  restoreVersion(formId: string, versionId: string): Promise<FormMetadata>;
}

export interface ElementToolboxItem {
  type: FormElementType;
  label: string;
  icon: React.ReactNode;
  category: 'input' | 'layout' | 'display' | 'advanced';
}
