
import React, { useState } from 'react';
import { Button } from './ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Upload, Image as ImageIcon, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Progress } from './ui/progress';

interface BackgroundImageUploadProps {
  currentImage?: string;
  onImageSelect: (url: string) => void;
}

export const BackgroundImageUpload: React.FC<BackgroundImageUploadProps> = ({
  currentImage,
  onImageSelect
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Image must be smaller than 10MB",
        variant: "destructive",
      });
      return;
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please select a valid image file (JPEG, PNG, GIF, or WebP)",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      // First check if bucket exists, if not create it
      const { error: bucketError } = await supabase.storage.getBucket('section-backgrounds');
      
      if (bucketError && bucketError.message.includes('not found')) {
        // Attempt to create the bucket
        const { error: createBucketError } = await supabase.storage.createBucket('section-backgrounds', {
          public: true,
          fileSizeLimit: 10485760, // 10MB in bytes
        });
        
        if (createBucketError) {
          throw createBucketError;
        }
      }
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      // Track upload progress manually by periodically checking upload status
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 5, 95));
      }, 100);

      // Upload without the onUploadProgress option which is causing the TypeScript error
      const { error: uploadError, data } = await supabase.storage
        .from('section-backgrounds')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (uploadError) {
        console.error("Upload error:", uploadError);
        throw uploadError;
      }

      if (data) {
        // Get the public URL
        const { data: { publicUrl } } = supabase.storage
          .from('section-backgrounds')
          .getPublicUrl(filePath);
        
        // Use a timestamp query parameter to prevent caching issues
        const urlWithTimestamp = `${publicUrl}?t=${Date.now()}`;
        
        onImageSelect(urlWithTimestamp);
        toast({
          title: "Image uploaded successfully",
          description: "Your background image has been updated.",
        });
      }
    } catch (error: any) {
      console.error('Error uploading file:', error);
      toast({
        title: "Upload failed",
        description: error.message || "There was an error uploading your image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadProgress(0), 1000); // Reset progress after a delay
      // Clear input value to allow uploading the same file again
      const input = document.getElementById('bg-image-upload') as HTMLInputElement;
      if (input) input.value = '';
    }
  };

  const removeBackground = () => {
    onImageSelect('');
    toast({
      title: "Background removed",
      description: "Background image has been removed from this section.",
    });
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
          <Button 
            variant="destructive" 
            size="sm"
            className="absolute bottom-2 right-2 opacity-80 hover:opacity-100"
            onClick={removeBackground}
          >
            Remove
          </Button>
        </div>
      )}
      
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          className="w-full relative overflow-hidden"
          disabled={isUploading}
          onClick={() => document.getElementById('bg-image-upload')?.click()}
        >
          {isUploading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Uploading...
            </>
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
      
      {isUploading && (
        <Progress value={uploadProgress} className="h-1" />
      )}
      
      <div className="text-xs text-gray-500">
        Supported formats: JPEG, PNG, GIF, WebP. Max size: 10MB
      </div>
    </div>
  );
};
