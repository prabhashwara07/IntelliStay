import express from 'express';
import { createBooking, getBookingsByUserId } from '../application/booking';
import { isAuthenticated } from './middleware/authHandler';
import requireBillingProfile from './middleware/billingProfileHandler';

const BookingsRouter = express.Router();

BookingsRouter.post('/', isAuthenticated as any,requireBillingProfile, createBooking);
BookingsRouter.get('/user/:userId', isAuthenticated as any, getBookingsByUserId);

export default BookingsRouter;  