
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Code, EyeIcon } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface HtmlEmbedProps {
  content: string;
  onChange: (content: string) => void;
}

export const HtmlEmbed: React.FC<HtmlEmbedProps> = ({ content, onChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [htmlContent, setHtmlContent] = useState(content);
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');

  const handleSave = () => {
    onChange(htmlContent);
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <div className="relative group">
        <div 
          className="border rounded-md p-4 min-h-[100px]"
          dangerouslySetInnerHTML={{ __html: content }}
        />
        <Button
          onClick={() => setIsEditing(true)}
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
          variant="secondary"
          size="sm"
        >
          Edit HTML
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4 border rounded-md p-4">
      <Tabs 
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as 'edit' | 'preview')}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="edit" className="flex items-center">
            <Code className="h-4 w-4 mr-1" />
            Code
          </TabsTrigger>
          <TabsTrigger value="preview" className="flex items-center">
            <EyeIcon className="h-4 w-4 mr-1" />
            Preview
          </TabsTrigger>
        </TabsList>
        <TabsContent value="edit" className="pt-4">
          <Textarea
            value={htmlContent}
            onChange={(e) => setHtmlContent(e.target.value)}
            className="font-mono min-h-[300px]"
            placeholder="<div>Your HTML code here</div>"
          />
        </TabsContent>
        <TabsContent value="preview" className="pt-4">
          <div 
            className="border rounded-md p-4 min-h-[300px] bg-white"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          onClick={() => setIsEditing(false)}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
        >
          Save HTML
        </Button>
      </div>
    </div>
  );
};
