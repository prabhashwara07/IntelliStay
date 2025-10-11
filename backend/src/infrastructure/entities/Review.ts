import { Schema, model, Document, Types } from 'mongoose';

export interface IReview extends Document {
  rating: number;
  comment: string;
  userId: string;
  hotelId: Types.ObjectId;
  bookingId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<IReview>({
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true, minlength: 10, maxlength: 500 },
  userId: { type: String, required: true },
  hotelId: {
    type: Schema.Types.ObjectId,
    ref: "Hotel",
    required: true,
  },
  bookingId: {
    type: Schema.Types.ObjectId,
    ref: "Booking",
    required: true,
    unique: true, // Ensure one review per booking
  },
}, { 
  timestamps: true 
});

const Review = model<IReview>("Review", reviewSchema);
export default Review;