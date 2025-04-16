
import React, { useState } from 'react';
import { useEditor } from '@/context/EditorContext';
import { 
  Plus, Settings, Layers, FileText, LayoutGrid, 
  Type, Save, RefreshCw, CircleDot, Palette, 
  Grid3X3, Image, Upload, Menu, X, Home 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { TextStyleEditor } from './TextStyleEditor';
import { ElementStyleEditor } from './ElementStyleEditor';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';

const EditorSidebar: React.FC = () => {
  const { 
    isEditMode, 
    pages, 
    currentPageId, 
    userRole,
    addPage, 
    setCurrentPageId,
    addSection,
    getSelectedElement,
    updateElement,
    replaceHeaderSection,
    replaceFooterSection,
    saveEditorChanges,
    addElement
  } = useEditor();
  
  const [activeTab, setActiveTab] = useState<'pages' | 'elements'>('pages');
  const selectedElementData = getSelectedElement();
  const canEdit = userRole === 'admin' || userRole === 'editor';
  const isAdmin = userRole === 'admin';
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [backgroundTab, setBackgroundTab] = useState<'colors' | 'gradients' | 'images'>('colors');
  const [elementTab, setElementTab] = useState<'text' | 'style' | 'milestone' | 'html'>('text');

  if (!isEditMode || !canEdit) return null;

  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      await saveEditorChanges();
      toast({
        title: "Perubahan tersimpan",
        description: "Semua perubahan editor telah berhasil disimpan",
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Gagal menyimpan",
        description: "Terjadi kesalahan saat menyimpan perubahan",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddPage = () => {
    const newPageId = `page-${Date.now()}`;
    const newPageTitle = `New Page ${pages.length + 1}`;
    const newPageSlug = `/${newPageTitle.toLowerCase().replace(/\s+/g, '-')}`;
    
    addPage({
      id: newPageId,
      title: newPageTitle,
      slug: newPageSlug,
      isPublished: false,
      sections: [
        {
          id: `section-${Date.now()}`,
          type: 'content',
          properties: {
            backgroundColor: 'bg-white',
            paddingY: 'py-12',
            paddingX: 'px-4'
          },
          elements: [
            {
              id: `element-${Date.now()}-heading`,
              type: 'heading',
              content: newPageTitle,
              properties: {
                className: 'text-3xl font-bold text-center mb-8'
              }
            },
            {
              id: `element-${Date.now()}-text`,
              type: 'text',
              content: 'This is a new page. Start editing to add your content.',
              properties: {
                className: 'text-center max-w-2xl mx-auto'
              }
            }
          ]
        }
      ]
    });
  };

  const handleAddSection = () => {
    const currentPage = pages.find(page => page.id === currentPageId);
    if (!currentPage) return;
    
    addSection(currentPageId, {
      id: `section-${Date.now()}`,
      type: 'content',
      properties: {
        backgroundColor: 'bg-white',
        paddingY: 'py-12',
        paddingX: 'px-4'
      },
      elements: [
        {
          id: `element-${Date.now()}-heading`,
          type: 'heading',
          content: 'New Section',
          properties: {
            className: 'text-2xl font-bold text-center mb-4'
          }
        },
        {
          id: `element-${Date.now()}-text`,
          type: 'text',
          content: 'This is a new section. Add elements and customize as needed.',
          properties: {
            className: 'text-center max-w-2xl mx-auto'
          }
        }
      ]
    });
  };

  const handleAddHeaderSection = () => {
    if (!isAdmin) return;
    
    replaceHeaderSection(currentPageId, {
      id: `header-section-${Date.now()}`,
      properties: {
        backgroundColor: 'bg-white',
        paddingY: 'py-4',
        paddingX: 'px-4'
      },
      elements: [
        {
          id: `header-logo-${Date.now()}`,
          type: 'image',
          content: '/placeholder.svg',
          properties: {
            className: 'h-10 w-auto'
          }
        },
        {
          id: `header-title-${Date.now()}`,
          type: 'heading',
          content: 'My Website',
          properties: {
            className: 'text-xl font-bold'
          }
        }
      ]
    });
  };

  const handleAddFooterSection = () => {
    if (!isAdmin) return;
    
    replaceFooterSection(currentPageId, {
      id: `footer-section-${Date.now()}`,
      properties: {
        backgroundColor: 'bg-gray-800',
        paddingY: 'py-8',
        paddingX: 'px-4'
      },
      elements: [
        {
          id: `footer-text-${Date.now()}`,
          type: 'text',
          content: '© 2025 Website Builder. All rights reserved.',
          properties: {
            className: 'text-gray-400 text-center'
          }
        }
      ]
    });
  };

  const handleAddMilestone = () => {
    const sectionId = selectedElementData?.sectionId || pages.find(page => page.id === currentPageId)?.sections[0]?.id;
    
    if (sectionId) {
      addElement(currentPageId, sectionId, {
        id: `element-${Date.now()}-milestone`,
        type: 'milestone',
        content: '2025',
        properties: {
          className: 'flex flex-col items-center',
          title: 'Achievement Milestone',
          description: 'A significant achievement or milestone reached',
          icon: 'CircleDot'
        }
      });
      
      toast({
        title: "Milestone Added",
        description: "A new milestone element has been added to your section",
        duration: 3000,
      });
    }
  };
  
  const updateElementColor = (color: string) => {
    if (!selectedElementData) return;
    
    const { pageId, sectionId, element } = selectedElementData;
    const currentClassName = element.properties?.className || '';
    
    const cleanedClassName = currentClassName.replace(/text-\w+-\d+|text-\w+/g, '').trim();
    
    const newClassName = `${cleanedClassName} ${color}`;
    
    updateElement(pageId, sectionId, element.id, {
      properties: {
        ...element.properties,
        className: newClassName
      }
    });
  };

  const updateElementAlign = (align: string) => {
    if (!selectedElementData) return;
    
    const { pageId, sectionId, element } = selectedElementData;
    const currentClassName = element.properties?.className || '';
    
    const cleanedClassName = currentClassName.replace(/text-left|text-center|text-right/g, '').trim();
    
    const newClassName = `${cleanedClassName} ${align}`;
    
    updateElement(pageId, sectionId, element.id, {
      properties: {
        ...element.properties,
        className: newClassName
      }
    });
  };

  const updateElementGridPosition = (property: string, value: string) => {
    if (!selectedElementData) return;
    
    const { pageId, sectionId, element } = selectedElementData;
    
    updateElement(pageId, sectionId, element.id, {
      gridPosition: {
        ...element.gridPosition || {
          column: '',
          row: '',
          columnSpan: '',
          rowSpan: ''
        },
        [property]: value
      }
    });
  };

  const handleUpdateHtml = (html: string) => {
    if (!selectedElementData) return;
    
    const { pageId, sectionId, element } = selectedElementData;
    
    updateElement(pageId, sectionId, element.id, {
      content: html
    });
  };

  const currentPage = pages.find(page => page.id === currentPageId);
  let currentSectionUsesGrid = false;
  
  if (selectedElementData && currentPage) {
    const section = currentPage.sections.find(s => s.id === selectedElementData.sectionId);
    currentSectionUsesGrid = section?.properties?.isGridLayout === 'true';
  }

  const isTextElement = selectedElementData && ['heading', 'text', 'button'].includes(selectedElementData.element.type);
  const isMilestoneElement = selectedElementData && selectedElementData.element.type === 'milestone';

  return (
    <div className="bg-white border-l shadow-lg fixed right-0 top-0 h-full w-72 z-50 overflow-hidden flex flex-col">
      {/* Editor Navbar */}
      <div className="bg-gray-900 text-white p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <LayoutGrid size={18} />
          <h2 className="font-medium">Page Builder</h2>
        </div>
        <Button 
          onClick={handleSaveChanges} 
          size="sm" 
          variant="outline"
          className="bg-transparent border-white text-white hover:bg-gray-800"
          disabled={isSaving}
        >
          {isSaving ? (
            <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
          ) : (
            <Save className="h-4 w-4 mr-1" />
          )}
          Save
        </Button>
      </div>
      
      <Tabs defaultValue="pages" className="flex-1 flex flex-col">
        <TabsList className="grid grid-cols-2 mb-1 p-1 mx-2 mt-2">
          <TabsTrigger value="pages" onClick={() => setActiveTab('pages')}>
            <FileText size={16} className="mr-2" />
            Pages
          </TabsTrigger>
          <TabsTrigger value="elements" onClick={() => setActiveTab('elements')}>
            <Settings size={16} className="mr-2" />
            Elements
          </TabsTrigger>
        </TabsList>
        
        <ScrollArea className="flex-1">
          <TabsContent value="pages" className="p-4 m-0">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium">Pages</h3>
                <Button 
                  onClick={handleAddPage}
                  className="h-7 text-xs bg-blue-600 text-white px-2 py-1 rounded flex items-center"
                  disabled={!isAdmin}
                  title={!isAdmin ? "Only admins can add pages" : "Add a new page"}
                  variant="default"
                  size="sm"
                >
                  <Plus size={12} className="mr-1" />
                  Add Page
                </Button>
              </div>
              <div className="bg-gray-50 rounded p-2 max-h-40 overflow-y-auto">
                {pages.map(page => (
                  <div 
                    key={page.id} 
                    className={cn(
                      "p-2 rounded mb-1 text-sm cursor-pointer",
                      currentPageId === page.id ? "bg-blue-600 text-white" : "bg-white hover:bg-gray-100",
                      !page.isPublished && "border-l-4 border-amber-300"
                    )}
                    onClick={() => setCurrentPageId(page.id)}
                  >
                    {page.title}
                    {!page.isPublished && (
                      <span className="ml-2 text-xs opacity-70">(Draft)</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            <Separator className="my-4" />
            
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium">Sections</h3>
                <Button 
                  onClick={handleAddSection}
                  className="h-7 text-xs bg-blue-600 text-white rounded flex items-center"
                  variant="default"
                  size="sm"
                >
                  <Plus size={12} className="mr-1" />
                  Add Section
                </Button>
              </div>
              
              {isAdmin && (
                <div className="flex flex-col gap-2 mb-4">
                  <div className="flex gap-2">
                    <Button
                      onClick={handleAddHeaderSection}
                      className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded flex-1"
                      variant="outline"
                      size="sm"
                    >
                      Header
                    </Button>
                    <Button
                      onClick={handleAddFooterSection}
                      className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded flex-1"
                      variant="outline"
                      size="sm"
                    >
                      Footer
                    </Button>
                  </div>
                </div>
              )}
            </div>
            
            <Separator className="my-4" />
            
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium">Elements</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={() => {
                    const sectionId = selectedElementData?.sectionId || pages.find(page => page.id === currentPageId)?.sections[0]?.id;
                    if (sectionId) {
                      addElement(currentPageId, sectionId, {
                        id: `element-${Date.now()}-heading`,
                        type: 'heading',
                        content: 'New Heading',
                        properties: {
                          className: 'text-2xl font-bold mb-4'
                        }
                      });
                    }
                  }}
                  className="flex items-center justify-start gap-2 h-10"
                  variant="outline"
                >
                  <Type size={16} /> Heading
                </Button>
                
                <Button
                  onClick={() => {
                    const sectionId = selectedElementData?.sectionId || pages.find(page => page.id === currentPageId)?.sections[0]?.id;
                    if (sectionId) {
                      addElement(currentPageId, sectionId, {
                        id: `element-${Date.now()}-text`,
                        type: 'text',
                        content: 'New paragraph text',
                        properties: {
                          className: 'mb-4'
                        }
                      });
                    }
                  }}
                  className="flex items-center justify-start gap-2 h-10"
                  variant="outline"
                >
                  <FileText size={16} /> Text
                </Button>
                
                <Button
                  onClick={() => {
                    const sectionId = selectedElementData?.sectionId || pages.find(page => page.id === currentPageId)?.sections[0]?.id;
                    if (sectionId) {
                      addElement(currentPageId, sectionId, {
                        id: `element-${Date.now()}-button`,
                        type: 'button',
                        content: 'Click Me',
                        properties: {
                          className: 'bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700'
                        }
                      });
                    }
                  }}
                  className="flex items-center justify-start gap-2 h-10"
                  variant="outline"
                >
                  <Settings size={16} /> Button
                </Button>
                
                <Button
                  onClick={() => {
                    const sectionId = selectedElementData?.sectionId || pages.find(page => page.id === currentPageId)?.sections[0]?.id;
                    if (sectionId) {
                      addElement(currentPageId, sectionId, {
                        id: `element-${Date.now()}-image`,
                        type: 'image',
                        content: '/placeholder.svg',
                        properties: {
                          className: 'w-full max-w-md mx-auto mb-4'
                        }
                      });
                    }
                  }}
                  className="flex items-center justify-start gap-2 h-10"
                  variant="outline"
                >
                  <Image size={16} /> Image
                </Button>
                
                <Button
                  onClick={handleAddMilestone}
                  className="flex items-center justify-start gap-2 h-10 col-span-2"
                  variant="outline"
                >
                  <CircleDot size={16} /> Milestone
                </Button>
              </div>
            </div>
          </TabsContent>
        
          <TabsContent value="elements" className="p-4 m-0">
            {selectedElementData ? (
              <div>
                <h3 className="font-medium mb-4 flex items-center gap-2">
                  {selectedElementData.element.type === 'heading' && <Type size={16} />}
                  {selectedElementData.element.type === 'text' && <FileText size={16} />}
                  {selectedElementData.element.type === 'image' && <Image size={16} />}
                  {selectedElementData.element.type === 'button' && <Settings size={16} />}
                  {selectedElementData.element.type === 'milestone' && <CircleDot size={16} />}
                  {selectedElementData.element.type.charAt(0).toUpperCase() + selectedElementData.element.type.slice(1)}
                </h3>
                
                {(isTextElement || isMilestoneElement) && (
                  <Tabs defaultValue="text" className="mb-4">
                    <TabsList className="grid grid-cols-3 mb-2">
                      <TabsTrigger
                        value="text"
                        onClick={() => setElementTab('text')}
                        className="flex items-center gap-1"
                      >
                        <Type size={14} />
                        Typography
                      </TabsTrigger>
                      <TabsTrigger
                        value="style"
                        onClick={() => setElementTab('style')}
                        className="flex items-center gap-1"
                      >
                        <Palette size={14} />
                        Style
                      </TabsTrigger>
                      <TabsTrigger
                        value="html"
                        onClick={() => setElementTab('html')}
                        className="flex items-center gap-1"
                      >
                        <FileText size={14} />
                        HTML
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="text" className="mt-2">
                      {isTextElement && selectedElementData && (
                        <TextStyleEditor
                          element={selectedElementData.element}
                          pageId={selectedElementData.pageId}
                          sectionId={selectedElementData.sectionId}
                        />
                      )}

                      {isMilestoneElement && (
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium mb-1">Title</label>
                            <input 
                              type="text" 
                              value={selectedElementData.element.properties?.title || ''}
                              onChange={(e) => updateElement(
                                selectedElementData.pageId, 
                                selectedElementData.sectionId, 
                                selectedElementData.element.id, 
                                {
                                  properties: {
                                    ...selectedElementData.element.properties,
                                    title: e.target.value
                                  }
                                }
                              )}
                              className="w-full p-2 border rounded text-sm"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium mb-1">Description</label>
                            <textarea 
                              value={selectedElementData.element.properties?.description || ''}
                              onChange={(e) => updateElement(
                                selectedElementData.pageId, 
                                selectedElementData.sectionId, 
                                selectedElementData.element.id, 
                                {
                                  properties: {
                                    ...selectedElementData.element.properties,
                                    description: e.target.value
                                  }
                                }
                              )}
                              className="w-full p-2 border rounded text-sm h-20"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium mb-1">Year/Date</label>
                            <input 
                              type="text" 
                              value={selectedElementData.element.content}
                              onChange={(e) => updateElement(
                                selectedElementData.pageId, 
                                selectedElementData.sectionId, 
                                selectedElementData.element.id, 
                                {
                                  content: e.target.value
                                }
                              )}
                              className="w-full p-2 border rounded text-sm"
                            />
                          </div>
                        </div>
                      )}
                    </TabsContent>
                    
                    <TabsContent value="style" className="mt-2">
                      {selectedElementData && (
                        <ElementStyleEditor
                          element={selectedElementData.element}
                          pageId={selectedElementData.pageId}
                          sectionId={selectedElementData.sectionId}
                        />
                      )}
                    </TabsContent>

                    <TabsContent value="html" className="mt-2">
                      <div className="space-y-3">
                        <label className="block text-sm font-medium mb-1">HTML Editor</label>
                        <textarea
                          value={selectedElementData.element.content || ''}
                          onChange={(e) => handleUpdateHtml(e.target.value)}
                          className="w-full p-2 border rounded text-sm min-h-[200px] font-mono"
                          spellCheck={false}
                        />
                        <p className="text-xs text-gray-500">
                          Edit the HTML content directly. Be careful with your syntax.
                        </p>
                      </div>
                    </TabsContent>
                  </Tabs>
                )}
                
                {!isTextElement && !isMilestoneElement && selectedElementData && (
                  <Tabs defaultValue="style" className="mb-4">
                    <TabsList className="grid grid-cols-2 mb-2">
                      <TabsTrigger
                        value="style"
                        className="flex items-center gap-1"
                      >
                        <Palette size={14} />
                        Style
                      </TabsTrigger>
                      <TabsTrigger
                        value="html"
                        className="flex items-center gap-1"
                      >
                        <FileText size={14} />
                        HTML
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="style" className="mt-2">
                      <ElementStyleEditor
                        element={selectedElementData.element}
                        pageId={selectedElementData.pageId}
                        sectionId={selectedElementData.sectionId}
                      />
                    </TabsContent>
                    
                    <TabsContent value="html" className="mt-2">
                      <div className="space-y-3">
                        <label className="block text-sm font-medium mb-1">HTML Editor</label>
                        <textarea
                          value={selectedElementData.element.content || ''}
                          onChange={(e) => handleUpdateHtml(e.target.value)}
                          className="w-full p-2 border rounded text-sm min-h-[200px] font-mono"
                          spellCheck={false}
                        />
                        <p className="text-xs text-gray-500">
                          Edit the HTML content directly. Be careful with your syntax.
                        </p>
                      </div>
                    </TabsContent>
                  </Tabs>
                )}

                {currentSectionUsesGrid && (
                  <div className="mb-4 border-t pt-4">
                    <div className="flex items-center mb-2">
                      <Grid3X3 size={16} className="mr-2" />
                      <label className="block text-sm font-medium">Grid Position</label>
                    </div>
                    
                    <div className="mb-2">
                      <label className="block text-xs text-gray-500 mb-1">Column</label>
                      <select 
                        value={selectedElementData.element.gridPosition?.column || ''}
                        onChange={(e) => updateElementGridPosition('column', e.target.value)}
                        className="w-full p-1 text-sm border rounded"
                      >
                        <option value="default">Default</option>
                        <option value="col-span-1">Column 1</option>
                        <option value="col-span-1 md:col-start-1">Start at 1</option>
                        <option value="col-span-1 md:col-start-2">Start at 2</option>
                        <option value="col-span-1 md:col-start-3">Start at 3</option>
                        <option value="col-span-full">Full Width</option>
                      </select>
                    </div>
                    
                    <div className="mb-2">
                      <label className="block text-xs text-gray-500 mb-1">Row</label>
                      <select 
                        value={selectedElementData.element.gridPosition?.row || ''}
                        onChange={(e) => updateElementGridPosition('row', e.target.value)}
                        className="w-full p-1 text-sm border rounded"
                      >
                        <option value="default">Default</option>
                        <option value="row-start-1">Row 1</option>
                        <option value="row-start-2">Row 2</option>
                        <option value="row-start-3">Row 3</option>
                        <option value="row-start-4">Row 4</option>
                      </select>
                    </div>
                    
                    <div className="mb-2">
                      <label className="block text-xs text-gray-500 mb-1">Column Span</label>
                      <select 
                        value={selectedElementData.element.gridPosition?.columnSpan || ''}
                        onChange={(e) => updateElementGridPosition('columnSpan', e.target.value)}
                        className="w-full p-1 text-sm border rounded"
                      >
                        <option value="default">Default</option>
                        <option value="md:col-span-1">Span 1</option>
                        <option value="md:col-span-2">Span 2</option>
                        <option value="md:col-span-3">Span 3</option>
                        <option value="col-span-full">Full Width</option>
                      </select>
                    </div>
                    
                    <div className="mb-2">
                      <label className="block text-xs text-gray-500 mb-1">Row Span</label>
                      <select 
                        value={selectedElementData.element.gridPosition?.rowSpan || ''}
                        onChange={(e) => updateElementGridPosition('rowSpan', e.target.value)}
                        className="w-full p-1 text-sm border rounded"
                      >
                        <option value="default">Default</option>
                        <option value="row-span-1">Span 1</option>
                        <option value="row-span-2">Span 2</option>
                        <option value="row-span-3">Span 3</option>
                      </select>
                    </div>
                  </div>
                )}
                
                <div className="text-sm text-gray-600">
                  Double-click on text elements to edit their content.
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Layers size={24} className="mx-auto mb-2" />
                <p>Select an element to edit its properties</p>
              </div>
            )}
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  );
};

export default EditorSidebar;
