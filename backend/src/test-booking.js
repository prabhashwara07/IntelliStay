const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

// Connect to MongoDB
async function createTestBooking() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('Connected to MongoDB');

    // Get existing hotel and create booking for your user
    const Hotel = require('./src/infrastructure/entities/Hotel').default;
    const Booking = require('./src/infrastructure/entities/Booking').default;

    const hotels = await Hotel.find().limit(2);
    console.log('Found hotels:', hotels.map(h => ({ id: h._id, name: h.name })));

    if (hotels.length > 0) {
      const bookings = [
        {
          userId: "user_31hF9t4hS5yL5SE3kHLzY9Z3Nb4",
          hotelId: hotels[0]._id,
          roomId: hotels[0].rooms[0]._id,
          checkIn: new Date("2024-09-15"),
          checkOut: new Date("2024-09-18"),
          numberOfGuests: 2,
          totalPrice: 25500,
          paymentStatus: "PAID"
        },
        {
          userId: "user_31hF9t4hS5yL5SE3kHLzY9Z3Nb4",
          hotelId: hotels[1]._id,
          roomId: hotels[1].rooms[0]._id,
          checkIn: new Date("2024-10-01"),
          checkOut: new Date("2024-10-03"),
          numberOfGuests: 1,
          totalPrice: 14400,
          paymentStatus: "PAID"
        }
      ];

      // Delete existing bookings for this user
      await Booking.deleteMany({ userId: "user_31hF9t4hS5yL5SE3kHLzY9Z3Nb4" });
      
      // Create new bookings
      const created = await Booking.insertMany(bookings);
      console.log('Created bookings:', created.length);
      
      // Test populate
      const testBooking = await Booking.findOne({ userId: "user_31hF9t4hS5yL5SE3kHLzY9Z3Nb4" })
        .populate({
          path: 'hotelId',
          select: 'name imageUrls location address',
          populate: {
            path: 'location',
            select: 'city country'
          }
        })
        .lean();
      
      console.log('Test booking with populated data:');
      console.log(JSON.stringify(testBooking, null, 2));
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

createTestBooking();