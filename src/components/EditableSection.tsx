
import React, { useState } from 'react';
import { Section, PageElement } from '@/context/EditorContext';
import { useEditor } from '@/context/EditorContext';
import EditableElement from './EditableElement';
import { cn } from '@/lib/utils';
import { Settings, Grid3X3, ArrowUpDown, Palette } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ColorGradientPicker } from './ColorGradientPicker';
import { BackgroundImageUpload } from './BackgroundImageUpload';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface EditableSectionProps {
  section: Section;
  pageId: string;
}

const EditableSection: React.FC<EditableSectionProps> = ({ section, pageId }) => {
  const { isEditMode, updateSection, getSelectedElement } = useEditor();
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

  return (
    <div 
      className={cn(
        section.properties?.backgroundColor,
        section.properties?.paddingY,
        section.properties?.paddingX,
        'relative',
        {
          'grid': section.properties?.isGridLayout,
          [section.properties?.gridColumns || '']: section.properties?.isGridLayout,
          [section.properties?.gridRows || '']: section.properties?.isGridLayout,
          [section.properties?.gridGap || '']: section.properties?.isGridLayout,
        }
      )}
      style={{
        backgroundImage: section.properties?.backgroundImage ? `url(${section.properties.backgroundImage})` : undefined,
        backgroundSize: section.properties?.backgroundSize || undefined,
        backgroundPosition: section.properties?.backgroundPosition || undefined,
        backgroundRepeat: section.properties?.backgroundRepeat || 'no-repeat',
        backgroundAttachment: section.properties?.backgroundAttachment || 'scroll',
        height: section.properties?.height,
      }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
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
      
      {isEditMode && (
        <>
          {/* Section edit icons in top-right corner with popover functionality */}
          {isSelected && (
            <div className="absolute top-2 right-2 z-20 flex gap-1">
              <Popover>
                <PopoverTrigger asChild>
                  <div className="bg-black bg-opacity-70 hover:bg-opacity-90 text-white rounded-full p-1.5 shadow-md cursor-pointer" title="Section Settings">
                    <Settings className="h-4 w-4" />
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <h4 className="font-medium mb-2">Section Settings</h4>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs text-gray-500">Padding X</Label>
                      <Select
                        value={section.properties?.paddingX || 'px-4'}
                        onValueChange={(value) => updateSectionGridSettings('paddingX', value)}
                      >
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue placeholder="Horizontal padding" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="px-0">None</SelectItem>
                          <SelectItem value="px-2">Small</SelectItem>
                          <SelectItem value="px-4">Medium</SelectItem>
                          <SelectItem value="px-8">Large</SelectItem>
                          <SelectItem value="px-12">Extra Large</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label className="text-xs text-gray-500">Padding Y</Label>
                      <Select
                        value={section.properties?.paddingY || 'py-4'}
                        onValueChange={(value) => updateSectionGridSettings('paddingY', value)}
                      >
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue placeholder="Vertical padding" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="py-0">None</SelectItem>
                          <SelectItem value="py-2">Small</SelectItem>
                          <SelectItem value="py-4">Medium</SelectItem>
                          <SelectItem value="py-8">Large</SelectItem>
                          <SelectItem value="py-12">Extra Large</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              
              {section.properties?.isGridLayout && (
                <Popover>
                  <PopoverTrigger asChild>
                    <div className="bg-black bg-opacity-70 hover:bg-opacity-90 text-white rounded-full p-1.5 shadow-md cursor-pointer" title="Grid Layout">
                      <Grid3X3 className="h-4 w-4" />
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <h4 className="font-medium mb-2">Grid Layout Settings</h4>
                    <div className="space-y-3">
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
                    </div>
                  </PopoverContent>
                </Popover>
              )}
              
              <Popover>
                <PopoverTrigger asChild>
                  <div className="bg-black bg-opacity-70 hover:bg-opacity-90 text-white rounded-full p-1.5 shadow-md cursor-pointer" title="Section Height">
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <h4 className="font-medium mb-2">Section Height</h4>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs text-gray-500">Height</Label>
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
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              
              <Popover>
                <PopoverTrigger asChild>
                  <div className="bg-black bg-opacity-70 hover:bg-opacity-90 text-white rounded-full p-1.5 shadow-md cursor-pointer" title="Background">
                    <Palette className="h-4 w-4" />
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <Tabs defaultValue="background" className="w-full">
                    <TabsList className="w-full grid grid-cols-2">
                      <TabsTrigger value="background">Background</TabsTrigger>
                      <TabsTrigger value="image">Image</TabsTrigger>
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
                      </div>
                    </TabsContent>
                  </Tabs>
                </PopoverContent>
              </Popover>
            </div>
          )}
          
          {isDraggingOver && (
            <div className="absolute inset-0 border-2 border-dashed border-editor-blue bg-editor-blue/10 pointer-events-none z-10"></div>
          )}
        </>
      )}
    </div>
  );
};

export default EditableSection;
