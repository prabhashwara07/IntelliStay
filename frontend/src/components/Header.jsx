import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { SignInButton, SignedIn, SignedOut, useClerk, UserButton, useUser } from '@clerk/clerk-react';
import BillingProfileDialog from './BillingProfileDialog';
import { Button } from './ui/button';
import { Menu, X } from 'lucide-react';
import { useGetBillingProfileQuery } from '../store/api';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const [billingOpen, setBillingOpen] = useState(false);
  const { signOut } = useClerk();
  const { user, isLoaded } = useUser();
  const { data: billingProfile, isLoading: isLoadingProfile } = useGetBillingProfileQuery(user?.id, {
      skip: !user,
    });

  const userRole = user?.publicMetadata?.role || 'user';
  const dashboardPath = userRole === 'admin' ? '/admin' : userRole === 'hotelowner' ? '/dashboard' : null;


  // Track scroll only on non-home pages where header is fixed/floating
  useEffect(() => {
    if (isHome) {
      setScrolled(false);
      return; // no listener needed on home since header is relative
    }



    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHome]);

  // Base header classes: solid + gradient for stronger visible brand color (removed transparency that made it appear white)
  const baseHeaderClasses = 'z-50 transition-all duration-300 bg-brand-primary bg-gradient-to-r from-brand-primary to-brand-primary';
  const homeLayoutClasses = 'relative mt-6 mx-6 md:mx-10 rounded-3xl border border-white/15 shadow-2xl';
  const floatingLayoutClasses = `fixed top-6 left-6 right-6 rounded-3xl border ${scrolled ? 'border-white/20 shadow-xl' : 'border-white/15 shadow-2xl'}`;
  const headerClassName = `${baseHeaderClasses} ${isHome ? homeLayoutClasses : floatingLayoutClasses}`;

  const navLinkBase = 'font-medium transition-colors relative';
  const navLinkInactive = 'text-white/85 hover:text-white';
  const navLinkActive = 'text-white after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-full after:rounded-full after:bg-white after:content-["" ]';

  const isActive = (path) => location.pathname === path;

  const handleSignOut = () => signOut({ redirectUrl: '/' });

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  

  const handleBillingOpen = () => {
    if(!isLoadingProfile){
      setBillingOpen(true);
    }
  };



  return (
    <header className={headerClassName}>
      {/* Main header content */}
      <div className={`flex items-center justify-between px-6 md:px-10 ${scrolled && !isHome ? 'py-3' : 'py-4'} w-full transition-all`}>
        <Link to="/" className="flex items-center hover:opacity-90 transition-opacity">
          <img 
            src="/int-logo.png" 
            alt="IntelliStay Logo" 
            className="h-8 w-8 md:h-10 md:w-10"
          />
          <div className="text-xl md:text-2xl font-bold text-white ml-2 drop-shadow-sm tracking-tight">
            IntelliStay
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-10">
          <Link to="/hotels" className={`${navLinkBase} ${isActive('/hotels') ? navLinkActive : navLinkInactive}`}>
            Hotels
          </Link>
          {isLoaded && dashboardPath && (
            <Link to={dashboardPath} className={`${navLinkBase} ${isActive(dashboardPath) ? navLinkActive : navLinkInactive}`}>
              Dashboard
            </Link>
          )}
          <Link to="/contact" className={`${navLinkBase} ${isActive('/contact') ? navLinkActive : navLinkInactive}`}>
            Contact
          </Link>
          <div className="flex items-center gap-4">
            <SignedIn>
              <Link to="/bookings" className={`${navLinkBase} ${isActive('/bookings') ? navLinkActive : navLinkInactive}`}>
                Bookings
              </Link>
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: `h-10 w-10 ring-2 ring-white/30 hover:ring-white/60 transition ${scrolled && !isHome ? 'shadow-md shadow-black/20' : ''}`,
                    userButtonPopoverCard: 'rounded-xl border border-gray-200 shadow-xl backdrop-blur bg-white/95',
                    userButtonPopoverActions: 'gap-1',
                    userButtonPopoverActionButton: 'text-sm rounded-lg hover:bg-brand-primary/10 hover:text-brand-primary',
                    userButtonPopoverActionButtonText: 'font-medium',
                    userButtonPopoverFooter: 'hidden'
                  },
                  variables: {
                    borderRadius: '0.75rem'
                  }
                }}
              >
                <UserButton.MenuItems>
                  {/* Built-in Clerk action for managing account */}
                  <UserButton.Action label="manageAccount" />
                  
                  {/* Custom actions with onClick handlers */}
                  {userRole !== 'admin' && userRole !== 'hotelowner' && (
                    <UserButton.Action 
                      label="Payment Profile" 
                      labelIcon={
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                      }
                      onClick={() => handleBillingOpen()}
                    />
                  )}
                  {userRole !== 'admin' && userRole !== 'hotelowner' && (
                    <UserButton.Action 
                      label="Become a Partner" 
                      labelIcon={
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14c-4.418 0-8 1.79-8 4v2h16v-2c0-2.21-3.582-4-8-4z" />
                        </svg>
                      }
                      onClick={() => navigate('/become-partner')}
                    />
                  )}
                  
                  {/* Built-in sign out action */}
                  <UserButton.Action label="signOut" />
                </UserButton.MenuItems>
              </UserButton>
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal">
                <Button className="bg-white text-brand-primary hover:bg-white/90 shadow-sm">
                  Sign In
                </Button>
              </SignInButton>
            </SignedOut>
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <button 
          onClick={toggleMobileMenu}
          className={`md:hidden p-2 text-white/90 hover:text-white transition-colors rounded-xl ${isHome ? 'hover:bg-white/10' : 'hover:bg-white/10'} ${scrolled && !isHome ? 'bg-white/5 backdrop-blur-sm' : ''}`}
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gradient-to-b from-brand-primary/95 to-brand-primary/85 border-t border-white/15 rounded-b-2xl backdrop-blur">
          <nav className="px-6 py-4 space-y-4">
            <Link 
              to="/hotels" 
              className="block text-white/90 hover:text-white transition-colors font-medium py-3 px-2 rounded-lg hover:bg-white/10"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Hotels
            </Link>
            <Link 
              to="/contact" 
              className="block text-white/90 hover:text-white transition-colors font-medium py-3 px-2 rounded-lg hover:bg-white/10"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact
            </Link>
            {isLoaded && dashboardPath && (
              <button 
                className="block w-full text-left text-white/90 hover:text-white transition-colors font-medium py-3 px-2 rounded-lg hover:bg-white/10"
                onClick={() => { setIsMobileMenuOpen(false); navigate(dashboardPath); }}
              >
                Dashboard
              </button>
            )}
            <div className="pt-2 border-t border-white/15">
              <SignedIn>
                <button 
                  className="block w-full text-left text-white/90 hover:text-white transition-colors font-medium py-3 px-2 rounded-lg hover:bg-white/10"
                  onClick={() => { setIsMobileMenuOpen(false); navigate('/bookings'); }}
                >
                  Bookings
                </button>
                {userRole !== 'admin' && userRole !== 'hotelowner' && (
                  <button 
                    className="block w-full text-left text-white/90 hover:text-white transition-colors font-medium py-3 px-2 rounded-lg hover:bg-white/10"
                    onClick={() => { setIsMobileMenuOpen(false);  handleBillingOpen(); }}
                  >
                    Payment Profile
                  </button>
                )}
                {userRole !== 'admin' && userRole !== 'hotelowner' && (
                  <button 
                    className="block w-full text-left text-white/90 hover:text-white transition-colors font-medium py-3 px-2 rounded-lg hover:bg-white/10"
                    onClick={() => { setIsMobileMenuOpen(false); navigate('/become-partner'); }}
                  >
                    Become a Partner
                  </button>
                )}
                <button 
                  className="block w-full text-left text-red-300 hover:text-red-200 transition-colors font-medium py-3 px-2 rounded-lg hover:bg-white/10"
                  onClick={() => { setIsMobileMenuOpen(false); signOut({ redirectUrl: '/' }); }}
                >
                  Sign Out
                </button>
              </SignedIn>
              <SignedOut>
                <SignInButton mode="modal">
                  <Button className="w-full bg-white text-brand-primary hover:bg-white/90">
                    Sign In
                  </Button>
                </SignInButton>
              </SignedOut>
            </div>
          </nav>
        </div>
      )}
      <BillingProfileDialog open={billingOpen} onOpenChange={setBillingOpen} data={billingProfile} />
    </header>
  );
}