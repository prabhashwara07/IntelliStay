import { Schema, model, Document } from 'mongoose';

// Interface to define the properties of a Location document
export interface ILocation extends Document {
  city: string;
  country: string;
}

const locationSchema = new Schema<ILocation>({
  city: { 
    type: String, 
    required: true 
  },
  country: { 
    type: String, 
    required: true 
  }
});

const Location = model<ILocation>("Location", locationSchema);
export default Location;