import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { UserButton } from '@clerk/clerk-react';
import { Building2 } from 'lucide-react';

export default function AdminDashboardLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simple header replacing sidebar */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-red-600 to-orange-600 rounded-lg flex items-center justify-center shadow-sm">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="font-semibold text-gray-900 leading-none">Admin Panel</h1>
              <p className="text-xs text-gray-500">IntelliStay Management</p>
            </div>
          </div>
          <nav className="flex items-center gap-4">
            <Link to="/admin/requests" className="text-sm font-medium text-gray-700 hover:text-gray-900">
              Hotel Requests
            </Link>
            <UserButton afterSignOutUrl="/" />
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}
