import { Request, Response, NextFunction } from 'express';
import Hotel from '../infrastructure/entities/Hotel';
import Booking from '../infrastructure/entities/Booking';
import { BadRequestError, NotFoundError, InternalServerError } from '../domain/errors';
import { Types } from 'mongoose';
import { getAuth, clerkClient } from '@clerk/express';

export const getHotelRequests = async (req: Request, res: Response, next: NextFunction) => {
  
  const HotelRequests = await Hotel.find({status:'pending'})
  res.status(200).json(HotelRequests);
};


export const approveHotelRequest = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;


    const hotel = await Hotel.findById(id);
    if (!hotel) {
      throw new NotFoundError('Hotel not found');
    }

    if (hotel.status === 'approved') {
      throw new BadRequestError('Hotel is already approved');
    }

    if (!hotel.ownerId) {
      throw new BadRequestError('Hotel has no owner assigned');
    }

    // Promote owner to hotelowner in Clerk public metadata
    try {
      await clerkClient.users.updateUser(hotel.ownerId, {
        publicMetadata: { role: 'hotelowner' }
      });
    } catch (err) {
      throw new InternalServerError('Failed to update owner role in Clerk');
    }

    // Update hotel status to approved
    hotel.status = 'approved';
    
    await hotel.save();

    res.status(200).json({
      success: true,
      message: 'Hotel request approved successfully',
     
    });
  } catch (error) {
    next(error);
  }
};

export const rejectHotelRequest = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const hotel = await Hotel.findById(id);
    if (!hotel) {
      throw new NotFoundError('Hotel not found');
    }

    if (hotel.status === 'rejected') {
      throw new BadRequestError('Hotel is already rejected');
    }

    // Update hotel status to rejected
    hotel.status = 'rejected';
    hotel.rejectionReason = reason || 'No reason provided';
    hotel.reviewedAt = new Date();
    
    await hotel.save();

    // NOTE: We don't change the user's role back to 'user' on rejection
    // This allows them to potentially resubmit or contact support
    // If you want to reset their role, uncomment below:
    /*
    try {
      await clerkClient.users.updateUser(hotel.ownerId, {
        publicMetadata: { role: 'user' }
      });
    } catch (err) {
      console.warn('Failed to reset user role in Clerk:', err);
    }
    */

    res.status(200).json({
      success: true,
      message: 'Hotel request rejected successfully',
    });
  } catch (error) {
    next(error);
  }
};


