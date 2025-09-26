// Sample data structure for hotel amenities
// This shows how the backend should structure amenity data using predefined keys

export const SAMPLE_HOTEL_DATA = {
  _id: "hotel_123",
  name: "Grand Plaza Hotel",
  description: "Luxury hotel in the heart of the city with stunning views and world-class amenities.",
  imageUrl: "https://example.com/hotel-image.jpg",
  priceFrom: 15000,
  rating: 4.5,
  location: "Colombo, Sri Lanka",
  
  // Amenities should use predefined keys from the amenities utility
  amenities: [
    "wifi",
    "parking",
    "pool",
    "gym", 
    "restaurant",
    "spa",
    "air_conditioning",
    "24_hour_front_desk",
    "concierge",
    "laundry",
    "pet_friendly",
    "business_center"
  ],
  
  // Additional hotel data...
  address: "123 Main Street, Colombo 01",
  phone: "+94 11 234 5678",
  email: "info@grandplaza.lk"
};

// Example of amenities categorized by type
export const AMENITIES_BY_CATEGORY_EXAMPLE = {
  connectivity: ["wifi", "tv"],
  transportation: ["parking", "airport_shuttle"],
  dining: ["restaurant", "breakfast", "room_service"],
  recreation: ["pool", "gym", "spa"],
  room: ["air_conditioning", "heating", "bathtub", "balcony"],
  service: ["concierge", "24_hour_front_desk", "laundry", "business_center"],
  policy: ["pet_friendly", "smoking_allowed", "non_smoking", "family_friendly"],
  security: ["security"]
};

// Backend API Response Example
export const API_RESPONSE_EXAMPLE = {
  success: true,
  data: {
    hotels: [
      {
        _id: "hotel_001",
        name: "Ocean View Resort",
        description: "Beautiful beachfront resort with amazing ocean views.",
        imageUrl: "https://example.com/ocean-resort.jpg",
        priceFrom: 25000,
        rating: 4.8,
        amenities: [
          "wifi",
          "parking", 
          "pool",
          "restaurant",
          "spa",
          "beach_access", // This would be ignored if not in predefined list
          "air_conditioning",
          "24_hour_front_desk"
        ]
      },
      {
        _id: "hotel_002", 
        name: "City Business Hotel",
        description: "Modern hotel perfect for business travelers.",
        imageUrl: "https://example.com/business-hotel.jpg",
        priceFrom: 12000,
        rating: 4.2,
        amenities: [
          "wifi",
          "parking",
          "gym",
          "restaurant", 
          "business_center",
          "air_conditioning",
          "24_hour_front_desk",
          "laundry",
          "concierge"
        ]
      }
    ]
  }
};

// Instructions for Backend Developers
export const BACKEND_INTEGRATION_NOTES = `
AMENITIES INTEGRATION GUIDE FOR BACKEND DEVELOPERS:

1. Use only predefined amenity keys from the frontend amenities utility
2. Valid amenity keys include:
   - wifi, tv (connectivity)
   - parking, airport_shuttle (transportation)  
   - restaurant, breakfast, room_service (dining)
   - pool, gym, spa (recreation)
   - air_conditioning, heating, bathtub, balcony (room features)
   - concierge, 24_hour_front_desk, laundry, business_center (services)
   - pet_friendly, smoking_allowed, non_smoking, family_friendly (policies)
   - security (security)

3. Database Schema:
   - amenities: Array of Strings (using predefined keys only)
   - Each string should match exactly with the keys defined in amenities.jsx

4. Validation:
   - Backend should validate amenity keys against the predefined list
   - Invalid keys should be filtered out or rejected
   - Consider creating an enum/constant list in your backend that matches frontend

5. API Response:
   - Return amenities as an array of strings
   - Frontend will handle icon mapping and display logic
   - No need to send icon data or labels from backend

Example MongoDB Schema:
{
  name: String,
  description: String, 
  amenities: [{
    type: String,
    enum: ['wifi', 'parking', 'pool', 'gym', 'restaurant', 'spa', ...] // full list
  }],
  ...
}
`;