
import React from 'react';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ColorGradientPickerProps {
  value: string;
  onChange: (value: string) => void;
  type: 'background' | 'text';
}

const COLORS = [
  { value: 'bg-white', label: 'White', textClass: 'text-white' },
  { value: 'bg-gray-100', label: 'Light Gray', textClass: 'text-gray-100' },
  { value: 'bg-editor-blue', label: 'Blue', textClass: 'text-editor-blue' },
  { value: 'bg-editor-purple', label: 'Purple', textClass: 'text-editor-purple' },
  { value: 'bg-editor-teal', label: 'Teal', textClass: 'text-editor-teal' },
  { value: 'bg-editor-indigo', label: 'Indigo', textClass: 'text-editor-indigo' },
];

const GRADIENTS = [
  { value: 'bg-gradient-to-r from-editor-blue to-editor-purple', label: 'Blue to Purple' },
  { value: 'bg-gradient-to-r from-editor-purple to-editor-teal', label: 'Purple to Teal' },
  { value: 'bg-gradient-to-r from-editor-teal to-editor-blue', label: 'Teal to Blue' },
  { value: 'bg-gradient-to-br from-editor-blue via-editor-purple to-editor-teal', label: 'Tri-Color' },
];

export const ColorGradientPicker: React.FC<ColorGradientPickerProps> = ({
  value,
  onChange,
  type
}) => {
  const colors = type === 'text' ? COLORS.map(c => ({ value: c.textClass, label: c.label })) : COLORS;
  const showGradients = type === 'background';

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-6 gap-2">
        {colors.map((color) => (
          <button
            key={color.value}
            className={cn(
              'w-8 h-8 rounded-full border-2',
              color.value,
              value === color.value ? 'border-black' : 'border-transparent'
            )}
            onClick={() => onChange(color.value)}
          />
        ))}
      </div>

      {showGradients && (
        <Select
          value={value}
          onValueChange={onChange}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select gradient" />
          </SelectTrigger>
          <SelectContent>
            {GRADIENTS.map((gradient) => (
              <SelectItem key={gradient.value} value={gradient.value}>
                <div className="flex items-center">
                  <div className={cn("w-8 h-4 rounded mr-2", gradient.value)} />
                  {gradient.label}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
};
