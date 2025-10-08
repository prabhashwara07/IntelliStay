import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Badge } from '@/src/components/ui/badge';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { 
  Bed, 
  Plus, 
  Search,
  Filter,
  Star,
  Wifi,
  Car,
  Coffee,
  Tv,
  Waves,
  Dumbbell,
  Utensils,
  Shield,
  Users,
  Square,
  Building2,
  Clock,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/src/components/ui/form';
import { useCreateRoomMutation, useGetOwnerHotelsQuery, useGetHotelByIdQuery } from '@/src/store/api';
import { toast } from 'sonner';
import { useUser } from '@clerk/clerk-react';

// Initial empty list; will be populated after selection/fetch
const mockRooms = [];

const roomTypes = ['Single', 'Double', 'Suite'];

const roomSchema = z.object({
  roomNumber: z.string().min(1, 'Room number is required'),
  roomType: z.enum(['Single', 'Double', 'Suite'], { required_error: 'Room type is required' }),
  pricePerNight: z.coerce.number().positive('Price must be greater than 0'),
  maxGuests: z.coerce.number().int().min(1, 'Capacity must be at least 1'),
  isAvailable: z.boolean().optional(),
});

const amenityIcons = {
  wifi: Wifi,
  tv: Tv,
  ac: Shield,
  minibar: Coffee,
  balcony: Square,
  jacuzzi: Waves,
  gym: Dumbbell,
  restaurant: Utensils,
  parking: Car,
  butler: Users
};

const amenityLabels = {
  wifi: 'Free WiFi',
  tv: 'Smart TV',
  ac: 'Air Conditioning',
  minibar: 'Mini Bar',
  balcony: 'Balcony',
  jacuzzi: 'Jacuzzi',
  gym: 'Gym Access',
  restaurant: 'Restaurant',
  parking: 'Parking',
  butler: 'Butler Service'
};

export default function RoomManagement() {
  const [rooms, setRooms] = useState(mockRooms);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);

  const { user } = useUser();
  const navigate = useNavigate();
  const { data: ownerHotelsData, isLoading: isLoadingHotels } = useGetOwnerHotelsQuery(undefined, { skip: !user });
  
  // Since owner can only have one hotel, get that single hotel
  const userHotel = ownerHotelsData?.data?.[0];
  const [createRoom, { isLoading: isCreating }] = useCreateRoomMutation();

  const form = useForm({
    resolver: zodResolver(roomSchema),
    defaultValues: {
      roomNumber: '',
      roomType: '',
      pricePerNight: '',
      maxGuests: '',
      isAvailable: true,
    }
  });

  // Fetch hotel details if hotel exists and is approved
  const { data: hotelDetails } = useGetHotelByIdQuery(userHotel?._id, { 
    skip: !userHotel?._id || userHotel?.status !== 'approved'
  });
  
  const backendRooms = hotelDetails?.rooms || [];
  const uiRooms = useMemo(() => backendRooms.map((r, idx) => ({
    id: r._id || String(idx),
    roomNumber: r.roomNumber,
    roomType: r.roomType,
    pricePerNight: r.pricePerNight,
    maxGuests: r.maxGuests,
    status: r.isAvailable ? 'available' : 'occupied',
    amenities: [],
    description: ''
  })), [backendRooms]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800 border-green-200';
      case 'occupied': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cleaning': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredRooms = uiRooms.filter(room => {
    const matchesSearch = room.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         room.roomType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || room.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleAddRoom = async (data) => {
    if (!userHotel?._id) {
      toast.error('No hotel found');
      return;
    }

    try {
      await createRoom({
        hotelId: userHotel._id,
        room: {
          roomNumber: data.roomNumber,
          roomType: data.roomType,
          pricePerNight: Number(data.pricePerNight),
          maxGuests: Number(data.maxGuests),
          isAvailable: data.isAvailable ?? true,
        }
      }).unwrap();
      
      toast.success('Room added successfully');
      setShowAddForm(false);
      form.reset();
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to add room');
    }
  };

  // Editing and deleting rooms are intentionally disabled

  const toggleAmenity = (_amenity) => {};

  if (isLoadingHotels) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Show message if no hotel exists
  if (!userHotel) {
    return (
      <div className="min-h-screen bg-background">
        <div className="p-6">
          <Card className="p-8 text-center">
            <Building2 className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">No Hotel Registered</h2>
            <p className="text-muted-foreground mb-4">
              You need to register a hotel first before managing rooms.
            </p>
            <Button onClick={() => navigate('/become-partner')}>
              Register Your Hotel
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  // Show message if hotel is pending approval
  if (userHotel.status === 'pending') {
    return (
      <div className="min-h-screen bg-background">
        <div className="p-6">
          <Card className="p-8 text-center">
            <Clock className="h-16 w-16 mx-auto mb-4 text-yellow-500" />
            <h2 className="text-xl font-semibold mb-2">{userHotel.name}</h2>
            <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200 mb-4">
              Pending Approval
            </Badge>
            <p className="text-muted-foreground mb-4">
              Your hotel is under review. Room management will be available once approved.
            </p>
            <Button variant="outline" onClick={() => navigate('/')}>
              Back to Home
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  // Show message if hotel was rejected
  if (userHotel.status === 'rejected') {
    return (
      <div className="min-h-screen bg-background">
        <div className="p-6">
          <Card className="p-8 text-center">
            <AlertCircle className="h-16 w-16 mx-auto mb-4 text-red-500" />
            <h2 className="text-xl font-semibold mb-2">{userHotel.name}</h2>
            <Badge className="bg-red-100 text-red-700 border-red-200 mb-4">
              Rejected
            </Badge>
            <p className="text-muted-foreground mb-4">
              Your hotel registration was not approved. Please contact support for more information.
            </p>
            <Button variant="outline" onClick={() => navigate('/contact')}>
              Contact Support
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  // Main room management interface (only for approved hotels)
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 pt-10 pb-10">
        {/* Page Header */}
        <div className="mb-8">
          <Badge className="mb-2 bg-primary/10 text-primary border-primary/20">Room Management</Badge>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">Manage Your Rooms</h1>
          <p className="text-muted-foreground mt-2">
            Managing rooms for: <span className="font-medium">{userHotel.name}</span>
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search rooms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
            >
              <option value="all">All Status</option>
              <option value="available">Available</option>
              <option value="occupied">Occupied</option>
              <option value="maintenance">Maintenance</option>
              <option value="cleaning">Cleaning</option>
            </select>
            <Button onClick={() => setShowAddForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Room
            </Button>
          </div>
        </div>



        {/* Add/Edit Room Form */}
        {showAddForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>{editingRoom ? 'Edit Room' : 'Add New Room'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleAddRoom)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="roomNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Room Number</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., 101" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="roomType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Room Type</FormLabel>
                          <FormControl>
                            <select
                              className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                              {...field}
                            >
                              <option value="">Select room type</option>
                              {roomTypes.map(type => (
                                <option key={type} value={type}>{type}</option>
                              ))}
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="pricePerNight"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price (Rs.)</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="e.g., 15000" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="maxGuests"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Capacity</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="e.g., 2" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" disabled={isCreating || !selectedHotelId}>
                      {editingRoom ? 'Update Room' : (isCreating ? 'Adding…' : 'Add Room')}
                    </Button>
                    <Button 
                      variant="outline"
                      type="button"
                      onClick={() => {
                        setShowAddForm(false);
                        setEditingRoom(null);
                        form.reset();
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}

        {/* Rooms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRooms.map((room) => (
            <Card key={room.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Bed className="h-5 w-5" />
                    Room {room.roomNumber}
                  </CardTitle>
                  <Badge className={getStatusColor(room.status)}>
                    {room.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="font-medium">{room.roomType}</p>
                  <p className="text-sm text-muted-foreground">{room.description}</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Price:</span>
                    <span className="font-semibold">Rs. {Number(room.pricePerNight).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Capacity:</span>
                    <span className="font-semibold">{room.maxGuests} guests</span>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Amenities:</p>
                  <div className="flex flex-wrap gap-1">
                    {room.amenities.map((amenity) => {
                      const IconComponent = amenityIcons[amenity];
                      return (
                        <div key={amenity} className="flex items-center gap-1 px-2 py-1 bg-muted rounded-md text-xs">
                          {IconComponent && <IconComponent className="h-3 w-3" />}
                          <span>{amenityLabels[amenity]}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Room details are view-only; editing and deletion are disabled */}
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredRooms.length === 0 && (
          <Card className="p-8 text-center">
            <div className="text-muted-foreground mb-2">No rooms found</div>
            <div className="text-sm text-muted-foreground mb-4">
              {searchTerm || filterStatus !== 'all' 
                ? 'Try adjusting your search or filters.' 
                : 'Add your first room to get started.'
              }
            </div>
            {!searchTerm && filterStatus === 'all' && (
              <Button onClick={() => setShowAddForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Room
              </Button>
            )}
          </Card>
        )}
      </div>
    </div>
  );
}

