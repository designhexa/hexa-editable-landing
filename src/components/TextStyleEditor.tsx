
import React from 'react';
import { 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  AlignJustify,
  Bold,
  Italic,
  Underline,
  Type
} from 'lucide-react';
import { useEditor } from '@/context/EditorContext';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from '@/components/ui/slider';
import { PageElement } from '@/context/EditorContext';

interface TextStyleEditorProps {
  element: PageElement;
  pageId: string;
  sectionId: string;
}

const TEXT_FONTS = [
  { value: 'font-sans', label: 'Sans-serif' },
  { value: 'font-serif', label: 'Serif' },
  { value: 'font-mono', label: 'Monospace' },
  { value: 'font-playfair', label: 'Playfair' },
  { value: 'font-poppins', label: 'Poppins' },
  { value: 'font-roboto', label: 'Roboto' }
];

const FONT_SIZES = [
  { value: 'text-xs', label: 'Extra Small' },
  { value: 'text-sm', label: 'Small' },
  { value: 'text-base', label: 'Normal' },
  { value: 'text-lg', label: 'Large' },
  { value: 'text-xl', label: 'Extra Large' },
  { value: 'text-2xl', label: '2XL' },
  { value: 'text-3xl', label: '3XL' },
  { value: 'text-4xl', label: '4XL' },
  { value: 'text-5xl', label: '5XL' },
  { value: 'text-6xl', label: '6XL' }
];

const LINE_HEIGHTS = [
  { value: 'leading-none', label: 'None - 1' },
  { value: 'leading-tight', label: 'Tight - 1.25' },
  { value: 'leading-snug', label: 'Snug - 1.375' },
  { value: 'leading-normal', label: 'Normal - 1.5' },
  { value: 'leading-relaxed', label: 'Relaxed - 1.625' },
  { value: 'leading-loose', label: 'Loose - 2' }
];

const LETTER_SPACINGS = [
  { value: 'tracking-tighter', label: 'Tighter' },
  { value: 'tracking-tight', label: 'Tight' },
  { value: 'tracking-normal', label: 'Normal' },
  { value: 'tracking-wide', label: 'Wide' },
  { value: 'tracking-wider', label: 'Wider' },
  { value: 'tracking-widest', label: 'Widest' }
];

const FONT_WEIGHTS = [
  { value: 'font-thin', label: 'Thin - 100' },
  { value: 'font-extralight', label: 'Extra Light - 200' },
  { value: 'font-light', label: 'Light - 300' },
  { value: 'font-normal', label: 'Normal - 400' },
  { value: 'font-medium', label: 'Medium - 500' },
  { value: 'font-semibold', label: 'Semibold - 600' },
  { value: 'font-bold', label: 'Bold - 700' },
  { value: 'font-extrabold', label: 'Extra Bold - 800' },
  { value: 'font-black', label: 'Black - 900' }
];

const TEXT_DECORATIONS = [
  { value: 'no-underline', label: 'None' },
  { value: 'underline', label: 'Underline' },
  { value: 'line-through', label: 'Line Through' },
  { value: 'overline', label: 'Overline' }
];

const TEXT_TRANSFORMS = [
  { value: 'normal-case', label: 'None' },
  { value: 'uppercase', label: 'UPPERCASE' },
  { value: 'lowercase', label: 'lowercase' },
  { value: 'capitalize', label: 'Capitalize' }
];

export const TextStyleEditor: React.FC<TextStyleEditorProps> = ({ element, pageId, sectionId }) => {
  const { updateElement } = useEditor();
  
  const getCurrentFontClass = () => {
    const className = element.properties?.className || '';
    return TEXT_FONTS.find(font => 
      className.includes(font.value)
    )?.value || 'font-sans';
  };

  const getCurrentFontSize = () => {
    const className = element.properties?.className || '';
    return FONT_SIZES.find(size => 
      className.includes(size.value)
    )?.value || 'text-base';
  };

  const getCurrentLineHeight = () => {
    const className = element.properties?.className || '';
    return LINE_HEIGHTS.find(height => 
      className.includes(height.value)
    )?.value || 'leading-normal';
  };

  const getCurrentLetterSpacing = () => {
    const className = element.properties?.className || '';
    return LETTER_SPACINGS.find(spacing => 
      className.includes(spacing.value)
    )?.value || 'tracking-normal';
  };
  
  const getCurrentFontWeight = () => {
    const className = element.properties?.className || '';
    
    // Check for font-bold specifically since it might be toggled separately
    if (className.includes('font-bold')) return 'font-bold';
    
    return FONT_WEIGHTS.find(weight => 
      className.includes(weight.value)
    )?.value || 'font-normal';
  };
  
  const getCurrentTextDecoration = () => {
    const className = element.properties?.className || '';
    return TEXT_DECORATIONS.find(decoration => 
      className.includes(decoration.value)
    )?.value || 'no-underline';
  };
  
  const getCurrentTextTransform = () => {
    const className = element.properties?.className || '';
    return TEXT_TRANSFORMS.find(transform => 
      className.includes(transform.value)
    )?.value || 'normal-case';
  };

  const updateTextStyle = (styleType: string, value: string) => {
    const currentClassName = element.properties?.className || '';
    let regex;
    
    switch (styleType) {
      case 'font':
        regex = /font-\w+(?!-)/g;
        break;
      case 'fontSize':
        regex = /text-xs|text-sm|text-base|text-lg|text-xl|text-2xl|text-3xl|text-4xl|text-5xl|text-6xl/g;
        break;
      case 'lineHeight':
        regex = /leading-\w+/g;
        break;
      case 'letterSpacing':
        regex = /tracking-\w+/g;
        break;
      case 'textAlign':
        regex = /text-left|text-center|text-right|text-justify/g;
        break;
      case 'fontWeight':
        regex = /font-thin|font-extralight|font-light|font-normal|font-medium|font-semibold|font-bold|font-extrabold|font-black/g;
        break;
      case 'textDecoration':
        regex = /underline|line-through|overline|no-underline/g;
        break;
      case 'textTransform':
        regex = /normal-case|uppercase|lowercase|capitalize/g;
        break;
      default:
        regex = new RegExp('');
    }
    
    // Remove existing style class
    const cleanedClassName = currentClassName.replace(regex, '').trim();
    
    // Add new style class
    const newClassName = `${cleanedClassName} ${value}`.trim();
    
    updateElement(pageId, sectionId, element.id, {
      properties: {
        ...element.properties,
        className: newClassName
      }
    });
  };

  const applyFontStyle = (style: string) => {
    const currentClassName = element.properties?.className || '';
    
    // Check if style already exists
    const hasStyle = currentClassName.includes(style);
    
    if (hasStyle) {
      // Remove style
      const newClassName = currentClassName.replace(style, '').trim();
      updateElement(pageId, sectionId, element.id, {
        properties: {
          ...element.properties,
          className: newClassName
        }
      });
    } else {
      // Add style
      updateElement(pageId, sectionId, element.id, {
        properties: {
          ...element.properties,
          className: `${currentClassName} ${style}`.trim()
        }
      });
    }
  };

  const isStyleActive = (style: string) => {
    const currentClassName = element.properties?.className || '';
    return currentClassName.includes(style);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-1">
        <Button
          variant={isStyleActive('font-bold') ? "default" : "outline"}
          size="sm"
          className="w-8 h-8 p-0"
          onClick={() => applyFontStyle('font-bold')}
          title="Bold"
        >
          <Bold size={14} />
        </Button>
        <Button
          variant={isStyleActive('italic') ? "default" : "outline"}
          size="sm"
          className="w-8 h-8 p-0"
          onClick={() => applyFontStyle('italic')}
          title="Italic"
        >
          <Italic size={14} />
        </Button>
        <Button
          variant={isStyleActive('underline') ? "default" : "outline"}
          size="sm"
          className="w-8 h-8 p-0"
          onClick={() => applyFontStyle('underline')}
          title="Underline"
        >
          <Underline size={14} />
        </Button>
        <Button
          variant={isStyleActive('text-left') ? "default" : "outline"}
          size="sm"
          className="w-8 h-8 p-0"
          onClick={() => updateTextStyle('textAlign', 'text-left')}
          title="Align Left"
        >
          <AlignLeft size={14} />
        </Button>
        <Button
          variant={isStyleActive('text-center') ? "default" : "outline"}
          size="sm"
          className="w-8 h-8 p-0"
          onClick={() => updateTextStyle('textAlign', 'text-center')}
          title="Align Center"
        >
          <AlignCenter size={14} />
        </Button>
        <Button
          variant={isStyleActive('text-right') ? "default" : "outline"}
          size="sm"
          className="w-8 h-8 p-0"
          onClick={() => updateTextStyle('textAlign', 'text-right')}
          title="Align Right"
        >
          <AlignRight size={14} />
        </Button>
        <Button
          variant={isStyleActive('text-justify') ? "default" : "outline"}
          size="sm"
          className="w-8 h-8 p-0"
          onClick={() => updateTextStyle('textAlign', 'text-justify')}
          title="Justify"
        >
          <AlignJustify size={14} />
        </Button>
      </div>
      
      <div>
        <label className="block text-sm text-gray-500 mb-1">Font Family</label>
        <Select
          value={getCurrentFontClass()}
          onValueChange={(value) => updateTextStyle('font', value)}
        >
          <SelectTrigger className="w-full h-8 text-xs">
            <SelectValue placeholder="Select Font" />
          </SelectTrigger>
          <SelectContent>
            {TEXT_FONTS.map((font) => (
              <SelectItem key={font.value} value={font.value} className={font.value}>
                {font.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <label className="block text-sm text-gray-500 mb-1">Font Size</label>
        <Select
          value={getCurrentFontSize()}
          onValueChange={(value) => updateTextStyle('fontSize', value)}
        >
          <SelectTrigger className="w-full h-8 text-xs">
            <SelectValue placeholder="Select Size" />
          </SelectTrigger>
          <SelectContent>
            {FONT_SIZES.map((size) => (
              <SelectItem key={size.value} value={size.value}>
                {size.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <label className="block text-sm text-gray-500 mb-1">Font Weight</label>
        <Select
          value={getCurrentFontWeight()}
          onValueChange={(value) => updateTextStyle('fontWeight', value)}
        >
          <SelectTrigger className="w-full h-8 text-xs">
            <SelectValue placeholder="Select Weight" />
          </SelectTrigger>
          <SelectContent>
            {FONT_WEIGHTS.map((weight) => (
              <SelectItem key={weight.value} value={weight.value}>
                {weight.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <label className="block text-sm text-gray-500 mb-1">Line Height</label>
        <Select
          value={getCurrentLineHeight()}
          onValueChange={(value) => updateTextStyle('lineHeight', value)}
        >
          <SelectTrigger className="w-full h-8 text-xs">
            <SelectValue placeholder="Select Line Height" />
          </SelectTrigger>
          <SelectContent>
            {LINE_HEIGHTS.map((height) => (
              <SelectItem key={height.value} value={height.value}>
                {height.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <label className="block text-sm text-gray-500 mb-1">Letter Spacing</label>
        <Select
          value={getCurrentLetterSpacing()}
          onValueChange={(value) => updateTextStyle('letterSpacing', value)}
        >
          <SelectTrigger className="w-full h-8 text-xs">
            <SelectValue placeholder="Select Spacing" />
          </SelectTrigger>
          <SelectContent>
            {LETTER_SPACINGS.map((spacing) => (
              <SelectItem key={spacing.value} value={spacing.value}>
                {spacing.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <label className="block text-sm text-gray-500 mb-1">Text Decoration</label>
        <Select
          value={getCurrentTextDecoration()}
          onValueChange={(value) => updateTextStyle('textDecoration', value)}
        >
          <SelectTrigger className="w-full h-8 text-xs">
            <SelectValue placeholder="Select Decoration" />
          </SelectTrigger>
          <SelectContent>
            {TEXT_DECORATIONS.map((decoration) => (
              <SelectItem key={decoration.value} value={decoration.value}>
                {decoration.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <label className="block text-sm text-gray-500 mb-1">Text Transform</label>
        <Select
          value={getCurrentTextTransform()}
          onValueChange={(value) => updateTextStyle('textTransform', value)}
        >
          <SelectTrigger className="w-full h-8 text-xs">
            <SelectValue placeholder="Select Transform" />
          </SelectTrigger>
          <SelectContent>
            {TEXT_TRANSFORMS.map((transform) => (
              <SelectItem key={transform.value} value={transform.value}>
                {transform.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
