import React, { useState, useEffect } from 'react';
import { useEditor, MenuItem } from '@/context/EditorContext';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Input } from './ui/input';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useToast } from '@/hooks/use-toast';
import { Grip, Plus, Trash2, Edit3, Save } from 'lucide-react';

interface NavigationItemProps {
  item: MenuItem;
  index: number;
}

const NavigationItem: React.FC<NavigationItemProps> = ({ item, index }) => {
  const { updateNavigation } = useEditor();
  const [title, setTitle] = useState(item.title);
  const [url, setUrl] = useState(item.url);
  const { toast } = useToast();

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };

  const handleSave = () => {
    updateNavigation((prevItems) => {
      const updatedItems = [...prevItems];
      updatedItems[index] = { ...item, title: title, url: url };
      return updatedItems;
    });
    toast({
      title: "Navigation Updated",
      description: `The navigation item "${title}" has been updated.`,
    });
  };

  return (
    <div className="flex items-center space-x-2 py-2">
      <Grip className="h-4 w-4 cursor-grab text-gray-500" />
      <Input
        type="text"
        placeholder="Title"
        value={title}
        onChange={handleTitleChange}
        className="flex-1 text-sm"
      />
      <Input
        type="text"
        placeholder="URL"
        value={url}
        onChange={handleUrlChange}
        className="flex-1 text-sm"
      />
      <Button size="sm" onClick={handleSave} className="bg-editor-blue text-white hover:bg-editor-blue/90">
        <Save className="h-4 w-4 mr-2" />
        Save
      </Button>
    </div>
  );
};

const NavigationManager: React.FC = () => {
  const { navigation, updateNavigation } = useEditor();
  const [open, setOpen] = useState(false);
  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemUrl, setNewItemUrl] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    // Ensure navigation items are sorted by order when component mounts
    const sortedNavigation = [...navigation].sort((a, b) => a.order - b.order);
    updateNavigation(sortedNavigation);
  }, [navigation, updateNavigation]);

  const handleDragEnd = (result: any) => {
    if (!result.destination) {
      return;
    }

    const items = Array.from(navigation);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update the order property based on the new index
    const updatedItems = items.map((item, index) => ({ ...item, order: index }));
    updateNavigation(updatedItems);
  };

  const handleAddItem = () => {
    if (newItemTitle && newItemUrl) {
      const newItem: MenuItem = {
        id: `nav-item-${Date.now()}`,
        title: newItemTitle,
        url: newItemUrl,
        order: navigation.length,
      };

      updateNavigation([...navigation, newItem]);
      setNewItemTitle('');
      setNewItemUrl('');
      setOpen(false);
      toast({
        title: "Navigation Item Added",
        description: `The navigation item "${newItem.title}" has been added.`,
      });
    }
  };

  const handleRemoveItem = (itemId: string) => {
    updateNavigation(navigation.filter(item => item.id !== itemId));
    toast({
      title: "Navigation Item Removed",
      description: "The navigation item has been removed.",
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Navigation Manager</h2>
        <Button onClick={() => setOpen(true)} className="bg-editor-blue text-white hover:bg-editor-blue/90">
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="navigation">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {navigation.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="bg-gray-50 rounded p-2 mb-2 shadow-sm border"
                    >
                      <div className="flex items-center justify-between">
                        <NavigationItem item={item} index={index} />
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleRemoveItem(item.id)}
                          className="ml-2"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Navigation Item</DialogTitle>
            <DialogDescription>Create a new item for your website's navigation.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="title" className="text-right">
                Title
              </label>
              <Input
                type="text"
                id="title"
                value={newItemTitle}
                onChange={(e) => setNewItemTitle(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="url" className="text-right">
                URL
              </label>
              <Input
                type="text"
                id="url"
                value={newItemUrl}
                onChange={(e) => setNewItemUrl(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <Button type="submit" onClick={handleAddItem} className="bg-editor-blue text-white hover:bg-editor-blue/90">
            Add Item
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Export the component
export default NavigationManager;
