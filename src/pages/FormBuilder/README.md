# Form Builder - Refactored

This is a refactored version of the Form Builder component with improved organization, proper naming conventions, and better separation of concerns.

## Key Improvements

### 1. Proper Naming Conventions
- All files now use PascalCase instead of kebab-case
- Components follow React naming conventions
- Clear, descriptive names for all modules

### 2. Organized Structure
```
src/pages/form-builder/
├── components/                 # All React components
│   ├── form-elements/         # Individual form element components
│   │   ├── BaseFormElement.tsx
│   │   ├── TextInputElement.tsx
│   │   ├── TextareaElement.tsx
│   │   ├── SelectElement.tsx
│   │   ├── CheckboxElement.tsx
│   │   └── index.ts
│   ├── FormBuilder.tsx         # Main form builder component
│   ├── FormDesigner.tsx        # WYSIWYG designer interface
│   ├── FormCanvas.tsx          # Canvas for dropping elements
│   ├── ElementToolbox.tsx      # Toolbox with draggable elements
│   ├── ElementRenderer.tsx     # Renders elements in designer
│   ├── ElementProperties.tsx   # Properties panel
│   ├── FormPreview.tsx         # Form preview
│   ├── VersionControl.tsx      # Version management
│   ├── DraggableElement.tsx    # Draggable toolbox item
│   ├── SettingsTab.tsx         # Form settings
│   ├── AdvancedTab.tsx         # Advanced settings
│   └── DebugTab.tsx            # Debug information
├── contexts/                   # React contexts
│   └── FormBuilderContext.tsx  # Main form builder context
├── data/                       # Data and configuration
│   ├── MockData.ts             # All mock data
│   └── ElementTypes.tsx        # Element type definitions
├── providers/                  # Data providers
│   └── MockFormDataProvider.ts # Mock data provider implementation
├── types/                      # TypeScript type definitions
│   └── FormTypes.ts            # All form-related types
├── docs/                       # Documentation
│   └── FormJsonStructure.md    # JSON output documentation
├── README.md                   # This file
└── index.tsx                   # Main entry point
```

### 3. Data Provider Interface
- Clean separation between UI and data layer
- `FormDataProviderInterface` defines all CRUD operations
- `MockFormDataProvider` implements the interface with mock data
- Easy to swap for real API implementation

### 4. Individual Element Components
Each form element type has its own component class:
- `BaseFormElement` - Common functionality for all elements
- `TextInputElement` - Text input fields
- `TextareaElement` - Multi-line text areas
- `SelectElement` - Dropdown selections
- `CheckboxElement` - Checkbox inputs
- More can be easily added following the same pattern

### 5. Context-Based State Management
- `FormBuilderContext` provides centralized state management
- Async operations for all CRUD actions
- Error handling and loading states
- Clean separation of concerns

## Key Features

### WYSIWYG Editor
- Drag and drop interface for building forms
- Real-time preview of form elements
- Visual element selection and editing
- Properties panel for detailed configuration

### Element Toolbox
- Categorized elements (Input, Layout, Display, Advanced)
- Tabbed interface for better organization
- Draggable elements with visual feedback

### Form Management
- Create, read, update, delete operations
- Version control with publishing
- Settings and advanced configuration
- Debug mode for development

### JSON Output
The form builder produces a comprehensive JSON structure that includes:
- Form metadata (name, description, settings)
- Element definitions with properties
- Validation rules and constraints
- Layout and styling information
- Version and change tracking

See `docs/FormJsonStructure.md` for detailed documentation.

## Usage

```tsx
import FormBuilderPage from './src/pages/form-builder';

// Use the form builder
<FormBuilderPage />
```

### With Custom Data Provider

```tsx
import { FormBuilderProvider } from './contexts/FormBuilderContext';
import { FormBuilder } from './components/FormBuilder';
import { MyCustomDataProvider } from './providers/MyCustomDataProvider';

function MyFormBuilder() {
  const dataProvider = new MyCustomDataProvider();
  
  return (
    <FormBuilderProvider dataProvider={dataProvider}>
      <FormBuilder />
    </FormBuilderProvider>
  );
}
```

## Extending the Form Builder

### Adding New Element Types

1. Add the new type to `FormElementType` in `types/FormTypes.ts`
2. Add the element configuration to `ELEMENT_TYPES` in `data/ElementTypes.tsx`
3. Create a new component in `components/form-elements/`
4. Update the `FormElementRenderer` to handle the new type
5. Export the new component from `components/form-elements/index.ts`

### Creating Custom Data Providers

Implement the `FormDataProviderInterface`:

```tsx
class MyDataProvider implements FormDataProviderInterface {
  async getForms(): Promise<FormState[]> {
    // Your implementation
  }
  
  async createForm(form: Omit<FormState, 'id' | 'lastModified'>): Promise<FormState> {
    // Your implementation
  }
  
  // ... implement all other methods
}
```

## Development

The form builder is designed to be:
- **Modular** - Each component has a single responsibility
- **Extensible** - Easy to add new element types and features
- **Type-safe** - Full TypeScript support with comprehensive types
- **Testable** - Clean separation of concerns makes testing easier
- **Maintainable** - Clear structure and naming conventions

## Future Enhancements

- Grid-based layout system
- Advanced validation rules
- Conditional logic between elements
- Form templates and themes
- Import/export functionality
- Real-time collaboration
- Form analytics and usage tracking 