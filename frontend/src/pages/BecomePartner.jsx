import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { useCreateHotelMutation, useGetOwnerHotelsQuery } from '@/src/store/api';
import { hotelFormSchema } from '@/src/schemas/hotelSchema';

import { Card, CardContent, CardHeader } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Badge } from '@/src/components/ui/badge';
import { Alert, AlertDescription } from '@/src/components/ui/alert';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/src/components/ui/form';

import { 
  Building2, 
  MapPin, 
  MessageSquare, 
  Loader2, 
  CheckCircle, 
  ImageIcon,
  AlertCircle 
} from 'lucide-react';

import { PREDEFINED_AMENITIES } from '@/src/utils/amenities';
import ImageUpload from '@/src/components/ImageUpload';

export default function BecomePartner() {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [createHotel, { isLoading: isSubmitting, error: apiError }] = useCreateHotelMutation();
  
  // NEW: Check if user already has a hotel
  const { data: ownerHotelsData, isLoading: isLoadingHotels } = useGetOwnerHotelsQuery(undefined, { 
    skip: !user 
  });
  const existingHotel = ownerHotelsData?.data?.[0]; // Get the single hotel if it exists

  const form = useForm({
    resolver: zodResolver(hotelFormSchema),
    defaultValues: {
      hotelName: '',
      description: '',
      location: '',
      amenities: [],
      imageUrls: [],
    },
  });

  const { watch, setValue, handleSubmit, formState: { errors } } = form;
  const watchedAmenities = watch('amenities');
  const watchedImageUrls = watch('imageUrls');

  const toggleAmenity = (amenityKey) => {
    const currentAmenities = watchedAmenities;
    const newAmenities = currentAmenities.includes(amenityKey)
      ? currentAmenities.filter(a => a !== amenityKey)
      : [...currentAmenities, amenityKey];
    
    setValue('amenities', newAmenities, { shouldValidate: true });
  };

  const handleImagesUploaded = (imageUrls) => {
    setValue('imageUrls', imageUrls, { shouldValidate: true });
  };

  const onSubmit = async (data) => {
    try {
      // Call the API directly - middleware will handle authentication
      const response = await createHotel(data).unwrap();

      if (response.success) {
        setIsSubmitted(true);
        form.reset();
      }
    } catch (error) {
      console.error('Hotel creation error:', error);
      // Error will be handled by the error display below
    }
  };

  if (!isLoaded || isLoadingHotels) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 pt-28 pb-10">
          <div className="max-w-2xl mx-auto text-center">
            <Card className="p-8">
              <h1 className="text-3xl font-bold text-foreground mb-4">Join Our Partner Network</h1>
              <p className="text-muted-foreground mb-6">Please sign in to apply as a hotel partner</p>
              <Button onClick={() => window.location.href = '/sign-in'}>
                Sign In to Continue
              </Button>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // NEW: Show existing hotel status if user already has one
  if (existingHotel) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 pt-28 pb-10">
          <div className="max-w-2xl mx-auto">
            <Card className="p-8">
              <div className="text-center">
                <Building2 className="h-16 w-16 mx-auto mb-4 text-primary" />
                <h1 className="text-2xl font-bold mb-4">Hotel Already Registered</h1>
                
                <div className="bg-muted p-6 rounded-lg mb-6">
                  <h2 className="text-lg font-semibold mb-2">{existingHotel.name}</h2>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-sm text-muted-foreground">Status:</span>
                    <Badge className={
                      existingHotel.status === 'approved' ? 'bg-green-100 text-green-700 border-green-200' :
                      existingHotel.status === 'pending' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                      'bg-red-100 text-red-700 border-red-200'
                    }>
                      {existingHotel.status.charAt(0).toUpperCase() + existingHotel.status.slice(1)}
                    </Badge>
                  </div>
                </div>

                {existingHotel.status === 'approved' && (
                  <div className="space-y-4">
                    <p className="text-muted-foreground mb-4">
                      Your hotel has been approved! You can now manage your rooms and bookings.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Button 
                        onClick={() => navigate('/dashboard/rooms')}
                        className="bg-primary hover:bg-primary/90"
                      >
                        Manage Rooms
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => navigate('/dashboard/bookings')}
                      >
                        View Bookings
                      </Button>
                    </div>
                  </div>
                )}

                {existingHotel.status === 'pending' && (
                  <div className="space-y-4">
                    <p className="text-muted-foreground">
                      Your hotel registration is under review. We'll notify you within 24 hours.
                    </p>
                    <Button variant="outline" onClick={() => navigate('/')}>
                      Back to Home
                    </Button>
                  </div>
                )}

                {existingHotel.status === 'rejected' && (
                  <div className="space-y-4">
                    <p className="text-muted-foreground">
                      Unfortunately, your hotel registration was not approved. Please contact support for more information.
                    </p>
                    <Button variant="outline" onClick={() => navigate('/contact')}>
                      Contact Support
                    </Button>
                  </div>
                )}

                <div className="mt-6 pt-6 border-t text-center text-sm text-muted-foreground">
                  <p>Each hotel owner can only register one hotel property.</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 pt-28 pb-10">
          <div className="max-w-2xl mx-auto text-center">
            <Card className="p-8">
              <div className="text-green-500 mb-4">
                <CheckCircle className="h-16 w-16 mx-auto" />
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-4">Hotel Submitted Successfully!</h1>
              <p className="text-muted-foreground mb-6">
                Thank you for adding your hotel to IntelliStay. We'll review your submission and notify you within 24 hours.
              </p>
              <p className="text-sm text-muted-foreground mb-6">
                You'll receive confirmation at <strong>{user?.emailAddresses?.[0]?.emailAddress}</strong>
              </p>
              <div className="flex gap-4 justify-center">
                <Button onClick={() => window.location.href = '/'} variant="outline">
                  Return to Home
                </Button>
                <Button onClick={() => {
                  setIsSubmitted(false);
                  form.reset();
                }}>
                  Add Another Hotel
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 pt-28 pb-10">
        {/* Page Header */}
        <div className="max-w-3xl mx-auto mb-8">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">Add Your Hotel</Badge>
          <h1 className="text-4xl font-bold text-foreground mb-4">List Your Hotel</h1>
          <p className="text-xl text-muted-foreground">
            Add your hotel to IntelliStay and start welcoming guests
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Card className="p-8">
            <CardHeader className="px-0 pt-0">
              <h2 className="text-2xl font-semibold text-foreground">Hotel Details</h2>
              <p className="text-muted-foreground">
                Provide basic information about your hotel. All fields are required.
              </p>
            </CardHeader>

            <CardContent className="px-0 pb-0">
              {/* Error Alert */}
              {apiError && (
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {apiError?.data?.message || 'Failed to submit hotel. Please try again.'}
                  </AlertDescription>
                </Alert>
              )}

              <Form {...form}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                  {/* Hotel Information */}
                  <section className="p-6 rounded-lg border border-border/40 bg-card/30">
                    <div className="flex items-center gap-2 mb-6">
                      <div className="p-2 rounded-md bg-primary/10 border border-primary/20">
                        <Building2 className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="text-lg font-semibold text-foreground">Hotel Information</h3>
                    </div>
                    
                    <div className="space-y-6">
                      <FormField
                        control={form.control}
                        name="hotelName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-foreground">
                              Hotel Name *
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Your Hotel Name"
                                className="border-2 border-border/60 focus:border-primary/50 shadow-sm hover:border-border transition-colors"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-foreground">
                              <MapPin className="inline h-4 w-4 mr-1" />
                              Location *
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="City, Country (e.g., Colombo, Sri Lanka)"
                                className="border-2 border-border/60 focus:border-primary/50 shadow-sm hover:border-border transition-colors"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-foreground">
                              <MessageSquare className="inline h-4 w-4 mr-1" />
                              Description *
                            </FormLabel>
                            <FormControl>
                              <textarea
                                {...field}
                                placeholder="Describe your hotel, its features, and what makes it special... (min 50 characters)"
                                rows={4}
                                className="w-full rounded-md border-2 border-border/60 bg-background px-3 py-2 text-sm shadow-sm outline-none focus:border-primary/50 hover:border-border transition-colors resize-none"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </section>

                  {/* Amenities Selection */}
                  <section className="p-6 rounded-lg border border-border/40 bg-card/30">
                    <div className="flex items-center gap-2 mb-6">
                      <div className="p-2 rounded-md bg-primary/10 border border-primary/20">
                        <CheckCircle className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="text-lg font-semibold text-foreground">Hotel Amenities</h3>
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="amenities"
                      render={() => (
                        <FormItem>
                          <FormLabel className="text-sm text-muted-foreground">
                            Select all amenities available at your hotel:
                          </FormLabel>
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-4">
                            {Object.entries(PREDEFINED_AMENITIES).map(([key, amenity]) => {
                              const IconComponent = amenity.icon;
                              const isSelected = watchedAmenities.includes(key);
                              
                              return (
                                <button
                                  key={key}
                                  type="button"
                                  onClick={() => toggleAmenity(key)}
                                  className={`p-3 rounded-lg border-2 text-sm flex flex-col items-center gap-2 transition-all hover:scale-105 ${
                                    isSelected 
                                      ? 'border-primary bg-primary/10 text-primary shadow-md' 
                                      : 'border-border/60 bg-background text-foreground hover:border-border shadow-sm'
                                  }`}
                                >
                                  <IconComponent className="h-5 w-5" />
                                  <span className="text-xs font-medium text-center leading-tight">
                                    {amenity.label}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                          
                          {watchedAmenities.length > 0 && (
                            <div className="mt-4 p-3 bg-primary/5 rounded-lg border border-primary/20">
                              <p className="text-sm text-primary font-medium mb-2">
                                Selected amenities ({watchedAmenities.length}):
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {watchedAmenities.map(key => (
                                  <Badge key={key} variant="secondary" className="text-xs">
                                    {PREDEFINED_AMENITIES[key]?.label}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </section>

                  {/* Hotel Images Section */}
                  <section className="p-6 rounded-lg border-2 border-border/60 bg-card/30">
                    <div className="flex items-center gap-2 mb-6">
                      <div className="p-2 rounded-md bg-primary/10 border border-primary/20">
                        <ImageIcon className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="text-lg font-semibold text-foreground">Hotel Images *</h3>
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="imageUrls"
                      render={() => (
                        <FormItem>
                          <ImageUpload 
                            onImagesUploaded={handleImagesUploaded}
                            maxImages={3}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </section>

                  {/* Submit Button */}
                  <div className="flex flex-col items-center space-y-4 pt-4">
                    <Button 
                      type="submit" 
                      size="lg" 
                      disabled={isSubmitting}
                      className="w-full md:w-auto px-8"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Submitting Hotel...
                        </>
                      ) : (
                        'Add My Hotel'
                      )}
                    </Button>
                    
                    <p className="text-sm text-muted-foreground text-center max-w-md">
                      By adding your hotel, you agree to our terms of service. 
                      Your hotel will be reviewed and listed within 24 hours.
                    </p>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}