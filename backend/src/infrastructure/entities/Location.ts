import { Schema, model, Document } from 'mongoose';

// Interface to define the properties of a Location document
export interface ILocation extends Document {
  city: string;
  country: string;
  coordinates?: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
}

const locationSchema = new Schema<ILocation>({
  city: { 
    type: String, 
    required: true 
  },
  country: { 
    type: String, 
    required: true 
  },
  coordinates: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      default: [0, 0]
    }
  }
});

locationSchema.index({ coordinates: '2dsphere' });

const Location = model<ILocation>("Location", locationSchema);
export default Location;