
import React, { useEffect } from 'react';
import { useEditor } from '@/context/EditorContext';
import EditorSidebar from './EditorSidebar';
import Navbar from './Navbar';
import MobileEditorTrigger from './MobileEditorTrigger';
import { SidebarProvider } from './ui/sidebar';
import { useAuth } from '@/context/AuthContext';
import EditModeToggle from './EditModeToggle';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isEditMode, setEditMode } = useEditor();
  const { isAuthenticated } = useAuth();

  // Reset edit mode to false when user is not authenticated
  useEffect(() => {
    if (!isAuthenticated && isEditMode) {
      setEditMode(false);
    }
  }, [isAuthenticated, isEditMode, setEditMode]);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <div className="flex flex-col flex-grow w-full">
          <Navbar />
          <main className="flex-grow w-full">
            {children}
          </main>
        </div>
        {/* Ensure the editor sidebar is visible when isEditMode is true */}
        {isEditMode && isAuthenticated && (
          <EditorSidebar />
        )}
        <EditModeToggle />
        {isAuthenticated && <MobileEditorTrigger />}
      </div>
    </SidebarProvider>
  );
};

export default Layout;
