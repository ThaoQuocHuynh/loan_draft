import { createContext, useContext, type ReactNode } from 'react';

export interface FormElement {
  id: string;
  type: string;
  label: string;
  properties: {
    name?: string;
    label?: string;
    placeholder?: string;
    validationType?: string;
    validationMessage?: string;
    width?: string;
    gridPosition?: {
      x: number;
      y: number;
      w: number;
      h: number;
    };
    options?: string[];
    [key: string]: string | number | boolean | null | undefined | string[] | { x: number; y: number; w: number; h: number };
  };
}

export interface FormState {
  elements: FormElement[];
}

interface FormBuilderContextType {
  formState: FormState;
}

const FormBuilderContext = createContext<FormBuilderContextType | undefined>(undefined);

export function useFormBuilder() {
  const context = useContext(FormBuilderContext);
  if (!context) {
    throw new Error('useFormBuilder must be used within a FormBuilderProvider');
  }
  return context;
}

export function FormBuilderProvider({ children, value }: { children: ReactNode; value: FormBuilderContextType }) {
  return (
    <FormBuilderContext.Provider value={value}>
      {children}
    </FormBuilderContext.Provider>
  );
} 