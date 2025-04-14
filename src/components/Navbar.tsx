
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useEditor } from '@/context/EditorContext';
import { LogOut } from 'lucide-react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

const Navbar = () => {
  const { isAuthenticated, currentUser, logout } = useAuth();
  const { navigation, isEditMode } = useEditor();
  
  const logoText = localStorage.getItem('websiteBuilder_logoText') || 'Page Builder';
  const logoImage = localStorage.getItem('websiteBuilder_logoImage') || null;

  return (
    <nav className="sticky top-0 z-40 w-full bg-white shadow-sm">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2">
            {logoImage ? (
              <img src={logoImage} alt="Logo" className="h-8 w-auto" />
            ) : (
              <span className="text-xl font-bold">{logoText}</span>
            )}
          </Link>
          
          <NavigationMenu>
            <NavigationMenuList>
              {navigation.map((item) => (
                <NavigationMenuItem key={item.id}>
                  <Link to={item.url}>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      {item.title}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              {currentUser && !isEditMode && (
                <span className="text-sm font-medium mr-2">
                  {currentUser.username} ({currentUser.role})
                </span>
              )}
              
              {!isEditMode && (
                <Button onClick={logout} variant="ghost" size="sm">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              )}
            </>
          ) : (
            <Button asChild size="sm">
              <Link to="/login">Login</Link>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
