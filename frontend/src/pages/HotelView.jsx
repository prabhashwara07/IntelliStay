import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Star, MapPin, Wifi, Car, Coffee, Dumbbell, Users, Bed, Bath, CheckCircle, ArrowLeft, Heart, Share2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/src/components/ui/tabs';
import { useGetHotelByIdQuery } from '@/src/store/api';


export default function HotelView() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: hotel, isLoading, isError, error } = useGetHotelByIdQuery(id);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedRoom, setSelectedRoom] = useState(null);

  const images = hotel?.imageUrls && hotel.imageUrls.length > 0 
    ? hotel.imageUrls 
    : ['https://via.placeholder.com/800x600?text=Hotel+Image'];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleBackToSearch = () => {
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading hotel details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !hotel) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">Hotel Not Found</h2>
            <p className="text-muted-foreground mb-6">
              {error?.status === 404 ? 'The hotel you are looking for does not exist.' : 'Failed to load hotel details.'}
            </p>
            <Button onClick={handleBackToSearch} variant="default">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Hotels
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header with back button */}
      <div className="sticky top-0 z-40 bg-white border-b border-subtle">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              className="flex items-center gap-2 hover:text-primary hover:bg-transparent"
              onClick={handleBackToSearch}
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Search
            </Button>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <Heart className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Hotel Header */}
        <div className="mb-6">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                {hotel.name}
              </h1>
              <div className="flex items-center gap-4 mb-2">
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-500 fill-current" />
                  <span className="ml-1 text-lg font-semibold">{hotel.averageRating || 0}</span>
                  <span className="ml-2 text-muted-foreground">
                    ({(hotel.totalReviews || 0).toLocaleString()} reviews)
                  </span>
                </div>
              </div>
              <div className="flex items-center text-muted-foreground">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{hotel.location?.city && hotel.location?.country ? `${hotel.location.city}, ${hotel.location.country}` : 'Location not available'}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-primary">
                {hotel.priceRange?.minPrice ? (
                  <>Rs {hotel.priceRange.minPrice.toLocaleString('en-LK')}</>
                ) : (
                  'Price on request'
                )}
              </div>
              <div className="text-muted-foreground">
                {hotel.priceRange?.minPrice && hotel.priceRange?.maxPrice && hotel.priceRange.minPrice !== hotel.priceRange.maxPrice 
                  ? `Rs ${hotel.priceRange.minPrice.toLocaleString('en-LK')} - Rs ${hotel.priceRange.maxPrice.toLocaleString('en-LK')} per night`
                  : 'per night'
                }
              </div>
            </div>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="mb-8">
          <Card className="overflow-hidden">
            <div className="relative h-64 md:h-96">
              <img
                src={images[currentImageIndex]}
                alt={`${hotel.name} - Image ${currentImageIndex + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/10" />
              
              {/* Navigation arrows */}
              <Button
                variant="secondary"
                size="sm"
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                onClick={prevImage}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                onClick={nextImage}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>

              {/* Image indicators */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                {images.map((_, index) => (
                  <button
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                    }`}
                    onClick={() => setCurrentImageIndex(index)}
                  />
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Hotel Details */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <h3 className="text-xl font-semibold">About This Hotel</h3>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      {hotel.description}
                    </p>

                    {/* Hotel Statistics */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted rounded-lg mb-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">{hotel.totalRooms || 0}</div>
                        <div className="text-sm text-muted-foreground">Total Rooms</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{hotel.availableRoomsCount || 0}</div>
                        <div className="text-sm text-muted-foreground">Available Rooms</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-yellow-600">{hotel.averageRating || 0}</div>
                        <div className="text-sm text-muted-foreground">Average Rating</div>
                      </div>
                    </div>
                    
                    {/* Hotel Amenities */}
                    {hotel.amenities && hotel.amenities.length > 0 && (
                      <div className="mb-6">
                        <h4 className="font-semibold mb-3">Hotel Amenities</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {hotel.amenities.map((amenity, index) => (
                            <div key={index} className="flex items-center">
                              <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                              <span className="text-sm text-muted-foreground">{amenity}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Available Rooms */}
                    {hotel.availableRooms && hotel.availableRooms.length > 0 && (
                      <div className="mb-6">
                        <h4 className="font-semibold mb-3 text-green-600">Available Rooms</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {hotel.availableRooms.map((room, index) => (
                            <Card key={index} className="border-green-200">
                              <CardContent className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                  <h5 className="font-semibold">{room.roomType} - Room {room.roomNumber}</h5>
                                  <Badge className="bg-green-600 text-white">Available</Badge>
                                </div>
                                <div className="flex items-center text-sm text-muted-foreground mb-2">
                                  <Users className="h-4 w-4 mr-2" />
                                  <span>Up to {room.maxGuests} guests</span>
                                </div>
                                <div className="text-lg font-bold text-primary">
                                  Rs {room.pricePerNight.toLocaleString('en-LK')}/night
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Occupied Rooms */}
                    {hotel.unavailableRooms && hotel.unavailableRooms.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-3 text-red-600">Occupied Rooms</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {hotel.unavailableRooms.map((room, index) => (
                            <Card key={index} className="border-red-200 opacity-60">
                              <CardContent className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                  <h5 className="font-semibold">{room.roomType} - Room {room.roomNumber}</h5>
                                  <Badge className="bg-red-600 text-white">Occupied</Badge>
                                </div>
                                <div className="flex items-center text-sm text-muted-foreground mb-2">
                                  <Users className="h-4 w-4 mr-2" />
                                  <span>Up to {room.maxGuests} guests</span>
                                </div>
                                <div className="text-lg font-bold text-muted-foreground">
                                  Rs {room.pricePerNight.toLocaleString('en-LK')}/night
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card className="sticky top-24">
                  <CardHeader>
                    <h3 className="text-xl font-semibold">Book Your Stay</h3>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">
                        {selectedRoom ? 'Room Price' : 'Price Range'}
                      </span>
                      <div className="text-right">
                        {selectedRoom ? (
                          (() => {
                            const room = hotel.availableRooms?.find(r => r.roomNumber === selectedRoom);
                            return (
                              <div className="text-xl font-bold text-primary">
                                Rs {room?.pricePerNight.toLocaleString('en-LK') || 0}
                              </div>
                            );
                          })()
                        ) : hotel.priceRange?.minPrice ? (
                          <div className="text-xl font-bold text-primary">
                            Rs {hotel.priceRange.minPrice.toLocaleString('en-LK')}
                            {hotel.priceRange.maxPrice && hotel.priceRange.minPrice !== hotel.priceRange.maxPrice && (
                              <span className="text-sm"> - Rs {hotel.priceRange.maxPrice.toLocaleString('en-LK')}</span>
                            )}
                          </div>
                        ) : (
                          <div className="text-xl font-bold text-primary">Price on request</div>
                        )}
                        <div className="text-xs text-muted-foreground">per night</div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Check-in</label>
                        <input
                          type="date"
                          className="w-full mt-1 px-3 py-2 border border-input bg-background rounded-md"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Check-out</label>
                        <input
                          type="date"
                          className="w-full mt-1 px-3 py-2 border border-input bg-background rounded-md"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Select Room</label>
                        <select 
                          value={selectedRoom || ''} 
                          onChange={(e) => setSelectedRoom(e.target.value)}
                          className="w-full mt-1 px-3 py-2 border border-input bg-background rounded-md"
                        >
                          <option value="">Choose a room</option>
                          {hotel.availableRooms && hotel.availableRooms.map((room) => (
                            <option key={room.roomNumber} value={room.roomNumber}>
                              {room.roomType} - Room {room.roomNumber} (Rs {room.pricePerNight.toLocaleString('en-LK')}/night)
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <Button className="w-full mt-4">
                      Book Now
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
      </div>
    </div>
  );
}
