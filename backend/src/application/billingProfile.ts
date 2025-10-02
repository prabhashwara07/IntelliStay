import { Request, Response } from 'express';
import { z } from 'zod';
import { clerkClient } from '@clerk/clerk-sdk-node';
import BillingProfile from '../infrastructure/entities/BillingProfile';
import { CreateBillingProfileDTO, UpdateBillingProfileDTO, BillingProfileResponseDTO } from '../domain/dtos/BiliingProfileDTO';
import { BadRequestError, ConflictError, InternalServerError, NotFoundError } from '../domain/errors';

export const createOrUpdateBillingProfile = async (req: Request, res: Response) => {
  // Validate request body using Zod DTO
  const validatedData = CreateBillingProfileDTO.parse(req.body);

  console.log('Validated Data:', validatedData);

  // First, verify that the user exists in Clerk
  try {
    await clerkClient.users.getUser(validatedData.userId);
  } catch (error) {
    throw new NotFoundError('User not found in system');
  }

  // Check if billing profile already exists for this user
  const existingProfile = await BillingProfile.findOne({ 
    userId: validatedData.userId,
    isActive: true 
  });

  let savedProfile;
  let isUpdate = false;

  if (existingProfile) {
    // Update existing profile
    savedProfile = await BillingProfile.findOneAndUpdate(
      { userId: validatedData.userId, isActive: true },
      { ...validatedData },
      { new: true, runValidators: true }
    );
    isUpdate = true;
  } else {
    // Create new profile
    const newBillingProfile = new BillingProfile(validatedData);
    savedProfile = await newBillingProfile.save();
  }

  // Convert to JSON to get virtuals and format properly
  const profileJson = savedProfile!.toJSON();
  
  // Format the response data to match DTO expectations
  const responseData = {
    mobile: profileJson.mobile,
    address: profileJson.address,           // ✅ Include raw address
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
  const { userId } = req.params;

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

  // Find the billing profile
  const billingProfile = await BillingProfile.findOne({ 
    userId,
    isActive: true 
  });

  if (!billingProfile) {
    throw new NotFoundError('Billing profile not found for this user');
  }

  // Convert to JSON to get virtuals and format properly
  const profileJson = billingProfile.toJSON();
  
  // Format the response data to match DTO expectations
  const responseData = {
    mobile: profileJson.mobile,
    address: profileJson.address,           // ✅ Include raw address
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


