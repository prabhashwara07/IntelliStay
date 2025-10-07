// frontend/src/components/ImageUpload.jsx
import React, { useState, useRef } from 'react';
import { Button } from '@/src/components/ui/button';
import { Card } from '@/src/components/ui/card';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import useCloudinaryUpload from '@/src/hooks/useCloudinaryUpload';

const ImageUpload = ({ onImagesUploaded, maxImages = 3 }) => {
  const [uploadedImages, setUploadedImages] = useState([]);
  const { uploadImages, uploading } = useCloudinaryUpload();
  const fileInputRef = useRef(null);

  const handleFileSelect = async (event) => {
    const files = Array.from(event.target.files);
    
    if (files.length === 0) return;
    
    if (uploadedImages.length + files.length > maxImages) {
      alert(`Maximum ${maxImages} images allowed`);
      return;
    }

    // Validate file types and sizes
    const validFiles = files.filter(file => {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      const maxSize = 5 * 1024 * 1024; // 5MB
      
      if (!validTypes.includes(file.type)) {
        alert(`${file.name} is not a valid image format`);
        return false;
      }
      
      if (file.size > maxSize) {
        alert(`${file.name} is too large. Max size is 5MB`);
        return false;
      }
      
      return true;
    });

    if (validFiles.length === 0) return;

    try {
      const newImageUrls = await uploadImages(validFiles);
      const allImages = [...uploadedImages, ...newImageUrls];
      setUploadedImages(allImages);
      onImagesUploaded(allImages);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload images. Please try again.');
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = (indexToRemove) => {
    const newImages = uploadedImages.filter((_, index) => index !== indexToRemove);
    setUploadedImages(newImages);
    onImagesUploaded(newImages);
  };

  return (
    <div className="space-y-4">
      {/* Upload Button */}
      <div className="flex items-center gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading || uploadedImages.length >= maxImages}
          className="border-2 border-dashed border-border/60 hover:border-primary/50"
        >
          {uploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Upload Images ({uploadedImages.length}/{maxImages})
            </>
          )}
        </Button>
        
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Upload Instructions */}
      <div className="text-sm text-muted-foreground">
        <p className="flex items-center gap-2">
          <ImageIcon className="h-4 w-4" />
          Upload 1-{maxImages} high-quality images of your hotel
        </p>
        <p className="text-xs mt-1">
          Supported: JPG, PNG, WebP • Max size: 5MB per image
        </p>
      </div>

      {/* Image Preview Grid */}
      {uploadedImages.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {uploadedImages.map((imageUrl, index) => (
            <Card key={index} className="relative overflow-hidden">
              <div className="aspect-video relative">
                <img
                  src={imageUrl}
                  alt={`Hotel image ${index + 1}`}
                  className="w-full h-full object-cover rounded-md"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x300?text=Image+Error';
                  }}
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-md"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Upload Progress Info */}
      {uploading && (
        <div className="text-center p-4 bg-primary/5 rounded-lg border border-primary/20">
          <Loader2 className="mx-auto h-6 w-6 animate-spin text-primary mb-2" />
          <p className="text-sm text-primary">Uploading images to cloud storage...</p>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;