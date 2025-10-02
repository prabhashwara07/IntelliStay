import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Hotel from './entities/Hotel';
import Location from './entities/Location';
import Review from './entities/Review';
import Booking from './entities/Booking';
import BillingProfile from './entities/BillingProfile';
import { generateEmbedding } from '../application/utils/embeddings';

// Load environment variables
dotenv.config();

const seedData = {
  locations: [
    {
      city: "Mumbai",
      country: "India",
      coordinates: {
        type: 'Point',
        coordinates: [72.8777, 19.0760]
      }
    },
    {
      city: "New Delhi",
      country: "India", 
      coordinates: {
        type: 'Point',
        coordinates: [77.2090, 28.6139]
      }
    },
    {
      city: "Bangalore",
      country: "India",
      coordinates: {
        type: 'Point',
        coordinates: [77.5946, 12.9716]
      }
    },
    {
      city: "Chennai",
      country: "India",
      coordinates: {
        type: 'Point',
        coordinates: [80.2707, 13.0827]
      }
    },
    {
      city: "Kolkata",
      country: "India",
      coordinates: {
        type: 'Point',
        coordinates: [88.3639, 22.5726]
      }
    }
  ],

  hotels: [
    {
      name: "The Grand Taj Hotel",
      description: "Luxury hotel with stunning ocean views and world-class amenities. Experience the finest in hospitality with our premium suites and exceptional service.",
      imageUrls: [
        "https://images.unsplash.com/photo-1566073771259-6a8506099945",
        "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9",
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b"
      ],
      amenities: ["wifi", "pool", "spa", "restaurant", "room_service", "gym", "business_center"],
      rooms: [
        { roomNumber: "101", roomType: "Single", pricePerNight: 8500, maxGuests: 1, isAvailable: true },
        { roomNumber: "102", roomType: "Double", pricePerNight: 9500, maxGuests: 2, isAvailable: true },
        { roomNumber: "201", roomType: "Suite", pricePerNight: 15000, maxGuests: 3, isAvailable: true }
      ],
      priceStartingFrom: 8500,
      starRating: 5,
      averageRating: 4.8
    },
    {
      name: "Imperial Palace Delhi",
      description: "Historic luxury hotel in the heart of Delhi. Perfect blend of traditional architecture and modern comfort.",
      imageUrls: [
        "https://images.unsplash.com/photo-1564501049412-61c2a3083791",
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d"
      ],
      amenities: ["wifi", "restaurant", "concierge", "parking", "business_center"],
      rooms: [
        { roomNumber: "301", roomType: "Single", pricePerNight: 7200, maxGuests: 1, isAvailable: true },
        { roomNumber: "302", roomType: "Double", pricePerNight: 8200, maxGuests: 2, isAvailable: true }
      ],
      priceStartingFrom: 7200,
      starRating: 4,
      averageRating: 4.5
    },
    {
      name: "Tech City Suites",
      description: "Modern business hotel perfect for tech professionals. Located in the heart of India's Silicon Valley.",
      imageUrls: [
        "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa",
        "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6"
      ],
      amenities: ["wifi", "business_center", "gym", "restaurant", "breakfast"],
      rooms: [
        { roomNumber: "401", roomType: "Single", pricePerNight: 5500, maxGuests: 1, isAvailable: true },
        { roomNumber: "402", roomType: "Double", pricePerNight: 6500, maxGuests: 2, isAvailable: true }
      ],
      priceStartingFrom: 5500,
      starRating: 4,
      averageRating: 4.2
    },
    {
      name: "Marina Grand Resort",
      description: "Beachfront resort with panoramic views of the Bay of Bengal. Perfect for leisure and business travelers.",
      imageUrls: [
        "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4",
        "https://images.unsplash.com/photo-1578662996442-48f60103fc96"
      ],
      amenities: ["wifi", "pool", "restaurant", "spa", "balcony"],
      rooms: [
        { roomNumber: "501", roomType: "Double", pricePerNight: 6800, maxGuests: 2, isAvailable: true },
        { roomNumber: "601", roomType: "Suite", pricePerNight: 12000, maxGuests: 3, isAvailable: true }
      ],
      priceStartingFrom: 6800,
      starRating: 4,
      averageRating: 4.6
    },
    {
      name: "Heritage Kolkata Hotel",
      description: "Colonial-era charm meets modern luxury in the cultural capital of India. Rich history and elegant accommodations.",
      imageUrls: [
        "https://images.unsplash.com/photo-1590490360182-c33d57733427",
        "https://images.unsplash.com/photo-1584132967334-10e028bd69f7"
      ],
      amenities: ["wifi", "restaurant", "concierge", "business_center"],
      rooms: [
        { roomNumber: "701", roomType: "Single", pricePerNight: 4800, maxGuests: 1, isAvailable: true },
        { roomNumber: "702", roomType: "Double", pricePerNight: 5800, maxGuests: 2, isAvailable: true }
      ],
      priceStartingFrom: 4800,
      starRating: 3,
      averageRating: 4.1
    },
    {
      name: "Budget Inn Mumbai",
      description: "Comfortable and affordable accommodation with essential amenities for budget-conscious travelers.",
      imageUrls: ["https://images.unsplash.com/photo-1561501900-3701fa6a0864"],
      amenities: ["wifi", "air_conditioning", "restaurant", "24_hour_front_desk"],
      rooms: [
        { roomNumber: "801", roomType: "Single", pricePerNight: 2200, maxGuests: 1, isAvailable: true }
      ],
      priceStartingFrom: 2200,
      starRating: 2,
      averageRating: 3.5
    },
    {
      name: "Business Center Delhi",
      description: "Strategic location for business travelers with easy access to metro and commercial areas.",
      imageUrls: ["https://images.unsplash.com/photo-1571896349842-33c89424de2d"],
      amenities: ["wifi", "business_center", "restaurant", "gym"],
      rooms: [
        { roomNumber: "901", roomType: "Double", pricePerNight: 3800, maxGuests: 2, isAvailable: true }
      ],
      priceStartingFrom: 3800,
      starRating: 3,
      averageRating: 3.8
    },
    {
      name: "Garden View Bangalore",
      description: "Peaceful hotel surrounded by lush gardens, perfect for relaxation after busy work days.",
      imageUrls: ["https://images.unsplash.com/photo-1596394516093-501ba68a0ba6"],
      amenities: ["wifi", "pool", "restaurant", "gym", "balcony"],
      rooms: [
        { roomNumber: "1001", roomType: "Single", pricePerNight: 4200, maxGuests: 1, isAvailable: true },
        { roomNumber: "1002", roomType: "Double", pricePerNight: 5200, maxGuests: 2, isAvailable: true }
      ],
      priceStartingFrom: 4200,
      starRating: 3,
      averageRating: 4.0
    }
  ],

  reviews: [
    {
      rating: 5,
      comment: "Absolutely fantastic stay! The service was impeccable and the room was luxurious. The ocean view was breathtaking. Will definitely come back!",
      userId: "user_demo_1"
    },
    {
      rating: 4,
      comment: "Great location and comfortable rooms. The staff was helpful and the amenities were top-notch. Highly recommended for business travelers.",
      userId: "user_demo_2"
    },
    {
      rating: 5,
      comment: "Perfect for our vacation! The beach access was amazing and the spa treatments were so relaxing. Excellent value for money.",
      userId: "user_demo_3"
    },
    {
      rating: 4,
      comment: "Clean, comfortable, and well-located. The heritage charm of this hotel is truly special. Great breakfast and friendly staff.",
      userId: "user_demo_4"
    },
    {
      rating: 3,
      comment: "Good basic accommodation for the price. Room was clean and staff was courteous. Perfect for budget travelers.",
      userId: "user_demo_5"
    },
    {
      rating: 4,
      comment: "Convenient location for business meetings. The conference facilities were excellent and the internet was fast.",
      userId: "user_demo_6"
    }
  ],

  bookings: [
    {
      userId: "user_31hF9t4hS5yL5SE3kHLzY9Z3Nb4", // Your actual user ID
      checkIn: new Date("2024-09-15"),
      checkOut: new Date("2024-09-18"), 
      numberOfGuests: 2,
      totalPrice: 25500,
      paymentStatus: "PAID"
    },
    {
      userId: "user_31hF9t4hS5yL5SE3kHLzY9Z3Nb4", // Your actual user ID
      checkIn: new Date("2024-10-01"),
      checkOut: new Date("2024-10-03"),
      numberOfGuests: 1,
      totalPrice: 14400,
      paymentStatus: "PAID"
    },
    {
      userId: "user_demo_3", 
      checkIn: new Date("2024-11-10"),
      checkOut: new Date("2024-11-15"),
      numberOfGuests: 3,
      totalPrice: 34000,
      paymentStatus: "PENDING"
    }
  ],

  billingProfiles: [
    {
      userId: "user_demo_1",
      address: "123 Main Street, Colpetty",
      city: "Colombo",
      country: "Sri Lanka",
      currency: "LKR",
      isDefault: true,
      isActive: true
    },
    {
      userId: "user_demo_2", 
      address: "456 Business Avenue, Fort",
      city: "Colombo", 
      country: "Sri Lanka",
      currency: "LKR",
      isDefault: true,
      isActive: true
    },
    {
      userId: "user_demo_3",
      address: "789 Tech Park, Rajagiriya",
      city: "Colombo",
      country: "Sri Lanka", 
      currency: "USD", // User prefers USD
      isDefault: true,
      isActive: true
    }
  ]
};

export const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Connect to MongoDB
    const MONGODB_URL = process.env.MONGODB_URL;
    if (!MONGODB_URL) {
      throw new Error('MONGODB_URL is not defined');
    }

    await mongoose.connect(MONGODB_URL);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      Hotel.deleteMany({}),
      Location.deleteMany({}),
      Review.deleteMany({}),
      Booking.deleteMany({}),
      BillingProfile.deleteMany({})
    ]);
    console.log('🗑️  Cleared existing data');

    // Seed locations
    console.log('📍 Seeding locations...');
    const createdLocations = await Location.insertMany(seedData.locations);
    console.log(`✅ Created ${createdLocations.length} locations`);

    // Seed hotels with location references and embeddings
    console.log('🏨 Seeding hotels with embeddings...');
    const hotelsWithLocationsAndEmbeddings = [];
    
    for (let i = 0; i < seedData.hotels.length; i++) {
      const hotel = seedData.hotels[i];
      const location = createdLocations[i % createdLocations.length];
      
      console.log(`🤖 Generating embedding for ${hotel.name}...`);
      
      try {
        // Create embedding text from hotel data
        const embeddingText = `${hotel.name} ${hotel.description} ${hotel.amenities.join(' ')} ${location.city} ${location.country}`;
        const embedding = await generateEmbedding(embeddingText);
        
        hotelsWithLocationsAndEmbeddings.push({
          ...hotel,
          location: location._id,
          embedding: embedding
        });
        
        console.log(`✅ Generated embedding for ${hotel.name}`);
      } catch (error) {
        console.warn(`⚠️  Failed to generate embedding for ${hotel.name}:`, error instanceof Error ? error.message : 'Unknown error');
        // Add hotel without embedding as fallback
        hotelsWithLocationsAndEmbeddings.push({
          ...hotel,
          location: location._id
        });
      }
    }
    
    const createdHotels = await Hotel.insertMany(hotelsWithLocationsAndEmbeddings);
    console.log(`✅ Created ${createdHotels.length} hotels with embeddings`);

    // Seed reviews with hotel references
    console.log('⭐ Seeding reviews...');
    const reviewsWithHotels = seedData.reviews.map((review, index) => ({
      ...review,
      hotelId: createdHotels[index % createdHotels.length]._id
    }));
    const createdReviews = await Review.insertMany(reviewsWithHotels);
    console.log(`✅ Created ${createdReviews.length} reviews`);

    // Update hotels with review references
    console.log('🔗 Linking reviews to hotels...');
    for (let i = 0; i < createdReviews.length; i++) {
      const review = createdReviews[i];
      const hotel = createdHotels[i % createdHotels.length];
      await Hotel.findByIdAndUpdate(hotel._id, {
        $push: { reviews: review._id }
      });
    }

    // Seed bookings with hotel references
    console.log('📅 Seeding bookings...');
    const bookingsWithHotels = seedData.bookings.map((booking, index) => {
      const hotel = createdHotels[index % createdHotels.length];
      const roomId = (hotel.rooms && hotel.rooms.length > 0) ? (hotel as any).rooms[0]._id : undefined;
      return {
        ...booking,
        hotelId: hotel._id,
        roomId
      };
    });
    const createdBookings = await Booking.insertMany(bookingsWithHotels);
    console.log(`✅ Created ${createdBookings.length} bookings`);

    console.log('🎉 Database seeding completed successfully!');
    console.log(`
📊 Summary:
   - ${createdLocations.length} Locations
   - ${createdHotels.length} Hotels  
   - ${createdReviews.length} Reviews
   - ${createdBookings.length} Bookings
    `);

  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  } finally {
    await mongoose.disconnect();
    console.log('🔐 Database connection closed');
  }
};

// Run seed if called directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('✨ Seeding process completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Seeding process failed:', error);
      process.exit(1);
    });
}

export default seedDatabase;
