import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Star, Loader2 } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/src/components/ui/dialog';
import { Button } from '@/src/components/ui/button';
import { Textarea } from '@/src/components/ui/textarea';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/src/components/ui/form';
import { useCreateReviewMutation } from '@/src/store/api';
import { toast } from 'sonner';

const reviewSchema = z.object({
  rating: z.number().min(1, 'Please select a rating').max(5),
  comment: z.string()
    .min(10, 'Comment must be at least 10 characters')
    .max(500, 'Comment must be at most 500 characters')
    .trim(),
});

export default function ReviewModal({ 
  isOpen, 
  onClose, 
  booking,
  onReviewSubmitted 
}) {
  const [createReview, { isLoading: isSubmitting }] = useCreateReviewMutation();
  
  const form = useForm({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
      comment: '',
    },
  });

  const handleSubmit = async (data) => {
    try {
      const result = await createReview({
        bookingId: booking.id,
        rating: data.rating,
        comment: data.comment,
      }).unwrap();

      toast.success('Review submitted successfully!');
      
      // Call the callback to refresh bookings
      if (onReviewSubmitted) {
        onReviewSubmitted();
      }
      
      // Reset form and close modal
      form.reset();
      onClose();
    } catch (error) {
      console.error('Failed to submit review:', error);
      const errorMessage = error?.data?.message || error?.message || 'Failed to submit review';
      toast.error(errorMessage);
    }
  };

  const StarRating = ({ value, onChange }) => {
    const [hoverValue, setHoverValue] = useState(0);

    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className="p-1 transition-colors hover:scale-110 transform"
            onMouseEnter={() => setHoverValue(star)}
            onMouseLeave={() => setHoverValue(0)}
            onClick={() => onChange(star)}
          >
            <Star
              className={`h-8 w-8 transition-colors ${
                star <= (hoverValue || value)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300 hover:text-yellow-300'
              }`}
            />
          </button>
        ))}
        <span className="ml-2 text-sm text-muted-foreground">
          {value > 0 && (
            <>
              {value} out of 5 star{value !== 1 ? 's' : ''}
            </>
          )}
        </span>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Write a Review</DialogTitle>
        </DialogHeader>

        {/* Hotel Info */}
        <div className="mb-4 p-3 bg-muted rounded-lg">
          <h3 className="font-medium text-sm">{booking?.hotel?.name}</h3>
          <p className="text-xs text-muted-foreground">
            Room {booking?.room?.roomNumber} • {booking?.room?.roomType}
          </p>
          <p className="text-xs text-muted-foreground">
            {new Date(booking?.checkIn).toLocaleDateString()} - {new Date(booking?.checkOut).toLocaleDateString()}
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Star Rating */}
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rating</FormLabel>
                  <FormControl>
                    <StarRating
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Comment */}
            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Experience</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us about your stay at this hotel..."
                      className="min-h-[100px] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <div className="text-xs text-muted-foreground text-right">
                    {field.value.length}/500
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Review'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}