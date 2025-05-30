// Secured.tsx
import React from 'react';
import { useUser } from '@/contexts/UserContext';
import { allows } from '@/utils/permissions';
import { SecuredProps } from '@/types/authorization';

const Secured: React.FC<SecuredProps> = ({ view = [], edit = [], children }) => {
  const { hasRole, hasClaim, hasPolicy } = useUser();

  // If no view claims are provided, the item is visible by default
  // If view claims are provided, check if user has any of them
  if (view.length > 0 && !allows(view, hasRole, hasClaim, hasPolicy)) {
    return null;
  }

  // If we get here, the item is visible
  // If no edit claims are provided, the item is enabled by default
  // If edit claims are provided, check if user has any of them
  const isEditable = edit.length === 0 || allows(edit, hasRole, hasClaim, hasPolicy);
  return React.cloneElement(children, {
    ...(children.props || {}),
    disabled: !isEditable,
  });
};

export { Secured };
