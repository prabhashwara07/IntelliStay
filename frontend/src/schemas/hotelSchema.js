// frontend/src/schemas/hotelSchema.js
import { z } from 'zod';

export const hotelFormSchema = z.object({
  hotelName: z
    .string()
    .min(3, 'Hotel name must be at least 3 characters')
    .max(100, 'Hotel name must be less than 100 characters')
    .trim(),
  
  description: z
    .string()
    .min(50, 'Description must be at least 50 characters')
    .max(1000, 'Description must be less than 1000 characters')
    .trim(),
  
  location: z
    .string()
    .min(5, 'Please enter a valid location (City, Country)')
    .regex(/^.+,\s*.+$/, 'Location must be in format: City, Country')
    .trim(),
  
  amenities: z
    .array(z.string())
    .min(1, 'Please select at least one amenity')
    .max(20, 'Maximum 20 amenities allowed'),
  
  imageUrls: z
    .array(z.string().url('Invalid image URL'))
    .min(1, 'Please upload at least one image')
    .max(3, 'Maximum 3 images allowed'),
});

