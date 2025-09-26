import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SignInButton, UserButton, SignedIn, SignedOut } from '@clerk/clerk-react';
import { Button } from '@/src/components/ui/button';
import { Menu, X } from 'lucide-react';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="fixed top-6 left-6 right-6 z-50 bg-white shadow-2xl rounded-2xl border border-gray-200 transition-all duration-300">
      {/* Main header content */}
      <div className="flex items-center justify-between px-6 md:px-8 py-4">
        <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
          <img 
            src="/int-logo.png" 
            alt="IntelliStay Logo" 
            className="h-8 w-8 md:h-10 md:w-10"
          />
          <div className="text-xl md:text-2xl font-bold text-brand-primary ml-2">
            IntelliStay
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link to="/about" className="text-gray-700 hover:text-brand-primary transition-colors font-medium">
            About Us
          </Link>
          <Link to="/contact" className="text-gray-700 hover:text-brand-primary transition-colors font-medium">
            Contact
          </Link>
          <div className="flex items-center gap-4">
            <SignedIn>
              <Link to="/my-account" className="text-gray-700 hover:text-brand-primary transition-colors font-medium">
                My Account
              </Link>
              <UserButton 
                afterSignOutUrl="/" 
                appearance={{
                  elements: {
                    avatarBox: "h-9 w-9"
                  }
                }}
              />
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal">
                <Button className="bg-brand-primary hover:bg-brand-primary/90">
                  Sign In
                </Button>
              </SignInButton>
            </SignedOut>
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <button 
          onClick={toggleMobileMenu}
          className="md:hidden p-2 text-gray-700 hover:text-brand-primary transition-colors rounded-lg hover:bg-gray-100"
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 rounded-b-2xl">
          <nav className="px-6 py-4 space-y-4">
            <Link 
              to="/about" 
              className="block text-gray-700 hover:text-brand-primary transition-colors font-medium py-3 px-2 rounded-lg hover:bg-gray-100"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About Us
            </Link>
            <Link 
              to="/contact" 
              className="block text-gray-700 hover:text-brand-primary transition-colors font-medium py-3 px-2 rounded-lg hover:bg-gray-100"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact
            </Link>
            <div className="pt-2 border-t border-gray-200">
              <SignedIn>
                <Link 
                  to="/my-account" 
                  className="block text-gray-700 hover:text-brand-primary transition-colors font-medium py-3 px-2 rounded-lg hover:bg-gray-100"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  My Account
                </Link>
                <div className="flex items-center py-3 px-2 rounded-lg hover:bg-gray-100">
                  <UserButton 
                    afterSignOutUrl="/" 
                    appearance={{
                      elements: {
                        avatarBox: "h-9 w-9"
                      }
                    }}
                  />
                  <span className="ml-3 text-sm text-gray-500">Account</span>
                </div>
              </SignedIn>
              <SignedOut>
                <SignInButton mode="modal">
                  <Button className="w-full bg-brand-primary hover:bg-brand-primary/90">
                    Sign In
                  </Button>
                </SignInButton>
              </SignedOut>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
