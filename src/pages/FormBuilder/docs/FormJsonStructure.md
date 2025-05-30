# Form Builder JSON Structure

The Form Builder produces a JSON object that contains all the necessary metadata to construct and render a form. This document outlines the structure of that JSON object.

## FormMetadata Interface

```typescript
interface FormMetadata {
  id: string                    // Unique identifier for the form
  name: string                  // Display name of the form
  description?: string          // Optional description
  elements: FormElement[]       // Array of form elements
  lastModified?: string         // ISO timestamp of last modification
  version?: {                   // Version information (if published)
    id: string
    versionNumber: number
    timestamp: string
  }
  redirectUrl?: string          // URL to redirect after submission
  allowSaveAsDraft?: boolean    // Allow users to save as draft
  //layout?: string              // Layout type (default: "standard")
  //theme?: string               // Theme name (default: "default")
  accessControl?: string       // Access control level
  enableVersioning?: boolean   // Enable version control
  enableChangeLogging?: boolean // Log all changes
  enableDataMapping?: boolean  // Enable data mapping features
}
```

## FormElement Interface

```typescript
interface FormElement {
  id: string                    // Unique identifier for the element
  type: FormElementType         // Type of form element
  label: string                 // Display label
  required: boolean             // Whether the field is required
  properties: Record<string, any> // Element-specific properties
}
```

## FormElementType

```typescript
type FormElementType =
  | "text"           // Text input field
  | "textarea"       // Multi-line text area
  | "number"         // Number input
  | "date"           // Date picker
  | "time"           // Time picker
  | "password"       // Password input
  | "label"          // Static label/text
  | "divider"        // Visual divider
  | "button"         // Button element
  | "image"          // Image display
  | "tableInput"     // Table input widget
  | "select"         // Single select dropdown
  | "multiSelect"    // Multi-select dropdown
  | "fileUpload"     // File upload widget
  | "checkbox"       // Checkbox input
  | "radio"          // Radio button group
  | "group"          // Element grouping container
  | "panel"          // Panel container
  | "repeatable"     // Repeatable section
  | "conditional"    // Conditional logic element
  | "layoutGrid"     // Grid layout container
  | "progressBar"    // Progress indicator
  | "memo"           // Memo/notes field
  | "documentViewer" // Document viewer
  | "apiData"        // API data source
```

## Common Element Properties

All form elements can have these common properties:

```typescript
{
  name?: string                 // Field name for form submission
  placeholder?: string          // Placeholder text
  description?: string          // Help text
  defaultValue?: any           // Default value
  permissions?: string[]        // Required permissions/claims
  gridPosition?: {             // Position in grid layout
    x: number                  // X coordinate
    y: number                  // Y coordinate
    w: number                  // Width in grid units
    h: number                  // Height in grid units
  }
}
```

## Element-Specific Properties

### Text/Textarea Elements
```typescript
{
  validationType?: "email" | "number" | "phone" | "custom" | "javascript" | "api"
  validationPattern?: string    // RegEx pattern for custom validation
  validationMessage?: string    // Error message for validation
  validationCode?: string       // JavaScript validation function
  serverValidation?: string     // API endpoint for server validation
}
```

### Select/Radio Elements
```typescript
{
  options: string[]            // Array of options
}
```

### File Upload Elements
```typescript
{
  acceptedTypes?: string[]     // Accepted file types
  maxFileSize?: number         // Maximum file size in bytes
  multiple?: boolean           // Allow multiple files
}
```

### Button Elements
```typescript
{
  buttonText?: string          // Button text
  buttonType?: "submit" | "button" | "reset"
  onClick?: string             // JavaScript code to execute
}
```

### Image Elements
```typescript
{
  imageUrl?: string            // URL of the image
  altText?: string             // Alt text for accessibility
  width?: number               // Image width
  height?: number              // Image height
}
```

## Example JSON Output

```json
{
  "id": "form-1",
  "name": "Customer Information Form",
  "description": "Collect customer information for account setup",
  "elements": [
    {
      "id": "element-1",
      "type": "text",
      "label": "Full Name",
      "required": true,
      "properties": {
        "name": "fullName",
        "placeholder": "Enter your full name",
        "validationType": "custom",
        "validationPattern": "^[a-zA-Z\\s]+$",
        "validationMessage": "Please enter a valid name"
      }
    },
    {
      "id": "element-2",
      "type": "select",
      "label": "Account Type",
      "required": true,
      "properties": {
        "name": "accountType",
        "options": ["Personal", "Business", "Enterprise"]
      }
    }
  ],
  "submitButtonText": "Submit Application",
  "successMessage": "Application submitted successfully!",
  "enableProgressBar": true,
  "accessControl": "authenticated",
  "enableVersioning": true
}
```

## Usage

This JSON structure can be:
1. Saved to a database for persistence
2. Used to render forms dynamically
3. Exported for use in other systems
4. Imported to recreate forms
5. Versioned for change tracking

The structure is designed to be both human-readable and machine-processable, making it suitable for various integration scenarios. 