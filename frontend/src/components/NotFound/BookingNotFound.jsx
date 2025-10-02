import React from 'react';
import { Calendar, Search, Plus, AlertCircle, Filter } from 'lucide-react';
import { Button } from '@/src/components/ui/button';

export default function BookingNotFound({ 
  title = "No Bookings Found",
  description = "You haven't made any bookings yet. Start exploring hotels and make your first reservation!",
  
  isError = false
}) {

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center space-y-6 transition-opacity duration-300 ease-in-out">
      {/* Icon Container */}
      <div className="relative">
        <div className={`w-24 h-24 ${isError ? 'bg-red-50' : 'bg-gray-100'} rounded-full flex items-center justify-center mb-4`}>
          {isError ? (
            <AlertCircle className="w-12 h-12 text-red-400" />
          ) : (
            <Calendar className="w-12 h-12 text-gray-400" />
          )}
        </div>
        {!isError && (
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
            <Search className="w-4 h-4 text-gray-500" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="space-y-3 max-w-md">
        <h3 className="text-xl font-semibold text-gray-900">
          {title}
        </h3>
        <p className="text-gray-600 leading-relaxed">
          {description}
        </p>
      </div>

      

      {/* Additional Info */}
      {isError ? (
        <div className="mt-8 p-4 bg-red-50 rounded-lg border border-red-100 max-w-md">
          <p className="text-sm text-red-800">
            ⚠️ <strong>Network Issue:</strong> Check your internet connection or contact support if the problem persists.
          </p>
        </div>
      ) : (
        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100 max-w-md">
          <p className="text-sm text-blue-800">
            � <strong>Tip:</strong> Use our smart search to find hotels that match your preferences and budget.
          </p>
        </div>
      )}
    </div>
  );
}