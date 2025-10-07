"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingsResponseDTO = exports.BookingResponseDTO = exports.BookingRoomDTO = exports.BookingHotelDTO = exports.GetBookingsQueryDTO = exports.CreateBookingDTO = void 0;
const zod_1 = require("zod");
// Request DTO for creating a booking
exports.CreateBookingDTO = zod_1.z.object({
    userId: zod_1.z.string().optional(),
    hotelId: zod_1.z.string().min(1, 'Hotel ID is required'),
    roomId: zod_1.z.string().min(1, 'Room ID is required'),
    checkIn: zod_1.z.string().transform((val) => new Date(val)),
    checkOut: zod_1.z.string().transform((val) => new Date(val)),
    numberOfGuests: zod_1.z.number().min(1, 'Number of guests must be at least 1'),
}).refine((data) => {
    return data.checkOut > data.checkIn;
}, {
    message: 'Check-out date must be after check-in date',
    path: ['checkOut'],
});
// Query parameters DTO for filtering bookings
exports.GetBookingsQueryDTO = zod_1.z.object({
    userId: zod_1.z.string().min(1, 'User ID is required'),
    paymentStatus: zod_1.z.enum(['PENDING', 'PAID', 'FAILED']).optional(),
    startDate: zod_1.z.string().optional().transform((val) => val ? new Date(val) : undefined),
    endDate: zod_1.z.string().optional().transform((val) => val ? new Date(val) : undefined),
});
// Hotel information embedded in booking response
exports.BookingHotelDTO = zod_1.z.object({
    id: zod_1.z.string(),
    name: zod_1.z.string(),
    imageUrls: zod_1.z.array(zod_1.z.string()).default([]),
    location: zod_1.z.object({
        city: zod_1.z.string(),
        country: zod_1.z.string(),
    }).optional(),
    address: zod_1.z.string().optional(),
});
// Room information embedded in booking response
exports.BookingRoomDTO = zod_1.z.object({
    id: zod_1.z.string(),
    roomNumber: zod_1.z.string(),
    roomType: zod_1.z.enum(['Single', 'Double', 'Suite']),
    pricePerNight: zod_1.z.number(),
    maxGuests: zod_1.z.number(),
}).nullable();
// Response DTO for booking data
exports.BookingResponseDTO = zod_1.z.object({
    id: zod_1.z.string(),
    userId: zod_1.z.string(),
    hotel: exports.BookingHotelDTO,
    room: exports.BookingRoomDTO,
    checkIn: zod_1.z.date(),
    checkOut: zod_1.z.date(),
    numberOfGuests: zod_1.z.number(),
    totalPrice: zod_1.z.number(),
    paymentStatus: zod_1.z.enum(['PENDING', 'PAID', 'FAILED']),
    createdAt: zod_1.z.date(),
    updatedAt: zod_1.z.date(),
});
// Simple bookings response DTO
exports.BookingsResponseDTO = zod_1.z.array(exports.BookingResponseDTO);
//# sourceMappingURL=BookingDTO.js.map