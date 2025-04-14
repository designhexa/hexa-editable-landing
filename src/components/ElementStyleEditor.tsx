
import React from 'react';
import { PageElement } from '@/types/editor';
import { useEditor } from '@/context/EditorContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Image, Palette, GalleryVerticalEnd } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ElementStyleEditorProps {
  element: PageElement;
  pageId: string;
  sectionId: string;
}

export const ElementStyleEditor: React.FC<ElementStyleEditorProps> = ({
  element,
  pageId,
  sectionId
}) => {
  const { updateElement } = useEditor();
  const [activeTab, setActiveTab] = React.useState<'background' | 'size'>('background');

  // Get current background settings from element
  const getCurrentBackground = () => {
    const className = element.properties?.className || '';
    
    if (className.includes('bg-gradient-to-')) {
      return 'gradient';
    } else if (className.includes('bg-[url(')) {
      return 'image';
    } else {
      return 'color';
    }
  };
  
  const getCurrentBackgroundColor = () => {
    const className = element.properties?.className || '';
    const match = className.match(/bg-([a-z]+-[0-9]+|[a-z]+)/);
    return match ? match[0] : '';
  };
  
  const getCurrentBackgroundImage = () => {
    const className = element.properties?.className || '';
    const match = className.match(/bg-\[url\(['"](.+)['"]\)\]/);
    return match ? match[1] : '';
  };
  
  const getCurrentGradient = () => {
    const className = element.properties?.className || '';
    const match = className.match(/bg-gradient-to-([a-z]+)/);
    return match ? `bg-gradient-to-${match[1]}` : 'bg-gradient-to-r';
  };
  
  const getCurrentWidth = () => {
    const className = element.properties?.className || '';
    const match = className.match(/w-([0-9]+\/[0-9]+|full|auto|screen|[0-9]+)/);
    return match ? match[0] : 'w-full';
  };
  
  const getCurrentHeight = () => {
    const className = element.properties?.className || '';
    const match = className.match(/h-([0-9]+\/[0-9]+|full|auto|screen|[0-9]+)/);
    return match ? match[0] : '';
  };

  // Update background color
  const updateBackgroundColor = (color: string) => {
    const currentClassName = element.properties?.className || '';
    // Remove existing background color classes
    const cleanedClassName = currentClassName.replace(/bg-[a-z]+-[0-9]+|bg-[a-z]+(?!\[)/g, '').trim();
    
    // Add new background color
    const newClassName = `${cleanedClassName} ${color}`.trim();
    
    updateElement(pageId, sectionId, element.id, {
      properties: {
        ...element.properties,
        className: newClassName
      }
    });
  };
  
  // Update background image
  const updateBackgroundImage = (imageUrl: string) => {
    const currentClassName = element.properties?.className || '';
    // Remove existing background image and background color classes
    const cleanedClassName = currentClassName
      .replace(/bg-\[url\([^\)]+\)\]|bg-[a-z]+-[0-9]+|bg-[a-z]+(?!\[)/g, '')
      .replace(/bg-gradient-to-[a-z]+ from-[a-z]+-[0-9]+ to-[a-z]+-[0-9]+/g, '')
      .trim();
    
    // Add background image
    const newClassName = `${cleanedClassName} bg-[url('${imageUrl}')] bg-cover bg-center`.trim();
    
    updateElement(pageId, sectionId, element.id, {
      properties: {
        ...element.properties,
        className: newClassName
      }
    });
  };
  
  // Update gradient
  const updateGradient = (gradientDirection: string, fromColor: string, toColor: string) => {
    const currentClassName = element.properties?.className || '';
    // Remove existing background classes
    const cleanedClassName = currentClassName
      .replace(/bg-\[url\([^\)]+\)\]|bg-[a-z]+-[0-9]+|bg-[a-z]+(?!\[)/g, '')
      .replace(/bg-gradient-to-[a-z]+ from-[a-z]+-[0-9]+ to-[a-z]+-[0-9]+/g, '')
      .trim();
    
    // Add gradient
    const newClassName = `${cleanedClassName} ${gradientDirection} ${fromColor} ${toColor}`.trim();
    
    updateElement(pageId, sectionId, element.id, {
      properties: {
        ...element.properties,
        className: newClassName
      }
    });
  };
  
  // Update element size
  const updateElementSize = (type: 'width' | 'height', value: string) => {
    const currentClassName = element.properties?.className || '';
    const regex = type === 'width' ? /w-([0-9]+\/[0-9]+|full|auto|screen|[0-9]+)/g : /h-([0-9]+\/[0-9]+|full|auto|screen|[0-9]+)/g;
    
    // Remove existing size classes
    const cleanedClassName = currentClassName.replace(regex, '').trim();
    
    // Add new size
    const newClassName = `${cleanedClassName} ${value}`.trim();
    
    updateElement(pageId, sectionId, element.id, {
      properties: {
        ...element.properties,
        className: newClassName
      }
    });
  };

  return (
    <div className="space-y-4">
      <Tabs defaultValue="background" className="w-full">
        <TabsList className="grid grid-cols-2 mb-2">
          <TabsTrigger 
            value="background" 
            onClick={() => setActiveTab('background')}
            className="flex items-center gap-1"
          >
            <Palette size={14} />
            Background
          </TabsTrigger>
          <TabsTrigger 
            value="size" 
            onClick={() => setActiveTab('size')}
            className="flex items-center gap-1"
          >
            <GalleryVerticalEnd size={14} />
            Size
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="background" className="space-y-4">
          <div className="space-y-2">
            <Tabs defaultValue="color">
              <TabsList className="grid grid-cols-3 mb-2">
                <TabsTrigger value="color">Color</TabsTrigger>
                <TabsTrigger value="gradient">Gradient</TabsTrigger>
                <TabsTrigger value="image">Image</TabsTrigger>
              </TabsList>
              
              <TabsContent value="color" className="space-y-3">
                <div className="grid grid-cols-5 gap-2">
                  <button onClick={() => updateBackgroundColor('bg-white')} className="w-6 h-6 bg-white border rounded-full" />
                  <button onClick={() => updateBackgroundColor('bg-black')} className="w-6 h-6 bg-black rounded-full" />
                  <button onClick={() => updateBackgroundColor('bg-gray-100')} className="w-6 h-6 bg-gray-100 rounded-full" />
                  <button onClick={() => updateBackgroundColor('bg-gray-200')} className="w-6 h-6 bg-gray-200 rounded-full" />
                  <button onClick={() => updateBackgroundColor('bg-gray-300')} className="w-6 h-6 bg-gray-300 rounded-full" />
                  
                  <button onClick={() => updateBackgroundColor('bg-blue-100')} className="w-6 h-6 bg-blue-100 rounded-full" />
                  <button onClick={() => updateBackgroundColor('bg-blue-200')} className="w-6 h-6 bg-blue-200 rounded-full" />
                  <button onClick={() => updateBackgroundColor('bg-blue-300')} className="w-6 h-6 bg-blue-300 rounded-full" />
                  <button onClick={() => updateBackgroundColor('bg-blue-400')} className="w-6 h-6 bg-blue-400 rounded-full" />
                  <button onClick={() => updateBackgroundColor('bg-blue-500')} className="w-6 h-6 bg-blue-500 rounded-full" />
                  
                  <button onClick={() => updateBackgroundColor('bg-red-100')} className="w-6 h-6 bg-red-100 rounded-full" />
                  <button onClick={() => updateBackgroundColor('bg-red-200')} className="w-6 h-6 bg-red-200 rounded-full" />
                  <button onClick={() => updateBackgroundColor('bg-red-300')} className="w-6 h-6 bg-red-300 rounded-full" />
                  <button onClick={() => updateBackgroundColor('bg-red-400')} className="w-6 h-6 bg-red-400 rounded-full" />
                  <button onClick={() => updateBackgroundColor('bg-red-500')} className="w-6 h-6 bg-red-500 rounded-full" />
                  
                  <button onClick={() => updateBackgroundColor('bg-green-100')} className="w-6 h-6 bg-green-100 rounded-full" />
                  <button onClick={() => updateBackgroundColor('bg-green-200')} className="w-6 h-6 bg-green-200 rounded-full" />
                  <button onClick={() => updateBackgroundColor('bg-green-300')} className="w-6 h-6 bg-green-300 rounded-full" />
                  <button onClick={() => updateBackgroundColor('bg-green-400')} className="w-6 h-6 bg-green-400 rounded-full" />
                  <button onClick={() => updateBackgroundColor('bg-green-500')} className="w-6 h-6 bg-green-500 rounded-full" />
                </div>
              </TabsContent>
              
              <TabsContent value="gradient" className="space-y-3">
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Direction</label>
                  <div className="grid grid-cols-4 gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => updateGradient('bg-gradient-to-r', 'from-blue-400', 'to-purple-500')}
                      className="h-8"
                    >
                      Right
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => updateGradient('bg-gradient-to-l', 'from-blue-400', 'to-purple-500')}
                      className="h-8"
                    >
                      Left
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => updateGradient('bg-gradient-to-t', 'from-blue-400', 'to-purple-500')}
                      className="h-8"
                    >
                      Top
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => updateGradient('bg-gradient-to-b', 'from-blue-400', 'to-purple-500')}
                      className="h-8"
                    >
                      Bottom
                    </Button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Presets</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={() => updateGradient('bg-gradient-to-r', 'from-blue-400', 'to-purple-500')}
                      className="h-10 rounded bg-gradient-to-r from-blue-400 to-purple-500"
                    />
                    <button 
                      onClick={() => updateGradient('bg-gradient-to-r', 'from-green-400', 'to-blue-500')}
                      className="h-10 rounded bg-gradient-to-r from-green-400 to-blue-500"
                    />
                    <button 
                      onClick={() => updateGradient('bg-gradient-to-r', 'from-yellow-400', 'to-orange-500')}
                      className="h-10 rounded bg-gradient-to-r from-yellow-400 to-orange-500"
                    />
                    <button 
                      onClick={() => updateGradient('bg-gradient-to-r', 'from-pink-400', 'to-red-500')}
                      className="h-10 rounded bg-gradient-to-r from-pink-400 to-red-500"
                    />
                    <button 
                      onClick={() => updateGradient('bg-gradient-to-t', 'from-gray-200', 'to-gray-50')}
                      className="h-10 rounded bg-gradient-to-t from-gray-200 to-gray-50"
                    />
                    <button 
                      onClick={() => updateGradient('bg-gradient-to-tr', 'from-indigo-500', 'to-pink-500')}
                      className="h-10 rounded bg-gradient-to-tr from-indigo-500 to-pink-500"
                    />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="image" className="space-y-3">
                <div className="space-y-2">
                  <label className="block text-sm text-gray-500 mb-1">Image URL</label>
                  <div className="flex gap-2">
                    <Input 
                      type="text" 
                      placeholder="https://example.com/image.jpg" 
                      className="text-xs"
                      onChange={(e) => {
                        if (e.target.value) {
                          updateBackgroundImage(e.target.value);
                        }
                      }}
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    Enter a URL to an image or choose from below
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => updateBackgroundImage('https://images.unsplash.com/photo-1482938289607-e9573fc25ebb')}
                    className="h-12 bg-cover bg-center rounded bg-[url('https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?w=150')]"
                  />
                  <button 
                    onClick={() => updateBackgroundImage('https://images.unsplash.com/photo-1500375592092-40eb2168fd21')}
                    className="h-12 bg-cover bg-center rounded bg-[url('https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=150')]"
                  />
                  <button 
                    onClick={() => updateBackgroundImage('https://images.unsplash.com/photo-1426604966848-d7adac402bff')}
                    className="h-12 bg-cover bg-center rounded bg-[url('https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=150')]"
                  />
                  <button 
                    onClick={() => updateBackgroundImage('https://images.unsplash.com/photo-1506744038136-46273834b3fb')}
                    className="h-12 bg-cover bg-center rounded bg-[url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=150')]"
                  />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </TabsContent>
        
        <TabsContent value="size" className="space-y-4">
          <div>
            <label className="block text-sm text-gray-500 mb-1">Width</label>
            <div className="grid grid-cols-3 gap-2">
              <Button 
                variant={getCurrentWidth() === 'w-full' ? 'default' : 'outline'} 
                size="sm" 
                onClick={() => updateElementSize('width', 'w-full')}
                className="h-8"
              >
                Full
              </Button>
              <Button 
                variant={getCurrentWidth() === 'w-auto' ? 'default' : 'outline'} 
                size="sm" 
                onClick={() => updateElementSize('width', 'w-auto')}
                className="h-8"
              >
                Auto
              </Button>
              <Button 
                variant={getCurrentWidth() === 'w-screen' ? 'default' : 'outline'} 
                size="sm" 
                onClick={() => updateElementSize('width', 'w-screen')}
                className="h-8"
              >
                Screen
              </Button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm text-gray-500 mb-1">Percentage Width</label>
            <div className="grid grid-cols-4 gap-2">
              <Button 
                variant={getCurrentWidth() === 'w-1/4' ? 'default' : 'outline'} 
                size="sm" 
                onClick={() => updateElementSize('width', 'w-1/4')}
                className="h-8"
              >
                25%
              </Button>
              <Button 
                variant={getCurrentWidth() === 'w-1/3' ? 'default' : 'outline'} 
                size="sm" 
                onClick={() => updateElementSize('width', 'w-1/3')}
                className="h-8"
              >
                33%
              </Button>
              <Button 
                variant={getCurrentWidth() === 'w-1/2' ? 'default' : 'outline'} 
                size="sm" 
                onClick={() => updateElementSize('width', 'w-1/2')}
                className="h-8"
              >
                50%
              </Button>
              <Button 
                variant={getCurrentWidth() === 'w-2/3' ? 'default' : 'outline'} 
                size="sm" 
                onClick={() => updateElementSize('width', 'w-2/3')}
                className="h-8"
              >
                66%
              </Button>
              <Button 
                variant={getCurrentWidth() === 'w-3/4' ? 'default' : 'outline'} 
                size="sm" 
                onClick={() => updateElementSize('width', 'w-3/4')}
                className="h-8"
              >
                75%
              </Button>
              <Button 
                variant={getCurrentWidth() === 'w-4/5' ? 'default' : 'outline'} 
                size="sm" 
                onClick={() => updateElementSize('width', 'w-4/5')}
                className="h-8"
              >
                80%
              </Button>
              <Button 
                variant={getCurrentWidth() === 'w-11/12' ? 'default' : 'outline'} 
                size="sm" 
                onClick={() => updateElementSize('width', 'w-11/12')}
                className="h-8"
              >
                92%
              </Button>
              <Button 
                variant={getCurrentWidth() === 'w-full' ? 'default' : 'outline'} 
                size="sm" 
                onClick={() => updateElementSize('width', 'w-full')}
                className="h-8"
              >
                100%
              </Button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm text-gray-500 mb-1">Height</label>
            <div className="grid grid-cols-3 gap-2">
              <Button 
                variant={getCurrentHeight() === 'h-auto' ? 'default' : 'outline'} 
                size="sm" 
                onClick={() => updateElementSize('height', 'h-auto')}
                className="h-8"
              >
                Auto
              </Button>
              <Button 
                variant={getCurrentHeight() === 'h-full' ? 'default' : 'outline'} 
                size="sm" 
                onClick={() => updateElementSize('height', 'h-full')}
                className="h-8"
              >
                Full
              </Button>
              <Button 
                variant={getCurrentHeight() === 'h-screen' ? 'default' : 'outline'} 
                size="sm" 
                onClick={() => updateElementSize('height', 'h-screen')}
                className="h-8"
              >
                Screen
              </Button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm text-gray-500 mb-1">Fixed Height</label>
            <div className="grid grid-cols-4 gap-2">
              <Button 
                variant={getCurrentHeight() === 'h-20' ? 'default' : 'outline'} 
                size="sm" 
                onClick={() => updateElementSize('height', 'h-20')}
                className="h-8"
              >
                80px
              </Button>
              <Button 
                variant={getCurrentHeight() === 'h-28' ? 'default' : 'outline'} 
                size="sm" 
                onClick={() => updateElementSize('height', 'h-28')}
                className="h-8"
              >
                112px
              </Button>
              <Button 
                variant={getCurrentHeight() === 'h-40' ? 'default' : 'outline'} 
                size="sm" 
                onClick={() => updateElementSize('height', 'h-40')}
                className="h-8"
              >
                160px
              </Button>
              <Button 
                variant={getCurrentHeight() === 'h-64' ? 'default' : 'outline'} 
                size="sm" 
                onClick={() => updateElementSize('height', 'h-64')}
                className="h-8"
              >
                256px
              </Button>
              <Button 
                variant={getCurrentHeight() === 'h-80' ? 'default' : 'outline'} 
                size="sm" 
                onClick={() => updateElementSize('height', 'h-80')}
                className="h-8"
              >
                320px
              </Button>
              <Button 
                variant={getCurrentHeight() === 'h-96' ? 'default' : 'outline'} 
                size="sm" 
                onClick={() => updateElementSize('height', 'h-96')}
                className="h-8"
              >
                384px
              </Button>
              <Button 
                variant={getCurrentHeight() === 'h-[30rem]' ? 'default' : 'outline'} 
                size="sm" 
                onClick={() => updateElementSize('height', 'h-[30rem]')}
                className="h-8"
              >
                480px
              </Button>
              <Button 
                variant={getCurrentHeight() === 'h-[40rem]' ? 'default' : 'outline'} 
                size="sm" 
                onClick={() => updateElementSize('height', 'h-[40rem]')}
                className="h-8"
              >
                640px
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
