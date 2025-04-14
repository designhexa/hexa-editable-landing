
import React from 'react';
import { useEditor } from '@/context/EditorContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';

const EditModeToggle: React.FC = () => {
  const { isEditMode, setEditMode, userRole } = useEditor();
  const { isAuthenticated } = useAuth();

  // Only show for authenticated users with editor or admin roles
  if (!isAuthenticated || (userRole !== 'admin' && userRole !== 'editor')) {
    return null;
  }

  const handleToggleEditMode = () => {
    setEditMode(!isEditMode);
  };

  return (
    <div className="fixed bottom-4 right-4 z-40">
      <Button
        onClick={handleToggleEditMode}
        variant={isEditMode ? "default" : "outline"}
        size="sm"
        className={isEditMode ? 
          "bg-blue-600 hover:bg-blue-700 text-white" : 
          "bg-white border-blue-600 text-blue-600 hover:bg-blue-50"
        }
      >
        {isEditMode ? (
          <>
            <EyeOff className="mr-2 h-4 w-4" />
            Exit Editor
          </>
        ) : (
          <>
            <Eye className="mr-2 h-4 w-4" />
            Edit Mode
          </>
        )}
      </Button>
    </div>
  );
};

export default EditModeToggle;
