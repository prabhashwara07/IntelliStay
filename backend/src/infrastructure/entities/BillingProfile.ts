import { Schema, model, Document } from 'mongoose';

export interface IBillingProfile extends Document {
  userId: string; // Clerk user ID
  address: string;
  mobile: string; // Mobile number
  city: string;
  country: string;
  currency: 'LKR' | 'USD' | 'EUR'; // Supported currencies for PayHere
  isDefault: boolean;
  isActive: boolean;
}

const billingProfileSchema = new Schema<IBillingProfile>({
  userId: { 
    type: String, 
    required: true,
    unique: true, // One billing profile per user
    index: true // Index for efficient user queries
  },
  mobile: { 
    type: String, 
    required: true,
  },
  address: { 
    type: String, 
    required: true,
    trim: true
  },
  city: { 
    type: String, 
    required: true,
    trim: true
  },
  country: { 
    type: String, 
    required: true,
    trim: true,
    default: 'Sri Lanka'
  },
  currency: {
    type: String,
    required: true,
    enum: ['LKR', 'USD', 'EUR'],
    default: 'LKR'
  },
  isDefault: { 
    type: Boolean, 
    default: true 
  },
  isActive: { 
    type: Boolean, 
    default: true 
  }
}, { 
  timestamps: true 
});

// Virtual for formatted address (for display purposes)
billingProfileSchema.virtual('formattedAddress').get(function() {
  return `${this.address}, ${this.city}, ${this.country}`;
});

// Virtual for currency symbol
billingProfileSchema.virtual('currencySymbol').get(function() {
  const symbols: { [key: string]: string } = {
    'LKR': 'Rs',
    'USD': '$',
    'EUR': '€'
  };
  return symbols[this.currency] || this.currency;
});

// Ensure virtuals are included in JSON output
billingProfileSchema.set('toJSON', { virtuals: true });
billingProfileSchema.set('toObject', { virtuals: true });

const BillingProfile = model<IBillingProfile>("BillingProfile", billingProfileSchema);
export default BillingProfile;