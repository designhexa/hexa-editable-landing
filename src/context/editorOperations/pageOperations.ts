
import { Page, Section } from '@/types/editor';

export const pageOperations = (
  pages: Page[],
  setPages: React.Dispatch<React.SetStateAction<Page[]>>,
  setSelectedElementId: React.Dispatch<React.SetStateAction<string | null>>
) => {
  const addPage = (page: Page) => {
    setPages((prevPages) => [...prevPages, page]);
  };

  const removePage = (pageId: string, newPageId: string) => {
    setPages((prevPages) => prevPages.filter(page => page.id !== pageId));
    return newPageId;
  };

  const updatePage = (pageId: string, updatedPage: Partial<Page>) => {
    setPages((prevPages) =>
      prevPages.map((page) =>
        page.id === pageId ? { ...page, ...updatedPage } : page
      )
    );
  };

  const publishPage = (pageId: string) => {
    setPages((prevPages) =>
      prevPages.map((page) =>
        page.id === pageId
          ? { ...page, isPublished: true, publishedAt: new Date().toISOString() }
          : page
      )
    );
  };

  const unpublishPage = (pageId: string) => {
    setPages((prevPages) =>
      prevPages.map((page) =>
        page.id === pageId ? { ...page, isPublished: false } : page
      )
    );
  };

  const replaceHeaderSection = (pageId: string, newHeaderSection: Section) => {
    setPages((prevPages) =>
      prevPages.map((page) => {
        if (page.id === pageId) {
          const headerIndex = page.sections.findIndex(section => section.type === 'header');
          const updatedSections = [...page.sections];
          
          const sectionWithType: Section = { 
            ...newHeaderSection, 
            type: 'header'
          };
          
          if (headerIndex >= 0) {
            updatedSections[headerIndex] = sectionWithType;
          } else {
            updatedSections.unshift(sectionWithType);
          }
          
          return {
            ...page,
            sections: updatedSections
          };
        }
        return page;
      })
    );
  };

  const replaceFooterSection = (pageId: string, newFooterSection: Section) => {
    setPages((prevPages) =>
      prevPages.map((page) => {
        if (page.id === pageId) {
          const footerIndex = page.sections.findIndex(section => section.type === 'footer');
          const updatedSections = [...page.sections];
          
          const sectionWithType: Section = { 
            ...newFooterSection, 
            type: 'footer'
          };
          
          if (footerIndex >= 0) {
            updatedSections[footerIndex] = sectionWithType;
          } else {
            updatedSections.push(sectionWithType);
          }
          
          return {
            ...page,
            sections: updatedSections
          };
        }
        return page;
      })
    );
  };

  return {
    addPage,
    removePage,
    updatePage,
    publishPage,
    unpublishPage,
    replaceHeaderSection,
    replaceFooterSection
  };
};
