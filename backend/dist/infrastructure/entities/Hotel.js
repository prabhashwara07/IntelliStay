"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const roomSchema = new mongoose_1.Schema({
    roomNumber: { type: String, required: true },
    roomType: { type: String, required: true, enum: ['Single', 'Double', 'Suite'] },
    pricePerNight: { type: Number, required: true },
    maxGuests: { type: Number, required: true, min: 1 },
    isAvailable: { type: Boolean, default: true },
});
const hotelSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: mongoose_1.Schema.Types.ObjectId, ref: "Location", required: true },
    imageUrls: { type: [String], required: true },
    amenities: { type: [String], default: [] },
    rooms: [roomSchema],
    reviews: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Review" }],
    embedding: { type: [Number], select: false },
    // --- SCHEMA DEFINITION FOR NEW FIELDS ---
    priceStartingFrom: { type: Number, required: true, index: true },
    starRating: { type: Number, required: true, min: 1, max: 5, index: true },
    averageRating: { type: Number, default: 0, min: 0, max: 5, index: true },
    // --- STATUS MANAGEMENT SCHEMA ---
    status: {
        type: String,
        required: true,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
        index: true
    },
    ownerId: { type: String, index: true }, // Clerk user ID
    submittedAt: { type: Date, default: Date.now },
    reviewedAt: { type: Date },
    reviewedBy: { type: String }, // Admin user ID
    rejectionReason: { type: String },
}, {
    timestamps: true
});
const Hotel = (0, mongoose_1.model)("Hotel", hotelSchema);
exports.default = Hotel;
//# sourceMappingURL=Hotel.js.map