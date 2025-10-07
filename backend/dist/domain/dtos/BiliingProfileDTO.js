"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCountry = exports.validateAddress = exports.validateCurrency = exports.BillingProfileQueryDTO = exports.BillingProfileResponseDTO = exports.UpdateBillingProfileDTO = exports.CreateBillingProfileDTO = void 0;
const zod_1 = require("zod");
// Base validation schemas
const currencySchema = zod_1.z.enum(['LKR', 'USD', 'EUR'], {
    errorMap: () => ({ message: 'Currency must be LKR, USD, or EUR' })
});
// Create Billing Profile DTO
exports.CreateBillingProfileDTO = zod_1.z.object({
    userId: zod_1.z.string().min(1, 'User ID is required'),
    mobile: zod_1.z.string()
        .min(10, 'Mobile number must be at least 10 characters long')
        .max(15, 'Mobile number must not exceed 15 characters')
        .regex(/^\d+$/, 'Mobile number must be numeric'),
    address: zod_1.z.string()
        .min(5, 'Address must be at least 5 characters long')
        .max(200, 'Address must not exceed 200 characters')
        .trim(),
    city: zod_1.z.string()
        .min(2, 'City must be at least 2 characters long')
        .max(50, 'City must not exceed 50 characters')
        .trim(),
    country: zod_1.z.string()
        .min(2, 'Country must be at least 2 characters long')
        .max(50, 'Country must not exceed 50 characters')
        .trim()
        .default('Sri Lanka'),
    currency: currencySchema.default('LKR'),
    isDefault: zod_1.z.boolean().default(true),
    isActive: zod_1.z.boolean().default(true)
});
// Update Billing Profile DTO (excludes userId as it shouldn't be updated)
exports.UpdateBillingProfileDTO = zod_1.z.object({
    address: zod_1.z.string()
        .min(5, 'Address must be at least 5 characters long')
        .max(200, 'Address must not exceed 200 characters')
        .trim()
        .optional(),
    mobile: zod_1.z.string()
        .min(10, 'Mobile number must be at least 10 characters long')
        .max(15, 'Mobile number must not exceed 15 characters')
        .regex(/^\d+$/, 'Mobile number must be numeric')
        .optional(),
    city: zod_1.z.string()
        .min(2, 'City must be at least 2 characters long')
        .max(50, 'City must not exceed 50 characters')
        .trim()
        .optional(),
    country: zod_1.z.string()
        .min(2, 'Country must be at least 2 characters long')
        .max(50, 'Country must not exceed 50 characters')
        .trim()
        .optional(),
    currency: currencySchema.optional(),
    isDefault: zod_1.z.boolean().optional(),
    isActive: zod_1.z.boolean().optional()
});
// Response DTO (what gets sent to frontend)
exports.BillingProfileResponseDTO = zod_1.z.object({
    mobile: zod_1.z.string(),
    address: zod_1.z.string(),
    city: zod_1.z.string(),
    country: zod_1.z.string(),
    currency: currencySchema,
});
// Query parameters for filtering billing profiles
exports.BillingProfileQueryDTO = zod_1.z.object({
    userId: zod_1.z.string().optional(),
    currency: currencySchema.optional(),
    isActive: zod_1.z.boolean().optional(),
    isDefault: zod_1.z.boolean().optional()
});
// Currency validation helper
const validateCurrency = (currency) => {
    return ['LKR', 'USD', 'EUR'].includes(currency);
};
exports.validateCurrency = validateCurrency;
// Address validation helper
const validateAddress = (address) => {
    // Basic address validation - should contain at least some text and possibly numbers
    const addressRegex = /^[a-zA-Z0-9\s,.-/]+$/;
    return addressRegex.test(address) && address.length >= 5;
};
exports.validateAddress = validateAddress;
// Country validation helper (you can expand this list)
const validateCountry = (country) => {
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
exports.validateCountry = validateCountry;
//# sourceMappingURL=BiliingProfileDTO.js.map