import { Schema, model, Document, Types } from 'mongoose';
import { ILocation } from './Location'; // Assuming Location.ts is in the same directory

// Interface for the embedded Room sub-document. Note: It does NOT extend Document.
export interface IRoom {
  roomNumber: string;
  roomType: 'Single' | 'Double' | 'Suite'; // Using TypeScript's string literal types
  pricePerNight: number;
  maxGuests: number;
  isAvailable: boolean;
}

// Interface for the Hotel document
export interface IHotel extends Document {
  name: string;
  description: string;
  location: Types.ObjectId | ILocation; // Can be populated with the full ILocation object
  imageUrls: string[];
  amenities: string[];
  rooms: IRoom[];
  reviews: Types.ObjectId[];
  embedding?: number[];
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
}, { 
  timestamps: true 
});

const Hotel = model<IHotel>("Hotel", hotelSchema);
export default Hotel;