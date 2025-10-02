import { Request, Response } from 'express';
import { z } from 'zod';
import { clerkClient } from '@clerk/clerk-sdk-node';
import Booking from '../infrastructure/entities/Booking';
import { GetBookingsQueryDTO, BookingResponseDTO, BookingsResponseDTO } from '../domain/dtos/BookingDTO';
import { BadRequestError, NotFoundError, InternalServerError } from '../domain/errors';

export const createBooking = async (req: Request, res: Response) => {

}

export const getBookingsByUserId = async (req: Request, res: Response) => {
  // Validate query parameters
  const queryData = {
    userId: req.params.userId,
    paymentStatus: req.query.paymentStatus as string,
    startDate: req.query.startDate as string,
    endDate: req.query.endDate as string,
  };

  const validatedQuery = GetBookingsQueryDTO.parse(queryData);
  const { userId, paymentStatus, startDate, endDate } = validatedQuery;

  console.log('Validated Query:', validatedQuery);

  // Validate that userId is provided
  if (!userId) {
    throw new BadRequestError('User ID is required');
  }

  // First, verify that the user exists in Clerk
  try {
    await clerkClient.users.getUser(userId);
  } catch (error) {
    throw new NotFoundError('User not found in system');
  }

  // Build filter query
  const filter: any = { userId };

  // Add payment status filter if provided
  if (paymentStatus) {
    filter.paymentStatus = paymentStatus;
  }

  // Add date range filter if provided
  if (startDate || endDate) {
    filter.checkIn = {};
    if (startDate) {
      filter.checkIn.$gte = startDate;
    }
    if (endDate) {
      filter.checkIn.$lte = endDate;
    }
  }

  console.log('Filter applied:', filter);

  try {
    // Fetch all bookings that match the filter
    const bookings = await Booking.find(filter)
      .populate({
        path: 'hotelId',
        select: 'name imageUrls location address rooms',
        populate: {
          path: 'location',
          select: 'city country'
        }
      })
      .sort({ createdAt: -1 }) // Most recent first
      .lean(); // Use lean() for better performance

    console.log('Raw booking data:', JSON.stringify(bookings[0], null, 2));

    // Transform booking data to match DTO
    const formattedBookings = bookings.map((booking: any) => {
      const hotel = booking.hotelId;
      
      // Find the specific room from hotel.rooms array using roomId
      const room = hotel.rooms?.find((r: any) => r._id.toString() === booking.roomId.toString());
      
      console.log('Processing booking:', {
        bookingId: booking._id,
        hotelName: hotel.name,
        roomId: booking.roomId,
        roomFound: !!room,
        roomDetails: room
      });
      
      return {
        id: booking._id.toString(),
        userId: booking.userId,
        hotel: {
          id: hotel._id.toString(),
          name: hotel.name || 'Unknown Hotel',
          imageUrls: hotel.imageUrls || [],
          location: hotel.location && hotel.location.city && hotel.location.country ? {
            city: hotel.location.city,
            country: hotel.location.country,
          } : undefined,
          address: hotel.address || undefined,
        },
        room: room ? {
          id: room._id.toString(),
          roomNumber: room.roomNumber,
          roomType: room.roomType,
          pricePerNight: room.pricePerNight,
          maxGuests: room.maxGuests,
        } : null,
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
        numberOfGuests: booking.numberOfGuests,
        totalPrice: booking.totalPrice,
        paymentStatus: booking.paymentStatus,
        createdAt: booking.createdAt,
        updatedAt: booking.updatedAt,
      };
    });

    // Validate each booking response
    const validatedBookings = formattedBookings.map(booking => 
      BookingResponseDTO.parse(booking)
    );

    // Validate complete response
    const validatedResponse = BookingsResponseDTO.parse(validatedBookings);

    res.status(200).json({
      success: true,
      message: `Found ${validatedBookings.length} booking${validatedBookings.length !== 1 ? 's' : ''} for user`,
      data: validatedResponse,
      filters: {
        paymentStatus: paymentStatus || 'all',
        dateRange: startDate || endDate ? { startDate, endDate } : 'all',
      },
    });

  } catch (error) {
    console.error('Error fetching bookings:', error);
    throw new InternalServerError('Failed to fetch bookings');
  }
}