import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Star, Bookmark, Clock, Building2, Filter } from 'lucide-react';
import { Card } from '@/src/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/src/components/ui/tabs';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/src/components/ui/avatar';
import HotelCard from '@/src/components/HotelCard';

const MOCK_USER = {
  id: 'user_123',
  name: 'Alex Johnson',
  email: 'alex.johnson@example.com',
  avatar: 'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=300&h=300&fit=crop&face',
  memberSince: '2023-04-12',
  tier: 'Gold',
  points: 4820,
};

const MOCK_BOOKINGS = [
  {
    id: 'bk_001',
    hotel: {
      _id: 'hotel_001',
      name: 'Ocean View Resort',
      description: 'Beachfront resort with panoramic ocean views and premium amenities.',
      imageUrl: 'https://images.unsplash.com/photo-1501117716987-c8e1ecb2103d?w=900&h=600&fit=crop',
      priceStartingFrom: 25000,
      starRating: 5,
      averageRating: 4.8,
      amenities: ['wifi', 'pool', 'restaurant', 'spa', 'air_conditioning', 'parking'],
    },
    checkIn: '2025-10-12',
    checkOut: '2025-10-16',
    guests: 2,
    rooms: 1,
    status: 'upcoming', // upcoming | completed | cancelled
    paymentStatus: 'PAID', // PAID | PENDING | REFUNDED
    reference: 'INT-2025-OVR-3519',
    address: 'Mirissa, Sri Lanka',
  },
  {
    id: 'bk_002',
    hotel: {
      _id: 'hotel_002',
      name: 'City Business Hotel',
      description: 'Modern hotel perfect for business travelers, centrally located.',
      imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=900&h=600&fit=crop',
      priceStartingFrom: 12000,
      starRating: 4,
      averageRating: 4.3,
      amenities: ['wifi', 'gym', 'restaurant', 'business_center', 'parking', 'air_conditioning'],
    },
    checkIn: '2025-08-02',
    checkOut: '2025-08-05',
    guests: 1,
    rooms: 1,
    status: 'completed',
    paymentStatus: 'REFUNDED',
    reference: 'INT-2025-CBH-8841',
    address: 'Colombo 02, Sri Lanka',
  },
  {
    id: 'bk_003',
    hotel: {
      _id: 'hotel_003',
      name: 'Highland Retreat',
      description: 'Cozy mountain retreat with breathtaking valley views.',
      imageUrl: 'https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba?w=900&h=600&fit=crop',
      priceStartingFrom: 18000,
      starRating: 4,
      averageRating: 4.6,
      amenities: ['wifi', 'restaurant', 'spa', 'parking', 'air_conditioning'],
    },
    checkIn: '2025-05-14',
    checkOut: '2025-05-18',
    guests: 2,
    rooms: 1,
    status: 'cancelled',
    paymentStatus: 'PENDING',
    reference: 'INT-2025-HLR-2219',
    address: 'Nuwara Eliya, Sri Lanka',
  },
];

const MOCK_SAVED = [
  {
    _id: 'hotel_004',
    name: 'Lagoon Paradise',
    description: 'Serene lagoon-side property ideal for a peaceful getaway.',
    imageUrl: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=900&h=600&fit=crop',
    priceStartingFrom: 22000,
    starRating: 5,
    averageRating: 4.9,
    amenities: ['wifi', 'pool', 'spa', 'restaurant', 'air_conditioning', 'parking'],
  },
  {
    _id: 'hotel_005',
    name: 'Urban Chic Suites',
    description: 'Stylish suites in the heart of the city with great connectivity.',
    imageUrl: 'https://images.unsplash.com/photo-1496412705862-e0088f16f791?w=900&h=600&fit=crop',
    priceStartingFrom: 16000,
    starRating: 4,
    averageRating: 4.4,
    amenities: ['wifi', 'gym', 'restaurant', 'parking', 'air_conditioning'],
  },
];

function SectionHeader({ title, badge }) {
  return (
    <div className="mb-6">
      {badge && (
        <Badge className="mb-2 bg-primary/10 text-primary border-primary/20">{badge}</Badge>
      )}
      <h2 className="text-2xl md:text-3xl font-bold text-foreground">{title}</h2>
    </div>
  );
}

function BookingRow({ booking, onView }) {
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
    <Card className="p-4 hover:shadow-sm border-border/60 bg-card/60 backdrop-blur supports-[backdrop-filter]:bg-card/50 transition-colors">
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2 justify-between">
          <div className="flex items-center gap-2">
            <h4 className="text-sm md:text-base font-semibold text-foreground tracking-tight">{booking.hotel.name}</h4>
            <Badge className={statusStyles[booking.status] + ' capitalize'}>{booking.status}</Badge>
            <Badge className={paymentStyles[booking.paymentStatus]}>{booking.paymentStatus}</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={() => onView(booking.hotel._id)}>Hotel</Button>
            <Button size="sm">Details</Button>
          </div>
        </div>
        <div className="flex flex-wrap gap-6 text-xs md:text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{booking.checkIn}</span>
            <span>→</span>
            <span>{booking.checkOut}</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            <span>{booking.address}</span>
          </div>
          <div className="text-xs md:text-xs text-muted-foreground">Ref: {booking.reference}</div>
        </div>
      </div>
    </Card>
  );
}

export default function MyAccount() {
  const navigate = useNavigate();

  // Filter state for booking history
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredBookings = useMemo(() => {
    return MOCK_BOOKINGS.filter(b => {
      const matchesPayment = paymentFilter === 'all' || b.paymentStatus === paymentFilter;
      const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
      const ci = new Date(b.checkIn).getTime();
      const fromOk = !dateFrom || ci >= new Date(dateFrom).getTime();
      const toOk = !dateTo || ci <= new Date(dateTo).getTime();
      return matchesPayment && matchesStatus && fromOk && toOk;
    });
  }, [paymentFilter, statusFilter, dateFrom, dateTo]);

  const handleViewHotel = (id) => navigate(`/hotel/${id}`);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 pt-28 pb-12">
        {/* Header */}
        <SectionHeader title="My Account" badge="Account Dashboard" />

        {/* Profile summary (action buttons section removed) */}
        <div className="mb-8">
          <Card className="p-6">
            <div className="flex items-start gap-4">
              <Avatar className="size-16">
                <AvatarImage src={MOCK_USER.avatar} alt={MOCK_USER.name} />
                <AvatarFallback>{MOCK_USER.name.slice(0, 2)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">{MOCK_USER.name}</h3>
                    <div className="text-sm text-muted-foreground">{MOCK_USER.email}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-amber-100 text-amber-800 border-amber-200">Tier: {MOCK_USER.tier}</Badge>
                    <Badge className="bg-primary/10 text-primary border-primary/20">{MOCK_USER.points} pts</Badge>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    Member since {MOCK_USER.memberSince}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Building2 className="h-4 w-4" />
                    Bookings: {MOCK_BOOKINGS.length}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Star className="h-4 w-4 text-yellow-500" />
                    Top rating: 4.9
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Tabs (Dashboard removed) */}
        <Tabs defaultValue="bookings" className="w-full">
          <TabsList>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="saved">Saved Hotels</TabsTrigger>
          </TabsList>

          <TabsContent value="bookings" className="mt-6 space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <h3 className="text-lg font-semibold">Booking History</h3>
              <div className="w-full md:w-auto grid grid-cols-2 lg:flex gap-3 text-xs md:text-sm">
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] uppercase tracking-wide text-muted-foreground">Payment</label>
                  <select value={paymentFilter} onChange={e => setPaymentFilter(e.target.value)} className="h-9 rounded-md border bg-background px-2 text-sm">
                    <option value="all">All</option>
                    <option value="PAID">Paid</option>
                    <option value="PENDING">Pending</option>
                    <option value="REFUNDED">Refunded</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] uppercase tracking-wide text-muted-foreground">Status</label>
                  <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="h-9 rounded-md border bg-background px-2 text-sm">
                    <option value="all">All</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] uppercase tracking-wide text-muted-foreground">From</label>
                  <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="h-9 rounded-md border bg-background px-2 text-sm" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] uppercase tracking-wide text-muted-foreground">To</label>
                  <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="h-9 rounded-md border bg-background px-2 text-sm" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] uppercase tracking-wide text-transparent select-none">Action</label>
                  <Button variant="outline" size="sm" className="h-9" onClick={() => { setPaymentFilter('all'); setStatusFilter('all'); setDateFrom(''); setDateTo(''); }}>
                    <Filter className="h-4 w-4 mr-1" /> Reset
                  </Button>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              {filteredBookings.length === 0 && (
                <Card className="p-10 text-center text-muted-foreground border-dashed">No bookings match the selected filters.</Card>
              )}
              {filteredBookings.map(b => (
                <BookingRow key={b.id} booking={b} onView={handleViewHotel} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="saved" className="mt-6">
            {MOCK_SAVED.length === 0 ? (
              <Card className="p-8 text-center">
                <Bookmark className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                <div className="text-muted-foreground">No saved hotels yet.</div>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {MOCK_SAVED.map((hotel) => (
                  <HotelCard key={hotel._id} hotel={hotel} onViewDetails={(id) => navigate(`/hotel/${id}`)} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}


