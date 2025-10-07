// frontend/src/hooks/useCloudinaryUpload.js
import { useState } from 'react';

const useCloudinaryUpload = () => {
  const [uploading, setUploading] = useState(false);

  const uploadImages = async (files) => {
    setUploading(true);
    const uploadedUrls = [];

    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
        formData.append('folder', 'intellistay/hotels');

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
          {
            method: 'POST',
            body: formData,
          }
        );

        const data = await response.json();
        
        if (data.secure_url) {
          uploadedUrls.push(data.secure_url);
        } else {
          throw new Error('Upload failed');
        }
      }

      return uploadedUrls;
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw error;
    } finally {
      setUploading(false);
    }
  };

  return { uploadImages, uploading };
};

export default useCloudinaryUpload;