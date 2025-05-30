import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { BaseFormElement, type BaseFormElementProps } from './BaseFormElement';

export function CheckboxElement(props: BaseFormElementProps) {
  const { element } = props;

  return (
    <BaseFormElement {...props}>
      <div className="flex items-center space-x-2">
        <Checkbox disabled className="pointer-events-none" />
        <Label className="text-sm">
          {element.properties.checkboxText || element.properties.label}
        </Label>
      </div>
    </BaseFormElement>
  );
}
