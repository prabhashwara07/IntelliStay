import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Star,
  MapPin,
  Users,
  Bed,
  Bath,
  CheckCircle,
  ArrowLeft,
  Heart,
  Share2,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/ui/tabs";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/src/components/ui/carousel";
import {
  useGetHotelByIdQuery,
  useCreateBookingMutation,
} from "@/src/store/api";
import { getAmenityIcons } from "@/src/utils/amenities";
import { useUser } from "@clerk/clerk-react";
import { toast } from "sonner";
import generateHash from "../utils/PaymentHash";
import { hash } from "zod";

export default function HotelView() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user, isLoaded: userLoaded } = useUser();
  const { data: hotel, isLoading, isError, error } = useGetHotelByIdQuery(id);
  const [createBooking, { isLoading: isBookingLoading }] =
    useCreateBookingMutation();

  // Form state
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [numberOfGuests, setNumberOfGuests] = useState(1);

  // Calculate total price and nights
  const selectedRoomData = hotel?.availableRooms?.find(
    (r) => r.roomNumber === selectedRoom
  );
  const numberOfNights =
    checkIn && checkOut
      ? Math.ceil(
          (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)
        )
      : 0;
  const totalPrice =
    selectedRoomData && numberOfNights > 0
      ? numberOfNights * selectedRoomData.pricePerNight
      : 0;

  const images =
    hotel?.imageUrls && hotel.imageUrls.length > 0
      ? hotel.imageUrls
      : ["https://via.placeholder.com/800x600?text=Hotel+Image"];

  const handleBackToSearch = () => {
    navigate("/");
  };

  const handleBooking = async () => {
    // Validation
    if (!userLoaded || !user) {
      toast.error("Please sign in to make a booking");
      return;
    }

    if (!selectedRoom) {
      toast.error("Please select a room");
      return;
    }

    if (!checkIn || !checkOut) {
      toast.error("Please select check-in and check-out dates");
      return;
    }

    if (new Date(checkOut) <= new Date(checkIn)) {
      toast.error("Check-out date must be after check-in date");
      return;
    }

    const room = hotel.availableRooms?.find(
      (r) => r.roomNumber === selectedRoom
    );
    if (!room) {
      toast.error("Selected room is no longer available");
      return;
    }

    if (numberOfGuests > room.maxGuests) {
      toast.error(`Room can accommodate maximum ${room.maxGuests} guests`);
      return;
    }

    try {
      const bookingData = {
        hotelId: id,
        roomId: room._id,
        checkIn,
        checkOut,
        numberOfGuests,
      };

      console.log("Creating booking:", bookingData);

      // Call backend API
      const result = await createBooking(bookingData).unwrap();

      console.log("Booking created, initiating payment:", result);

      // Show success message
      toast.success("Booking created! Redirecting to payment...", {
        description: `Booking ID: ${result.bookingDetails.bookingId}`,
        duration: 3000,
      });

      const paymentHash = generateHash(result.bookingDetails.bookingId, totalPrice);

      const refactoredPaymentData = {
        ...result.paymentData,
        first_name: user?.firstName,
        last_name: user?.lastName,
        email: user?.primaryEmailAddress.emailAddress || "guest",
        hash: paymentHash,
      };

      console.log("Refactored payment data:", refactoredPaymentData);

      // Automatically submit PayHere form
      if (result.paymentData && result.checkoutUrl) {
        submitPayHereForm(refactoredPaymentData, result.checkoutUrl);
      } else {
        throw new Error("Payment data not received from server");
      }
    } catch (error) {
      console.error("Booking error:", error);
      const errorMessage =
        error?.data?.error?.message ||
        error?.data?.message ||
        "Failed to create booking. Please try again.";
      toast.error("Booking failed", {
        description: errorMessage,
        duration: 5000,
      });
    }
  };

  // Helper function to submit PayHere form
  const submitPayHereForm = (paymentData, checkoutUrl) => {
    // Create form element
    const form = document.createElement("form");
    form.method = "POST";
    form.action = checkoutUrl;

    // Add all payment data as hidden inputs
    Object.entries(paymentData).forEach(([key, value]) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = String(value);
      form.appendChild(input);
    });

    // Append form to body and submit
    document.body.appendChild(form);

    console.log("Submitting PayHere form:", paymentData);

    // Submit form (redirects user to PayHere)
    form.submit();
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
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Hotel Not Found
            </h2>
            <p className="text-muted-foreground mb-6">
              {error?.status === 404
                ? "The hotel you are looking for does not exist."
                : "Failed to load hotel details."}
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
    <div className="min-h-screen bg-background pt-25">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        {/* Hotel Header - Mobile Optimized */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-3">
                {hotel.name}
              </h1>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-3">
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="ml-1 font-semibold">
                    {hotel.averageRating || 0}
                  </span>
                  <span className="ml-2 text-sm text-muted-foreground">
                    ({(hotel.totalReviews || 0).toLocaleString()} reviews)
                  </span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                  <span>
                    {hotel.location?.city && hotel.location?.country
                      ? `${hotel.location.city}, ${hotel.location.country}`
                      : "Location not available"}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex-shrink-0 text-right hidden sm:block">
              <div className="text-2xl sm:text-3xl font-bold text-primary">
                {hotel.priceRange?.minPrice ? (
                  <>Rs. {hotel.priceRange.minPrice.toLocaleString()}</>
                ) : (
                  "Price on request"
                )}
              </div>
              <div className="text-sm text-muted-foreground">
                Starting Price
              </div>
            </div>
          </div>
        </div>

        {/* Image Gallery - Shadcn Carousel */}
        <div className="relative">
          <Carousel className="w-full">
            <CarouselContent>
              {images.map((image, index) => (
                <CarouselItem key={index}>
                  <div className="relative h-64 sm:h-80 lg:h-96 rounded-xl overflow-hidden">
                    <img
                      src={image}
                      alt={`${hotel.name} - Image ${index + 1}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
          </Carousel>

          {/* Image dots indicator */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {images.map((_, index) => (
              <div
                key={index}
                className="w-2 h-2 rounded-full bg-white/50 hover:bg-white/80 transition-colors cursor-pointer"
              />
            ))}
          </div>
        </div>

        {/* Hotel Details - Modern Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* About Section */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">About This Hotel</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {hotel.description}
                </p>
              </CardContent>
            </Card>

            {/* Hotel Statistics - Mobile Optimized */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Hotel Overview</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <div className="text-xl sm:text-2xl font-bold text-blue-600">
                      {hotel.totalRooms || 0}
                    </div>
                    <div className="text-xs sm:text-sm text-blue-600/80 font-medium">
                      Total Rooms
                    </div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg border border-green-100">
                    <div className="text-xl sm:text-2xl font-bold text-green-600">
                      {hotel.availableRoomsCount || 0}
                    </div>
                    <div className="text-xs sm:text-sm text-green-600/80 font-medium">
                      Available
                    </div>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                    <div className="text-xl sm:text-2xl font-bold text-yellow-600">
                      {hotel.averageRating || 0}
                    </div>
                    <div className="text-xs sm:text-sm text-yellow-600/80 font-medium">
                      Rating
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* Hotel Amenities */}
            {hotel.amenities && hotel.amenities.length > 0 && (
              <Card className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">
                    Hotel Amenities
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {hotel.amenities.map((amenity, index) => {
                      const amenityIcons = getAmenityIcons([amenity]);
                      const IconComponent =
                        amenityIcons[0]?.icon || CheckCircle;
                      return (
                        <div
                          key={index}
                          className="flex items-center p-2 bg-gray-50 rounded-lg"
                        >
                          <IconComponent className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                          <span className="text-sm font-medium capitalize">
                            {amenity.replace("_", " ")}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Available Rooms */}
            {hotel.availableRooms && hotel.availableRooms.length > 0 && (
              <Card className="border-0 shadow-sm border-l-4 border-l-green-500">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                    <h3 className="text-lg font-semibold text-green-700">
                      Available Rooms
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {hotel.availableRooms.map((room, index) => (
                      <div
                        key={index}
                        className="bg-green-50 border border-green-200 rounded-xl p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-semibold text-green-800">
                              {room.roomType}
                            </h4>
                            <p className="text-sm text-green-600">
                              Room {room.roomNumber}
                            </p>
                          </div>
                          <Badge className="bg-green-100 text-green-800 border-green-200">
                            Available
                          </Badge>
                        </div>
                        <div className="flex items-center text-sm text-green-700 mb-2">
                          <Users className="h-4 w-4 mr-2" />
                          <span>Up to {room.maxGuests} guests</span>
                        </div>
                        <div className="text-xl font-bold text-green-800">
                          Rs. {room.pricePerNight.toLocaleString()}
                          <span className="text-sm font-normal">/night</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Occupied Rooms */}
            {hotel.unavailableRooms && hotel.unavailableRooms.length > 0 && (
              <Card className="border-0 shadow-sm border-l-4 border-l-red-500">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="h-2 w-2 bg-red-500 rounded-full"></div>
                    <h3 className="text-lg font-semibold text-red-700">
                      Currently Occupied
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {hotel.unavailableRooms.map((room, index) => (
                      <div
                        key={index}
                        className="bg-red-50 border border-red-200 rounded-xl p-4 opacity-75"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-semibold text-red-800">
                              {room.roomType}
                            </h4>
                            <p className="text-sm text-red-600">
                              Room {room.roomNumber}
                            </p>
                          </div>
                          <Badge className="bg-red-100 text-red-800 border-red-200">
                            Occupied
                          </Badge>
                        </div>
                        <div className="flex items-center text-sm text-red-700 mb-2">
                          <Users className="h-4 w-4 mr-2" />
                          <span>Up to {room.maxGuests} guests</span>
                        </div>
                        <div className="text-xl font-bold text-red-800">
                          Rs. {room.pricePerNight.toLocaleString()}
                          <span className="text-sm font-normal">/night</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Booking Sidebar - Mobile Optimized */}
          <div className="order-first lg:order-last">
            <Card className="sticky top-20 border-0 shadow-lg bg-gradient-to-br from-white to-gray-50/50">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold mb-2">Book Your Stay</h3>
                  <div className="text-3xl font-bold text-primary mb-1">
                    {selectedRoom
                      ? (() => {
                          const room = hotel.availableRooms?.find(
                            (r) => r.roomNumber === selectedRoom
                          );
                          return `Rs. ${
                            room?.pricePerNight.toLocaleString() || 0
                          }`;
                        })()
                      : hotel.priceRange?.minPrice
                      ? `Rs. ${hotel.priceRange.minPrice.toLocaleString()}`
                      : "Price on request"}
                  </div>
                  <div className="text-sm text-muted-foreground">per night</div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Check-in
                      </label>
                      <input
                        type="date"
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                        min={new Date().toISOString().split("T")[0]}
                        className="w-full px-3 py-2 border border-gray-300 bg-white rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Check-out
                      </label>
                      <input
                        type="date"
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                        min={checkIn || new Date().toISOString().split("T")[0]}
                        className="w-full px-3 py-2 border border-gray-300 bg-white rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Select Room
                    </label>
                    <select
                      value={selectedRoom || ""}
                      onChange={(e) => setSelectedRoom(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 bg-white rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                      disabled={isBookingLoading}
                    >
                      <option value="">Choose a room</option>
                      {hotel.availableRooms &&
                        hotel.availableRooms.map((room) => (
                          <option key={room.roomNumber} value={room.roomNumber}>
                            {room.roomType} - Room {room.roomNumber} (Rs.{" "}
                            {room.pricePerNight.toLocaleString()}/night)
                          </option>
                        ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Guests
                    </label>
                    <select
                      value={numberOfGuests}
                      onChange={(e) =>
                        setNumberOfGuests(Number(e.target.value))
                      }
                      className="w-full px-3 py-2 border border-gray-300 bg-white rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                      disabled={isBookingLoading}
                    >
                      <option value={1}>1 Guest</option>
                      <option value={2}>2 Guests</option>
                      <option value={3}>3 Guests</option>
                      <option value={4}>4 Guests</option>
                      <option value={5}>5 Guests</option>
                      <option value={6}>6 Guests</option>
                    </select>
                  </div>
                </div>

                {/* Booking Summary */}
                {selectedRoomData &&
                  checkIn &&
                  checkOut &&
                  numberOfNights > 0 && (
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
                      <h4 className="font-semibold text-gray-900 mb-3">
                        Booking Summary
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Room:</span>
                          <span className="font-medium">
                            {selectedRoomData.roomType} #
                            {selectedRoomData.roomNumber}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Dates:</span>
                          <span className="font-medium">
                            {new Date(checkIn).toLocaleDateString()} -{" "}
                            {new Date(checkOut).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Nights:</span>
                          <span className="font-medium">{numberOfNights}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Guests:</span>
                          <span className="font-medium">{numberOfGuests}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">
                            Price per night:
                          </span>
                          <span className="font-medium">
                            Rs.{" "}
                            {selectedRoomData.pricePerNight.toLocaleString()}
                          </span>
                        </div>
                        <div className="border-t pt-2 mt-2">
                          <div className="flex justify-between text-lg font-bold">
                            <span>Total:</span>
                            <span className="text-primary">
                              Rs. {totalPrice.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                {userLoaded && user ? (
                  <Button
                    onClick={handleBooking}
                    disabled={isBookingLoading}
                    className="w-full mt-6 bg-primary hover:bg-primary/90 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isBookingLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Creating Booking...
                      </div>
                    ) : (
                      "Book Now"
                    )}
                  </Button>
                ) : (
                  <Button
                    onClick={() =>
                      toast.info("Please sign in to make a booking")
                    }
                    className="w-full mt-6 bg-gray-400 hover:bg-gray-500 text-white font-semibold py-3 rounded-lg shadow-lg transition-all duration-200"
                  >
                    Sign In to Book
                  </Button>
                )}

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Free cancellation until 24h before</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
