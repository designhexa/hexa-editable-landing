
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Page, UserRole, MenuItem, Section, PageElement } from '@/types/editor';
import { EditorContextType } from './EditorContextType';
import { defaultHomePage, defaultNavigation } from '@/data/defaultData';
import { pageOperations } from './editorOperations/pageOperations';
import { sectionOperations } from './editorOperations/sectionOperations';
import { elementOperations } from './editorOperations/elementOperations';

export const EditorContext = createContext<EditorContextType | undefined>(undefined);

export const EditorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [pages, setPages] = useState<Page[]>([defaultHomePage]);
  const [currentPageId, setCurrentPageId] = useState(defaultHomePage.id);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<UserRole>('viewer');
  const [navigation, setNavigation] = useState<MenuItem[]>(defaultNavigation);

  const currentPage = pages.find(page => page.id === currentPageId) || null;

  // Import operations
  const {
    addPage,
    removePage: removePageOp,
    updatePage,
    publishPage,
    unpublishPage,
    replaceHeaderSection,
    replaceFooterSection
  } = pageOperations(pages, setPages, setSelectedElementId);

  const {
    addSection,
    updateSection,
    removeSection,
    duplicateSection,
    moveSectionUp,
    moveSectionDown
  } = sectionOperations(setPages);

  const {
    addElement,
    updateElement,
    removeElement,
    getSelectedElement
  } = elementOperations(setPages, pages, currentPageId, selectedElementId);

  // Handler for removing pages with navigation update
  const removePage = (pageId: string, newPageId: string) => {
    const pageToRemove = pages.find(p => p.id === pageId);
    const newCurrentPageId = removePageOp(pageId, newPageId);
    
    // Update navigation
    if (pageToRemove) {
      setNavigation((prevNav) => prevNav.filter(item => item.url !== pageToRemove.slug));
    }
    
    return newCurrentPageId;
  };

  // Toggle edit mode
  const toggleEditMode = () => {
    if (userRole === 'viewer') {
      return;
    }
    
    setIsEditMode((prev) => !prev);
    if (isEditMode) {
      setSelectedElementId(null);
    }
  };

  const setEditMode = (value: boolean) => {
    setIsEditMode(value);
    if (!value) {
      setSelectedElementId(null);
    }
  };

  // Element selection
  const selectElement = (elementId: string | null) => {
    setSelectedElementId(elementId);
  };

  // Navigation handling
  const updateNavigation = (items: MenuItem[]) => {
    const sortedItems = [...items].sort((a, b) => a.order - b.order);
    setNavigation(sortedItems);
  };

  // Saving changes
  const saveEditorChanges = async (): Promise<void> => {
    return new Promise((resolve, reject) => {
      try {
        localStorage.setItem('websiteBuilder_pages', JSON.stringify(pages));
        localStorage.setItem('websiteBuilder_navigation', JSON.stringify(navigation));
        
        setTimeout(() => {
          console.log('Changes saved successfully');
          resolve();
        }, 1000);
      } catch (error) {
        console.error('Error saving changes:', error);
        reject(error);
      }
    });
  };

  // Publishing changes
  const publishChanges = () => {
    if (currentPage) {
      publishPage(currentPage.id);
      saveEditorChanges()
        .then(() => {
          console.log('Changes published successfully');
        })
        .catch((error) => {
          console.error('Error publishing changes:', error);
        });
    }
  };

  // Load saved data from localStorage
  useEffect(() => {
    try {
      const savedPages = localStorage.getItem('websiteBuilder_pages');
      const savedNavigation = localStorage.getItem('websiteBuilder_navigation');
      
      if (savedPages) {
        setPages(JSON.parse(savedPages));
      }
      
      if (savedNavigation) {
        setNavigation(JSON.parse(savedNavigation));
      }
    } catch (error) {
      console.error('Error loading saved data:', error);
    }
  }, []);

  // Create the context value object
  const value = {
    pages,
    currentPageId,
    isEditMode,
    selectedElementId,
    userRole,
    navigation,
    currentPage,
    addPage,
    removePage,
    setCurrentPageId,
    updatePage,
    toggleEditMode,
    setEditMode,
    addSection,
    updateSection,
    removeSection,
    addElement,
    updateElement,
    removeElement,
    selectElement,
    duplicateSection,
    moveSectionUp,
    moveSectionDown,
    getSelectedElement,
    setUserRole,
    publishPage,
    unpublishPage,
    replaceHeaderSection,
    replaceFooterSection,
    updateNavigation,
    saveEditorChanges,
    publishChanges
  };

  return (
    <EditorContext.Provider value={value}>{children}</EditorContext.Provider>
  );
};

// Custom hook for using the editor context
export const useEditor = () => {
  const context = useContext(EditorContext);
  if (context === undefined) {
    throw new Error('useEditor must be used within an EditorProvider');
  }
  return context;
};

// Export types
export type { ElementType, UserRole, SectionType, MenuItem, PageElement, Section, Page } from '@/types/editor';
