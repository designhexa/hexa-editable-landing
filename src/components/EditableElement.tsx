
import React, { useState } from 'react';
import { useEditor, PageElement } from '@/context/EditorContext';
import { cn } from '@/lib/utils';
import { HtmlEmbed } from './HtmlEmbed';

interface EditableElementProps {
  element: PageElement;
  pageId: string;
  sectionId: string;
  className?: string;
  draggable?: boolean;
  onDragStart?: (event: React.DragEvent) => void;
}

const EditableElement: React.FC<EditableElementProps> = ({
  element,
  pageId,
  sectionId,
  className,
  draggable,
  onDragStart
}) => {
  const { isEditMode, selectElement, updateElement, updatePage } = useEditor();
  const [isEditing, setIsEditing] = useState(false);
  
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isEditMode) {
      selectElement(element.id);
    }
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isEditMode && (element.type === 'text' || element.type === 'heading')) {
      setIsEditing(true);
      selectElement(null);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    updateElement(pageId, sectionId, element.id, { content: e.target.value });
    updatePage(pageId, { needs_republish: true });
  };

  const handleBlur = () => {
    setIsEditing(false);
  };

  const renderElement = () => {
    switch (element.type) {
      case 'heading':
        return isEditMode && isEditing ? (
          <input
            type="text"
            value={element.content}
            onChange={handleChange}
            onBlur={handleBlur}
            className={cn(
              'w-full p-2 bg-white border rounded shadow-sm',
              element.properties?.className
            )}
          />
        ) : (
          <h2 className={element.properties?.className}>{element.content}</h2>
        );
        
      case 'text':
        return isEditMode && isEditing ? (
          <textarea
            value={element.content}
            onChange={handleChange}
            onBlur={handleBlur}
            className={cn(
              'w-full p-2 bg-white border rounded shadow-sm',
              element.properties?.className
            )}
          />
        ) : (
          <p className={element.properties?.className}>{element.content}</p>
        );
        
      case 'image':
        return (
          <img
            src={element.content}
            alt="Element"
            className={element.properties?.className}
          />
        );
        
      case 'button':
        return (
          <button className={element.properties?.className}>{element.content}</button>
        );
      
      case 'html':
        return (
          <HtmlEmbed
            content={element.content}
            onChange={(content) => {
              updateElement(pageId, sectionId, element.id, {
                content,
              });
              updatePage(pageId, { needs_republish: true });
            }}
          />
        );
        
      default:
        return null;
    }
  };

  return (
    <div
      className={cn(
        'relative',
        className
      )}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      draggable={draggable}
      onDragStart={onDragStart}
    >
      {renderElement()}
    </div>
  );
};

export default EditableElement;
