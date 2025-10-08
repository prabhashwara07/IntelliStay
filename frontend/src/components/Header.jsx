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
              {userRole !== 'admin' && userRole !== 'hotelowner' && (
                <Link to="/bookings" className={`${navLinkBase} ${isActive('/bookings') ? navLinkActive : navLinkInactive}`}>
                  Bookings
                </Link>
              )}
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
              <Link to="/sign-in">
                <Button className="bg-white text-brand-primary hover:bg-white/90 shadow-sm">
                  Sign In
                </Button>
              </Link>
            </SignedOut>
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <button 
          onClick={toggleMobileMenu}
          className={`md:hidden p-3 text-white/90 hover:text-white transition-all duration-200 rounded-xl hover:bg-white/10 active:scale-95 ${scrolled && !isHome ? 'bg-white/5 backdrop-blur-sm shadow-lg' : ''}`}
          aria-label="Toggle mobile menu"
        >
          <div className="relative">
            {isMobileMenuOpen ? (
              <X size={24} className="transition-transform duration-200" />
            ) : (
              <Menu size={24} className="transition-transform duration-200" />
            )}
          </div>
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gradient-to-b from-brand-primary/95 to-brand-primary/85 border-t border-white/15 rounded-b-2xl backdrop-blur animate-in slide-in-from-top-2 duration-300">
          <nav className="px-6 py-6 space-y-1">
            {/* Main Navigation Section */}
            <div className="space-y-1">
              <div className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-3 px-2">
                Navigation
              </div>
              <Link 
                to="/hotels" 
                className={`flex items-center text-white/90 hover:text-white transition-all duration-200 font-medium py-3 px-3 rounded-xl hover:bg-white/10 group ${isActive('/hotels') ? 'bg-white/10 text-white' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <svg className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                Hotels
              </Link>
              <Link 
                to="/contact" 
                className={`flex items-center text-white/90 hover:text-white transition-all duration-200 font-medium py-3 px-3 rounded-xl hover:bg-white/10 group ${isActive('/contact') ? 'bg-white/10 text-white' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <svg className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Contact
              </Link>
              {isLoaded && dashboardPath && (
                <button 
                  className={`flex items-center w-full text-left text-white/90 hover:text-white transition-all duration-200 font-medium py-3 px-3 rounded-xl hover:bg-white/10 group ${isActive(dashboardPath) ? 'bg-white/10 text-white' : ''}`}
                  onClick={() => { setIsMobileMenuOpen(false); navigate(dashboardPath); }}
                >
                  <svg className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Dashboard
                </button>
              )}
            </div>

            {/* User Actions Section */}
            <div className="pt-4 border-t border-white/15">
              <div className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-3 px-2">
                Account
              </div>
              <SignedIn>
                {userRole !== 'admin' && userRole !== 'hotelowner' && (
                  <button 
                    className="flex items-center w-full text-left text-white/90 hover:text-white transition-all duration-200 font-medium py-3 px-3 rounded-xl hover:bg-white/10 group"
                    onClick={() => { setIsMobileMenuOpen(false); navigate('/bookings'); }}
                  >
                    <svg className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    My Bookings
                  </button>
                )}
                {userRole !== 'admin' && userRole !== 'hotelowner' && (
                  <>
                    <button 
                      className="flex items-center w-full text-left text-white/90 hover:text-white transition-all duration-200 font-medium py-3 px-3 rounded-xl hover:bg-white/10 group"
                      onClick={() => { setIsMobileMenuOpen(false); handleBillingOpen(); }}
                    >
                      <svg className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                      Payment Profile
                    </button>
                    <button 
                      className="flex items-center w-full text-left text-white/90 hover:text-white transition-all duration-200 font-medium py-3 px-3 rounded-xl hover:bg-white/10 group"
                      onClick={() => { setIsMobileMenuOpen(false); navigate('/become-partner'); }}
                    >
                      <svg className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14c-4.418 0-8 1.79-8 4v2h16v-2c0-2.21-3.582-4-8-4z" />
                      </svg>
                      Become a Partner
                    </button>
                  </>
                )}
                <div className="pt-2 border-t border-white/10">
                  <button 
                    className="flex items-center w-full text-left text-red-300 hover:text-red-200 transition-all duration-200 font-medium py-3 px-3 rounded-xl hover:bg-red-500/10 group"
                    onClick={() => { setIsMobileMenuOpen(false); signOut({ redirectUrl: '/' }); }}
                  >
                    <svg className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Sign Out
                  </button>
                </div>
              </SignedIn>
              <SignedOut>
                <Link to="/sign-in">
                  <Button className="w-full bg-white text-brand-primary hover:bg-white/90 shadow-lg hover:shadow-xl transition-all duration-200 font-semibold py-3">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    Sign In
                  </Button>
                </Link>
              </SignedOut>
            </div>
          </nav>
        </div>
      )}
      <BillingProfileDialog open={billingOpen} onOpenChange={setBillingOpen} data={billingProfile} />
    </header>
  );
}