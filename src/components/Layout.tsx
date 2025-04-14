
import React from 'react';
import { useEditor } from '@/context/EditorContext';
import EditorSidebar from './EditorSidebar';
import Navbar from './Navbar';
import MobileEditorTrigger from './MobileEditorTrigger';
import { SidebarProvider } from './ui/sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isEditMode } = useEditor();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <div className="flex flex-col flex-grow">
          <Navbar />
          <main className="flex-grow relative">
            {children}
          </main>
        </div>
        {isEditMode && (
          <div className="fixed right-0 top-0 h-full">
            <EditorSidebar />
          </div>
        )}
        <MobileEditorTrigger />
      </div>
    </SidebarProvider>
  );
};

export default Layout;
