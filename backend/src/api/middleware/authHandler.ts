import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';
import { Request, Response, NextFunction } from 'express';

// Simple authentication middleware
export const isAuthenticated = ClerkExpressRequireAuth({
  onError: (error: any) => {
    console.error('Authentication error:', error);
  }
});

export default isAuthenticated;
