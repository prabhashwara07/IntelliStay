import express from 'express';
import { createBooking, getBookingsByUserId } from '../application/booking';
import { isAuthenticated } from './middleware/authHandler';

const BookingsRouter = express.Router();

BookingsRouter.post('/', isAuthenticated as any, createBooking);
BookingsRouter.get('/user/:userId', isAuthenticated as any, getBookingsByUserId);

export default BookingsRouter;  