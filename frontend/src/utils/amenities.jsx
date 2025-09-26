import React from 'react';
import { 
  Wifi, 
  Car, 
  Utensils, 
  Waves, 
  Dumbbell, 
  Coffee, 
  Wind, 
  Tv, 
  Shield, 
  Users, 
  Bath, 
  PawPrint, 
  Cigarette, 
  CigaretteOff, 
  Plane, 
  MapPin, 
  Clock, 
  Phone, 
  Shirt,
  UtensilsCrossed,
  BedDouble,
  Car as ParkingIcon,
  Sparkles,
  Briefcase,
  Baby,
  Mountain,
  TreePine,
  Sun,
  Snowflake
} from 'lucide-react';

// Predefined amenities list with their corresponding icons and display names
export const PREDEFINED_AMENITIES = {
  // Connectivity & Technology
  'wifi': {
    icon: Wifi,
    label: 'Free WiFi',
    category: 'connectivity'
  },
  'tv': {
    icon: Tv,
    label: 'TV',
    category: 'connectivity'
  },
  
  // Transportation & Parking
  'parking': {
    icon: Car,
    label: 'Free Parking',
    category: 'transportation'
  },
  'airport_shuttle': {
    icon: Plane,
    label: 'Airport Shuttle',
    category: 'transportation'
  },
  
  // Dining & Food
  'restaurant': {
    icon: Utensils,
    label: 'Restaurant',
    category: 'dining'
  },
  'breakfast': {
    icon: Coffee,
    label: 'Breakfast',
    category: 'dining'
  },
  'room_service': {
    icon: UtensilsCrossed,
    label: 'Room Service',
    category: 'dining'
  },
  
  // Recreation & Wellness
  'pool': {
    icon: Waves,
    label: 'Swimming Pool',
    category: 'recreation'
  },
  'gym': {
    icon: Dumbbell,
    label: 'Fitness Center',
    category: 'recreation'
  },
  'spa': {
    icon: Sparkles,
    label: 'Spa',
    category: 'recreation'
  },
  
  // Room Features
  'air_conditioning': {
    icon: Wind,
    label: 'Air Conditioning',
    category: 'room'
  },
  'heating': {
    icon: Sun,
    label: 'Heating',
    category: 'room'
  },
  'bathtub': {
    icon: Bath,
    label: 'Bathtub',
    category: 'room'
  },
  'balcony': {
    icon: Mountain,
    label: 'Balcony',
    category: 'room'
  },
  
  // Services
  'concierge': {
    icon: Users,
    label: 'Concierge',
    category: 'service'
  },
  '24_hour_front_desk': {
    icon: Clock,
    label: '24/7 Front Desk',
    category: 'service'
  },
  'laundry': {
    icon: Shirt,
    label: 'Laundry Service',
    category: 'service'
  },
  'business_center': {
    icon: Briefcase,
    label: 'Business Center',
    category: 'service'
  },
  
  // Policies & Accessibility
  'pet_friendly': {
    icon: PawPrint,
    label: 'Pet Friendly',
    category: 'policy'
  },
  'smoking_allowed': {
    icon: Cigarette,
    label: 'Smoking Allowed',
    category: 'policy'
  },
  'non_smoking': {
    icon: CigaretteOff,
    label: 'Non-Smoking',
    category: 'policy'
  },
  'family_friendly': {
    icon: Baby,
    label: 'Family Friendly',
    category: 'policy'
  },
  
  // Security
  'security': {
    icon: Shield,
    label: 'Security',
    category: 'security'
  }
};

// Component to render amenity icons
export function AmenityIcon({ amenityKey, className = "h-4 w-4", showLabel = false, iconOnly = true }) {
  const amenity = PREDEFINED_AMENITIES[amenityKey];
  
  if (!amenity) {
    return null;
  }
  
  const IconComponent = amenity.icon;
  
  if (iconOnly) {
    return (
      <div className="flex items-center gap-1" title={amenity.label}>
        <IconComponent className={className} />
        {showLabel && <span className="text-xs">{amenity.label}</span>}
      </div>
    );
  }
  
  return (
    <div className="flex items-center gap-2">
      <IconComponent className={className} />
      <span className="text-sm">{amenity.label}</span>
    </div>
  );
}

// Utility function to get amenity icons for a list of amenities
export function getAmenityIcons(amenitiesList, maxIcons = 6) {
  if (!Array.isArray(amenitiesList)) {
    return [];
  }
  
  return amenitiesList
    .filter(amenity => PREDEFINED_AMENITIES[amenity])
    .slice(0, maxIcons)
    .map(amenity => ({
      key: amenity,
      ...PREDEFINED_AMENITIES[amenity]
    }));
}

// Utility function to check if an amenity exists
export function isValidAmenity(amenityKey) {
  return !!PREDEFINED_AMENITIES[amenityKey];
}

// Get all amenities by category
export function getAmenitiesByCategory(category) {
  return Object.entries(PREDEFINED_AMENITIES)
    .filter(([key, amenity]) => amenity.category === category)
    .reduce((acc, [key, amenity]) => {
      acc[key] = amenity;
      return acc;
    }, {});
}

// Get available categories
export function getAmenityCategories() {
  const categories = [...new Set(Object.values(PREDEFINED_AMENITIES).map(a => a.category))];
  return categories.sort();
}