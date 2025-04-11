
import { Section } from '@/types/editor';

export const sectionOperations = (
  setPages: React.Dispatch<React.SetStateAction<any[]>>
) => {
  const addSection = (pageId: string, section: Section) => {
    setPages((prevPages) =>
      prevPages.map((page) =>
        page.id === pageId
          ? { ...page, sections: [...page.sections, section] }
          : page
      )
    );
  };

  const updateSection = (pageId: string, sectionId: string, updatedSection: Partial<Section>) => {
    setPages((prevPages) =>
      prevPages.map((page) =>
        page.id === pageId
          ? {
              ...page,
              sections: page.sections.map((section) =>
                section.id === sectionId
                  ? { ...section, ...updatedSection }
                  : section
              ),
            }
          : page
      )
    );
  };

  const removeSection = (pageId: string, sectionId: string) => {
    setPages((prevPages) =>
      prevPages.map((page) =>
        page.id === pageId
          ? {
              ...page,
              sections: page.sections.filter(
                (section) => section.id !== sectionId
              ),
            }
          : page
      )
    );
  };

  const duplicateSection = (pageId: string, sectionId: string) => {
    setPages((prevPages) =>
      prevPages.map((page) => {
        if (page.id === pageId) {
          const sectionToDuplicate = page.sections.find(
            (section) => section.id === sectionId
          );

          if (sectionToDuplicate) {
            const sectionIndex = page.sections.findIndex(
              (section) => section.id === sectionId
            );

            const duplicatedSection: Section = {
              ...sectionToDuplicate,
              id: `section-${Date.now()}`,
              elements: sectionToDuplicate.elements.map(element => ({
                ...element,
                id: `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
              }))
            };

            const newSections = [...page.sections];
            newSections.splice(sectionIndex + 1, 0, duplicatedSection);

            return {
              ...page,
              sections: newSections
            };
          }
        }
        return page;
      })
    );
  };

  const moveSectionUp = (pageId: string, sectionId: string) => {
    setPages((prevPages) =>
      prevPages.map((page) => {
        if (page.id === pageId) {
          const sectionIndex = page.sections.findIndex(
            (section) => section.id === sectionId
          );

          if (sectionIndex > 0) {
            const newSections = [...page.sections];
            const temp = newSections[sectionIndex - 1];
            newSections[sectionIndex - 1] = newSections[sectionIndex];
            newSections[sectionIndex] = temp;

            return {
              ...page,
              sections: newSections
            };
          }
        }
        return page;
      })
    );
  };

  const moveSectionDown = (pageId: string, sectionId: string) => {
    setPages((prevPages) =>
      prevPages.map((page) => {
        if (page.id === pageId) {
          const sectionIndex = page.sections.findIndex(
            (section) => section.id === sectionId
          );

          if (sectionIndex < page.sections.length - 1) {
            const newSections = [...page.sections];
            const temp = newSections[sectionIndex + 1];
            newSections[sectionIndex + 1] = newSections[sectionIndex];
            newSections[sectionIndex] = temp;

            return {
              ...page,
              sections: newSections
            };
          }
        }
        return page;
      })
    );
  };

  return {
    addSection,
    updateSection,
    removeSection,
    duplicateSection,
    moveSectionUp,
    moveSectionDown
  };
};
