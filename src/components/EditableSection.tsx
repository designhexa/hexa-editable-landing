
import React, { useState } from 'react';
import { Section, PageElement } from '@/context/EditorContext';
import { useEditor } from '@/context/EditorContext';
import EditableElement from './EditableElement';
import { cn } from '@/lib/utils';
import { Settings, Grid3X3, ArrowUpDown, Palette, Plus, LayoutGrid, Trash2, Eye, Layers } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ColorGradientPicker } from './ColorGradientPicker';
import { BackgroundImageUpload } from './BackgroundImageUpload';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Slider } from './ui/slider';
import { Input } from './ui/input';
import { Button } from './ui/button';

interface EditableSectionProps {
  section: Section;
  pageId: string;
}

const EditableSection: React.FC<EditableSectionProps> = ({ section, pageId }) => {
  const { isEditMode, updateSection, getSelectedElement, removeSection } = useEditor();
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const selectedElement = getSelectedElement();
  const isSelected = selectedElement?.sectionId === section.id;

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragLeave = () => {
    setIsDraggingOver(false);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDraggingOver(false);
    const elementId = event.dataTransfer.getData('text/plain');
    console.log(`Element ${elementId} dropped into section ${section.id}`);
  };

  const handleElementDragStart = (element: PageElement) => (event: React.DragEvent) => {
    event.dataTransfer.setData('text/plain', element.id);
  };

  const updateSectionBackgroundColor = (background: string) => {
    updateSection(pageId, section.id, {
      properties: {
        ...section.properties,
        backgroundColor: background
      }
    });
  };

  const updateSectionHeight = (height: string) => {
    updateSection(pageId, section.id, {
      properties: {
        ...section.properties,
        height: height
      }
    });
  };

  const updateSectionGridSettings = (key: string, value: any) => {
    updateSection(pageId, section.id, {
      properties: {
        ...section.properties,
        [key]: value
      }
    });
  };

  const updateSectionPadding = (direction: string, value: string) => {
    const currentPaddings = {
      paddingTop: section.properties?.paddingTop || '0px',
      paddingRight: section.properties?.paddingRight || '0px',
      paddingBottom: section.properties?.paddingBottom || '0px',
      paddingLeft: section.properties?.paddingLeft || '0px',
    };
    
    updateSection(pageId, section.id, {
      properties: {
        ...section.properties,
        [direction]: value
      }
    });
  };

  const updateSectionBackground = (imageUrl: string) => {
    updateSection(pageId, section.id, {
      properties: {
        ...section.properties,
        backgroundImage: imageUrl,
        backgroundSize: section.properties?.backgroundSize || 'cover',
        backgroundPosition: section.properties?.backgroundPosition || 'center'
      }
    });
  };

  const updateImageOpacity = (opacity: number) => {
    updateSection(pageId, section.id, {
      properties: {
        ...section.properties,
        backgroundOpacity: opacity
      }
    });
  };

  const updateOverlayColor = (color: string) => {
    updateSection(pageId, section.id, {
      properties: {
        ...section.properties,
        overlayColor: color
      }
    });
  };

  const updateOverlayOpacity = (opacity: number) => {
    updateSection(pageId, section.id, {
      properties: {
        ...section.properties,
        overlayOpacity: opacity
      }
    });
  };

  const handleRemoveSection = () => {
    if (confirm("Are you sure you want to remove this section?")) {
      removeSection(pageId, section.id);
    }
  };

  // Convert tailwind padding classes to CSS style properties
  const calculatePaddingStyle = () => {
    return {
      paddingTop: section.properties?.paddingTop || '1rem',
      paddingRight: section.properties?.paddingRight || '1rem',
      paddingBottom: section.properties?.paddingBottom || '1rem',
      paddingLeft: section.properties?.paddingLeft || '1rem',
    };
  };

  // Set the background opacity and overlay
  const backgroundImageStyle = section.properties?.backgroundImage 
    ? { 
        backgroundImage: `url(${section.properties.backgroundImage})`,
        backgroundSize: section.properties?.backgroundSize || 'cover',
        backgroundPosition: section.properties?.backgroundPosition || 'center',
        backgroundRepeat: section.properties?.backgroundRepeat || 'no-repeat',
        backgroundAttachment: section.properties?.backgroundAttachment || 'scroll',
        opacity: section.properties?.backgroundOpacity !== undefined 
          ? section.properties.backgroundOpacity 
          : 1
      } 
    : {};

  // Prepare the overlay style if needed
  const overlayStyle = (section.properties?.overlayColor && section.properties?.overlayOpacity) 
    ? {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: section.properties.overlayColor,
        opacity: section.properties.overlayOpacity,
        pointerEvents: 'none',
        zIndex: 1
      } 
    : null;

  return (
    <div 
      className={cn(
        section.properties?.backgroundColor,
        'relative',
        {
          'grid': section.properties?.isGridLayout,
          [section.properties?.gridColumns || '']: section.properties?.isGridLayout,
          [section.properties?.gridRows || '']: section.properties?.isGridLayout,
          [section.properties?.gridGap || '']: section.properties?.isGridLayout,
        }
      )}
      style={{
        ...calculatePaddingStyle(),
        height: section.properties?.height,
        position: 'relative',
      }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Background Image with Opacity */}
      {section.properties?.backgroundImage && (
        <div 
          className="absolute inset-0 z-0"
          style={backgroundImageStyle}
        ></div>
      )}
      
      {/* Overlay */}
      {overlayStyle && (
        <div style={overlayStyle}></div>
      )}
      
      {/* Content Container with proper z-index */}
      <div className="relative z-2">
        {section.elements.map((element) => (
          <EditableElement
            key={element.id}
            element={element}
            pageId={pageId}
            sectionId={section.id}
            draggable={section.properties?.isDraggableGrid}
            onDragStart={handleElementDragStart(element)}
            className={cn(
              element.gridPosition?.column,
              element.gridPosition?.row,
              element.gridPosition?.columnSpan,
              element.gridPosition?.rowSpan
            )}
          />
        ))}
      </div>
      
      {isEditMode && (
        <>
          {/* Section edit icons in top-center */}
          <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 z-30 flex gap-1 bg-white rounded-full shadow-md p-1">
            {/* Add section/widget button */}
            <div className="bg-editor-blue text-white rounded-full p-1.5 cursor-pointer hover:bg-blue-600" title="Add Element">
              <Plus className="h-4 w-4" />
            </div>
            
            {/* Section padding button */}
            <Popover>
              <PopoverTrigger asChild>
                <div className="bg-editor-blue text-white rounded-full p-1.5 cursor-pointer hover:bg-blue-600" title="Padding Settings">
                  <LayoutGrid className="h-4 w-4" />
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <h4 className="font-medium mb-2">Padding Settings</h4>
                <div className="space-y-3">
                  <div>
                    <Label className="text-xs text-gray-500">Top Padding</Label>
                    <div className="flex items-center gap-2">
                      <Input 
                        type="text" 
                        className="h-8"
                        value={section.properties?.paddingTop || '1rem'}
                        onChange={(e) => updateSectionPadding('paddingTop', e.target.value)}
                        placeholder="e.g., 16px or 1rem"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-xs text-gray-500">Right Padding</Label>
                    <div className="flex items-center gap-2">
                      <Input 
                        type="text" 
                        className="h-8"
                        value={section.properties?.paddingRight || '1rem'}
                        onChange={(e) => updateSectionPadding('paddingRight', e.target.value)}
                        placeholder="e.g., 16px or 1rem"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-xs text-gray-500">Bottom Padding</Label>
                    <div className="flex items-center gap-2">
                      <Input 
                        type="text" 
                        className="h-8"
                        value={section.properties?.paddingBottom || '1rem'}
                        onChange={(e) => updateSectionPadding('paddingBottom', e.target.value)}
                        placeholder="e.g., 16px or 1rem"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-xs text-gray-500">Left Padding</Label>
                    <div className="flex items-center gap-2">
                      <Input 
                        type="text" 
                        className="h-8"
                        value={section.properties?.paddingLeft || '1rem'}
                        onChange={(e) => updateSectionPadding('paddingLeft', e.target.value)}
                        placeholder="e.g., 16px or 1rem"
                      />
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            
            {/* Color Picker */}
            <Popover>
              <PopoverTrigger asChild>
                <div className="bg-editor-blue text-white rounded-full p-1.5 cursor-pointer hover:bg-blue-600" title="Background">
                  <Palette className="h-4 w-4" />
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <Tabs defaultValue="background" className="w-full">
                  <TabsList className="w-full grid grid-cols-3">
                    <TabsTrigger value="background">Color</TabsTrigger>
                    <TabsTrigger value="image">Image</TabsTrigger>
                    <TabsTrigger value="overlay">Overlay</TabsTrigger>
                  </TabsList>
                  <TabsContent value="background" className="pt-4">
                    <ColorGradientPicker
                      type="background"
                      value={section.properties?.backgroundColor || 'bg-white'}
                      onChange={updateSectionBackgroundColor}
                    />
                  </TabsContent>
                  <TabsContent value="image" className="pt-4">
                    <div className="space-y-3">
                      <BackgroundImageUpload
                        currentImage={section.properties?.backgroundImage}
                        onImageSelect={updateSectionBackground}
                      />
                      
                      {section.properties?.backgroundImage && (
                        <div>
                          <Label className="text-xs text-gray-500">Image Opacity</Label>
                          <div className="flex items-center gap-2">
                            <Slider
                              defaultValue={[section.properties?.backgroundOpacity !== undefined ? section.properties.backgroundOpacity * 100 : 100]}
                              max={100}
                              step={1}
                              onValueChange={(value) => updateImageOpacity(value[0] / 100)}
                            />
                            <span className="text-xs">{Math.round((section.properties?.backgroundOpacity || 1) * 100)}%</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                  <TabsContent value="overlay" className="pt-4">
                    <div className="space-y-3">
                      <Label className="text-xs text-gray-500">Overlay Color</Label>
                      <ColorGradientPicker
                        type="overlay"
                        value={section.properties?.overlayColor || 'transparent'}
                        onChange={updateOverlayColor}
                      />
                      
                      <Label className="text-xs text-gray-500">Overlay Opacity</Label>
                      <div className="flex items-center gap-2">
                        <Slider
                          defaultValue={[section.properties?.overlayOpacity !== undefined ? section.properties.overlayOpacity * 100 : 50]}
                          max={100}
                          step={1}
                          onValueChange={(value) => updateOverlayOpacity(value[0] / 100)}
                        />
                        <span className="text-xs">{Math.round((section.properties?.overlayOpacity || 0.5) * 100)}%</span>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </PopoverContent>
            </Popover>
            
            {/* Grid Layout */}
            <Popover>
              <PopoverTrigger asChild>
                <div className="bg-editor-blue text-white rounded-full p-1.5 cursor-pointer hover:bg-blue-600" title="Grid Layout">
                  <Grid3X3 className="h-4 w-4" />
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <h4 className="font-medium mb-2">Grid Layout Settings</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isGridLayout"
                      checked={section.properties?.isGridLayout || false}
                      onChange={(e) => updateSectionGridSettings('isGridLayout', e.target.checked)}
                      className="h-4 w-4"
                    />
                    <Label htmlFor="isGridLayout" className="text-xs text-gray-500">Enable Grid Layout</Label>
                  </div>

                  {section.properties?.isGridLayout && (
                    <>
                      <div>
                        <Label className="text-xs text-gray-500">Grid Columns</Label>
                        <Select
                          value={section.properties?.gridColumns || 'grid-cols-1'}
                          onValueChange={(value) => updateSectionGridSettings('gridColumns', value)}
                        >
                          <SelectTrigger className="h-8 text-xs">
                            <SelectValue placeholder="Select columns" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="grid-cols-1">1 Column</SelectItem>
                            <SelectItem value="grid-cols-2">2 Columns</SelectItem>
                            <SelectItem value="grid-cols-3">3 Columns</SelectItem>
                            <SelectItem value="grid-cols-4">4 Columns</SelectItem>
                            <SelectItem value="grid-cols-1 md:grid-cols-2">1 Col (Mobile) / 2 Col (Desktop)</SelectItem>
                            <SelectItem value="grid-cols-1 md:grid-cols-3">1 Col (Mobile) / 3 Col (Desktop)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label className="text-xs text-gray-500">Grid Gap</Label>
                        <Select
                          value={section.properties?.gridGap || 'gap-4'}
                          onValueChange={(value) => updateSectionGridSettings('gridGap', value)}
                        >
                          <SelectTrigger className="h-8 text-xs">
                            <SelectValue placeholder="Select gap size" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="gap-0">No Gap</SelectItem>
                            <SelectItem value="gap-2">Small Gap</SelectItem>
                            <SelectItem value="gap-4">Medium Gap</SelectItem>
                            <SelectItem value="gap-6">Large Gap</SelectItem>
                            <SelectItem value="gap-8">Extra Large Gap</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="isDraggableGrid"
                          checked={section.properties?.isDraggableGrid || false}
                          onChange={(e) => updateSectionGridSettings('isDraggableGrid', e.target.checked)}
                          className="h-4 w-4"
                        />
                        <Label htmlFor="isDraggableGrid" className="text-xs text-gray-500">Enable Drag & Drop</Label>
                      </div>
                    </>
                  )}
                </div>
              </PopoverContent>
            </Popover>
            
            {/* Height Section */}
            <Popover>
              <PopoverTrigger asChild>
                <div className="bg-editor-blue text-white rounded-full p-1.5 cursor-pointer hover:bg-blue-600" title="Section Height">
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <h4 className="font-medium mb-2">Section Height</h4>
                <div className="space-y-3">
                  <Select
                    value={section.properties?.height || 'auto'}
                    onValueChange={updateSectionHeight}
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue placeholder="Select height" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="auto">Auto</SelectItem>
                      <SelectItem value="300px">300px</SelectItem>
                      <SelectItem value="400px">400px</SelectItem>
                      <SelectItem value="500px">500px</SelectItem>
                      <SelectItem value="600px">600px</SelectItem>
                      <SelectItem value="100vh">Full Viewport</SelectItem>
                      <SelectItem value="50vh">Half Viewport</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <div>
                    <Label className="text-xs text-gray-500">Custom Height</Label>
                    <Input 
                      type="text" 
                      className="h-8"
                      value={section.properties?.height === 'auto' || 
                             section.properties?.height === '300px' || 
                             section.properties?.height === '400px' || 
                             section.properties?.height === '500px' || 
                             section.properties?.height === '600px' || 
                             section.properties?.height === '100vh' || 
                             section.properties?.height === '50vh' || 
                             !section.properties?.height 
                        ? '' 
                        : section.properties?.height}
                      onChange={(e) => updateSectionHeight(e.target.value)}
                      placeholder="e.g., 350px or 75vh"
                    />
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          
          {/* Remove section button in the top-right corner */}
          <div 
            className="absolute top-2 right-2 z-30 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 cursor-pointer shadow-md"
            title="Remove Section"
            onClick={handleRemoveSection}
          >
            <Trash2 className="h-4 w-4" />
          </div>

          {isDraggingOver && (
            <div className="absolute inset-0 border-2 border-dashed border-editor-blue bg-editor-blue/10 pointer-events-none z-10"></div>
          )}
        </>
      )}
    </div>
  );
};

export default EditableSection;
