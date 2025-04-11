
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
  children?: PageElement[];
  parentId?: string | null;
  index?: number;
}

export interface Page {
  id: string;
  title: string;
  slug: string;
  description?: string;
  elements: PageElement[];
  createdAt: string;
  updatedAt: string;
}

// Initial demo content
const initialPages: Page[] = [
  {
    id: 'home-page',
    title: 'Home',
    slug: '/',
    description: 'Welcome to our website',
    elements: [
      {
        id: 'header-1',
        type: 'heading',
        content: 'Welcome to Page Builder',
        attributes: { level: '1' },
      },
      {
        id: 'paragraph-1',
        type: 'text',
        content: 'This is a simple web page builder. You can edit this content when logged in as an editor or admin.',
      },
      {
        id: 'button-1',
        type: 'button',
        content: 'Learn More',
        attributes: { href: '/about', className: 'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' },
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'about-page',
    title: 'About',
    slug: '/about',
    description: 'About our company',
    elements: [
      {
        id: 'header-2',
        type: 'heading',
        content: 'About Us',
        attributes: { level: '1' },
      },
      {
        id: 'text-about',
        type: 'text',
        content: 'We are a company dedicated to making web building easy.',
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

// Define context type
interface EditorContextType {
  pages: Page[];
  currentPageId: string | null;
  setCurrentPageId: (id: string) => void;
  currentPage: Page | null;
  isEditMode: boolean;
  setEditMode: (isEdit: boolean) => void;
  selectedElementId: string | null;
  setSelectedElementId: (id: string | null) => void;
  updateElementContent: (elementId: string, newContent: string) => void;
  updateElementAttributes: (elementId: string, newAttributes: Record<string, string>) => void;
  addElement: (elementType: ElementType, parentId?: string) => void;
  removeElement: (elementId: string) => void;
  moveElement: (elementId: string, direction: 'up' | 'down') => void;
  saveEditorChanges: () => Promise<void>;
  addNewPage: (title: string, slug: string) => void;
  removePage: (pageId: string) => void;
  publishChanges: () => Promise<void>;
  revertChanges: () => void;
}

const EditorContext = createContext<EditorContextType | undefined>(undefined);

export const EditorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pages, setPages] = useState<Page[]>([]);
  const [currentPageId, setCurrentPageId] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const { toast } = useToast();
  const { isAuthenticated, hasPermission } = useAuth();

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

  // Disable edit mode if user logs out
  useEffect(() => {
    if (!isAuthenticated && isEditMode) {
      setIsEditMode(false);
      setSelectedElementId(null);
    }
  }, [isAuthenticated, isEditMode]);

  // Function to enter edit mode
  const setEditMode = useCallback((isEdit: boolean) => {
    if (isEdit && !isAuthenticated) {
      toast({
        variant: "destructive",
        title: "Access denied",
        description: "You need to login as an editor or admin to edit pages.",
      });
      return;
    }

    if (isEdit && isAuthenticated && !hasPermission('editor')) {
      toast({
        variant: "destructive",
        title: "Access denied",
        description: "You don't have permission to edit pages.",
      });
      return;
    }

    setIsEditMode(isEdit);
    if (!isEdit) {
      setSelectedElementId(null);
    }
  }, [isAuthenticated, hasPermission, toast]);

  // Get current page
  const currentPage = currentPageId ? pages.find(page => page.id === currentPageId) || null : null;

  // Update element content
  const updateElementContent = (elementId: string, newContent: string) => {
    if (!currentPage) return;

    setPages(prevPages => prevPages.map(page => {
      if (page.id !== currentPageId) return page;
      
      const updatedElements = updateElementInTree(page.elements, elementId, (element) => ({
        ...element,
        content: newContent
      }));
      
      return {
        ...page,
        elements: updatedElements,
        updatedAt: new Date().toISOString()
      };
    }));
  };

  // Update element attributes
  const updateElementAttributes = (elementId: string, newAttributes: Record<string, string>) => {
    if (!currentPage) return;

    setPages(prevPages => prevPages.map(page => {
      if (page.id !== currentPageId) return page;
      
      const updatedElements = updateElementInTree(page.elements, elementId, (element) => ({
        ...element,
        attributes: { ...element.attributes, ...newAttributes }
      }));
      
      return {
        ...page,
        elements: updatedElements,
        updatedAt: new Date().toISOString()
      };
    }));
  };

  // Helper function to update an element in the tree
  const updateElementInTree = (
    elements: PageElement[], 
    elementId: string, 
    updateFn: (element: PageElement) => PageElement
  ): PageElement[] => {
    return elements.map(element => {
      if (element.id === elementId) {
        return updateFn(element);
      }
      
      if (element.children && element.children.length > 0) {
        return {
          ...element,
          children: updateElementInTree(element.children, elementId, updateFn)
        };
      }
      
      return element;
    });
  };

  // Add new element
  const addElement = (elementType: ElementType, parentId?: string) => {
    if (!currentPage) return;

    const newElement: PageElement = {
      id: nanoid(),
      type: elementType,
      content: getDefaultContentForType(elementType),
      attributes: getDefaultAttributesForType(elementType),
    };

    setPages(prevPages => prevPages.map(page => {
      if (page.id !== currentPageId) return page;
      
      let updatedElements: PageElement[];
      
      if (parentId) {
        // Add as child to specific parent
        updatedElements = addElementToParent(page.elements, parentId, newElement);
      } else {
        // Add to root level
        updatedElements = [...page.elements, newElement];
      }
      
      return {
        ...page,
        elements: updatedElements,
        updatedAt: new Date().toISOString()
      };
    }));

    setSelectedElementId(newElement.id);
  };

  // Helper to get default content for new elements
  const getDefaultContentForType = (type: ElementType): string => {
    switch(type) {
      case 'heading': return 'New Heading';
      case 'text': return 'New paragraph text';
      case 'button': return 'Button';
      case 'link': return 'Link';
      case 'image': return 'https://via.placeholder.com/300x200';
      case 'container': return '';
      default: return '';
    }
  };

  // Helper to get default attributes for new elements
  const getDefaultAttributesForType = (type: ElementType): Record<string, string> => {
    switch(type) {
      case 'heading': return { level: '2' };
      case 'button': return { 
        className: 'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
      };
      case 'link': return { href: '#', className: 'text-blue-500 hover:underline' };
      case 'image': return { alt: 'Image description', className: 'max-w-full h-auto' };
      case 'container': return { 
        className: 'p-4 border border-gray-200 rounded-lg my-4' 
      };
      default: return {};
    }
  };

  // Helper to add element to a parent
  const addElementToParent = (
    elements: PageElement[], 
    parentId: string, 
    newElement: PageElement
  ): PageElement[] => {
    return elements.map(element => {
      if (element.id === parentId) {
        return {
          ...element,
          children: element.children ? [...element.children, newElement] : [newElement]
        };
      }
      
      if (element.children && element.children.length > 0) {
        return {
          ...element,
          children: addElementToParent(element.children, parentId, newElement)
        };
      }
      
      return element;
    });
  };

  // Remove element
  const removeElement = (elementId: string) => {
    if (!currentPage) return;

    setPages(prevPages => prevPages.map(page => {
      if (page.id !== currentPageId) return page;
      
      const updatedElements = removeElementFromTree(page.elements, elementId);
      
      return {
        ...page,
        elements: updatedElements,
        updatedAt: new Date().toISOString()
      };
    }));

    if (selectedElementId === elementId) {
      setSelectedElementId(null);
    }
  };

  // Helper to remove element from tree
  const removeElementFromTree = (elements: PageElement[], elementId: string): PageElement[] => {
    return elements
      .filter(element => element.id !== elementId)
      .map(element => {
        if (element.children && element.children.length > 0) {
          return {
            ...element,
            children: removeElementFromTree(element.children, elementId)
          };
        }
        return element;
      });
  };

  // Move element up or down
  const moveElement = (elementId: string, direction: 'up' | 'down') => {
    if (!currentPage) return;

    setPages(prevPages => prevPages.map(page => {
      if (page.id !== currentPageId) return page;
      
      // Find the parent containing the element
      let flatElements = flattenElements(page.elements);
      let elementIndex = flatElements.findIndex(el => el.id === elementId);
      
      if (elementIndex === -1) return page;
      
      const element = flatElements[elementIndex];
      const parentId = element.parentId;
      
      // Get siblings (elements with the same parent)
      let siblings: PageElement[];
      
      if (!parentId) {
        // Root level elements
        siblings = page.elements;
      } else {
        // Find parent and its children
        const parent = findElementInTree(page.elements, parentId);
        if (!parent || !parent.children) return page;
        siblings = parent.children;
      }
      
      // Find element among siblings
      const siblingIndex = siblings.findIndex(el => el.id === elementId);
      if (siblingIndex === -1) return page;
      
      // Calculate new index
      let newIndex: number;
      if (direction === 'up') {
        newIndex = Math.max(0, siblingIndex - 1);
      } else {
        newIndex = Math.min(siblings.length - 1, siblingIndex + 1);
      }
      
      // Don't do anything if element is already at the boundary
      if (newIndex === siblingIndex) return page;
      
      // Create a new array with the element moved
      let newSiblings = [...siblings];
      newSiblings.splice(siblingIndex, 1);
      newSiblings.splice(newIndex, 0, siblings[siblingIndex]);
      
      // Update the tree
      let updatedElements: PageElement[];
      
      if (!parentId) {
        // Update root elements
        updatedElements = newSiblings;
      } else {
        // Update children of the parent
        updatedElements = updateElementInTree(page.elements, parentId, (element) => ({
          ...element,
          children: newSiblings
        }));
      }
      
      return {
        ...page,
        elements: updatedElements,
        updatedAt: new Date().toISOString()
      };
    }));
  };

  // Helper to flatten element tree (and add parentId references)
  const flattenElements = (elements: PageElement[], parentId: string | null = null): (PageElement & { parentId: string | null })[] => {
    return elements.reduce((acc, element) => {
      const elementWithParent = { ...element, parentId };
      acc.push(elementWithParent);
      
      if (element.children && element.children.length > 0) {
        acc.push(...flattenElements(element.children, element.id));
      }
      
      return acc;
    }, [] as (PageElement & { parentId: string | null })[]);
  };

  // Helper to find an element in the tree
  const findElementInTree = (elements: PageElement[], elementId: string): PageElement | null => {
    for (const element of elements) {
      if (element.id === elementId) {
        return element;
      }
      
      if (element.children && element.children.length > 0) {
        const found = findElementInTree(element.children, elementId);
        if (found) return found;
      }
    }
    
    return null;
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

  // Add new page
  const addNewPage = (title: string, slug: string) => {
    // Ensure slug starts with /
    const formattedSlug = slug.startsWith('/') ? slug : `/${slug}`;
    
    // Check if page with slug already exists
    const slugExists = pages.some(page => page.slug === formattedSlug);
    if (slugExists) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `A page with slug "${formattedSlug}" already exists.`,
      });
      return;
    }

    const newPage: Page = {
      id: nanoid(),
      title,
      slug: formattedSlug,
      elements: [
        {
          id: nanoid(),
          type: 'heading',
          content: title,
          attributes: { level: '1' },
        },
        {
          id: nanoid(),
          type: 'text',
          content: 'Edit this content to add your page description.',
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setPages(prevPages => [...prevPages, newPage]);
    setCurrentPageId(newPage.id);
    
    toast({
      title: "Page created",
      description: `"${title}" page has been created successfully.`,
    });
  };

  // Remove page
  const removePage = (pageId: string) => {
    if (pages.length <= 1) {
      toast({
        variant: "destructive",
        title: "Cannot remove page",
        description: "You must have at least one page.",
      });
      return;
    }

    setPages(prevPages => {
      const updatedPages = prevPages.filter(page => page.id !== pageId);
      
      // If removing the current page, switch to another page
      if (pageId === currentPageId && updatedPages.length > 0) {
        setCurrentPageId(updatedPages[0].id);
      }
      
      return updatedPages;
    });
    
    toast({
      title: "Page removed",
      description: "The page has been removed successfully.",
    });
  };

  // Publish changes (in a real app, this would push to a server)
  const publishChanges = async (): Promise<void> => {
    return new Promise((resolve) => {
      // In a real application, this would publish to a server
      saveEditorChanges().then(() => {
        toast({
          title: "Changes published",
          description: "Your changes have been published successfully.",
        });
        resolve();
      });
    });
  };
  
  // Revert changes to last published version
  const revertChanges = () => {
    // In a real app, this would pull from the server
    // Here we're just reloading from localStorage
    const storedPages = localStorage.getItem('pages');
    if (storedPages) {
      try {
        setPages(JSON.parse(storedPages));
        toast({
          title: "Changes reverted",
          description: "Your changes have been reverted to the last saved version.",
        });
      } catch (error) {
        console.error('Error parsing stored pages:', error);
        toast({
          variant: "destructive",
          title: "Error reverting changes",
          description: "There was an error reverting your changes.",
        });
      }
    }
  };

  return (
    <EditorContext.Provider
      value={{
        pages,
        currentPageId,
        setCurrentPageId,
        currentPage,
        isEditMode,
        setEditMode,
        selectedElementId,
        setSelectedElementId,
        updateElementContent,
        updateElementAttributes,
        addElement,
        removeElement,
        moveElement,
        saveEditorChanges,
        addNewPage,
        removePage,
        publishChanges,
        revertChanges,
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
