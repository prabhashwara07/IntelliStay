import { Schema, model, Document, Types } from 'mongoose';
import { ILocation } from './Location';

// Interface for the embedded Room sub-document
export interface IRoom {
  roomNumber: string;
  roomType: 'Single' | 'Double' | 'Suite';
  pricePerNight: number;
  maxGuests: number;
  isAvailable: boolean;
}

// Interface for the Hotel document, including the new fields
export interface IHotel extends Document {
  name: string;
  description: string;
  location: Types.ObjectId | ILocation;
  imageUrls: string[];
  amenities: string[];
  rooms: IRoom[];
  reviews: Types.ObjectId[];
  embedding?: number[];
  
  // --- NEW FIELDS FOR FILTERING ---
  priceStartingFrom: number; // For efficient price filtering/sorting
  starRating: number;         // For filtering by star category
  averageRating: number;      // For efficient rating filtering/sorting
  
  // --- STATUS MANAGEMENT ---
  status: 'pending' | 'approved' | 'rejected';
  ownerId?: string;           // Clerk user ID of hotel owner
  submittedAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string;        // Admin user ID who reviewed
  rejectionReason?: string;   // Reason for rejection
}

const roomSchema = new Schema<IRoom>({
  roomNumber: { type: String, required: true },
  roomType: { type: String, required: true, enum: ['Single', 'Double', 'Suite'] },
  pricePerNight: { type: Number, required: true },
  maxGuests: { type: Number, required: true, min: 1 },
  isAvailable: { type: Boolean, default: true },
});

const hotelSchema = new Schema<IHotel>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: Schema.Types.ObjectId, ref: "Location", required: true },
  imageUrls: { type: [String], required: true },
  amenities: { type: [String], default: [] },
  rooms: [roomSchema],
  reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
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

const Hotel = model<IHotel>("Hotel", hotelSchema);
export default Hotel;