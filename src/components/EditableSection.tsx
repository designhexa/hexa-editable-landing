import React, { useState } from 'react';
import { Section } from '@/context/EditorContext';
import { useEditor } from '@/context/EditorContext';
import EditableElement from './EditableElement';
import { cn } from '@/lib/utils';

interface EditableSectionProps {
  section: Section;
  pageId: string;
}

const EditableSection: React.FC<EditableSectionProps> = ({ section, pageId }) => {
  const { isEditMode } = useEditor();
  const [isDraggingOver, setIsDraggingOver] = useState(false);

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

  const handleElementDragStart = (elementId: string) => (event: React.DragEvent) => {
    event.dataTransfer.setData('text/plain', elementId);
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
        height: section.properties?.height,
      }}
    >
      {section.elements.map((element) => (
        <EditableElement
          key={element.id}
          element={element}
          pageId={pageId}
          sectionId={section.id}
          draggable={section.properties?.isDraggableGrid}
          onDragStart={handleElementDragStart}
          className={cn(
            element.gridPosition?.column,
            element.gridPosition?.row,
            element.gridPosition?.columnSpan,
            element.gridPosition?.rowSpan
          )}
        />
      ))}
    </div>
  );
};

export default EditableSection;
