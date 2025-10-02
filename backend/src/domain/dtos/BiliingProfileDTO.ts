import { z } from 'zod';

// Base validation schemas
const currencySchema = z.enum(['LKR', 'USD', 'EUR'], {
  errorMap: () => ({ message: 'Currency must be LKR, USD, or EUR' })
});

// Create Billing Profile DTO
export const CreateBillingProfileDTO = z.object({
  userId: z.string().min(1, 'User ID is required'),
  mobile: z.string()
    .min(10, 'Mobile number must be at least 10 characters long')
    .max(15, 'Mobile number must not exceed 15 characters')
    .regex(/^\d+$/, 'Mobile number must be numeric'),
  address: z.string()
    .min(5, 'Address must be at least 5 characters long')
    .max(200, 'Address must not exceed 200 characters')
    .trim(),
  city: z.string()
    .min(2, 'City must be at least 2 characters long')
    .max(50, 'City must not exceed 50 characters')
    .trim(),
  country: z.string()
    .min(2, 'Country must be at least 2 characters long')
    .max(50, 'Country must not exceed 50 characters')
    .trim()
    .default('Sri Lanka'),
  currency: currencySchema.default('LKR'),
  isDefault: z.boolean().default(true),
  isActive: z.boolean().default(true)
});

// Update Billing Profile DTO (excludes userId as it shouldn't be updated)
export const UpdateBillingProfileDTO = z.object({
  address: z.string()
    .min(5, 'Address must be at least 5 characters long')
    .max(200, 'Address must not exceed 200 characters')
    .trim()
    .optional(),
    mobile: z.string()
    .min(10, 'Mobile number must be at least 10 characters long')
    .max(15, 'Mobile number must not exceed 15 characters')
    .regex(/^\d+$/, 'Mobile number must be numeric')
    .optional(),
  city: z.string()
    .min(2, 'City must be at least 2 characters long')
    .max(50, 'City must not exceed 50 characters')
    .trim()
    .optional(),
  country: z.string()
    .min(2, 'Country must be at least 2 characters long')
    .max(50, 'Country must not exceed 50 characters')
    .trim()
    .optional(),
  currency: currencySchema.optional(),
  isDefault: z.boolean().optional(),
  isActive: z.boolean().optional()
});

// Response DTO (what gets sent to frontend)
export const BillingProfileResponseDTO = z.object({
  
    mobile:z.string(),
  address: z.string(),
  city: z.string(),
  country: z.string(),
  currency: currencySchema,
  
});

// Query parameters for filtering billing profiles
export const BillingProfileQueryDTO = z.object({
  userId: z.string().optional(),
  currency: currencySchema.optional(),
  isActive: z.boolean().optional(),
  isDefault: z.boolean().optional()
});

// Type exports for use in controllers and services
export type CreateBillingProfileInput = z.infer<typeof CreateBillingProfileDTO>;
export type UpdateBillingProfileInput = z.infer<typeof UpdateBillingProfileDTO>;
export type BillingProfileResponse = z.infer<typeof BillingProfileResponseDTO>;
export type BillingProfileQuery = z.infer<typeof BillingProfileQueryDTO>;

// Currency validation helper
export const validateCurrency = (currency: string): currency is 'LKR' | 'USD' | 'EUR' => {
  return ['LKR', 'USD', 'EUR'].includes(currency);
};

// Address validation helper
export const validateAddress = (address: string): boolean => {
  // Basic address validation - should contain at least some text and possibly numbers
  const addressRegex = /^[a-zA-Z0-9\s,.-/]+$/;
  return addressRegex.test(address) && address.length >= 5;
};

// Country validation helper (you can expand this list)
export const validateCountry = (country: string): boolean => {
  const supportedCountries = [
    'Sri Lanka',
    'India', 
    'United States',
    'United Kingdom',
    'Canada',
    'Australia',
    'Singapore',
    'Malaysia',
    'Thailand'
  ];
  return supportedCountries.includes(country);
};
