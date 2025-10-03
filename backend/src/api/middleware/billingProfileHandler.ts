import { Request, Response, NextFunction } from 'express';
import BillingProfile, { IBillingProfile } from '../../infrastructure/entities/BillingProfile';
import { BadRequestError, NotFoundError } from '../../domain/errors';
import { AuthObject } from '@clerk/clerk-sdk-node';

declare module 'express-serve-static-core' {
  interface Request {
    billingProfile?: IBillingProfile;
    auth?: AuthObject;
  }
}

export const requireBillingProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Check if auth exists first
    if (!req.auth?.userId) {
      throw new BadRequestError('User ID is required');
    }
    
    const userId = req.auth.userId;

    const existingProfile = await BillingProfile.findOne({ userId, isActive: true });
    
    if (!existingProfile) {
      throw new NotFoundError('Billing profile not found. Please complete your billing profile first.');
    }

    req.billingProfile = existingProfile;
    
    next();
    
  } catch (error) {
    console.error('Billing profile check error:', error);
    next(error);
  }
};

export default requireBillingProfile;
