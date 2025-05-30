import React from 'react';
import { Input } from '@/components/ui/input';
import { BaseFormElement, type BaseFormElementProps } from './BaseFormElement';

export function TextInputElement(props: BaseFormElementProps) {
  const { element } = props;
  
  return (
    <BaseFormElement {...props}>
      <Input
        placeholder={element.properties?.placeholder || 'Enter text...'}
        disabled
        className="pointer-events-none"
      />
    </BaseFormElement>
  );
} 