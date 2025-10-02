import React, { useMemo, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Card } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Filter } from 'lucide-react';
import BookingCard from '@/src/components/BookingCard';
import BookingNotFound from '@/src/components/NotFound/BookingNotFound';
import { useGetBookingsByUserIdQuery } from '@/src/store/api';

export default function Bookings() {
  const { user, isLoaded } = useUser();

  const [paymentFilter, setPaymentFilter] = useState('PAID');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Fetch bookings using RTK Query
  const {
    data: bookingsResponse,
    isLoading: isLoadingBookings,
    error: bookingsError,
    refetch: refetchBookings
  } = useGetBookingsByUserIdQuery(
    {
      userId: user?.id,
      paymentStatus: paymentFilter,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    },
    {
      skip: !user?.id, // Skip query if user is not loaded
    }
  );



  // Transform API data to match component expectations
  const transformedBookings = useMemo(() => {
    if (!bookingsResponse?.data) return [];
    
    return bookingsResponse.data.map(booking => ({
      id: booking.id,
      hotel: {
        id: booking.hotel.id,
        name: booking.hotel.name,
        imageUrls: booking.hotel.imageUrls,
        location: booking.hotel.location,
        address: booking.hotel.address
      },
      room: booking.room,
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
      paymentStatus: booking.paymentStatus,
      reference: `INT-${new Date(booking.createdAt).getFullYear()}-${booking.id.slice(-4).toUpperCase()}`,
      numberOfGuests: booking.numberOfGuests,
      totalPrice: booking.totalPrice,
      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt
    }));
  }, [bookingsResponse]);

  // No need for frontend filtering since API handles all filtering
  const filteredBookings = transformedBookings;

  // Determine the current state more explicitly
  const hasAnyBookings = transformedBookings.length > 0;
  const hasFilteredBookings = filteredBookings.length > 0;
  const hasActiveFilters = startDate || endDate;

  if (!isLoaded) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading…</div>;
  if (isLoaded && !user) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Please sign in to view bookings.</div>;
  
  // Handle loading state for bookings
  if (isLoadingBookings) {
    return (
      <div className="min-h-screen bg-background pt-32 pb-16 px-6 md:px-10">
        <div className="mx-auto">
          <div className="grid gap-10">
            <section>
              <div className="flex items-end flex-wrap gap-3 justify-between mb-4">
                <h2 className="text-lg font-semibold">Booking History</h2>
                <div className="flex flex-wrap gap-3 text-xs md:text-sm">
                  <div className="h-9 w-24 bg-gray-200 animate-pulse rounded-md"></div>
                  <div className="h-9 w-36 bg-gray-200 animate-pulse rounded-md"></div>
                  <div className="h-9 w-36 bg-gray-200 animate-pulse rounded-md"></div>
                  <div className="h-9 w-20 bg-gray-200 animate-pulse rounded-md"></div>
                </div>
              </div>
              <div className="space-y-6">
                {[1, 2, 3].map(i => (
                  <Card key={i} className="p-6 animate-pulse">
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="md:w-48 h-48 bg-gray-200 rounded"></div>
                      <div className="flex-1 space-y-4">
                        <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    );
  }

  // Handle error state
  if (bookingsError) {
    return (
      <div className="min-h-screen bg-background pt-32 pb-16 px-6 md:px-10">
        <div className="mx-auto">
          <div className="grid gap-10">
            <section>
              <h2 className="text-lg font-semibold mb-4">Booking History</h2>
              <BookingNotFound 
                isError={true}
                title="Failed to Load Bookings"
                description="We encountered an error while fetching your bookings. Please check your connection and try again."
                actionButtonText="Try Again"
                onActionClick={() => refetchBookings()}
              />
            </section>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-32 pb-16 px-6 md:px-10">
      <div className=" mx-auto">
        

        <div className="grid gap-10">
          <section>
            <div className="flex items-end flex-wrap gap-3 justify-between mb-4">
              <h2 className="text-lg font-semibold">Booking History</h2>
              <div className="flex flex-wrap gap-3 text-xs md:text-sm">
                <select value={paymentFilter} onChange={e => setPaymentFilter(e.target.value)} className="h-9 rounded-md border bg-background px-2 text-sm">
                  <option value="PAID">Paid</option>
                  <option value="PENDING">Pending</option>
                  <option value="FAILED">Failed</option>
                </select>
                <input
                  type="date"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  placeholder="Start Date"
                  className="h-9 rounded-md border bg-background px-2 text-sm"
                />
                <input
                  type="date"
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                  placeholder="End Date"
                  className="h-9 rounded-md border bg-background px-2 text-sm"
                />
                <Button variant="outline" size="sm" className="h-9" onClick={() => { 
                  setPaymentFilter('PAID'); 
                  setStartDate(''); 
                  setEndDate(''); 
                }}>
                  <Filter className="h-4 w-4 mr-1" />Reset
                </Button>
              </div>
            </div>
            <div className="space-y-6">
              {filteredBookings.length === 0 ? (
                <BookingNotFound 
                  title="No Bookings Found"
                  description={!hasAnyBookings 
                    ? "You haven't made any bookings yet. Start exploring hotels and make your first reservation!"
                    : "Try adjusting your filters to see more booking results, or clear all filters to view all your bookings."
                  }
                  actionButtonText={!hasAnyBookings ? "Browse Hotels" : "Clear All Filters"}
                  onActionClick={!hasAnyBookings 
                    ? () => window.location.href = '/'
                    : () => { 
                        setPaymentFilter('PAID'); 
                        setStartDate(''); 
                        setEndDate(''); 
                      }
                  }
                />
              ) : (
                filteredBookings.map(booking => <BookingCard key={booking.id} booking={booking} />)
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
