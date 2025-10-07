import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUser, useAuth } from '@clerk/clerk-react';
import { Loader2 } from 'lucide-react';

// Basic authentication protection
export const ProtectedRoute = ({ children, redirectTo = '/sign-in' }) => {
  const { isLoaded, isSignedIn } = useAuth();
  const location = useLocation();

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  return children;
};

// Role-based protection
export const RoleProtectedRoute = ({ 
  children, 
  allowedRoles = [], 
  redirectTo = '/unauthorized' 
}) => {
  const { isLoaded, isSignedIn, user } = useUser();
  const location = useLocation();

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  // Check if user has required role
  const userRole = user?.publicMetadata?.role || 'user';
  
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  return children;
};

// Hotel Owner specific protection
export const HotelOwnerRoute = ({ children }) => {
  return (
    <RoleProtectedRoute 
      allowedRoles={['hotelowner', 'admin']} 
      redirectTo="/unauthorized"
    >
      {children}
    </RoleProtectedRoute>
  );
};

// Admin specific protection
export const AdminRoute = ({ children }) => {
  return (
    <RoleProtectedRoute 
      allowedRoles={['admin']} 
      redirectTo="/unauthorized"
    >
      {children}
    </RoleProtectedRoute>
  );
};

// Public route that redirects if already authenticated
export const PublicRoute = ({ children, redirectTo = '/dashboard' }) => {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (isSignedIn) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};
