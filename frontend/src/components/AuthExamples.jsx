import React from 'react';
import { useUser, useAuth, SignInButton, SignOutButton, SignUpButton } from '@clerk/clerk-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

// Example component showing different Clerk authentication patterns
export default function AuthExamples() {
  const { isLoaded, isSignedIn, user } = useUser();
  const { signOut } = useAuth();

  // Show loading state
  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Clerk Authentication Examples</h1>

      {/* Basic Authentication Check */}
      <Card>
        <CardHeader>
          <CardTitle>1. Basic Authentication Check</CardTitle>
          <CardDescription>
            Check if user is signed in and display user info
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isSignedIn ? (
            <div className="space-y-4">
              <p className="text-green-600">✅ User is signed in!</p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p><strong>User ID:</strong> {user.id}</p>
                <p><strong>Email:</strong> {user.primaryEmailAddress?.emailAddress}</p>
                <p><strong>Name:</strong> {user.fullName}</p>
                <p><strong>Role:</strong> {user.publicMetadata?.role || 'user'}</p>
              </div>
              <SignOutButton>
                <Button variant="outline">Sign Out</Button>
              </SignOutButton>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-red-600">❌ User is not signed in</p>
              <div className="flex gap-2">
                <SignInButton>
                  <Button>Sign In</Button>
                </SignInButton>
                <SignUpButton>
                  <Button variant="outline">Sign Up</Button>
                </SignUpButton>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Role-based Access Control */}
      <Card>
        <CardHeader>
          <CardTitle>2. Role-based Access Control</CardTitle>
          <CardDescription>
            Show different content based on user role
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isSignedIn ? (
            <div className="space-y-4">
              {user.publicMetadata?.role === 'admin' && (
                <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                  <h3 className="font-semibold text-red-800">Admin Panel</h3>
                  <p className="text-red-600">You have admin access!</p>
                </div>
              )}
              
              {user.publicMetadata?.role === 'hotelowner' && (
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-800">Hotel Owner Dashboard</h3>
                  <p className="text-blue-600">Manage your hotels and bookings!</p>
                </div>
              )}
              
              {user.publicMetadata?.role === 'user' && (
                <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-800">User Dashboard</h3>
                  <p className="text-green-600">Welcome! Book your next stay.</p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-500">Please sign in to see role-based content</p>
          )}
        </CardContent>
      </Card>

      {/* Conditional Rendering */}
      <Card>
        <CardHeader>
          <CardTitle>3. Conditional Rendering</CardTitle>
          <CardDescription>
            Show/hide components based on authentication status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Only show to authenticated users */}
            {isSignedIn && (
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-green-800">🔒 This content is only visible to signed-in users</p>
              </div>
            )}

            {/* Only show to hotel owners */}
            {isSignedIn && user.publicMetadata?.role === 'hotelowner' && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-blue-800">🏨 This content is only visible to hotel owners</p>
              </div>
            )}

            {/* Only show to admins */}
            {isSignedIn && user.publicMetadata?.role === 'admin' && (
              <div className="bg-red-50 p-4 rounded-lg">
                <p className="text-red-800">⚙️ This content is only visible to admins</p>
              </div>
            )}

            {/* Show to non-authenticated users */}
            {!isSignedIn && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-800">👋 Sign in to see personalized content</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Custom Sign Out */}
      <Card>
        <CardHeader>
          <CardTitle>4. Custom Sign Out</CardTitle>
          <CardDescription>
            Custom sign out with additional logic
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isSignedIn && (
            <Button 
              onClick={() => {
                // Add custom logic before signing out
                console.log('User is signing out...');
                signOut();
              }}
              variant="destructive"
            >
              Custom Sign Out
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
