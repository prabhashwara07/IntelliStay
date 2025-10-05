import { Schema, model, Document } from 'mongoose';

// Interface for the Amenity document
export interface IAmenity extends Document {
  key: string;
  label: string;
  category: string;
  icon?: string;
}

const amenitySchema = new Schema<IAmenity>({
  key: {
    type: String,
    required: true,
    unique: true
  },
  label: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: false
  }
}, {
  timestamps: true
});

export const Amenity = model<IAmenity>('Amenity', amenitySchema);