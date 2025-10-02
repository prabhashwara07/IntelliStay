import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { Card } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';
import { Calendar, MapPin, Filter, ArrowLeft, ExternalLink } from 'lucide-react';

const MOCK_BOOKINGS = [
  {
    id: 'bk_001',
    hotel: {
      _id: 'hotel_001',
      name: 'Ocean View Resort',
      imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=900&h=600&fit=crop'
    },
    checkIn: '2025-10-12',
    checkOut: '2025-10-16',
    status: 'upcoming',
    paymentStatus: 'PAID',
    reference: 'INT-2025-OVR-3519',
    address: 'Mirissa, Sri Lanka'
  },
  {
    id: 'bk_002',
    hotel: {
      _id: 'hotel_002',
      name: 'City Business Hotel',
      imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=900&h=600&fit=crop'
    },
    checkIn: '2025-08-02',
    checkOut: '2025-08-05',
    status: 'completed',
    paymentStatus: 'REFUNDED',
    reference: 'INT-2025-CBH-8841',
    address: 'Colombo 02, Sri Lanka'
  }
];

function BookingCard({ booking }) {
  const statusStyles = {
    upcoming: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    completed: 'bg-gray-50 text-gray-700 border-gray-200',
    cancelled: 'bg-rose-50 text-rose-700 border-rose-200'
  };
  const paymentStyles = {
    PAID: 'bg-green-100 text-green-700 border-green-200',
    PENDING: 'bg-amber-100 text-amber-800 border-amber-200',
    REFUNDED: 'bg-blue-100 text-blue-700 border-blue-200'
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="flex flex-col md:flex-row">
        {/* Hotel Image */}
        <div className="md:w-48 h-48 md:h-auto relative">
          <div 
            className="w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url(${booking.hotel.imageUrl})` }}
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
                <h3 className="text-xl font-semibold text-foreground">{booking.hotel.name}</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge className={statusStyles[booking.status] + ' capitalize text-xs'}>
                    {booking.status}
                  </Badge>
                  <Badge className={paymentStyles[booking.paymentStatus] + ' text-xs'}>
                    {booking.paymentStatus}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{booking.address}</span>
              </div>
            </div>
            
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
            </div>
            
            {/* Footer with reference and actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border/50 mt-auto">
              <div className="text-xs text-muted-foreground">
                <span className="font-medium">Reference:</span> {booking.reference}
              </div>
              <div className="flex gap-2">
                <Button size="sm" className="text-xs ">
                  View Details
                </Button>
                <Button variant="ghost" size="sm" className="text-xs hover:bg-gray-100 hover:text-foreground">
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

export default function Bookings() {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();

  const [paymentFilter, setPaymentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredBookings = useMemo(() => {
    return MOCK_BOOKINGS.filter(b => {
      const matchesPayment = paymentFilter === 'all' || b.paymentStatus === paymentFilter;
      const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
      return matchesPayment && matchesStatus;
    });
  }, [paymentFilter, statusFilter]);

  if (!isLoaded) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading…</div>;
  if (isLoaded && !user) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Please sign in to view bookings.</div>;

  return (
    <div className="min-h-screen bg-background pt-32 pb-16 px-6 md:px-10">
      <div className=" mx-auto">
        

        <div className="grid gap-10">
          <section>
            <div className="flex items-end flex-wrap gap-3 justify-between mb-4">
              <h2 className="text-lg font-semibold">Booking History</h2>
              <div className="flex gap-3 text-xs md:text-sm">
                <select value={paymentFilter} onChange={e => setPaymentFilter(e.target.value)} className="h-9 rounded-md border bg-background px-2 text-sm">
                  <option value="all">Payment: All</option>
                  <option value="PAID">Paid</option>
                  <option value="PENDING">Pending</option>
                  <option value="REFUNDED">Refunded</option>
                </select>
                <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="h-9 rounded-md border bg-background px-2 text-sm">
                  <option value="all">Status: All</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <Button variant="outline" size="sm" className="h-9" onClick={() => { setPaymentFilter('all'); setStatusFilter('all'); }}><Filter className="h-4 w-4 mr-1" />Reset</Button>
              </div>
            </div>
            <div className="space-y-6">
              {filteredBookings.length === 0 && <Card className="p-10 text-center text-muted-foreground border-dashed">No bookings match the selected filters.</Card>}
              {filteredBookings.map(b => <BookingCard key={b.id} booking={b} />)}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
