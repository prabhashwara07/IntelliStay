import { z } from 'zod';

// Query parameters DTO for filtering bookings
export const GetBookingsQueryDTO = z.object({
  userId: z.string().min(1, 'User ID is required'),
  paymentStatus: z.enum(['PENDING', 'PAID', 'FAILED']).optional(),
  startDate: z.string().optional().transform((val) => val ? new Date(val) : undefined),
  endDate: z.string().optional().transform((val) => val ? new Date(val) : undefined),
});

// Hotel information embedded in booking response
export const BookingHotelDTO = z.object({
  id: z.string(),
  name: z.string(),
  imageUrls: z.array(z.string()).default([]),
  location: z.object({
    city: z.string(),
    country: z.string(),
  }).optional(),
  address: z.string().optional(),
});

// Room information embedded in booking response
export const BookingRoomDTO = z.object({
  id: z.string(),
  roomNumber: z.string(),
  roomType: z.enum(['Single', 'Double', 'Suite']),
  pricePerNight: z.number(),
  maxGuests: z.number(),
}).nullable();

// Response DTO for booking data
export const BookingResponseDTO = z.object({
  id: z.string(),
  userId: z.string(),
  hotel: BookingHotelDTO,
  room: BookingRoomDTO,
  checkIn: z.date(),
  checkOut: z.date(),
  numberOfGuests: z.number(),
  totalPrice: z.number(),
  paymentStatus: z.enum(['PENDING', 'PAID', 'FAILED']),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Simple bookings response DTO
export const BookingsResponseDTO = z.array(BookingResponseDTO);

export type GetBookingsQuery = z.infer<typeof GetBookingsQueryDTO>;
export type BookingResponse = z.infer<typeof BookingResponseDTO>;
export type BookingsResponse = z.infer<typeof BookingsResponseDTO>;