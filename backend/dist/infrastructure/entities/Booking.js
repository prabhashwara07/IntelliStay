"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const bookingSchema = new mongoose_1.Schema({
    userId: { type: String, required: true },
    hotelId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Hotel", required: true },
    roomId: { type: mongoose_1.Schema.Types.ObjectId, required: true },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    numberOfGuests: { type: Number, required: true, min: 1 },
    totalPrice: { type: Number, required: true },
    paymentStatus: {
        type: String,
        enum: ["PENDING", "PAID", "FAILED", "CANCELLED"],
        default: "PENDING",
    },
}, {
    timestamps: true
});
const Booking = (0, mongoose_1.model)("Booking", bookingSchema);
exports.default = Booking;
//# sourceMappingURL=Booking.js.map