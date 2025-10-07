import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import { Types } from 'mongoose';
import Booking from '../infrastructure/entities/Booking';
import Hotel from '../infrastructure/entities/Hotel';
import { CreateBookingDTO, GetBookingsQueryDTO, BookingResponseDTO, BookingsResponseDTO } from '../domain/dtos/BookingDTO';
import { BadRequestError, NotFoundError, InternalServerError } from '../domain/errors';
import crypto from 'crypto';
import { clerkClient, getAuth } from '@clerk/express';
import generateHash from './utils/payhere';

export const createBooking = async (req: Request, res: Response, next: NextFunction) => {
  
  const userId = getAuth(req).userId;
  const billingProfile = req.billingProfile;

  
  const validatedData = CreateBookingDTO.safeParse(req.body);
  if (!validatedData.success) {
    throw new BadRequestError('Invalid booking data');
  }

  const { hotelId, roomId, checkIn, checkOut, numberOfGuests } = validatedData.data;


  
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
        { checkIn: { $lte: checkIn }, checkOut: { $gt: checkIn } },
        { checkIn: { $lt: checkOut }, checkOut: { $gte: checkOut } },
        { checkIn: { $gte: checkIn }, checkOut: { $lte: checkOut } }
      ],
      paymentStatus: { $ne: 'FAILED' }
    });

    if (conflictingBooking) {
      throw new BadRequestError('Room is already booked for the selected dates');
    }

    // Calculate total price
    const numberOfNights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    const totalPrice = numberOfNights * room.pricePerNight;

    // Create the booking with userId from auth middleware
    const newBooking = new Booking({
      userId, // From req.auth.userId
      hotelId: new Types.ObjectId(hotelId),
      roomId: new Types.ObjectId(roomId),
      checkIn,
      checkOut,
      numberOfGuests,
      totalPrice,
      paymentStatus: 'PENDING'
    });

    const savedBooking  = await newBooking.save() as any;

    let firstName ;
    let lastName ;
    let email ;
    
    try {
      const user = await clerkClient.users.getUser(userId!);
      firstName = user.firstName;
      lastName = user.lastName;
      email = user.primaryEmailAddress?.emailAddress;
      
    } catch (error) {
      throw new InternalServerError('Failed to fetch user');
    }
  
    const paymentData = {
      merchant_id: `${process.env.PAYHERE_MERCHANT_ID}`,
      return_url: `${process.env.FRONTEND_URL}/bookings`,
      cancel_url: `${process.env.FRONTEND_URL}/bookings`,
      notify_url: `${process.env.BACKEND_URL}/bookings/payment/notify`,
      first_name: firstName,
      last_name: lastName,
      email: email,
      phone: billingProfile?.mobile,
      address: billingProfile?.address,
      city: billingProfile?.city,
      country: billingProfile?.country,
      order_id: savedBooking._id.toString(),
      items: `${hotel.name} - Room Booking`,
      currency:  'LKR',
      amount: Number(totalPrice).toFixed(2),
      hash: generateHash(savedBooking._id.toString(), Number(totalPrice).toFixed(2)),
    };

    console.log('Payment data prepared:', paymentData);

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      bookingDetails: {
        bookingId: savedBooking._id,
        totalNights: numberOfNights,
        pricePerNight: room.pricePerNight,
        totalPrice: totalPrice,
        mobile: billingProfile?.mobile,
      },
      paymentData: paymentData,
      checkoutUrl: 'https://sandbox.payhere.lk/pay/checkout' // PayHere sandbox URL
    });

  } catch (error) {
    next(error);
  }
};


export const getBookingsByUserId = async (req: Request, res: Response, next: NextFunction) => {
  // Validate query parameters
  const queryData = {
    userId: req.params.userId,
    paymentStatus: req.query.paymentStatus as string,
    startDate: req.query.startDate as string,
    endDate: req.query.endDate as string,
  };

  const validatedQuery = GetBookingsQueryDTO.parse(queryData);
  const { userId, paymentStatus, startDate, endDate } = validatedQuery;


  
  const filter: any = { userId };

  
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


  try {
    const bookings = await Booking.find(filter)
      .populate({
        path: 'hotelId',
        select: 'name imageUrls location address rooms',
        populate: {
          path: 'location',
          select: 'city country'
        }
      })
      .sort({ createdAt: -1 })
      .lean(); // Use lean() for better performance


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
    next(error);
  }
}

export const verifyBooking = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log('Raw request body:', req.body);
    console.log('Request headers:', req.headers);

    // Check if req.body exists
    if (!req.body) {
      throw new BadRequestError('Request body is missing');
    }

    // Extract PayHere POST data
    const {
      merchant_id,
      order_id,
      payhere_amount,
      payhere_currency,
      status_code,
      md5sig
    } = req.body;

    console.log('PayHere verification request:', {
      merchant_id,
      order_id,
      payhere_amount,
      payhere_currency,
      status_code,
      md5sig
    });

    // Validate required fields
    if (!merchant_id || !order_id || !payhere_amount || !payhere_currency || !status_code || !md5sig) {
      throw new BadRequestError('Missing required PayHere verification data');
    }

    const merchant_secret = process.env.PAYHERE_MERCHANT_SECRET;
    if (!merchant_secret) {
      throw new InternalServerError('Merchant secret not configured');
    }

    // Generate local MD5 signature for verification
    const hashedSecret = crypto.createHash('md5').update(merchant_secret).digest('hex').toUpperCase();
    
    const signatureString = merchant_id + order_id + payhere_amount + payhere_currency + status_code + hashedSecret;
    const local_md5sig = crypto.createHash('md5').update(signatureString).digest('hex').toUpperCase();

    console.log('Signature verification:', {
      received_signature: md5sig,
      calculated_signature: local_md5sig,
      signatures_match: local_md5sig === md5sig,
      status_code: status_code,
      is_success: status_code == 2
    });

    // Verify signature and payment success
    if (local_md5sig === md5sig && status_code == 2) {
      // Payment is successful and verified
      
      // Find and update the booking
      const booking = await Booking.findById(order_id);
      if (!booking) {
        throw new NotFoundError('Booking not found');
      }

      // Update booking payment status
      booking.paymentStatus = 'PAID';
      await booking.save();

      console.log(`Payment verified and booking ${order_id} updated successfully`);

      res.status(200).json({ 
        success: true, 
        message: 'Payment verified and booking updated successfully' 
      });

    } else if (local_md5sig === md5sig && status_code == 0) {
      // Payment is pending
      const booking = await Booking.findById(order_id);
      if (booking) {
        booking.paymentStatus = 'PENDING';
        await booking.save();
      }

      res.status(200).json({ 
        success: true, 
        message: 'Payment is pending' 
      });

    } else if (local_md5sig === md5sig && status_code == -1) {
      // Payment was canceled
      const booking = await Booking.findById(order_id);
      if (booking) {
        booking.paymentStatus = 'CANCELLED';
        await booking.save();
      }

      res.status(200).json({ 
        success: true, 
        message: 'Payment was cancelled' 
      });

    } else if (local_md5sig === md5sig && status_code == -2) {
      // Payment failed
      const booking = await Booking.findById(order_id);
      if (booking) {
        booking.paymentStatus = 'FAILED';
        await booking.save();
      }

      res.status(200).json({ 
        success: true, 
        message: 'Payment failed' 
      });

    } else {
      // Invalid signature or unknown status
      console.error('Invalid payment verification:', {
        signature_match: local_md5sig === md5sig,
        status_code: status_code
      });

      throw new BadRequestError('Invalid payment verification signature or status');
    }

  } catch (error) {
    console.error('Payment verification error:', error);
    next(error);
  }
}

// Fetch bookings for hotels owned by the authenticated owner
export const getBookingsForOwner = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = getAuth(req).userId;
    

    const { paymentStatus, startDate, endDate, hotelId } = req.query as {
      paymentStatus?: string;
      startDate?: string;
      endDate?: string;
      hotelId?: string;
    };

    // Find hotels owned by this user (optionally filter by a specific hotel)
    const hotelFilter: any = { ownerId: userId };
    if (hotelId) {
      if (!Types.ObjectId.isValid(hotelId)) {
        throw new BadRequestError('Invalid hotel ID');
      }
      hotelFilter._id = new Types.ObjectId(hotelId);
    }
    const ownerHotels = await Hotel.find(hotelFilter).select('_id').lean();
    const ownerHotelIds = ownerHotels.map(h => h._id);

    // If owner has no hotels, return empty
    if (ownerHotelIds.length === 0) {
      return res.status(200).json({ success: true, data: [] });
    }

    // Build booking filter
    const filter: any = { hotelId: { $in: ownerHotelIds } };
    if (paymentStatus && ['PENDING', 'PAID', 'FAILED', 'CANCELLED'].includes(paymentStatus)) {
      filter.paymentStatus = paymentStatus;
    }
    if (startDate || endDate) {
      filter.checkIn = {};
      if (startDate) filter.checkIn.$gte = new Date(startDate);
      if (endDate) filter.checkIn.$lte = new Date(endDate);
    }

    const bookings = await Booking.find(filter)
      .populate({
        path: 'hotelId',
        select: 'name imageUrls location address rooms',
        populate: { path: 'location', select: 'city country' }
      })
      .sort({ createdAt: -1 })
      .lean();

    const formatted = bookings.map((booking: any) => {
      const hotel = booking.hotelId;
      const room = hotel.rooms?.find((r: any) => r._id.toString() === booking.roomId.toString());
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

    const validated = BookingsResponseDTO.parse(formatted);
    res.status(200).json({ success: true, data: validated });
  } catch (error) {
    next(error);
  }
}