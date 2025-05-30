import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { BaseFormElement, type BaseFormElementProps } from './BaseFormElement';

export function TextareaElement(props: BaseFormElementProps) {
  const { element } = props;
  
  return (
    <BaseFormElement {...props}>
      <Textarea
        placeholder={element.properties.placeholder || 'Enter text...'}
        disabled
        className="pointer-events-none resize-none"
        rows={3}
      />
    </BaseFormElement>
  );
} 