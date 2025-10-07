# Clerk Frontend Protection Guide

This guide shows you how to protect pages and components using Clerk authentication in your React application.

## 1. Route-Level Protection

### Basic Authentication Protection
```jsx
import { ProtectedRoute } from './components/ProtectedRoute';

// Protect entire routes
<Route 
  path="/bookings" 
  element={
    <ProtectedRoute>
      <Bookings />
    </ProtectedRoute>
  } 
/>
```

### Role-Based Protection
```jsx
import { HotelOwnerRoute, AdminRoute } from './components/ProtectedRoute';

// Protect for hotel owners only
<Route 
  element={
    <HotelOwnerRoute>
      <DashboardLayout />
    </HotelOwnerRoute>
  }
>
  <Route path="/dashboard/rooms" element={<RoomManagement />} />
</Route>

// Protect for admins only
<Route 
  path="/admin" 
  element={
    <AdminRoute>
      <AdminPanel />
    </AdminRoute>
  } 
/>
```

### Custom Role Protection
```jsx
import { RoleProtectedRoute } from './components/ProtectedRoute';

<Route 
  path="/special" 
  element={
    <RoleProtectedRoute allowedRoles={['admin', 'moderator']}>
      <SpecialPage />
    </RoleProtectedRoute>
  } 
/>
```

## 2. Component-Level Protection

### Using useUser Hook
```jsx
import { useUser } from '@clerk/clerk-react';

function MyComponent() {
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!isSignedIn) {
    return <div>Please sign in to view this content</div>;
  }

  return (
    <div>
      <h1>Welcome, {user.fullName}!</h1>
      <p>Your role: {user.publicMetadata?.role}</p>
    </div>
  );
}
```

### Using useAuth Hook
```jsx
import { useAuth } from '@clerk/clerk-react';

function MyComponent() {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) return <div>Loading...</div>;
  if (!isSignedIn) return <div>Access denied</div>;

  return <div>Protected content</div>;
}
```

## 3. Conditional Rendering

### Show/Hide Based on Authentication
```jsx
import { useUser } from '@clerk/clerk-react';

function Header() {
  const { isSignedIn, user } = useUser();

  return (
    <header>
      <nav>
        <Link to="/">Home</Link>
        
        {/* Show to all users */}
        <Link to="/hotels">Hotels</Link>
        
        {/* Show only to authenticated users */}
        {isSignedIn && (
          <Link to="/bookings">My Bookings</Link>
        )}
        
        {/* Show only to hotel owners */}
        {isSignedIn && user?.publicMetadata?.role === 'hotelowner' && (
          <Link to="/dashboard">Dashboard</Link>
        )}
        
        {/* Show only to admins */}
        {isSignedIn && user?.publicMetadata?.role === 'admin' && (
          <Link to="/admin">Admin Panel</Link>
        )}
      </nav>
    </header>
  );
}
```

### Role-Based Content
```jsx
function Dashboard() {
  const { user } = useUser();
  const userRole = user?.publicMetadata?.role;

  return (
    <div>
      {userRole === 'admin' && <AdminPanel />}
      {userRole === 'hotelowner' && <HotelOwnerPanel />}
      {userRole === 'user' && <UserPanel />}
    </div>
  );
}
```

## 4. Custom Hooks for Protection

### Create Custom Hooks
```jsx
// hooks/useAuth.js
import { useUser } from '@clerk/clerk-react';

export const useIsAuthenticated = () => {
  const { isLoaded, isSignedIn } = useUser();
  return { isLoaded, isSignedIn };
};

export const useUserRole = () => {
  const { user } = useUser();
  return user?.publicMetadata?.role || 'user';
};

export const useIsHotelOwner = () => {
  const { user } = useUser();
  return user?.publicMetadata?.role === 'hotelowner';
};

export const useIsAdmin = () => {
  const { user } = useUser();
  return user?.publicMetadata?.role === 'admin';
};
```

### Using Custom Hooks
```jsx
import { useIsHotelOwner, useUserRole } from './hooks/useAuth';

function MyComponent() {
  const isHotelOwner = useIsHotelOwner();
  const userRole = useUserRole();

  return (
    <div>
      {isHotelOwner && <HotelOwnerContent />}
      <p>Current role: {userRole}</p>
    </div>
  );
}
```

## 5. Loading States

### Proper Loading Handling
```jsx
import { useUser } from '@clerk/clerk-react';

function ProtectedComponent() {
  const { isLoaded, isSignedIn, user } = useUser();

  // Always check isLoaded first
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isSignedIn) {
    return <Navigate to="/sign-in" replace />;
  }

  return <div>Protected content</div>;
}
```

## 6. Error Handling

### Unauthorized Access
```jsx
import { useUser } from '@clerk/clerk-react';

function AdminPanel() {
  const { user } = useUser();
  const userRole = user?.publicMetadata?.role;

  if (userRole !== 'admin') {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold text-red-600">Access Denied</h2>
        <p>You don't have permission to access this page.</p>
      </div>
    );
  }

  return <div>Admin content</div>;
}
```

## 7. Redirects and Navigation

### Programmatic Redirects
```jsx
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';

function MyComponent() {
  const navigate = useNavigate();
  const { isSignedIn, user } = useUser();

  const handleProtectedAction = () => {
    if (!isSignedIn) {
      navigate('/sign-in');
      return;
    }

    if (user?.publicMetadata?.role !== 'hotelowner') {
      navigate('/unauthorized');
      return;
    }

    // Proceed with action
  };

  return <button onClick={handleProtectedAction}>Protected Action</button>;
}
```

## 8. Best Practices

### 1. Always Check Loading State
```jsx
const { isLoaded, isSignedIn } = useUser();

if (!isLoaded) {
  return <LoadingSpinner />;
}
```

### 2. Use Consistent Role Checking
```jsx
// Good: Consistent role checking
const userRole = user?.publicMetadata?.role || 'user';
const isAdmin = userRole === 'admin';
const isHotelOwner = userRole === 'hotelowner';

// Bad: Inconsistent checks
const isAdmin = user?.publicMetadata?.role === 'admin';
const isHotelOwner = user?.publicMetadata?.role === 'hotelowner';
```

### 3. Handle Edge Cases
```jsx
function ProtectedComponent() {
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded) return <LoadingSpinner />;
  if (!isSignedIn) return <SignInPrompt />;
  if (!user) return <ErrorState />;

  // Safe to use user data
  return <div>Welcome {user.fullName}!</div>;
}
```

### 4. Use Route-Level Protection for Pages
```jsx
// Good: Protect at route level
<Route 
  path="/dashboard" 
  element={
    <HotelOwnerRoute>
      <Dashboard />
    </HotelOwnerRoute>
  } 
/>

// Less ideal: Protect inside component
function Dashboard() {
  const { user } = useUser();
  if (user?.publicMetadata?.role !== 'hotelowner') {
    return <Unauthorized />;
  }
  return <div>Dashboard content</div>;
}
```

## 9. Available Protection Components

- `ProtectedRoute` - Basic authentication protection
- `RoleProtectedRoute` - Custom role-based protection
- `HotelOwnerRoute` - Hotel owner specific protection
- `AdminRoute` - Admin specific protection
- `PublicRoute` - Redirects authenticated users

## 10. Environment Setup

Make sure your Clerk is properly configured in `main.jsx`:

```jsx
import { ClerkProvider } from '@clerk/clerk-react';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

createRoot(document.getElementById('root')).render(
  <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ClerkProvider>
);
```

This guide covers all the main patterns for protecting pages and components with Clerk in your React application.
