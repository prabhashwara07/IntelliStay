import { Request, Response, NextFunction } from 'express';
import { getAuth, clerkClient } from '@clerk/express';
import { Types } from 'mongoose';
import Review from '../infrastructure/entities/Review';
import Booking from '../infrastructure/entities/Booking';
import Hotel from '../infrastructure/entities/Hotel';
import { CreateReviewDTO } from '../domain/dtos/ReviewDTO';
import { BadRequestError, NotFoundError, ConflictError, ValidationError } from '../domain/errors';

export const createReviewForBooking = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = getAuth(req);
    const { bookingId } = req.params;

    if (!userId) {
      throw new BadRequestError('User authentication required');
    }

    if (!Types.ObjectId.isValid(bookingId)) {
      throw new BadRequestError('Invalid booking ID format');
    }

    // Validate request body
    const validatedData = CreateReviewDTO.safeParse(req.body);
    if (!validatedData.success) {
      throw new ValidationError('Invalid review data: ' + validatedData.error.message);
    }

    const { rating, comment } = validatedData.data;

    // Find the booking and verify ownership (don't populate to keep hotelId as ObjectId)
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      throw new NotFoundError('Booking not found');
    }

    if (booking.userId !== userId) {
      throw new BadRequestError('You can only review your own bookings');
    }

    // Check if booking is eligible for review
    if (booking.paymentStatus !== 'PAID') {
      throw new BadRequestError('Only paid bookings can be reviewed');
    }

    const currentDate = new Date();
    if (booking.checkOut >= currentDate) {
      throw new BadRequestError('You can only review after your checkout date has passed');
    }

    // Check if review already exists for this booking
    const existingReview = await Review.findOne({ bookingId: booking._id });
    if (existingReview) {
      throw new ConflictError('A review already exists for this booking');
    }

    // Create the review
    const review = new Review({
      rating,
      comment,
      userId,
      hotelId: booking.hotelId,
      bookingId: booking._id,
    });

    await review.save();

    // Update hotel's average rating
    await updateHotelAverageRating(booking.hotelId);

    // Get user's first name for response
    let userFirstName = 'Guest';
    try {
      const user = await clerkClient.users.getUser(userId);
      userFirstName = user.firstName || 'Guest';
    } catch (error) {
      console.warn('Could not fetch user details for review response:', error);
    }

    res.status(201).json({
      success: true,
      message: 'Review created successfully',
      data: {
        id: review._id,
        rating: review.rating,
        comment: review.comment,
        userId: review.userId,
        userFirstName,
        hotelId: review.hotelId,
        bookingId: review.bookingId,
        createdAt: review.createdAt,
        updatedAt: review.updatedAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getHotelReviews = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id: hotelId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    if (!Types.ObjectId.isValid(hotelId)) {
      throw new BadRequestError('Invalid hotel ID format');
    }

    // Check if hotel exists
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      throw new NotFoundError('Hotel not found');
    }

    // Get total count
    const total = await Review.countDocuments({ hotelId });
    
    // Get reviews with pagination
    const reviews = await Review.find({ hotelId })
      .sort({ createdAt: -1 }) // Most recent first
      .skip(skip)
      .limit(limit)
      .lean();

    // Get user details for each review
    const reviewsWithUserData = await Promise.all(
      reviews.map(async (review) => {
        let userFirstName = 'Guest';
        try {
          const user = await clerkClient.users.getUser(review.userId);
          userFirstName = user.firstName || 'Guest';
        } catch (error: any) {
          // Silently handle user not found errors - user may have been deleted
          // Only log non-404 errors
          if (error?.status !== 404) {
            console.warn(`Could not fetch user details for review ${review._id}:`, error?.message || 'Unknown error');
          }
        }

        return {
          id: review._id,
          rating: review.rating,
          comment: review.comment,
          userId: review.userId,
          userFirstName,
          hotelId: review.hotelId,
          bookingId: review.bookingId,
          createdAt: review.createdAt,
          updatedAt: review.updatedAt,
        };
      })
    );

    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      data: reviewsWithUserData,
      pagination: {
        total,
        page,
        limit,
        totalPages,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Helper function to update hotel's average rating
async function updateHotelAverageRating(hotelId: Types.ObjectId) {
  try {
    const reviews = await Review.find({ hotelId });
    
    if (reviews.length === 0) {
      await Hotel.findByIdAndUpdate(hotelId, { averageRating: 0 });
      return;
    }

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;
    
    await Hotel.findByIdAndUpdate(hotelId, { 
      averageRating: Math.round(averageRating * 10) / 10 // Round to 1 decimal place
    });
  } catch (error) {
    console.error('Failed to update hotel average rating:', error);
    // Don't throw - this is a background operation
  }
}