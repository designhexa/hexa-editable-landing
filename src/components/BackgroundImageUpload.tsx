
import React, { useState } from 'react';
import { Button } from './ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Upload, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BackgroundImageUploadProps {
  currentImage?: string;
  onImageSelect: (url: string) => void;
}

export const BackgroundImageUpload: React.FC<BackgroundImageUploadProps> = ({
  currentImage,
  onImageSelect
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from('section-backgrounds')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      if (data) {
        const { data: { publicUrl } } = supabase.storage
          .from('section-backgrounds')
          .getPublicUrl(filePath);
        
        onImageSelect(publicUrl);
        toast({
          title: "Image uploaded successfully",
          description: "Your background image has been updated.",
        });
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      {currentImage && (
        <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
          <img
            src={currentImage}
            alt="Current background"
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          className="w-full"
          disabled={isUploading}
          onClick={() => document.getElementById('bg-image-upload')?.click()}
        >
          {isUploading ? (
            "Uploading..."
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              Upload Image
            </>
          )}
        </Button>
        
        <input
          type="file"
          id="bg-image-upload"
          accept="image/*"
          className="hidden"
          onChange={handleFileSelect}
        />
      </div>
    </div>
  );
};
