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
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-subtle">
      {/* Main header content */}
      <div className="flex items-center justify-between px-4 md:px-6 py-4">
        <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
          <img 
            src="/int-logo.png" 
            alt="IntelliStay Logo" 
            className="h-8 w-8 md:h-10 md:w-10"
          />
          <div className="text-xl md:text-2xl font-bold text-brand-primary">
            IntelliStay
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link to="/about" className="text-black hover:text-brand-primary transition-colors font-medium">
            About Us
          </Link>
          <Link to="/contact" className="text-black hover:text-brand-primary transition-colors font-medium">
            Contact
          </Link>
          <div className="flex items-center">
            <SignedIn>
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
                <Button>
                  Sign In
                </Button>
              </SignInButton>
            </SignedOut>
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <button 
          onClick={toggleMobileMenu}
          className="md:hidden p-2 text-black hover:text-brand-primary transition-colors"
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-surface-elevated border-t border-subtle">
          <nav className="px-4 py-4 space-y-4">
            <Link 
              to="/about" 
              className="block text-black hover:text-brand-primary transition-colors font-medium py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About Us
            </Link>
            <Link 
              to="/contact" 
              className="block text-black hover:text-brand-primary transition-colors font-medium py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact
            </Link>
            <div className="pt-2 border-t border-subtle">
              <SignedIn>
                <div className="flex items-center py-2">
                  <UserButton 
                    afterSignOutUrl="/" 
                    appearance={{
                      elements: {
                        avatarBox: "h-9 w-9"
                      }
                    }}
                  />
                  <span className="ml-3 text-sm text-muted-foreground">Account</span>
                </div>
              </SignedIn>
              <SignedOut>
                <SignInButton mode="modal">
                  <Button className="w-full">
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