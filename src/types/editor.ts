
// Type definitions for the editor
export type ElementType = 'heading' | 'text' | 'image' | 'button' | 'section' | 'milestone';
export type UserRole = 'viewer' | 'editor' | 'admin';
export type SectionType = 'content' | 'header' | 'footer';
export type LayoutType = 'fullwidth' | 'boxed';

export interface MenuItem {
  id: string;
  title: string;
  url: string;
  order: number;
}

export interface PageElement {
  id: string;
  type: ElementType;
  content: string;
  properties?: Record<string, any>;
  gridPosition?: {
    column: string;
    row: string;
    columnSpan: string;
    rowSpan: string;
  };
  textStyle?: {
    fontFamily: string;
    fontSize: string;
    lineHeight: string;
    letterSpacing: string;
    textAlign: string;
  };
}

export interface Section {
  id: string;
  elements: PageElement[];
  properties?: {
    backgroundColor?: string;
    paddingY?: string;
    paddingX?: string;
    height?: string;
    isGridLayout?: string;
    gridColumns?: string;
    gridRows?: string;
    gridGap?: string;
    gridType?: string;
    isDraggableGrid?: string;
    backgroundImage?: string;
    backgroundSize?: string;
    backgroundPosition?: string;
    backgroundBlendMode?: string;
    backgroundOverlay?: string;
  };
  type?: SectionType;
}

export interface Page {
  id: string;
  title: string;
  slug: string;
  sections: Section[];
  isPublished: boolean;
  publishedAt?: string;
  layout?: LayoutType;
}
