
import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import PageRenderer from '@/components/PageRenderer';
import EditorSidebar from '@/components/EditorSidebar';
import { useEditor } from '@/context/EditorContext';
import { useToast } from '@/hooks/use-toast';
import { useLocation, useNavigate } from 'react-router-dom';

const Index = () => {
  const { isEditMode, saveEditorChanges, pages, setCurrentPageId, currentPageId } = useEditor();
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Set current page based on URL path (slug)
  useEffect(() => {
    const currentPath = location.pathname;
    const matchingPage = pages.find(page => page.slug === currentPath);
    
    if (matchingPage) {
      setCurrentPageId(matchingPage.id);
    } else if (currentPath === '/') {
      const homePage = pages.find(page => page.slug === '/');
      if (homePage) {
        setCurrentPageId(homePage.id);
      }
    }
  }, [location.pathname, pages, setCurrentPageId]);

  // Update URL when current page changes, using replace instead of push to prevent blinking
  useEffect(() => {
    if (currentPageId) {
      const currentPage = pages.find(page => page.id === currentPageId);
      if (currentPage && location.pathname !== currentPage.slug) {
        navigate(currentPage.slug, { replace: true });
      }
    }
  }, [currentPageId, pages, navigate, location.pathname]);

  return (
    <div className={`min-h-screen bg-gray-50 flex ${isEditMode ? 'pr-4' : ''}`}>
      <div className={`flex flex-col w-full transition-all duration-300 ease-in-out ${isEditMode ? 'pr-64' : ''}`}>
        <Navbar />
        <PageRenderer />
      </div>
      {isEditMode && <EditorSidebar />}
    </div>
  );
};

export default Index;

