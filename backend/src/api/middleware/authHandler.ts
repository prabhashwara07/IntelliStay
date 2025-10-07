// middleware/auth.js
import { requireAuth, getAuth } from '@clerk/express';
import { NextFunction, Request, Response } from 'express';
import { Roles } from '../../types/globals';

export const ROLES = {
  USER: 'user',
  HOTELOWNER: 'hotelowner',
  ADMIN: 'admin'
} as const;

// For API routes - throws error instead of redirecting
export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  const { userId } = getAuth(req);
  
  if (!userId) {
    return res.status(401).json({ 
      error: 'Unauthorized',
      message: 'Authentication required' 
    });
  }
  
  next();
};

// Role checking function
export const checkRole = (req: Request, role: Roles) => {
  const { sessionClaims } = getAuth(req);
  return sessionClaims?.metadata?.role === role;
};

// Role-based middleware
export const requireRole = (allowedRoles: Roles[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { sessionClaims, userId } = getAuth(req);
    
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const userRole = sessionClaims?.metadata?.role || ROLES.USER;
    
    if (!allowedRoles.includes(userRole as Roles)) {
      return res.status(403).json({ 
        error: 'Forbidden',
        message: 'Insufficient permissions',
        requiredRoles: allowedRoles,
        currentRole: userRole
      });
    }
    
    next();
  };
};

export default isAuthenticated;
