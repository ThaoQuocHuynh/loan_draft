import React from "react";
import { useDraggable } from "@dnd-kit/core";

interface DraggableElementProps {
  id: string;
  label: string;
  icon: React.ReactNode;
}

export default function DraggableElement({
  id,
  label,
  icon,
}: DraggableElementProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id,
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`flex flex-col items-center justify-center p-2 border rounded-md cursor-grab text-center hover:bg-accent hover:text-accent-foreground transition-colors ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      {icon}
      <span className="text-xs mt-1">{label}</span>
    </div>
  );
}
