import React from 'react';
import {
  AlignLeft,
  CheckSquare,
  LetterText,
  Hash,
  KeyRound,
  FileText,
  Grid2X2,
  Images,
  ListChecks,
  ListPlus,
  ListCheck,
  ListTree,
  CalendarDays,
  Clock4,
  ALargeSmall,
  Radio,
  SquareSquare,
  SquareMousePointer,
  PanelTop,
  Upload,
  SeparatorHorizontal,
  Parentheses,
  Percent
} from 'lucide-react';
import type { ElementToolboxItem } from '../types/FormTypes';

export const ELEMENT_TYPES: ElementToolboxItem[] = [
  // Input Elements
  { type: 'text', label: 'Text Input', icon: <AlignLeft className="h-4 w-4" />, category: 'input' },
  { type: 'textarea', label: 'Textarea', icon: <LetterText className="h-4 w-4" />, category: 'input' },
  { type: 'number', label: 'Number', icon: <Hash className="h-4 w-4" />, category: 'input' },
  { type: 'date', label: 'Date', icon: <CalendarDays className="h-4 w-4" />, category: 'input' },
  { type: 'time', label: 'Time', icon: <Clock4 className="h-4 w-4" />, category: 'input' },
  { type: 'password', label: 'Password', icon: <KeyRound className="h-4 w-4" />, category: 'input' },
  { type: 'select', label: 'Single Select', icon: <ListCheck className="h-4 w-4" />, category: 'input' },
  { type: 'multiSelect', label: 'Multi Select', icon: <ListChecks className="h-4 w-4" />, category: 'input' },
  { type: 'checkbox', label: 'Checkbox', icon: <CheckSquare className="h-4 w-4" />, category: 'input' },
  { type: 'radio', label: 'Radio', icon: <Radio className="h-4 w-4" />, category: 'input' },
  { type: 'fileUpload', label: 'File Upload', icon: <Upload className="h-4 w-4" />, category: 'input' },
  { type: 'tableInput', label: 'Table Input', icon: <ListPlus className="h-4 w-4" />, category: 'input' },

  // Display Elements
  { type: 'label', label: 'Label', icon: <ALargeSmall className="h-4 w-4" />, category: 'display' },
  { type: 'divider', label: 'Divider', icon: <SeparatorHorizontal className="h-4 w-4" />, category: 'display' },
  { type: 'button', label: 'Button', icon: <SquareMousePointer className="h-4 w-4" />, category: 'display' },
  { type: 'image', label: 'Image', icon: <Images className="h-4 w-4" />, category: 'display' },
  { type: 'progressBar', label: 'Progress Bar', icon: <Percent className="h-4 w-4" />, category: 'display' },

  // Layout Elements
  { type: 'group', label: 'Group', icon: <SquareSquare className="h-4 w-4" />, category: 'layout' },
  { type: 'panel', label: 'Panel', icon: <PanelTop className="h-4 w-4" />, category: 'layout' },
  { type: 'layoutGrid', label: 'Layout Grid', icon: <Grid2X2 className="h-4 w-4" />, category: 'layout' },

  // Advanced Elements
  { type: 'repeatable', label: 'Repeatable', icon: <ListTree className="h-4 w-4" />, category: 'advanced' },
  { type: 'conditional', label: 'Conditional', icon: <Parentheses className="h-4 w-4" />, category: 'advanced' },
  { type: 'apiData', label: 'API Data', icon: <FileText className="h-4 w-4" />, category: 'advanced' },
]; 