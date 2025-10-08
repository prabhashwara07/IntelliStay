import React from 'react';
import { SignIn } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Header with back button */}
        <div className="bg-white border-b border-gray-200 px-4 py-4">
          <div className="max-w-md mx-auto flex items-center">
            <Button variant="ghost" asChild className="mr-4">
              <Link to="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </Button>
            <h1 className="text-lg font-semibold text-gray-900">Sign In</h1>
          </div>
        </div>

        {/* Sign In Form */}
        <div className="flex-1 flex items-center justify-center px-4 py-8">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <Link to="/" className="inline-flex items-center mb-4">
                <img 
                  src="/int-logo.png" 
                  alt="IntelliStay Logo" 
                  className="h-8 w-8 mr-2"
                />
                <span className="text-xl font-bold text-brand-primary">IntelliStay</span>
              </Link>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome back</h2>
              <p className="text-gray-600">Sign in to your account to continue</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <SignIn 
                appearance={{
                  elements: {
                    rootBox: 'w-full',
                    card: 'shadow-none border-0',
                    headerTitle: 'hidden',
                    headerSubtitle: 'hidden',
                    socialButtonsBlockButton: 'border border-gray-300 hover:bg-gray-50',
                    formButtonPrimary: 'bg-brand-primary hover:bg-brand-primary/90',
                    footerActionLink: 'text-brand-primary hover:text-brand-primary/80',
                    identityPreviewText: 'text-gray-600',
                    formFieldInput: 'border-gray-300 focus:border-brand-primary focus:ring-brand-primary/20',
                    formFieldLabel: 'text-gray-700 font-medium'
                  }
                }}
                redirectUrl="/"
                signUpUrl="/sign-up"
              />
            </div>
            
            <div className="text-center mt-6">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link to="/sign-up" className="text-brand-primary hover:text-brand-primary/80 font-medium">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
    </div>
  );
}
