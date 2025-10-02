import React, { useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/src/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/src/components/ui/form';
import { Input } from '@/src/components/ui/input';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';
import { useGetBillingProfileQuery, useCreateOrUpdateBillingProfileMutation } from '@/src/store/api';

// Single schema for form validation, matching the backend DTO
const billingSchema = z.object({
  mobile: z.string().min(10, 'A valid phone number is required'),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  country: z.string().min(2, 'Country is required'),
  currency: z.enum(['LKR', 'USD', 'EUR']),
});

export default function BillingProfileDialog({ open, onOpenChange }) {
  const { user, isLoaded } = useUser();
  
  const { 
    data: billingProfile, 
    isLoading: isLoadingProfile,
    isFetching,
    refetch,
    error: queryError,
    isSuccess: isQuerySuccess,
  } = useGetBillingProfileQuery(
    user?.id,
    { 
      skip: !user || !open,
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
    }
  );
  
  const [
    createOrUpdateProfile, 
    { 
      isLoading: isSubmitting, 
      isSuccess,
      isError: isMutationError,
      error: mutationError,
      reset: resetMutation 
    }
  ] = useCreateOrUpdateBillingProfileMutation();

  const form = useForm({
    resolver: zodResolver(billingSchema),
    defaultValues: {
      mobile: '',
      address: '',
      city: '',
      country: 'Sri Lanka',
      currency: 'LKR',
    },
    mode: 'onChange',
  });

  // Refetch data when dialog opens
  useEffect(() => {
    if (open && user) {
      refetch();
    }
  }, [open, user, refetch]);

  // FIXED: Populate form when data is available
  useEffect(() => {
    if (open && billingProfile?.data && user && !isLoadingProfile) {
      // Access the nested data property
      const profileData = billingProfile.data;
      
      const formData = {
        mobile: profileData.mobile || '',
        address: profileData.address || '',
        city: profileData.city || '',
        country: profileData.country || 'Sri Lanka',
        currency: profileData.currency || 'LKR',
      };
      
      // Set each field
      Object.entries(formData).forEach(([key, value]) => {
        form.setValue(key, value, { 
          shouldValidate: false, 
          shouldDirty: false,
          shouldTouch: false 
        });
      });
      
      // Alternative: Use reset if setValue doesn't work
      // form.reset(formData);
    }
  }, [open, billingProfile, user, isLoadingProfile, form]);

  // Reset mutation states when dialog closes
  useEffect(() => {
    if (!open) {
      resetMutation();
    }
  }, [open, resetMutation]);



  const onSubmit = async (values) => {
    if (!user) return;
    
    try {
      const result = await createOrUpdateProfile({ 
        ...values, 
        userId: user.id 
      }).unwrap();
      
      // Close dialog immediately after successful save
      onOpenChange(false);
      resetMutation();
      
      // Show success notification after dialog closes
      toast.success('Profile saved successfully!', {
        description: 'Your billing information has been updated.',
        duration: 4000,
      });
      
      // Refetch in background after dialog closes (optional)
      refetch();
      
    } catch (err) {
      console.error('Failed to save billing profile:', err);
      toast.error('Failed to save profile', {
        description: 'Please check your information and try again.',
        duration: 4000,
      });
    }
  };
  
  const formatLabel = (text) => text.replace(/([A-Z])/g, ' $1').trim();
  const isLoading = !isLoaded || isLoadingProfile;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <DialogTitle>Billing Profile</DialogTitle>
              <DialogDescription className="mt-1 text-xs max-w-xl">
                Provide details required for checkout. Your email is read-only from your account.
              </DialogDescription>
            </div>
            <div className="flex gap-2">
              {isSuccess && (
                <Badge variant="outline" className="text-emerald-600 border-emerald-300 bg-emerald-50">
                  Saved
                </Badge>
              )}
              {isMutationError && (
                <Badge variant="outline" className="text-red-600 border-red-300 bg-red-50">
                  Error
                </Badge>
              )}
            </div>
          </div>
        </DialogHeader>

        {isLoading ? (
          <div className="py-16 text-center text-muted-foreground">
            Loading billing profile...
          </div>
        ) : !user ? (
          <div className="py-16 text-center text-muted-foreground">
            Please sign in to manage billing.
          </div>
        ) : queryError ? (
          <div className="py-16 text-center text-red-500">
            Error loading billing profile. Please try again.
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name (Read-only) */}
                <div className="flex flex-col gap-1 mt-1">
                  <label className="text-xs font-medium">Name</label>
                  <Input 
                    className="border-gray-500" 
                    disabled 
                    value={`${user.firstName || ''} ${user.lastName || ''}`.trim()} 
                  />
                </div>

                {/* Email (Read-only) */}
                <div className="flex flex-col gap-1 mt-1">
                  <label className="text-xs font-medium">Email</label>
                  <Input 
                    className="border-gray-500" 
                    disabled 
                    value={user.primaryEmailAddress?.emailAddress || ''} 
                  />
                </div>

                {/* Address */}
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel className="text-xs capitalize">
                        {formatLabel(field.name)} *
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="123 Main Street" 
                          {...field} 
                          className="border-gray-400"
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )}
                />
                
                {/* Mobile */}
                <FormField
                  control={form.control}
                  name="mobile"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs capitalize">
                        {formatLabel(field.name)} *
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="+94 71 234 5678" 
                          {...field} 
                          className="border-gray-400"
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )}
                />

                {/* City */}
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs capitalize">
                        {formatLabel(field.name)} *
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Colombo" 
                          {...field} 
                          className="border-gray-400"
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )}
                />

                {/* Country */}
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs capitalize">
                        {formatLabel(field.name)} *
                      </FormLabel>
                      <FormControl>
                        <select 
                          {...field} 
                          className="h-10 border-gray-400 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          disabled={isSubmitting}
                        >
                          <option value="Sri Lanka">Sri Lanka</option>
                          <option value="India">India</option>
                          <option value="United States">United States</option>
                          <option value="United Kingdom">United Kingdom</option>
                        </select>
                      </FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )}
                />

                {/* Currency */}
                <FormField
                  control={form.control}
                  name="currency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs capitalize">
                        {formatLabel(field.name)}
                      </FormLabel>
                      <FormControl>
                        <select 
                          {...field} 
                          className="h-10 w-full rounded-md border border-gray-400 bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          disabled={isSubmitting}
                        >
                          <option value="LKR">LKR - Sri Lankan Rupee</option>
                          <option value="USD">USD - US Dollar</option>
                          <option value="EUR">EUR - Euro</option>
                        </select>
                      </FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Error Message Display */}
              {isMutationError && (
                <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                  {mutationError?.data?.message || 'Failed to save billing profile. Please try again.'}
                </div>
              )}

              {/* Submit Button */}
              <div className="mt-6 flex items-center gap-4">
                <Button 
                  type="submit" 
                  size="sm" 
                  disabled={isSubmitting || !form.formState.isValid}
                >
                  {isSubmitting ? 'Saving…' : 'Save Billing Profile'}
                </Button>
                <span className="text-[11px] text-muted-foreground">
                  * Required for checkout payload
                </span>
              </div>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}