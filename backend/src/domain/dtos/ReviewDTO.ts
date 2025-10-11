import { z } from 'zod';

export const CreateReviewDTO = z.object({
  rating: z.number().int().min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5'),
  comment: z.string()
    .min(10, 'Comment must be at least 10 characters')
    .max(500, 'Comment must be at most 500 characters')
    .trim(),
});

export const ReviewResponseDTO = z.object({
  id: z.string(),
  rating: z.number(),
  comment: z.string(),
  userId: z.string(),
  userFirstName: z.string(),
  hotelId: z.string(),
  bookingId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const ReviewsResponseDTO = z.object({
  data: z.array(ReviewResponseDTO),
  pagination: z.object({
    total: z.number(),
    page: z.number(),
    limit: z.number(),
    totalPages: z.number(),
  }),
});

export type CreateReview = z.infer<typeof CreateReviewDTO>;
export type ReviewResponse = z.infer<typeof ReviewResponseDTO>;
export type ReviewsResponse = z.infer<typeof ReviewsResponseDTO>;