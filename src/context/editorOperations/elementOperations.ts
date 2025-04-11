
import { PageElement } from '@/types/editor';

export const elementOperations = (
  setPages: React.Dispatch<React.SetStateAction<any[]>>,
  pages: any[],
  currentPageId: string,
  selectedElementId: string | null
) => {
  const addElement = (pageId: string, sectionId: string, element: PageElement) => {
    setPages((prevPages) =>
      prevPages.map((page) =>
        page.id === pageId
          ? {
              ...page,
              sections: page.sections.map((section) =>
                section.id === sectionId
                  ? {
                      ...section,
                      elements: [...section.elements, element],
                    }
                  : section
              ),
            }
          : page
      )
    );
  };

  const updateElement = (
    pageId: string,
    sectionId: string,
    elementId: string,
    updatedElement: Partial<PageElement>
  ) => {
    setPages((prevPages) =>
      prevPages.map((page) =>
        page.id === pageId
          ? {
              ...page,
              sections: page.sections.map((section) =>
                section.id === sectionId
                  ? {
                      ...section,
                      elements: section.elements.map((element) =>
                        element.id === elementId
                          ? { ...element, ...updatedElement }
                          : element
                      ),
                    }
                  : section
              ),
            }
          : page
      )
    );
  };

  const removeElement = (pageId: string, sectionId: string, elementId: string) => {
    setPages((prevPages) =>
      prevPages.map((page) =>
        page.id === pageId
          ? {
              ...page,
              sections: page.sections.map((section) =>
                section.id === sectionId
                  ? {
                      ...section,
                      elements: section.elements.filter(
                        (element) => element.id !== elementId
                      ),
                    }
                  : section
              ),
            }
          : page
      )
    );
  };

  const getSelectedElement = () => {
    if (!selectedElementId) return null;

    for (const page of pages) {
      if (page.id === currentPageId) {
        for (const section of page.sections) {
          const element = section.elements.find(e => e.id === selectedElementId);
          if (element) {
            return { pageId: page.id, sectionId: section.id, element };
          }
        }
      }
    }
    
    return null;
  };

  return {
    addElement,
    updateElement,
    removeElement,
    getSelectedElement
  };
};
