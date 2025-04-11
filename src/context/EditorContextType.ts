
import { Page, Section, PageElement, UserRole, MenuItem } from '@/types/editor';

export interface EditorContextType {
  pages: Page[];
  currentPageId: string;
  isEditMode: boolean;
  selectedElementId: string | null;
  userRole: UserRole;
  navigation: MenuItem[];
  currentPage?: Page | null;
  addPage: (page: Page) => void;
  removePage: (pageId: string, newPageId: string) => void;
  setCurrentPageId: (id: string) => void;
  updatePage: (pageId: string, updatedPage: Partial<Page>) => void;
  toggleEditMode: () => void;
  setEditMode: (value: boolean) => void;
  addSection: (pageId: string, section: Section) => void;
  updateSection: (pageId: string, sectionId: string, section: Partial<Section>) => void;
  removeSection: (pageId: string, sectionId: string) => void;
  addElement: (pageId: string, sectionId: string, element: PageElement) => void;
  updateElement: (pageId: string, sectionId: string, elementId: string, element: Partial<PageElement>) => void;
  removeElement: (pageId: string, sectionId: string, elementId: string) => void;
  selectElement: (elementId: string | null) => void;
  duplicateSection: (pageId: string, sectionId: string) => void;
  moveSectionUp: (pageId: string, sectionId: string) => void;
  moveSectionDown: (pageId: string, sectionId: string) => void;
  getSelectedElement: () => { pageId: string, sectionId: string, element: PageElement } | null;
  setUserRole: (role: UserRole) => void;
  publishPage: (pageId: string) => void;
  unpublishPage: (pageId: string) => void;
  replaceHeaderSection: (pageId: string, newHeaderSection: Section) => void;
  replaceFooterSection: (pageId: string, newFooterSection: Section) => void;
  updateNavigation: (items: MenuItem[]) => void;
  saveEditorChanges: () => Promise<void>;
  publishChanges: () => void;
}
