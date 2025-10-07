import { Request, Response } from 'express';
import { z } from 'zod';
import { clerkClient, getAuth } from '@clerk/express';
import BillingProfile from '../infrastructure/entities/BillingProfile';
import { CreateBillingProfileDTO, UpdateBillingProfileDTO, BillingProfileResponseDTO } from '../domain/dtos/BiliingProfileDTO';
import { BadRequestError, ConflictError, InternalServerError, NotFoundError } from '../domain/errors';
import { NextFunction } from 'express';

export const createOrUpdateBillingProfile = async (req: Request, res: Response) => {
  const validatedData = CreateBillingProfileDTO.parse(req.body);


  const existingProfile = await BillingProfile.findOne({ 
    userId: validatedData.userId,
    isActive: true 
  });

  let savedProfile;
  let isUpdate = false;

  if (existingProfile) {
    
    savedProfile = await BillingProfile.findOneAndUpdate(
      { userId: validatedData.userId, isActive: true },
      { ...validatedData },
      { new: true, runValidators: true }
    );
    isUpdate = true;
  } else {
    
    const newBillingProfile = new BillingProfile(validatedData);
    savedProfile = await newBillingProfile.save();
  }

  const profileJson = savedProfile!.toJSON();
  
  const responseData = {
    mobile: profileJson.mobile,
    address: profileJson.address,           
    city: profileJson.city,
    country: profileJson.country,
    currency: profileJson.currency,
  };
  
  const validatedResponse = BillingProfileResponseDTO.parse(responseData);

  res.status(isUpdate ? 200 : 201).json({
    success: true,
    message: `Billing profile ${isUpdate ? 'updated' : 'created'} successfully`,
    data: validatedResponse
  });
};

export const getBillingProfileByUserId = async (req: Request, res: Response) => {
  const userId = getAuth(req).userId;

  // Find the billing profile
  const billingProfile = await BillingProfile.findOne({ 
    userId,
    isActive: true
  });

  if (!billingProfile) {
    throw new NotFoundError('Billing profile not found for this user');
  }

  const profileJson = billingProfile.toJSON();
  
  const responseData = {
    mobile: profileJson.mobile,
    address: profileJson.address,           
    city: profileJson.city,
    country: profileJson.country,
    currency: profileJson.currency,
  };
  
  const validatedResponse = BillingProfileResponseDTO.parse(responseData);

  res.status(200).json({
    success: true,
    message: 'Billing profile retrieved successfully',
    data: validatedResponse
  });
};



