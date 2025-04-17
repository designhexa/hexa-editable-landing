
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChromePicker } from 'react-color';

interface ColorGradientPickerProps {
  value: string;
  onChange: (value: string) => void;
  type: 'background' | 'text';
}

const COLORS = [
  { value: 'bg-white', label: 'White', textClass: 'text-white', hex: '#FFFFFF' },
  { value: 'bg-gray-100', label: 'Light Gray', textClass: 'text-gray-100', hex: '#F3F4F6' },
  { value: 'bg-editor-blue', label: 'Blue', textClass: 'text-editor-blue', hex: '#3B82F6' },
  { value: 'bg-editor-purple', label: 'Purple', textClass: 'text-editor-purple', hex: '#8B5CF6' },
  { value: 'bg-editor-teal', label: 'Teal', textClass: 'text-editor-teal', hex: '#14B8A6' },
  { value: 'bg-editor-indigo', label: 'Indigo', textClass: 'text-editor-indigo', hex: '#6366F1' },
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
  const colors = type === 'text' ? COLORS.map(c => ({ value: c.textClass, label: c.label, hex: c.hex })) : COLORS;
  const showGradients = type === 'background';
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [customColor, setCustomColor] = useState('#FFFFFF');

  const handleCustomColorChange = (color: any) => {
    setCustomColor(color.hex);
  };

  const applyCustomColor = () => {
    if (type === 'background') {
      onChange(`bg-[${customColor}]`);
    } else {
      onChange(`text-[${customColor}]`);
    }
    setShowColorPicker(false);
  };

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
        
        {/* Custom color button */}
        <button
          className={cn(
            'w-8 h-8 rounded-full border-2 bg-gradient-to-r from-red-500 via-green-500 to-blue-500',
            value.startsWith('bg-[#') || value.startsWith('text-[#') ? 'border-black' : 'border-transparent'
          )}
          onClick={() => setShowColorPicker(!showColorPicker)}
          title="Custom Color"
        />
      </div>

      {showColorPicker && (
        <div className="relative z-30">
          <div className="absolute">
            <ChromePicker 
              color={customColor}
              onChange={handleCustomColorChange}
              disableAlpha={true}
            />
            <button 
              className="w-full mt-2 py-2 bg-editor-blue text-white rounded-md text-sm"
              onClick={applyCustomColor}
            >
              Apply Color
            </button>
          </div>
          <div 
            className="fixed inset-0 z-20" 
            onClick={() => setShowColorPicker(false)}
          />
        </div>
      )}

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
