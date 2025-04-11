
import React, { useState } from 'react';
import { useEditor } from '@/context/EditorContext';
import { ElementType } from '@/context/EditorContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowUp, ArrowDown, Plus, Trash2, Type, Heading, Image, ExternalLink, SquareStack, MousePointer } from 'lucide-react';

const EditorSidebar = () => {
  const {
    isEditMode,
    selectedElementId,
    updateElementContent,
    updateElementAttributes,
    addElement,
    removeElement,
    moveElement,
    currentPage,
    addNewPage,
  } = useEditor();
  
  const [newPageTitle, setNewPageTitle] = useState('');
  const [newPageSlug, setNewPageSlug] = useState('');

  // Find the selected element
  const selectedElement = currentPage?.elements.find(
    (element) => element.id === selectedElementId
  ) || null;

  const handleContentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (selectedElementId) {
      updateElementContent(selectedElementId, e.target.value);
    }
  };

  const handleAttributeChange = (attributeName: string, value: string) => {
    if (selectedElementId) {
      updateElementAttributes(selectedElementId, { [attributeName]: value });
    }
  };

  const handleAddElement = (type: ElementType) => {
    addElement(type);
  };

  const handleRemoveElement = () => {
    if (selectedElementId) {
      removeElement(selectedElementId);
    }
  };

  const handleMoveElement = (direction: 'up' | 'down') => {
    if (selectedElementId) {
      moveElement(selectedElementId, direction);
    }
  };

  const handleAddPage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPageTitle && newPageSlug) {
      addNewPage(newPageTitle, newPageSlug);
      setNewPageTitle('');
      setNewPageSlug('');
    }
  };

  // Don't render the sidebar if not in edit mode
  if (!isEditMode) {
    return null;
  }

  return (
    <div className="fixed right-0 top-16 h-[calc(100vh-4rem)] w-72 bg-white border-l border-gray-200 overflow-y-auto shadow-lg">
      <div className="p-4">
        <Tabs defaultValue="elements">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="elements">Elements</TabsTrigger>
            <TabsTrigger value="selected">Selected</TabsTrigger>
            <TabsTrigger value="pages">Pages</TabsTrigger>
          </TabsList>
          
          {/* Elements Tab */}
          <TabsContent value="elements" className="space-y-4">
            <h3 className="font-semibold">Add Elements</h3>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleAddElement('heading')}
                className="justify-start"
              >
                <Heading className="mr-2 h-4 w-4" />
                Heading
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleAddElement('text')}
                className="justify-start"
              >
                <Type className="mr-2 h-4 w-4" />
                Text
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleAddElement('image')}
                className="justify-start"
              >
                <Image className="mr-2 h-4 w-4" />
                Image
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleAddElement('button')}
                className="justify-start"
              >
                <MousePointer className="mr-2 h-4 w-4" />
                Button
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleAddElement('link')}
                className="justify-start"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Link
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleAddElement('container')}
                className="justify-start"
              >
                <SquareStack className="mr-2 h-4 w-4" />
                Container
              </Button>
            </div>
          </TabsContent>
          
          {/* Selected Element Tab */}
          <TabsContent value="selected" className="space-y-4">
            {selectedElement ? (
              <>
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold capitalize">{selectedElement.type}</h3>
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleMoveElement('up')}
                    >
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleMoveElement('down')}
                    >
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={handleRemoveElement}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Content</label>
                    {selectedElement.type === 'text' ? (
                      <Textarea
                        value={selectedElement.content}
                        onChange={handleContentChange}
                        rows={4}
                      />
                    ) : (
                      <Input
                        value={selectedElement.content}
                        onChange={handleContentChange}
                      />
                    )}
                  </div>
                  
                  {/* Specific attributes for each element type */}
                  {selectedElement.type === 'heading' && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Heading Level</label>
                      <select
                        className="w-full border border-gray-300 rounded h-9 px-3"
                        value={selectedElement.attributes?.level || '2'}
                        onChange={(e) => handleAttributeChange('level', e.target.value)}
                      >
                        <option value="1">H1</option>
                        <option value="2">H2</option>
                        <option value="3">H3</option>
                        <option value="4">H4</option>
                        <option value="5">H5</option>
                        <option value="6">H6</option>
                      </select>
                    </div>
                  )}
                  
                  {(selectedElement.type === 'button' || selectedElement.type === 'link') && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">URL</label>
                      <Input
                        value={selectedElement.attributes?.href || ''}
                        onChange={(e) => handleAttributeChange('href', e.target.value)}
                        placeholder="https://example.com"
                      />
                    </div>
                  )}
                  
                  {selectedElement.type === 'image' && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Alt Text</label>
                      <Input
                        value={selectedElement.attributes?.alt || ''}
                        onChange={(e) => handleAttributeChange('alt', e.target.value)}
                        placeholder="Image description"
                      />
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">CSS Classes</label>
                    <Input
                      value={selectedElement.attributes?.className || ''}
                      onChange={(e) => handleAttributeChange('className', e.target.value)}
                      placeholder="e.g. text-lg font-bold"
                    />
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-6 text-gray-500">
                <p>Select an element to edit</p>
                <p className="text-sm">Click on any element on the page</p>
              </div>
            )}
          </TabsContent>
          
          {/* Pages Tab */}
          <TabsContent value="pages" className="space-y-4">
            <h3 className="font-semibold">Add New Page</h3>
            <form onSubmit={handleAddPage} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Page Title</label>
                <Input
                  value={newPageTitle}
                  onChange={(e) => setNewPageTitle(e.target.value)}
                  placeholder="About Us"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Page Slug</label>
                <Input
                  value={newPageSlug}
                  onChange={(e) => setNewPageSlug(e.target.value)}
                  placeholder="/about"
                  required
                />
                <p className="text-xs text-gray-500">Must start with / (forward slash)</p>
              </div>
              
              <Button type="submit" className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Create Page
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default EditorSidebar;
