import { Schema, model, Document, Types } from 'mongoose';

export interface IReview extends Document {
  rating: number;
  comment: string;
  userId: string;
  hotelId: Types.ObjectId;
}

const reviewSchema = new Schema<IReview>({
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  userId: { type: String, required: true },
  hotelId: {
    type: Schema.Types.ObjectId,
    ref: "Hotel",
    required: true,
  },
}, { 
  timestamps: true 
});

const Review = model<IReview>("Review", reviewSchema);
export default Review;