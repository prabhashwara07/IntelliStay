"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const booking_1 = require("../application/booking");
const authHandler_1 = require("./middleware/authHandler");
const billingProfileHandler_1 = __importDefault(require("./middleware/billingProfileHandler"));
const BookingsRouter = express_1.default.Router();
BookingsRouter.post('/', authHandler_1.isAuthenticated, billingProfileHandler_1.default, booking_1.createBooking);
BookingsRouter.get('/user/:userId', authHandler_1.isAuthenticated, booking_1.getBookingsByUserId);
BookingsRouter.get('/owner', authHandler_1.isAuthenticated, booking_1.getBookingsForOwner);
// PayHere webhook endpoint - no authentication required, handles form data
BookingsRouter.post('/payment/notify', express_1.default.urlencoded({ extended: true }), booking_1.verifyBooking);
exports.default = BookingsRouter;
//# sourceMappingURL=booking.js.map