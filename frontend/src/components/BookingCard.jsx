import React from 'react';
import { Card } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';
import { Calendar, MapPin, ExternalLink, Bed, Users, Hash, DoorOpen } from 'lucide-react';

const paymentStyles = {
  PAID: 'bg-green-100 text-green-700 border-green-200',
  PENDING: 'bg-amber-100 text-amber-800 border-amber-200',
  FAILED: 'bg-red-100 text-red-700 border-red-200'
};

export default function BookingCard({ booking }) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="flex flex-col md:flex-row">
        {/* Hotel Image */}
        <div className="md:w-48 h-48 md:h-auto relative  ">
          <div 
            className="w-full h-full bg-cover bg-center "
            style={{ 
              backgroundImage: `url(${booking.hotel.imageUrls?.[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'})` 
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1 p-6">
          <div className="flex flex-col h-full gap-4">
            {/* Header with hotel name and badges */}
            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="flex flex-col gap-1">
                  <h3 className="text-xl font-semibold text-foreground">{booking.hotel.name}</h3>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Hash className="h-3 w-3" />
                    <span>Booking ID: {booking.id.slice(-8).toUpperCase()}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge className={paymentStyles[booking.paymentStatus] + ' text-xs'}>
                    {booking.paymentStatus}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>
                  {booking.hotel.location ? 
                    `${booking.hotel.location.city}, ${booking.hotel.location.country}` : 
                    booking.hotel.address || 'Location not available'
                  }
                </span>
              </div>
            </div>
            
            {/* Room Details */}
            {booking.room && (
              <div className="bg-gray-50 rounded-lg p-3 border">
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <DoorOpen className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Room:</span>
                    <span className="text-muted-foreground">{booking.room.roomNumber}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Bed className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Type:</span>
                    <span className="text-muted-foreground">{booking.room.roomType}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Max Guests:</span>
                    <span className="text-muted-foreground">{booking.room.maxGuests}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Rate:</span>
                    <span className="text-muted-foreground">Rs. {booking.room.pricePerNight.toLocaleString()}/night</span>
                  </div>
                </div>
              </div>
            )}
            
            {/* Booking Details */}
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Check-in:</span>
                <span className="text-muted-foreground">{new Date(booking.checkIn).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Check-out:</span>
                <span className="text-muted-foreground">{new Date(booking.checkOut).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Guests:</span>
                <span className="text-muted-foreground">{booking.numberOfGuests}</span>
              </div>
            </div>
            
            {/* Footer with price and actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border/50 mt-auto">
              <div className="text-sm">
                <span className="text-muted-foreground">Total: </span>
                <span className="font-semibold text-foreground text-lg">Rs. {booking.totalPrice.toLocaleString()}</span>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs hover:bg-gray-100 hover:text-foreground"
                  onClick={() => window.open(`/hotel/${booking.hotel.id}`, '_blank')}
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Hotel Info
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}