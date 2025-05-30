import { useDraggable } from '@dnd-kit/core';
import React, { useCallback, useEffect, useState } from 'react';
import { useFormBuilder } from '@/pages/FormBuilder/contexts/FormBuilderContext';
import { FormElement } from '@/pages/FormBuilder/types/FormTypes';

export interface BaseFormElementProps {
  element: FormElement;
  isSelected?: boolean;
  onSelect?: () => void;
  onRemove?: () => void;
  children?: React.ReactNode;
}

export function BaseFormElement({
  element,
  isSelected = false,
  onSelect,
  onRemove,
  children,
}: BaseFormElementProps) {
  const { updateElement } = useFormBuilder();
  const [isResizing, setIsResizing] = useState(false);
  const [initialSize, setInitialSize] = useState({ width: 0, height: 0 });
  const [initialPosition, setInitialPosition] = useState({ x: 0, y: 0 });
  const [tempSize, setTempSize] = useState({ width: 0, height: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [justDropped, setJustDropped] = useState(false);

  // Make element draggable only if it has a position (is absolutely positioned)
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `canvas-element-${element.id}`,
    disabled: !element.properties.position || isResizing,
    data: {
      type: 'canvas-element',
      element,
    },
  });

  // Track when element was just dropped to prevent transition animation
  useEffect(() => {
    if (transform === null && justDropped) {
      // Element was just dropped, keep transitions disabled briefly
      const timer = setTimeout(() => {
        setJustDropped(false);
      }, 100);
      return () => clearTimeout(timer);
    } else if (transform !== null) {
      // Element is being dragged
      setJustDropped(true);
    }
  }, [transform, justDropped]);

  const dragStyle = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : {};

  // Apply absolute positioning for positioned elements
  const positionStyle = element.properties.position
    ? {
        position: 'absolute' as const,
        left: `${element.properties.position.x}px`,
        top: `${element.properties.position.y}px`,
      }
    : {};

  return (
    <div
      ref={setNodeRef}
      {...(element.properties.position ? listeners : {})}
      {...(element.properties.position ? attributes : {})}
      onClick={onSelect}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className={`relative border rounded-md p-3 transition-all ${
        isSelected ? 'ring-2 ring-primary border-primary' : 'hover:border-gray-300'
      } ${transform ? 'z-50' : ''} ${
        element.properties.properties.position ? 'cursor-move' : 'cursor-pointer'
      } ${!element.properties.position ? 'mb-4' : ''}`}
      style={{
        width: isResizing ? `${tempSize.width}px` : element.properties.size?.width,
        height: isResizing ? `${tempSize.height}px` : element.properties.size?.height,
        minWidth: '200px',
        minHeight: '50px',
        transition: isResizing || transform || justDropped ? 'none' : 'all 0.2s ease',
        ...positionStyle,
        ...dragStyle,
      }}
    >
      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
        <span>{element.properties?.label}</span>
        {element.properties?.required && <span className="text-red-500">*</span>}
      </div>
      {children}
      {isSelected && (
        <button
          onClick={e => {
            e.stopPropagation();
            onRemove?.();
          }}
          className="absolute top-1 right-1 h-6 w-6 rounded-full bg-red-500 text-white text-xs hover:bg-red-600 flex items-center justify-center"
        >
          ×
        </button>
      )}
    </div>
  );
}
