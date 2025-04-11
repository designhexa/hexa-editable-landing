
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useEditor } from '@/context/EditorContext';
import { Eye, EyeOff, Save, LogOut, Menu } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from '@/components/ui/separator';

const Navbar = () => {
  const { isAuthenticated, currentUser, logout } = useAuth();
  const { 
    isEditMode, 
    setEditMode, 
    pages, 
    currentPage, 
    setCurrentPageId,
    saveEditorChanges,
    publishChanges 
  } = useEditor();
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleToggleEditMode = () => {
    if (isEditMode) {
      // First save changes
      saveEditorChanges().then(() => {
        setEditMode(false);
      });
    } else {
      setEditMode(true);
    }
  };

  const handlePublish = () => {
    publishChanges();
  };

  return (
    <nav className="sticky top-0 z-40 w-full bg-white shadow-sm">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="text-xl font-bold">
            Page Builder
          </Link>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Menu className="mr-2 h-4 w-4" />
                Pages
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {pages.map((page) => (
                <DropdownMenuItem
                  key={page.id}
                  className={currentPage?.id === page.id ? "bg-accent" : ""}
                  onClick={() => setCurrentPageId(page.id)}
                >
                  {page.title}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              {currentUser && (
                <span className="text-sm font-medium mr-2">
                  {currentUser.username} ({currentUser.role})
                </span>
              )}
              
              {isEditMode ? (
                <Button onClick={handlePublish} variant="outline" size="sm">
                  <Save className="mr-2 h-4 w-4" />
                  Publish
                </Button>
              ) : null}
              
              <Button
                onClick={handleToggleEditMode}
                variant={isEditMode ? "default" : "outline"}
                size="sm"
              >
                {isEditMode ? (
                  <>
                    <EyeOff className="mr-2 h-4 w-4" />
                    View Mode
                  </>
                ) : (
                  <>
                    <Eye className="mr-2 h-4 w-4" />
                    Edit Mode
                  </>
                )}
              </Button>
              
              <Separator orientation="vertical" className="h-6" />
              
              <Button onClick={logout} variant="ghost" size="sm">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </>
          ) : (
            <Button onClick={handleLoginClick} size="sm">
              Login
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
