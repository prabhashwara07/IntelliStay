import express from 'express';
import { createBooking, getBookingsByUserId, verifyBooking } from '../application/booking';
import { isAuthenticated } from './middleware/authHandler';
import requireBillingProfile from './middleware/billingProfileHandler';

const BookingsRouter = express.Router();

BookingsRouter.post('/', isAuthenticated as any,requireBillingProfile, createBooking);
BookingsRouter.get('/user/:userId', isAuthenticated as any, getBookingsByUserId);

// PayHere webhook endpoint - no authentication required, handles form data
BookingsRouter.post('/payment/notify', express.urlencoded({ extended: true }), verifyBooking);

export default BookingsRouter;  