
import React from 'react';
import { useEditor } from '@/context/EditorContext';
import { PageElement } from '@/context/EditorContext';

const PageRenderer = () => {
  const { currentPage, isEditMode, selectedElementId, setSelectedElementId } = useEditor();

  if (!currentPage) {
    return (
      <div className="container py-8 text-center">
        <h1 className="text-2xl font-bold">Page not found</h1>
        <p>The requested page could not be found.</p>
      </div>
    );
  }

  const renderElement = (element: PageElement) => {
    const isSelected = selectedElementId === element.id;
    
    const commonProps = {
      key: element.id,
      onClick: isEditMode ? 
        (e: React.MouseEvent) => {
          e.stopPropagation();
          setSelectedElementId(element.id);
        } : undefined,
      className: `${isEditMode ? 'outline-dashed outline-1 outline-transparent hover:outline-gray-300' : ''} 
                 ${isSelected ? '!outline-blue-500 !outline-2' : ''}
                 ${element.attributes?.className || ''}`
    };

    switch (element.type) {
      case 'heading':
        const level = element.attributes?.level || '2';
        const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;
        return (
          <HeadingTag {...commonProps}>
            {element.content}
          </HeadingTag>
        );
        
      case 'text':
        return (
          <p {...commonProps}>
            {element.content}
          </p>
        );
        
      case 'image':
        return (
          <img 
            src={element.content} 
            {...commonProps}
            alt={element.attributes?.alt || ""}
          />
        );
        
      case 'button':
        return (
          <button
            {...commonProps}
            type="button"
          >
            {element.content}
          </button>
        );
        
      case 'link':
        return (
          <a 
            {...commonProps}
            href={element.attributes?.href || '#'}
          >
            {element.content}
          </a>
        );
        
      case 'container':
        return (
          <div {...commonProps}>
            {element.children?.map(childElement => renderElement(childElement))}
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="container py-8" onClick={() => isEditMode && setSelectedElementId(null)}>
      {currentPage.elements.map(element => renderElement(element))}
    </div>
  );
};

export default PageRenderer;
