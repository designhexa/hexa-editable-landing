
import React from 'react';
import PageRenderer from '@/components/PageRenderer';
import { useEditor } from '@/context/EditorContext';

const Index: React.FC = () => {
  const { currentPage } = useEditor();
  const layout = currentPage?.layout || 'fullwidth';
  
  return (
    <div className="w-full">
      <PageRenderer layout={layout} />
    </div>
  );
};

export default Index;
