
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useEditor } from '@/context/EditorContext';
import { LogOut, Upload, Edit, Image as ImageIcon } from 'lucide-react';
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
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const Navbar = () => {
  const { isAuthenticated, currentUser, logout } = useAuth();
  const { navigation, isEditMode } = useEditor();
  
  const [logoText, setLogoText] = useState(localStorage.getItem('websiteBuilder_logoText') || 'Page Builder');
  const [logoImage, setLogoImage] = useState(localStorage.getItem('websiteBuilder_logoImage') || null);
  const [isEditingIdentity, setIsEditingIdentity] = useState(false);

  // Handle logo text change
  const handleLogoTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLogoText = e.target.value;
    setLogoText(newLogoText);
    localStorage.setItem('websiteBuilder_logoText', newLogoText);
  };

  // Handle logo image upload
  const handleLogoImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setLogoImage(base64String);
        localStorage.setItem('websiteBuilder_logoImage', base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle logo image removal
  const handleRemoveLogo = () => {
    setLogoImage(null);
    localStorage.removeItem('websiteBuilder_logoImage');
  };

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
            
            {isAuthenticated && isEditMode && (
              <Popover open={isEditingIdentity} onOpenChange={setIsEditingIdentity}>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="sm" className="ml-2 h-7 w-7 p-0">
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Edit Website Identity</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="space-y-4">
                    <h4 className="font-medium leading-none">Website Identity</h4>
                    <Separator />
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Logo Text</label>
                      <Input 
                        value={logoText} 
                        onChange={handleLogoTextChange}
                        className="col-span-2 h-8"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Logo Image</label>
                      <div className="flex flex-col gap-2">
                        {logoImage && (
                          <div className="relative w-full h-20 bg-gray-100 rounded flex items-center justify-center">
                            <img src={logoImage} alt="Logo" className="max-h-16 max-w-full" />
                            <Button 
                              variant="destructive" 
                              size="sm" 
                              className="absolute top-1 right-1 h-6 w-6 p-0"
                              onClick={handleRemoveLogo}
                            >
                              ✕
                            </Button>
                          </div>
                        )}
                        <div className="flex items-center">
                          <Button asChild variant="outline" size="sm">
                            <label className="cursor-pointer">
                              <Upload className="mr-2 h-4 w-4" />
                              Upload Logo
                              <input 
                                type="file" 
                                accept="image/*" 
                                onChange={handleLogoImageUpload} 
                                className="hidden"
                              />
                            </label>
                          </Button>
                          <span className="text-xs text-gray-500 ml-2">Recommended size: 40x40px</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
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
