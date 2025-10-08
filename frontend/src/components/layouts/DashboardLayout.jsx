import React, { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { UserButton } from '@clerk/clerk-react';
import { 
  Bed, 
  Calendar, 
  Menu,
  X,
  Home,
  Building2
} from 'lucide-react';

const navigationItems = [
  {
    name: 'Rooms',
    href: '/dashboard/rooms',
    icon: Bed,
    color: 'text-brand-primary'
  },
  {
    name: 'Bookings',
    href: '/dashboard/bookings',
    icon: Calendar,
    color: 'text-brand-primary'
  },
];

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSidebarOpen(true)}
          className="bg-card shadow-md border-border"
        >
          <Menu className="h-4 w-4" />
        </Button>
      </div>

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-card border-r border-border shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center shadow-md">
                  <Building2 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-lg text-foreground">IntelliStay</h2>
                  <p className="text-sm text-muted-foreground">Hotel Management</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden text-muted-foreground hover:text-foreground"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {navigationItems.map((item) => {
              const IconComponent = item.icon;
              const isItemActive = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-200 group ${
                    isItemActive
                      ? 'bg-brand-primary/10 border border-brand-primary/20 shadow-sm'
                      : 'hover:bg-muted hover:shadow-sm'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <div className={`p-2 rounded-lg ${
                    isItemActive 
                      ? 'bg-brand-primary/20' 
                      : 'bg-muted group-hover:bg-muted/80'
                  }`}>
                    <IconComponent className={`h-5 w-5 ${
                      isItemActive ? 'text-brand-primary' : 'text-muted-foreground group-hover:text-foreground'
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-semibold ${
                      isItemActive ? 'text-foreground' : 'text-foreground/80 group-hover:text-foreground'
                    }`}>
                      {item.name}
                    </p>
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-border space-y-2">
            
            <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted">
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: 'h-9 w-9',
                    userButtonPopoverCard: 'rounded-xl border border-border shadow-xl backdrop-blur bg-card/95',
                    userButtonPopoverActions: 'gap-1',
                    userButtonPopoverActionButton: 'text-sm rounded-lg hover:bg-brand-primary/10 hover:text-brand-primary',
                    userButtonPopoverActionButtonText: 'font-medium'
                  },
                  variables: {
                    borderRadius: '0.75rem'
                  }
                }}
              >
                <UserButton.MenuItems>
                  <UserButton.Action label="manageAccount" />
                  <UserButton.Action label="signOut" />
                </UserButton.MenuItems>
              </UserButton>
              <span className="font-medium text-foreground">Account</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:ml-72">
        {/* Main content area */}
        <main className="min-h-screen">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

