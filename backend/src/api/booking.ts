import express from 'express';
import { createBooking, getBookingsByUserId, verifyBooking, getBookingsForOwner } from '../application/booking';
import { createReviewForBooking } from '../application/review';
import { isAuthenticated } from './middleware/authHandler';
import requireBillingProfile from './middleware/billingProfileHandler';

const BookingsRouter = express.Router();

BookingsRouter.post('/', isAuthenticated ,requireBillingProfile, createBooking);
BookingsRouter.get('/user/:userId', isAuthenticated, getBookingsByUserId);
BookingsRouter.get('/owner', isAuthenticated , getBookingsForOwner);

// Review endpoints
BookingsRouter.post('/reviews/:bookingId', isAuthenticated, createReviewForBooking);

// PayHere webhook endpoint - no authentication required, handles form data
BookingsRouter.post('/payment/notify', express.urlencoded({ extended: true }), verifyBooking);

export default BookingsRouter;  