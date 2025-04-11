import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { nanoid } from 'nanoid';
import { useAuth } from './AuthContext';

// Types for our page editor
export type ElementType = 'text' | 'heading' | 'image' | 'button' | 'container' | 'link';

export interface PageElement {
  id: string;
  type: ElementType;
  content: string;
  attributes?: Record<string, string>;
  properties?: Record<string, string>;
  children?: PageElement[];
  parentId?: string | null;
  index?: number;
  gridPosition?: {
    column?: string;
    row?: string;
    columnSpan?: string;
    rowSpan?: string;
  };
}

export interface Section {
  id: string;
  type?: 'header' | 'content' | 'footer';
  properties?: Record<string, string>;
  elements: PageElement[];
}

export interface Page {
  id: string;
  title: string;
  slug: string;
  description?: string;
  isPublished?: boolean;
  sections: Section[];
  createdAt?: string;
  updatedAt?: string;
}

// Selected element data for editor
export interface SelectedElementData {
  pageId: string;
  sectionId: string;
  element: PageElement;
}

// Initial demo content
const initialPages: Page[] = [
  {
    id: 'home-page',
    title: 'Home',
    slug: '/',
    isPublished: true,
    sections: [
      {
        id: 'header-section',
        type: 'header',
        properties: {
          backgroundColor: 'bg-white',
          paddingY: 'py-4',
          paddingX: 'px-4'
        },
        elements: [
          {
            id: 'header-title',
            type: 'heading',
            content: 'Website Builder',
            properties: {
              className: 'text-xl font-bold'
            }
          }
        ]
      },
      {
        id: 'content-section',
        type: 'content',
        properties: {
          backgroundColor: 'bg-white',
          paddingY: 'py-12',
          paddingX: 'px-4'
        },
        elements: [
          {
            id: 'main-heading',
            type: 'heading',
            content: 'Welcome to Page Builder',
            properties: {
              className: 'text-3xl font-bold text-center mb-8'
            }
          },
          {
            id: 'intro-paragraph',
            type: 'text',
            content: 'This is a simple web page builder. You can edit this content when logged in as an editor or admin.',
            properties: {
              className: 'text-center max-w-2xl mx-auto'
            }
          },
          {
            id: 'cta-button',
            type: 'button',
            content: 'Learn More',
            properties: {
              className: 'bg-editor-blue hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-6 mx-auto block'
            }
          },
        ]
      },
      {
        id: 'footer-section',
        type: 'footer',
        properties: {
          backgroundColor: 'bg-gray-800',
          paddingY: 'py-8',
          paddingX: 'px-4'
        },
        elements: [
          {
            id: 'footer-text',
            type: 'text',
            content: '© 2025 Website Builder. All rights reserved.',
            properties: {
              className: 'text-gray-400 text-center'
            }
          }
        ]
      }
    ]
  }
];

// Define context type
interface EditorContextType {
  pages: Page[];
  currentPageId: string;
  setCurrentPageId: (id: string) => void;
  isEditMode: boolean;
  setEditMode: (isEdit: boolean) => void;
  userRole: string;
  updatePage: (pageId: string, updates: Partial<Page>) => void;
  addPage: (page: Page) => void;
  removePage: (pageId: string, redirectToPageId?: string) => void;
  addSection: (pageId: string, section: Section) => void;
  replaceHeaderSection: (pageId: string, section: Section) => void;
  replaceFooterSection: (pageId: string, section: Section) => void;
  updateSection: (pageId: string, sectionId: string, updates: Partial<Section>) => void;
  removeSection: (pageId: string, sectionId: string) => void;
  addElement: (pageId: string, sectionId: string, element: PageElement) => void;
  updateElement: (pageId: string, sectionId: string, elementId: string, updates: Partial<PageElement>) => void;
  removeElement: (pageId: string, sectionId: string, elementId: string) => void;
  selectedElementId: string | null;
  setSelectedElementId: (id: string | null) => void;
  getSelectedElement: () => SelectedElementData | null;
  saveEditorChanges: () => Promise<void>;
  currentPage?: Page;
  selectElement: (elementId: string | null) => void;
  duplicateSection: (pageId: string, sectionId: string) => void;
  moveSectionUp: (pageId: string, sectionId: string) => void;
  moveSectionDown: (pageId: string, sectionId: string) => void;
  publishChanges: () => Promise<void>;
}

const EditorContext = createContext<EditorContextType | undefined>(undefined);

export const EditorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pages, setPages] = useState<Page[]>([]);
  const [currentPageId, setCurrentPageId] = useState<string>('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const { toast } = useToast();
  const { currentUser } = useAuth();
  
  // Get user role
  const userRole = currentUser?.role || 'viewer';
  
  // Load pages from localStorage on initial render
  useEffect(() => {
    const storedPages = localStorage.getItem('pages');
    if (storedPages) {
      try {
        setPages(JSON.parse(storedPages));
      } catch (error) {
        console.error('Error parsing stored pages:', error);
        setPages(initialPages);
        localStorage.setItem('pages', JSON.stringify(initialPages));
      }
    } else {
      setPages(initialPages);
      localStorage.setItem('pages', JSON.stringify(initialPages));
    }
  }, []);

  // Set initial page if not set
  useEffect(() => {
    if (pages.length > 0 && !currentPageId) {
      setCurrentPageId(pages[0].id);
    }
  }, [pages, currentPageId]);

  // Get current page
  const currentPage = pages.find(p => p.id === currentPageId);

  // Function to select an element
  const selectElement = (elementId: string | null) => {
    setSelectedElementId(elementId);
  };

  // Function to get the selected element
  const getSelectedElement = (): SelectedElementData | null => {
    if (!selectedElementId || !currentPageId) return null;
    
    const page = pages.find(p => p.id === currentPageId);
    if (!page) return null;
    
    for (const section of page.sections) {
      const element = findElementInArray(section.elements, selectedElementId);
      if (element) {
        return {
          pageId: currentPageId,
          sectionId: section.id,
          element
        };
      }
    }
    
    return null;
  };
  
  // Helper function to find an element in a nested array
  const findElementInArray = (elements: PageElement[], elementId: string): PageElement | null => {
    for (const element of elements) {
      if (element.id === elementId) {
        return element;
      }
      
      if (element.children) {
        const found = findElementInArray(element.children, elementId);
        if (found) return found;
      }
    }
    
    return null;
  };

  // Update page
  const updatePage = (pageId: string, updates: Partial<Page>) => {
    setPages(prevPages => prevPages.map(page => {
      if (page.id === pageId) {
        return { ...page, ...updates };
      }
      return page;
    }));
  };
  
  // Add page
  const addPage = (page: Page) => {
    setPages(prevPages => [...prevPages, page]);
    setCurrentPageId(page.id);
  };
  
  // Remove page
  const removePage = (pageId: string, redirectToPageId?: string) => {
    setPages(prevPages => prevPages.filter(page => page.id !== pageId));
    if (currentPageId === pageId && redirectToPageId) {
      setCurrentPageId(redirectToPageId);
    } else if (currentPageId === pageId && pages.length > 1) {
      const otherPage = pages.find(page => page.id !== pageId);
      if (otherPage) {
        setCurrentPageId(otherPage.id);
      }
    }
  };

  // Add section
  const addSection = (pageId: string, section: Section) => {
    setPages(prevPages => prevPages.map(page => {
      if (page.id === pageId) {
        return {
          ...page,
          sections: [...page.sections, section]
        };
      }
      return page;
    }));
  };
  
  // Replace header section
  const replaceHeaderSection = (pageId: string, section: Section) => {
    section.type = 'header';
    
    setPages(prevPages => prevPages.map(page => {
      if (page.id === pageId) {
        // Remove existing header if any
        const filteredSections = page.sections.filter(s => s.type !== 'header');
        
        // Add new header at the beginning
        return {
          ...page,
          sections: [section, ...filteredSections]
        };
      }
      return page;
    }));
  };
  
  // Replace footer section
  const replaceFooterSection = (pageId: string, section: Section) => {
    section.type = 'footer';
    
    setPages(prevPages => prevPages.map(page => {
      if (page.id === pageId) {
        // Remove existing footer if any
        const filteredSections = page.sections.filter(s => s.type !== 'footer');
        
        // Add new footer at the end
        return {
          ...page,
          sections: [...filteredSections, section]
        };
      }
      return page;
    }));
  };
  
  // Update section
  const updateSection = (pageId: string, sectionId: string, updates: Partial<Section>) => {
    setPages(prevPages => prevPages.map(page => {
      if (page.id === pageId) {
        return {
          ...page,
          sections: page.sections.map(section => {
            if (section.id === sectionId) {
              return { ...section, ...updates };
            }
            return section;
          })
        };
      }
      return page;
    }));
  };
  
  // Duplicate section
  const duplicateSection = (pageId: string, sectionId: string) => {
    setPages(prevPages => prevPages.map(page => {
      if (page.id === pageId) {
        const sectionToDuplicate = page.sections.find(section => section.id === sectionId);
        if (!sectionToDuplicate) return page;
        
        const newSection = {
          ...JSON.parse(JSON.stringify(sectionToDuplicate)), // Deep clone
          id: `section-${nanoid(6)}`,
          elements: sectionToDuplicate.elements.map(element => ({
            ...element,
            id: `element-${nanoid(6)}`
          }))
        };
        
        // Find the index of the section to duplicate
        const sectionIndex = page.sections.findIndex(section => section.id === sectionId);
        
        // Create a new array with the new section inserted after the original
        const newSections = [...page.sections];
        newSections.splice(sectionIndex + 1, 0, newSection);
        
        return {
          ...page,
          sections: newSections
        };
      }
      return page;
    }));
  };
  
  // Move section up
  const moveSectionUp = (pageId: string, sectionId: string) => {
    setPages(prevPages => prevPages.map(page => {
      if (page.id === pageId) {
        const sectionIndex = page.sections.findIndex(section => section.id === sectionId);
        if (sectionIndex <= 0) return page; // Can't move up if it's the first section
        
        const newSections = [...page.sections];
        const temp = newSections[sectionIndex];
        newSections[sectionIndex] = newSections[sectionIndex - 1];
        newSections[sectionIndex - 1] = temp;
        
        return {
          ...page,
          sections: newSections
        };
      }
      return page;
    }));
  };
  
  // Move section down
  const moveSectionDown = (pageId: string, sectionId: string) => {
    setPages(prevPages => prevPages.map(page => {
      if (page.id === pageId) {
        const sectionIndex = page.sections.findIndex(section => section.id === sectionId);
        if (sectionIndex === -1 || sectionIndex >= page.sections.length - 1) return page; // Can't move down if it's the last section
        
        const newSections = [...page.sections];
        const temp = newSections[sectionIndex];
        newSections[sectionIndex] = newSections[sectionIndex + 1];
        newSections[sectionIndex + 1] = temp;
        
        return {
          ...page,
          sections: newSections
        };
      }
      return page;
    }));
  };
  
  // Remove section
  const removeSection = (pageId: string, sectionId: string) => {
    setPages(prevPages => prevPages.map(page => {
      if (page.id === pageId) {
        return {
          ...page,
          sections: page.sections.filter(section => section.id !== sectionId)
        };
      }
      return page;
    }));
  };
  
  // Add element to section
  const addElement = (pageId: string, sectionId: string, element: PageElement) => {
    setPages(prevPages => prevPages.map(page => {
      if (page.id === pageId) {
        return {
          ...page,
          sections: page.sections.map(section => {
            if (section.id === sectionId) {
              return {
                ...section,
                elements: [...section.elements, element]
              };
            }
            return section;
          })
        };
      }
      return page;
    }));
  };
  
  // Update element
  const updateElement = (pageId: string, sectionId: string, elementId: string, updates: Partial<PageElement>) => {
    setPages(prevPages => prevPages.map(page => {
      if (page.id === pageId) {
        return {
          ...page,
          sections: page.sections.map(section => {
            if (section.id === sectionId) {
              return {
                ...section,
                elements: updateElementInArray(section.elements, elementId, updates)
              };
            }
            return section;
          })
        };
      }
      return page;
    }));
  };
  
  // Helper function to update an element in a nested array
  const updateElementInArray = (elements: PageElement[], elementId: string, updates: Partial<PageElement>): PageElement[] => {
    return elements.map(element => {
      if (element.id === elementId) {
        return { ...element, ...updates };
      }
      
      if (element.children) {
        return {
          ...element,
          children: updateElementInArray(element.children, elementId, updates)
        };
      }
      
      return element;
    });
  };
  
  // Remove element
  const removeElement = (pageId: string, sectionId: string, elementId: string) => {
    setPages(prevPages => prevPages.map(page => {
      if (page.id === pageId) {
        return {
          ...page,
          sections: page.sections.map(section => {
            if (section.id === sectionId) {
              return {
                ...section,
                elements: removeElementFromArray(section.elements, elementId)
              };
            }
            return section;
          })
        };
      }
      return page;
    }));
  };
  
  // Helper function to remove an element from a nested array
  const removeElementFromArray = (elements: PageElement[], elementId: string): PageElement[] => {
    return elements
      .filter(element => element.id !== elementId)
      .map(element => {
        if (element.children) {
          return {
            ...element,
            children: removeElementFromArray(element.children, elementId)
          };
        }
        return element;
      });
  };
  
  // Save changes to localStorage
  const saveEditorChanges = async (): Promise<void> => {
    return new Promise((resolve) => {
      localStorage.setItem('pages', JSON.stringify(pages));
      toast({
        title: "Changes saved",
        description: "Your changes have been saved locally.",
      });
      resolve();
    });
  };

  // Publish changes
  const publishChanges = async (): Promise<void> => {
    return new Promise((resolve) => {
      // Mark current page as published
      if (currentPageId) {
        setPages(prevPages => prevPages.map(page => {
          if (page.id === currentPageId) {
            return {
              ...page,
              isPublished: true,
              updatedAt: new Date().toISOString()
            };
          }
          return page;
        }));
      }
      
      // Save to localStorage
      localStorage.setItem('pages', JSON.stringify(pages));
      
      toast({
        title: "Published successfully",
        description: "Your page has been published successfully.",
      });
      resolve();
    });
  };

  // Set edit mode wrapper
  const setEditMode = (isEdit: boolean) => {
    setIsEditMode(isEdit);
  };

  return (
    <EditorContext.Provider
      value={{
        pages,
        currentPageId,
        setCurrentPageId,
        isEditMode,
        setEditMode,
        userRole,
        updatePage,
        addPage,
        removePage,
        addSection,
        replaceHeaderSection,
        replaceFooterSection,
        updateSection,
        removeSection,
        addElement,
        updateElement,
        removeElement,
        selectedElementId,
        setSelectedElementId,
        getSelectedElement,
        saveEditorChanges,
        currentPage,
        selectElement,
        duplicateSection,
        moveSectionUp,
        moveSectionDown,
        publishChanges,
      }}
    >
      {children}
    </EditorContext.Provider>
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
