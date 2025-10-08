import React from 'react';
import { Card } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';
import { Calendar, MapPin, Users, Hash, DoorOpen, Bed, Clock, User, Mail, Phone, CreditCard } from 'lucide-react';

const paymentStyles = {
  PAID: 'bg-green-100 text-green-700 border-green-200',
  PENDING: 'bg-amber-100 text-amber-800 border-amber-200',
  FAILED: 'bg-red-100 text-red-700 border-red-200',
  CANCELLED: 'bg-gray-100 text-gray-700 border-gray-200'
};

export default function OwnerBookingCard({ booking }) {
  // Calculate nights
  const checkInDate = new Date(booking.checkIn);
  const checkOutDate = new Date(booking.checkOut);
  const numberOfNights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));

  return (
    <Card className="overflow-hidden hover:shadow-md transition-all duration-200">
      <div className="flex flex-col md:flex-row">
        {/* Left Section - Hotel Image */}
        <div className="md:w-48 h-32 md:h-auto relative">
          <div 
            className="w-full h-full bg-cover bg-center"
            style={{ 
              backgroundImage: `url(${booking.hotel.imageUrls?.[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'})` 
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            <div className="absolute top-2 left-2">
              <Badge className={`${paymentStyles[booking.paymentStatus]} text-xs`}>
                {booking.paymentStatus}
              </Badge>
            </div>
          </div>
        </div>
        
        {/* Right Section - Booking Details */}
        <div className="flex-1 p-4">
          <div className="flex flex-col gap-3">
            {/* Header - Booking ID and Hotel Name */}
            <div className="flex items-start justify-between gap-3 pb-2 border-b">
              <div className="flex-1">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                  <Hash className="h-3 w-3" />
                  <span className="font-mono">ID: {booking.id.slice(-8).toUpperCase()}</span>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-1">{booking.hotel.name}</h3>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  <span>
                    {booking.hotel.location ? 
                      `${booking.hotel.location.city}, ${booking.hotel.location.country}` : 
                      booking.hotel.address || 'Location not available'
                    }
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-foreground">Rs. {booking.totalPrice.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">{numberOfNights} nights</div>
              </div>
            </div>

            {/* Compact Info Row */}
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-1">
                <User className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-muted-foreground">Guest:</span>
                <span className="font-mono text-xs">{booking.userId.slice(-6).toUpperCase()}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5 text-muted-foreground" />
                <span>{booking.numberOfGuests} guests</span>
              </div>
              {booking.room && (
                <>
                  <div className="flex items-center gap-1">
                    <DoorOpen className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>Room {booking.room.roomNumber}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Bed className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>{booking.room.roomType}</span>
                  </div>
                </>
              )}
            </div>
            
            {/* Stay Details */}
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-green-600" />
                <span>In: {checkInDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-red-600" />
                <span>Out: {checkOutDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
              </div>
              {booking.room && (
                <div className="flex items-center gap-1">
                  <CreditCard className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>Rs. {booking.room.pricePerNight.toLocaleString()}/night</span>
                </div>
              )}
            </div>
            
          </div>
        </div>
      </div>
    </Card>
  );
}
