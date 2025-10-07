import React, { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { Button } from './ui/button';
import { Card } from './ui/card';
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
    description: 'Manage rooms and amenities',
    color: 'text-blue-600'
  },
  {
    name: 'Bookings',
    href: '/dashboard/bookings',
    icon: Calendar,
    description: 'View and manage bookings',
    color: 'text-green-600'
  },
];

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;
  const currentPage = navigationItems.find(item => isActive(item.href));

  return (
    <div className="min-h-screen bg-gray-50">
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
          className="bg-white shadow-md"
        >
          <Menu className="h-4 w-4" />
        </Button>
      </div>

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-200 shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                  <Building2 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-lg text-gray-900">IntelliStay</h2>
                  <p className="text-sm text-gray-500">Hotel Management</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden text-gray-400 hover:text-gray-600"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            {/* Current page indicator */}
            {currentPage && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg border">
                <div className="flex items-center gap-2">
                  <currentPage.icon className={`h-4 w-4 ${currentPage.color}`} />
                  <div>
                    <p className="font-medium text-gray-900">{currentPage.name}</p>
                    <p className="text-xs text-gray-500">{currentPage.description}</p>
                  </div>
                </div>
              </div>
            )}
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
                      ? 'bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 shadow-sm'
                      : 'hover:bg-gray-50 hover:shadow-sm'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <div className={`p-2 rounded-lg ${
                    isItemActive 
                      ? 'bg-blue-100' 
                      : 'bg-gray-100 group-hover:bg-gray-200'
                  }`}>
                    <IconComponent className={`h-5 w-5 ${
                      isItemActive ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-700'
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-semibold ${
                      isItemActive ? 'text-gray-900' : 'text-gray-700 group-hover:text-gray-900'
                    }`}>
                      {item.name}
                    </p>
                    <p className={`text-sm ${
                      isItemActive ? 'text-gray-600' : 'text-gray-500 group-hover:text-gray-600'
                    }`}>
                      {item.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 space-y-2">
            <Link
              to="/"
              className="flex items-center gap-3 p-3 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
              onClick={() => setSidebarOpen(false)}
            >
              <Home className="h-5 w-5" />
              <span className="font-medium">Back to Website</span>
            </Link>
            <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50">
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: 'h-9 w-9',
                    userButtonPopoverCard: 'rounded-xl border border-gray-200 shadow-xl backdrop-blur bg-white/95',
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
              <span className="font-medium text-gray-700">Account</span>
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

