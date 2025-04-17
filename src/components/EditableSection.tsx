
import React, { useState } from 'react';
import { Section, PageElement } from '@/context/EditorContext';
import { useEditor } from '@/context/EditorContext';
import EditableElement from './EditableElement';
import { cn } from '@/lib/utils';
import { Settings, Grid3X3, ArrowUpDown, Palette } from 'lucide-react';

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
          {/* Section edit icons in top-right corner */}
          {isSelected && (
            <div className="absolute top-2 right-2 z-20 flex gap-1">
              <div className="bg-editor-blue text-white rounded-full p-1.5 shadow-md" title="Section Settings">
                <Settings className="h-4 w-4" />
              </div>
              {section.properties?.isGridLayout && (
                <div className="bg-editor-purple text-white rounded-full p-1.5 shadow-md" title="Grid Layout">
                  <Grid3X3 className="h-4 w-4" />
                </div>
              )}
              <div className="bg-editor-teal text-white rounded-full p-1.5 shadow-md" title="Section Height">
                <ArrowUpDown className="h-4 w-4" />
              </div>
              <div className="bg-editor-indigo text-white rounded-full p-1.5 shadow-md" title="Background Color">
                <Palette className="h-4 w-4" />
              </div>
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
