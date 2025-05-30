import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BaseFormElement, type BaseFormElementProps } from './BaseFormElement';

export function SelectElement(props: BaseFormElementProps) {
  const { element } = props;
  const options = element.properties.options || [];
  
  return (
    <BaseFormElement {...props}>
      <Select disabled>
        <SelectTrigger className="pointer-events-none">
          <SelectValue placeholder={element.properties.placeholder || 'Select an option...'} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option: string, index: number) => (
            <SelectItem key={index} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {options.length > 0 && (
        <div className="text-xs text-muted-foreground mt-1">
          Options: {options.join(', ')}
        </div>
      )}
    </BaseFormElement>
  );
} 