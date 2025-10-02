

import express from 'express';
import { createBooking, getBookingsByUserId } from '../application/booking';

const BookingsRouter = express.Router();

// POST /api/bookings - Create a new booking
BookingsRouter.post('/', createBooking);

// GET /api/bookings/user/:userId - Get bookings by user ID with optional filters
// Query params: ?paymentStatus=PAID&startDate=2024-01-01&endDate=2024-12-31
BookingsRouter.get('/user/:userId', getBookingsByUserId);

export default BookingsRouter;  