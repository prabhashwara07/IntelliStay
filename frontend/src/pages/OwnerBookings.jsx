import React, { useMemo, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Card } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Filter } from 'lucide-react';
import BookingCard from '@/src/components/BookingCard';
import BookingNotFound from '@/src/components/NotFound/BookingNotFound';
import { useGetOwnerBookingsQuery, useGetOwnerHotelsQuery } from '@/src/store/api';

export default function OwnerBookings() {
  const { user, isLoaded } = useUser();

  const [paymentFilter, setPaymentFilter] = useState('PAID');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const { data: hotelsData } = useGetOwnerHotelsQuery(undefined, { skip: !user });
  const hotels = hotelsData?.data || [];
  const [hotelIdFilter, setHotelIdFilter] = useState('');

  const {
    data: bookingsResponse,
    isLoading: isLoadingBookings,
    error: bookingsError,
    refetch: refetchBookings
  } = useGetOwnerBookingsQuery(
    {
      paymentStatus: paymentFilter,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      hotelId: hotelIdFilter || undefined,
    },
    { skip: !user?.id }
  );

  const transformedBookings = useMemo(() => {
    if (!bookingsResponse?.data) return [];
    return bookingsResponse.data.map(booking => ({
      id: booking.id,
      hotel: booking.hotel,
      room: booking.room,
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
      paymentStatus: booking.paymentStatus,
      numberOfGuests: booking.numberOfGuests,
      totalPrice: booking.totalPrice,
      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt
    }));
  }, [bookingsResponse]);

  const filteredBookings = transformedBookings;

  if (!isLoaded) return <div className="min-h-screen bg-background"><div className="p-6">Loading…</div></div>;
  if (isLoaded && !user) return <div className="min-h-screen bg-background"><div className="p-6">Please sign in.</div></div>;

  if (isLoadingBookings) {
    return (
      <div className="min-h-screen bg-background">
        <div className="p-6">
          <div className="grid gap-6">
            {[1,2,3].map(i => (<Card key={i} className="p-6 animate-pulse h-40" />))}
          </div>
        </div>
      </div>
    );
  }

  if (bookingsError) {
    return (
      <div className="min-h-screen bg-background p-6">
        <BookingNotFound 
          isError={true}
          title="Failed to Load Bookings"
          description="We couldn't fetch your hotel bookings. Please try again."
          actionButtonText="Retry"
          onActionClick={() => refetchBookings()}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="p-6">
        <div className="flex items-end flex-wrap gap-3 justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold">Bookings</h2>
            <p className="text-sm text-muted-foreground">View and manage reservations</p>
          </div>
              <div className="flex flex-wrap gap-3 text-xs md:text-sm">
                {hotels.length > 0 && (
                  <select value={hotelIdFilter} onChange={e => setHotelIdFilter(e.target.value)} className="h-9 rounded-md border bg-background px-2 text-sm">
                    <option value="">All Hotels</option>
                    {hotels.map(h => (
                      <option key={h._id} value={h._id}>{h.name}</option>
                    ))}
                  </select>
                )}
            <select value={paymentFilter} onChange={e => setPaymentFilter(e.target.value)} className="h-9 rounded-md border bg-background px-2 text-sm">
              <option value="PAID">Paid</option>
              <option value="PENDING">Pending</option>
              <option value="FAILED">Failed</option>
            </select>
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="h-9 rounded-md border bg-background px-2 text-sm" />
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="h-9 rounded-md border bg-background px-2 text-sm" />
                <Button variant="outline" size="sm" className="h-9" onClick={() => { setHotelIdFilter(''); setPaymentFilter('PAID'); setStartDate(''); setEndDate(''); }}>
              <Filter className="h-4 w-4 mr-1" />Reset
            </Button>
          </div>
        </div>
        <div className="space-y-6">
          {filteredBookings.length === 0 ? (
            <BookingNotFound 
              title="No Bookings Found"
              description="No reservations matched your filters."
              actionButtonText="Clear Filters"
              onActionClick={() => { setPaymentFilter('PAID'); setStartDate(''); setEndDate(''); }}
            />
          ) : (
            filteredBookings.map(booking => (
              <BookingCard key={booking.id} booking={booking} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}


