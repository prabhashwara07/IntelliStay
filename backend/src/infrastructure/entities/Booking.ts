import { Schema, model, Document, Types } from 'mongoose';

export interface IBooking extends Document {
  userId: string;
  hotelId: Types.ObjectId;
  roomId: Types.ObjectId;
  checkIn: Date;
  checkOut: Date;
  numberOfGuests: number;
  totalPrice: number;
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'CANCELLED';
  createdAt: Date;
  updatedAt: Date;
}

const bookingSchema = new Schema<IBooking>({
  userId: { type: String, required: true },
  hotelId: { type: Schema.Types.ObjectId, ref: "Hotel", required: true },
  roomId: { type: Schema.Types.ObjectId, required: true },
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

const Booking = model<IBooking>("Booking", bookingSchema);
export default Booking;