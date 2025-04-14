
import React from 'react';
import { useEditor } from '@/context/EditorContext';
import EditableSection from './EditableSection';
import { Trash2, Layout as LayoutIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface PageRendererProps {
  layout?: 'fullwidth' | 'boxed';
}

const PageRenderer: React.FC<PageRendererProps> = ({ layout = 'fullwidth' }) => {
  const { pages, currentPageId, updatePage, isEditMode, userRole, removePage } = useEditor();
  const { toast } = useToast();
  
  const currentPage = pages.find(page => page.id === currentPageId);
  const canEdit = userRole === 'admin' || userRole === 'editor';
  const isAdmin = userRole === 'admin';
  
  if (!currentPage) {
    return <div className="p-8 text-center text-red-500">Page not found</div>;
  }

  const footerSection = currentPage.sections.find(section => section.type === 'footer');
  const contentSections = currentPage.sections.filter(
    section => (section.type === 'content' || !section.type)
  );
  
  const handlePageTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updatePage(currentPageId, { title: e.target.value });
  };
  
  const handlePageSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updatePage(currentPageId, { slug: e.target.value });
  };

  const handleLayoutChange = (value: 'fullwidth' | 'boxed') => {
    updatePage(currentPageId, { layout: value });
  };
  
  const handleDeletePage = () => {
    if (pages.length <= 1) {
      toast({
        title: "Cannot Delete Page",
        description: "You must have at least one page in your site.",
        variant: "destructive",
      });
      return;
    }
    
    const otherPage = pages.find(page => page.id !== currentPageId);
    if (otherPage) {
      removePage(currentPageId, otherPage.id);
      toast({
        title: "Page Deleted",
        description: `The page "${currentPage.title}" has been deleted.`,
        variant: "default",
      });
    }
  };

  const contentContainerClasses = layout === 'boxed' 
    ? "container mx-auto px-4 max-w-7xl" 
    : "w-full";
  
  return (
    <div className="min-h-screen flex flex-col relative">
      {isEditMode && canEdit && (
        <div className="bg-gray-100 p-2 border-b border-gray-200">
          <div className="container mx-auto flex items-center flex-wrap gap-2">
            <div className="flex items-center">
              <span className="text-sm font-medium mr-2">Page Title:</span>
              <input
                type="text"
                value={currentPage.title}
                onChange={handlePageTitleChange}
                className="px-2 py-1 text-sm border rounded"
              />
            </div>
            
            <div className="flex items-center">
              <span className="text-sm font-medium mr-2">Slug:</span>
              <input
                type="text"
                value={currentPage.slug}
                onChange={handlePageSlugChange}
                className="px-2 py-1 text-sm border rounded"
              />
            </div>

            <div className="flex items-center ml-4">
              <span className="text-sm font-medium mr-2">Layout:</span>
              <Select
                value={currentPage.layout || 'fullwidth'}
                onValueChange={(value) => handleLayoutChange(value as 'fullwidth' | 'boxed')}
              >
                <SelectTrigger className="w-32 h-8 text-sm">
                  <SelectValue placeholder="Select layout" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fullwidth">Full Width</SelectItem>
                  <SelectItem value="boxed">Boxed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {isAdmin && (
              <button
                onClick={handleDeletePage}
                className="ml-auto flex items-center px-2 py-1 bg-red-50 text-red-600 rounded hover:bg-red-100 text-sm"
                title="Delete this page"
              >
                <Trash2 size={14} className="mr-1" />
                Delete Page
              </button>
            )}
          </div>
        </div>
      )}
      
      <div className="flex-grow">
        <div className={contentContainerClasses}>
          {contentSections.map((section) => (
            <EditableSection 
              key={section.id}
              section={section}
              pageId={currentPage.id}
            />
          ))}
        </div>
      </div>
      
      {footerSection && (
        <EditableSection 
          key={footerSection.id}
          section={footerSection}
          pageId={currentPage.id}
        />
      )}
    </div>
  );
};

export default PageRenderer;
