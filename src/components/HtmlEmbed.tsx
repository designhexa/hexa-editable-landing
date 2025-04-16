
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';

interface HtmlEmbedProps {
  content: string;
  onChange: (content: string) => void;
}

export const HtmlEmbed: React.FC<HtmlEmbedProps> = ({ content, onChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [htmlContent, setHtmlContent] = useState(content);

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
    <div className="space-y-4">
      <Textarea
        value={htmlContent}
        onChange={(e) => setHtmlContent(e.target.value)}
        className="font-mono min-h-[200px]"
        placeholder="<div>Your HTML code here</div>"
      />
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
