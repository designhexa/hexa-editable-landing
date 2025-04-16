
import React, { useState } from 'react';
import { useEditor } from '@/context/EditorContext';
import { Plus, Settings, Layers, FileText, LayoutGrid, Type, Save, RefreshCw, Grid, ArrowsMaximize } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TextStyleEditor } from './TextStyleEditor';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';
import { ColorGradientPicker } from './ColorGradientPicker';
import { BackgroundImageUpload } from './BackgroundImageUpload';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Slider } from './ui/slider';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

const EditorSidebar: React.FC = () => {
  const { 
    isEditMode, 
    pages, 
    currentPageId, 
    userRole,
    addPage, 
    setCurrentPageId,
    addSection,
    addElement,
    getSelectedElement,
    updateElement,
    replaceHeaderSection,
    replaceFooterSection,
    saveEditorChanges,
    updateSection,
    updatePage
  } = useEditor();
  
  const [activeTab, setActiveTab] = useState<'pages' | 'elements'>('pages');
  const selectedElementData = getSelectedElement();
  const canEdit = userRole === 'admin' || userRole === 'editor';
  const isAdmin = userRole === 'admin';
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

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
      needs_republish: true,
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
        paddingX: 'px-4',
        height: 'auto',
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
    
    // Mark page as needing republish
    updatePage(currentPageId, { needs_republish: true });
  };

  const handleAddHtmlSection = () => {
    const currentPage = pages.find(page => page.id === currentPageId);
    if (!currentPage) return;
    
    addSection(currentPageId, {
      id: `section-${Date.now()}`,
      type: 'content',
      properties: {
        backgroundColor: 'bg-white',
        paddingY: 'py-8',
        paddingX: 'px-4',
        height: 'auto',
      },
      elements: [
        {
          id: `element-${Date.now()}-html`,
          type: 'html',
          content: '<div class="text-center"><h2 class="text-2xl font-bold mb-4">HTML Section</h2><p>This is a custom HTML section. Edit to add your code.</p></div>',
          properties: {
            className: 'w-full'
          }
        }
      ]
    });
    
    // Mark page as needing republish
    updatePage(currentPageId, { needs_republish: true });
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
    
    // Mark page as needing republish
    updatePage(currentPageId, { needs_republish: true });
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
    
    // Mark page as needing republish
    updatePage(currentPageId, { needs_republish: true });
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
    
    // Mark page as needing republish
    updatePage(pageId, { needs_republish: true });
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
    
    // Mark page as needing republish
    updatePage(pageId, { needs_republish: true });
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
    
    // Mark page as needing republish
    updatePage(pageId, { needs_republish: true });
  };

  const updateSectionBackground = (imageUrl: string) => {
    if (!selectedElementData) return;
    
    const { pageId, sectionId } = selectedElementData;
    
    updateSection(pageId, sectionId, {
      properties: {
        ...currentSection?.properties,
        backgroundImage: imageUrl,
        backgroundSize: currentSection?.properties?.backgroundSize || 'cover',
        backgroundPosition: currentSection?.properties?.backgroundPosition || 'center'
      }
    });
    
    // Mark page as needing republish
    updatePage(pageId, { needs_republish: true });
  };

  const updateSectionGridSettings = (key: string, value: any) => {
    if (!selectedElementData) return;
    
    const { pageId, sectionId } = selectedElementData;
    
    updateSection(pageId, sectionId, {
      properties: {
        ...currentSection?.properties,
        [key]: value
      }
    });
    
    // Mark page as needing republish
    updatePage(pageId, { needs_republish: true });
  };

  const updateSectionBackgroundProperty = (property: string, value: string) => {
    if (!selectedElementData) return;
    
    const { pageId, sectionId } = selectedElementData;
    
    updateSection(pageId, sectionId, {
      properties: {
        ...currentSection?.properties,
        [property]: value
      }
    });
    
    // Mark page as needing republish
    updatePage(pageId, { needs_republish: true });
  };

  const handleAddHtmlEmbed = () => {
    if (!selectedElementData) return;
    
    const { pageId, sectionId } = selectedElementData;
    
    addElement(pageId, sectionId, {
      id: `element-${Date.now()}-html`,
      type: 'html',
      content: '<div>Add your HTML here</div>',
      properties: {
        className: 'w-full'
      }
    });
    
    // Mark page as needing republish
    updatePage(pageId, { needs_republish: true });
  };

  const updateSectionBackgroundColor = (background: string) => {
    if (!selectedElementData) return;
    
    const { pageId, sectionId } = selectedElementData;
    
    updateSection(pageId, sectionId, {
      properties: {
        ...currentSection?.properties,
        backgroundColor: background
      }
    });
    
    // Mark page as needing republish
    updatePage(pageId, { needs_republish: true });
  };

  const currentPage = pages.find(page => page.id === currentPageId);
  let currentSectionUsesGrid = false;
  let currentSection = null;
  
  if (selectedElementData && currentPage) {
    const section = currentPage.sections.find(s => s.id === selectedElementData.sectionId);
    currentSectionUsesGrid = section?.properties?.isGridLayout || false;
    currentSection = section;
  }

  const isTextElement = selectedElementData && ['heading', 'text', 'button'].includes(selectedElementData.element.type);

  return (
    <div className="bg-white border-l shadow-lg fixed right-0 top-0 h-full w-72 z-20 overflow-auto">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="font-medium text-xl">Page Editor</h2>
        <Button 
          onClick={handleSaveChanges} 
          size="sm" 
          className="bg-editor-blue text-white hover:bg-editor-blue/90"
          disabled={isSaving}
        >
          {isSaving ? (
            <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
          ) : (
            <Save className="h-4 w-4 mr-1" />
          )}
          Simpan
        </Button>
      </div>
      
      <div className="flex border-b">
        <button 
          className={cn(
            "flex-1 p-3 text-sm font-medium",
            activeTab === 'pages' ? 'bg-gray-100 border-b-2 border-editor-blue' : ''
          )}
          onClick={() => setActiveTab('pages')}
        >
          <FileText size={16} className="inline mr-2" />
          Pages & Sections
        </button>
        <button 
          className={cn(
            "flex-1 p-3 text-sm font-medium",
            activeTab === 'elements' ? 'bg-gray-100 border-b-2 border-editor-blue' : ''
          )}
          onClick={() => setActiveTab('elements')}
        >
          <Settings size={16} className="inline mr-2" />
          Element Settings
        </button>
      </div>
      
      {activeTab === 'pages' && (
        <div className="p-4">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium">Pages</h3>
              <button 
                onClick={handleAddPage}
                className="text-xs bg-editor-blue text-white px-2 py-1 rounded flex items-center"
                disabled={!isAdmin}
                title={!isAdmin ? "Only admins can add pages" : "Add a new page"}
              >
                <Plus size={12} className="mr-1" />
                Add Page
              </button>
            </div>
            <div className="bg-gray-50 rounded p-2 max-h-40 overflow-y-auto">
              {pages.map(page => (
                <div 
                  key={page.id} 
                  className={cn(
                    "p-2 rounded mb-1 text-sm cursor-pointer",
                    currentPageId === page.id ? "bg-editor-blue text-white" : "bg-white hover:bg-gray-100",
                    !page.isPublished && "border-l-4 border-amber-300"
                  )}
                  onClick={() => setCurrentPageId(page.id)}
                >
                  {page.title}
                  {!page.isPublished && (
                    <span className="ml-2 text-xs opacity-70">(Draft)</span>
                  )}
                  {page.needs_republish && page.isPublished && (
                    <span className="ml-2 text-xs opacity-70">(Modified)</span>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium">Add Section</h3>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleAddSection}
                className="p-2 bg-gray-50 hover:bg-gray-100 rounded text-sm flex flex-col items-center justify-center"
              >
                <Layers size={20} className="mb-1" />
                Content Section
              </button>
              <button
                onClick={handleAddHtmlSection}
                className="p-2 bg-gray-50 hover:bg-gray-100 rounded text-sm flex flex-col items-center justify-center"
              >
                <FileText size={20} className="mb-1" />
                HTML Section
              </button>
              <button
                onClick={handleAddHeaderSection}
                className="p-2 bg-gray-50 hover:bg-gray-100 rounded text-sm flex flex-col items-center justify-center"
                disabled={!isAdmin}
              >
                <ArrowsMaximize size={20} className="mb-1" />
                Header Section
              </button>
              <button
                onClick={handleAddFooterSection}
                className="p-2 bg-gray-50 hover:bg-gray-100 rounded text-sm flex flex-col items-center justify-center"
                disabled={!isAdmin}
              >
                <ArrowsMaximize size={20} className="mb-1 rotate-180" />
                Footer Section
              </button>
            </div>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium">Elements</h3>
            </div>
            <div className="bg-gray-50 rounded p-2">
              <button
                onClick={handleAddHtmlEmbed}
                className="w-full text-left p-2 hover:bg-white rounded text-sm"
              >
                + HTML Embed
              </button>
            </div>
          </div>
        </div>
      )}
      
      {activeTab === 'elements' && selectedElementData && (
        <div className="p-4">
          <div>
            <h3 className="font-medium mb-4">Element Settings: {selectedElementData.element.type}</h3>
            
            {isTextElement && (
              <div className="mb-6 border-b pb-4">
                <div className="flex items-center mb-2">
                  <Type size={16} className="mr-2" />
                  <h4 className="font-medium">Text Styling</h4>
                </div>
                <TextStyleEditor 
                  element={selectedElementData.element}
                  pageId={selectedElementData.pageId}
                  sectionId={selectedElementData.sectionId}
                />
              </div>
            )}
            
            {(['heading', 'text', 'button'].includes(selectedElementData.element.type)) && (
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Text Color</label>
                <div className="grid grid-cols-5 gap-2">
                  <button onClick={() => updateElementColor('text-black')} className="w-6 h-6 bg-black rounded-full" />
                  <button onClick={() => updateElementColor('text-white')} className="w-6 h-6 bg-white border rounded-full" />
                  <button onClick={() => updateElementColor('text-editor-blue')} className="w-6 h-6 bg-editor-blue rounded-full" />
                  <button onClick={() => updateElementColor('text-editor-purple')} className="w-6 h-6 bg-editor-purple rounded-full" />
                  <button onClick={() => updateElementColor('text-editor-teal')} className="w-6 h-6 bg-editor-teal rounded-full" />
                  <button onClick={() => updateElementColor('text-gray-700')} className="w-6 h-6 bg-gray-700 rounded-full" />
                  <button onClick={() => updateElementColor('text-red-500')} className="w-6 h-6 bg-red-500 rounded-full" />
                  <button onClick={() => updateElementColor('text-yellow-500')} className="w-6 h-6 bg-yellow-500 rounded-full" />
                  <button onClick={() => updateElementColor('text-green-500')} className="w-6 h-6 bg-green-500 rounded-full" />
                  <button onClick={() => updateElementColor('text-editor-indigo')} className="w-6 h-6 bg-editor-indigo rounded-full" />
                </div>
              </div>
            )}
            
            {currentSectionUsesGrid && (
              <div className="mb-4 border-t pt-4">
                <div className="flex items-center mb-2">
                  <LayoutGrid size={16} className="mr-2" />
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
            
            {selectedElementData?.sectionId && (
              <>
                <div className="mb-4 border-t pt-4">
                  <div className="flex items-center mb-2">
                    <Grid size={16} className="mr-2" />
                    <h4 className="font-medium">Section Layout</h4>
                  </div>
                  
                  <div className="flex items-center mb-3 mt-2">
                    <Switch
                      id="grid-layout"
                      checked={currentSection?.properties?.isGridLayout || false}
                      onCheckedChange={(checked) => updateSectionGridSettings('isGridLayout', checked)}
                      className="mr-2"
                    />
                    <Label htmlFor="grid-layout">Enable Grid Layout</Label>
                  </div>
                  
                  {currentSection?.properties?.isGridLayout && (
                    <div className="space-y-3 mb-3 bg-gray-50 p-2 rounded">
                      <div>
                        <Label className="text-xs text-gray-500">Grid Columns</Label>
                        <Select
                          value={currentSection?.properties?.gridColumns || 'grid-cols-1'}
                          onValueChange={(value) => updateSectionGridSettings('gridColumns', value)}
                        >
                          <SelectTrigger className="h-8 text-xs">
                            <SelectValue placeholder="Select columns" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="grid-cols-1">1 Column</SelectItem>
                            <SelectItem value="grid-cols-2">2 Columns</SelectItem>
                            <SelectItem value="grid-cols-3">3 Columns</SelectItem>
                            <SelectItem value="grid-cols-4">4 Columns</SelectItem>
                            <SelectItem value="grid-cols-1 md:grid-cols-2">1 Col (Mobile) / 2 Col (Desktop)</SelectItem>
                            <SelectItem value="grid-cols-1 md:grid-cols-3">1 Col (Mobile) / 3 Col (Desktop)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label className="text-xs text-gray-500">Grid Gap</Label>
                        <Select
                          value={currentSection?.properties?.gridGap || 'gap-4'}
                          onValueChange={(value) => updateSectionGridSettings('gridGap', value)}
                        >
                          <SelectTrigger className="h-8 text-xs">
                            <SelectValue placeholder="Select gap size" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="gap-0">No Gap</SelectItem>
                            <SelectItem value="gap-2">Small Gap</SelectItem>
                            <SelectItem value="gap-4">Medium Gap</SelectItem>
                            <SelectItem value="gap-6">Large Gap</SelectItem>
                            <SelectItem value="gap-8">Extra Large Gap</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex items-center">
                        <Switch
                          id="draggable-grid"
                          checked={currentSection?.properties?.isDraggableGrid || false}
                          onCheckedChange={(checked) => updateSectionGridSettings('isDraggableGrid', checked)}
                          className="mr-2"
                        />
                        <Label htmlFor="draggable-grid" className="text-xs">Draggable Elements</Label>
                      </div>
                    </div>
                  )}
                  
                  <div className="space-y-3 mb-3">
                    <div>
                      <Label className="text-xs text-gray-500">Section Height</Label>
                      <Select
                        value={currentSection?.properties?.height || 'auto'}
                        onValueChange={(value) => updateSectionGridSettings('height', value)}
                      >
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue placeholder="Select height" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="auto">Auto</SelectItem>
                          <SelectItem value="300px">300px</SelectItem>
                          <SelectItem value="400px">400px</SelectItem>
                          <SelectItem value="500px">500px</SelectItem>
                          <SelectItem value="600px">600px</SelectItem>
                          <SelectItem value="100vh">Full Viewport</SelectItem>
                          <SelectItem value="50vh">Half Viewport</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label className="text-xs text-gray-500">Padding X</Label>
                      <Select
                        value={currentSection?.properties?.paddingX || 'px-4'}
                        onValueChange={(value) => updateSectionGridSettings('paddingX', value)}
                      >
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue placeholder="Horizontal padding" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="px-0">None</SelectItem>
                          <SelectItem value="px-2">Small</SelectItem>
                          <SelectItem value="px-4">Medium</SelectItem>
                          <SelectItem value="px-8">Large</SelectItem>
                          <SelectItem value="px-12">Extra Large</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label className="text-xs text-gray-500">Padding Y</Label>
                      <Select
                        value={currentSection?.properties?.paddingY || 'py-4'}
                        onValueChange={(value) => updateSectionGridSettings('paddingY', value)}
                      >
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue placeholder="Vertical padding" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="py-0">None</SelectItem>
                          <SelectItem value="py-2">Small</SelectItem>
                          <SelectItem value="py-4">Medium</SelectItem>
                          <SelectItem value="py-8">Large</SelectItem>
                          <SelectItem value="py-12">Extra Large</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="mb-6 border-t pt-4">
                  <Tabs defaultValue="background" className="w-full">
                    <TabsList className="w-full grid grid-cols-2">
                      <TabsTrigger value="background">Background</TabsTrigger>
                      <TabsTrigger value="image">Image</TabsTrigger>
                    </TabsList>
                    <TabsContent value="background" className="pt-4">
                      <ColorGradientPicker
                        type="background"
                        value={currentSection?.properties?.backgroundColor || 'bg-white'}
                        onChange={updateSectionBackgroundColor}
                      />
                    </TabsContent>
                    <TabsContent value="image" className="pt-4">
                      <div className="space-y-3">
                        <BackgroundImageUpload
                          currentImage={currentSection?.properties?.backgroundImage?.replace(/url\(['"](.+)['"]\)/, '$1')}
                          onImageSelect={updateSectionBackground}
                        />
                        
                        {currentSection?.properties?.backgroundImage && (
                          <>
                            <div>
                              <Label className="text-xs text-gray-500">Background Size</Label>
                              <Select
                                value={currentSection?.properties?.backgroundSize || 'cover'}
                                onValueChange={(value) => updateSectionBackgroundProperty('backgroundSize', value)}
                              >
                                <SelectTrigger className="h-8 text-xs">
                                  <SelectValue placeholder="Background size" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="cover">Cover</SelectItem>
                                  <SelectItem value="contain">Contain</SelectItem>
                                  <SelectItem value="auto">Auto</SelectItem>
                                  <SelectItem value="100%">100%</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div>
                              <Label className="text-xs text-gray-500">Background Position</Label>
                              <Select
                                value={currentSection?.properties?.backgroundPosition || 'center'}
                                onValueChange={(value) => updateSectionBackgroundProperty('backgroundPosition', value)}
                              >
                                <SelectTrigger className="h-8 text-xs">
                                  <SelectValue placeholder="Position" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="center">Center</SelectItem>
                                  <SelectItem value="top">Top</SelectItem>
                                  <SelectItem value="bottom">Bottom</SelectItem>
                                  <SelectItem value="left">Left</SelectItem>
                                  <SelectItem value="right">Right</SelectItem>
                                  <SelectItem value="top left">Top Left</SelectItem>
                                  <SelectItem value="top right">Top Right</SelectItem>
                                  <SelectItem value="bottom left">Bottom Left</SelectItem>
                                  <SelectItem value="bottom right">Bottom Right</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div>
                              <Label className="text-xs text-gray-500">Background Repeat</Label>
                              <Select
                                value={currentSection?.properties?.backgroundRepeat || 'no-repeat'}
                                onValueChange={(value) => updateSectionBackgroundProperty('backgroundRepeat', value)}
                              >
                                <SelectTrigger className="h-8 text-xs">
                                  <SelectValue placeholder="Repeat" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="no-repeat">No Repeat</SelectItem>
                                  <SelectItem value="repeat">Repeat</SelectItem>
                                  <SelectItem value="repeat-x">Repeat X</SelectItem>
                                  <SelectItem value="repeat-y">Repeat Y</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div>
                              <Label className="text-xs text-gray-500">Background Attachment</Label>
                              <Select
                                value={currentSection?.properties?.backgroundAttachment || 'scroll'}
                                onValueChange={(value) => updateSectionBackgroundProperty('backgroundAttachment', value)}
                              >
                                <SelectTrigger className="h-8 text-xs">
                                  <SelectValue placeholder="Attachment" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="scroll">Scroll</SelectItem>
                                  <SelectItem value="fixed">Fixed</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </>
                        )}
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </>
            )}
            
            <div className="text-sm text-gray-600">
              Double-click on text elements to edit their content.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditorSidebar;
