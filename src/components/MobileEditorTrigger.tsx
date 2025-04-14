
import React from 'react';
import { Settings } from 'lucide-react';
import { useEditor } from '@/context/EditorContext';
import { Button } from './ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

const MobileEditorTrigger: React.FC = () => {
  const { isEditMode, toggleEditMode, userRole } = useEditor();
  const canEdit = userRole === 'admin' || userRole === 'editor';
  
  if (!canEdit) return null;
  
  return (
    <div className="md:hidden fixed bottom-4 right-4 z-40">
      <Drawer>
        <DrawerTrigger asChild>
          <Button size="icon" variant="default" className="rounded-full shadow-lg bg-blue-600 hover:bg-blue-700">
            <Settings className="h-5 w-5 text-white" />
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Editor Controls</DrawerTitle>
            <DrawerDescription>
              Access editor functions
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4 space-y-4">
            <Button 
              onClick={toggleEditMode}
              className="w-full"
              variant={isEditMode ? "destructive" : "default"}
            >
              {isEditMode ? "Exit Edit Mode" : "Enter Edit Mode"}
            </Button>
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default MobileEditorTrigger;
