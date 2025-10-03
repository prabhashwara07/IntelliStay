import { Request, Response } from 'express';
import { z } from 'zod';
import { Types } from 'mongoose';
import Booking from '../infrastructure/entities/Booking';
import Hotel from '../infrastructure/entities/Hotel';
import { CreateBookingDTO, GetBookingsQueryDTO, BookingResponseDTO, BookingsResponseDTO } from '../domain/dtos/BookingDTO';
import { BadRequestError, NotFoundError, InternalServerError } from '../domain/errors';

export const createBooking = async (req: Request, res: Response) => {
  // Validate request body
  const validatedData = CreateBookingDTO.safeParse(req.body);
  if (!validatedData.success) {
    console.error('Validation failed:', validatedData.error);
    throw new BadRequestError('Invalid booking data');
  }

  const { userId, hotelId, roomId, checkIn, checkOut, numberOfGuests } = validatedData.data;

  console.log('Creating booking with validated data:', validatedData);

  // Validate ObjectId formats
  if (!Types.ObjectId.isValid(hotelId)) {
    throw new BadRequestError('Invalid hotel ID format');
  }
  if (!Types.ObjectId.isValid(roomId)) {
    throw new BadRequestError('Invalid room ID format');
  }

  try {
    // Find the hotel and verify it exists
    const hotel = await Hotel.findById(hotelId).lean();
    if (!hotel) {
      throw new NotFoundError('Hotel not found');
    }

    // Find the specific room within the hotel
    const room = hotel.rooms.find((r: any) => r._id.toString() === roomId);
    if (!room) {
      throw new NotFoundError('Room not found in the specified hotel');
    }

    // Check if room is available
    if (!room.isAvailable) {
      throw new BadRequestError('Room is not available for booking');
    }

    // Validate number of guests against room capacity
    if (numberOfGuests > room.maxGuests) {
      throw new BadRequestError(`Room can accommodate maximum ${room.maxGuests} guests, but ${numberOfGuests} requested`);
    }

    // Check for existing bookings that conflict with the requested dates
    const conflictingBooking = await Booking.findOne({
      roomId: new Types.ObjectId(roomId),
      $or: [
        // New booking starts within existing booking
        { checkIn: { $lte: checkIn }, checkOut: { $gt: checkIn } },
        // New booking ends within existing booking
        { checkIn: { $lt: checkOut }, checkOut: { $gte: checkOut } },
        // New booking completely encompasses existing booking
        { checkIn: { $gte: checkIn }, checkOut: { $lte: checkOut } }
      ],
      paymentStatus: { $ne: 'FAILED' } // Don't consider failed bookings as conflicts
    });

    if (conflictingBooking) {
      throw new BadRequestError('Room is already booked for the selected dates');
    }

    // Calculate total price (number of nights * price per night)
    const numberOfNights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    const totalPrice = numberOfNights * room.pricePerNight;

    // Create the booking
    const newBooking = new Booking({
      userId,
      hotelId: new Types.ObjectId(hotelId),
      roomId: new Types.ObjectId(roomId),
      checkIn,
      checkOut,
      numberOfGuests,
      totalPrice,
      paymentStatus: 'PENDING'
    });

    // Save the booking
    const savedBooking = await newBooking.save();

    console.log('Booking created successfully:', savedBooking._id);

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      bookingDetails: {
        bookingId: savedBooking._id,
        totalNights: numberOfNights,
        pricePerNight: room.pricePerNight,
        totalPrice: totalPrice,
      }
    });

  } catch (error) {
    console.error('Error creating booking:', error);
    if (error instanceof BadRequestError || error instanceof NotFoundError) {
      throw error;
    }
    throw new InternalServerError('Failed to create booking');
  }
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