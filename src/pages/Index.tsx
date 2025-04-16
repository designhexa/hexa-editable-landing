
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

  // Update URL when current page changes
  useEffect(() => {
    if (currentPageId) {
      const currentPage = pages.find(page => page.id === currentPageId);
      if (currentPage && location.pathname !== currentPage.slug) {
        navigate(currentPage.slug);
      }
    }
  }, [currentPageId, pages, navigate, location.pathname]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className={isEditMode ? 'mr-72' : ''}>
        <PageRenderer />
      </main>
      <EditorSidebar />
    </div>
  );
};

export default Index;
