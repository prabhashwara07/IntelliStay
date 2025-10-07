import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './database';
import Location from './entities/Location';
import Hotel from './entities/Hotel';
import { Amenity } from './entities/Amenity';
import Review from './entities/Review';
import { generateEmbedding } from '../application/utils/embeddings';

// Load environment variables
dotenv.config();

// Amenities data from frontend utils
const AMENITIES_DATA = [
  // Connectivity & Technology
  { key: 'wifi', label: 'Free WiFi', category: 'connectivity' },
  { key: 'tv', label: 'TV', category: 'connectivity' },
  
  // Transportation & Parking
  { key: 'parking', label: 'Free Parking', category: 'transportation' },
  { key: 'airport_shuttle', label: 'Airport Shuttle', category: 'transportation' },
  
  // Dining & Food
  { key: 'restaurant', label: 'Restaurant', category: 'dining' },
  { key: 'breakfast', label: 'Breakfast', category: 'dining' },
  { key: 'room_service', label: 'Room Service', category: 'dining' },
  
  // Recreation & Wellness
  { key: 'pool', label: 'Swimming Pool', category: 'recreation' },
  { key: 'gym', label: 'Fitness Center', category: 'recreation' },
  { key: 'spa', label: 'Spa', category: 'recreation' },
  
  // Room Features
  { key: 'air_conditioning', label: 'Air Conditioning', category: 'room' },
  { key: 'heating', label: 'Heating', category: 'room' },
  { key: 'bathtub', label: 'Bathtub', category: 'room' },
  { key: 'balcony', label: 'Balcony', category: 'room' },
  
  // Services
  { key: 'concierge', label: 'Concierge', category: 'service' },
  { key: '24_hour_front_desk', label: '24/7 Front Desk', category: 'service' },
  { key: 'laundry', label: 'Laundry Service', category: 'service' },
  { key: 'business_center', label: 'Business Center', category: 'service' },
  
  // Policies & Accessibility
  { key: 'pet_friendly', label: 'Pet Friendly', category: 'policy' },
  { key: 'smoking_allowed', label: 'Smoking Allowed', category: 'policy' },
  { key: 'non_smoking', label: 'Non-Smoking', category: 'policy' },
  { key: 'family_friendly', label: 'Family Friendly', category: 'policy' },
  
  // Security
  { key: 'security', label: 'Security', category: 'security' }
];

// Location data for 5 different countries
const LOCATIONS_DATA = [
  { city: 'New York', country: 'United States' },
  { city: 'Los Angeles', country: 'United States' },
  { city: 'London', country: 'United Kingdom' },
  { city: 'Edinburgh', country: 'United Kingdom' },
  { city: 'Tokyo', country: 'Japan' },
  { city: 'Kyoto', country: 'Japan' },
  { city: 'Paris', country: 'France' },
  { city: 'Nice', country: 'France' },
  { city: 'Sydney', country: 'Australia' },
  { city: 'Melbourne', country: 'Australia' }
];

// Comprehensive hotel data with rich descriptions
const HOTELS_DATA = [
  // United States - New York
  {
    name: "The Manhattan Grand",
    description: "Experience the pinnacle of luxury at The Manhattan Grand, a sophisticated urban retreat in the heart of Times Square. Our contemporary design seamlessly blends modern elegance with classic New York charm. Each of our meticulously appointed rooms features floor-to-ceiling windows offering breathtaking city views, premium Egyptian cotton linens, and state-of-the-art technology. The hotel's prime location places you steps away from Broadway theaters, world-class shopping on Fifth Avenue, and iconic landmarks like Central Park. Our award-winning restaurant serves contemporary American cuisine with a focus on locally-sourced ingredients, while our rooftop bar provides an unparalleled setting for evening cocktails with panoramic views of the Manhattan skyline.",
    locationCity: 'New York',
    locationCountry: 'United States',
    imageUrls: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d',
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461'
    ],
    amenities: ['wifi', 'air_conditioning', 'gym', 'restaurant', 'concierge', '24_hour_front_desk', 'laundry', 'business_center', 'room_service', 'valet_parking'],
    rooms: [
      { roomNumber: '101', roomType: 'Single', pricePerNight: 299, maxGuests: 1, isAvailable: true },
      { roomNumber: '102', roomType: 'Double', pricePerNight: 399, maxGuests: 2, isAvailable: true },
      { roomNumber: '201', roomType: 'Suite', pricePerNight: 699, maxGuests: 4, isAvailable: true },
      { roomNumber: '202', roomType: 'Suite', pricePerNight: 699, maxGuests: 4, isAvailable: true }
    ],
    starRating: 5,
    averageRating: 4.7,
    status: 'approved'
  },
  {
    name: "Brooklyn Heights Boutique",
    description: "Discover the charm of Brooklyn at this intimate boutique hotel nestled in the historic Brooklyn Heights neighborhood. Our carefully curated property features uniquely designed rooms that celebrate local artisans and the rich cultural heritage of the area. Each accommodation showcases exposed brick walls, hardwood floors, and custom-made furniture crafted by Brooklyn artists. Guests enjoy complimentary access to our artisanal coffee bar featuring locally roasted beans, and our concierge team provides insider recommendations for exploring the vibrant food scene, independent galleries, and the famous Brooklyn Bridge Promenade. The hotel's eco-friendly practices include solar panels, locally-sourced organic amenities, and a partnership with community gardens.",
    locationCity: 'New York',
    locationCountry: 'United States',
    imageUrls: [
      'https://images.unsplash.com/photo-1522798514-97ceb8c4f1c8',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7',
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461'
    ],
    amenities: ['wifi', 'air_conditioning', 'breakfast', 'pet_friendly', 'non_smoking', 'concierge', 'laundry'],
    rooms: [
      { roomNumber: '101', roomType: 'Single', pricePerNight: 189, maxGuests: 1, isAvailable: true },
      { roomNumber: '102', roomType: 'Double', pricePerNight: 249, maxGuests: 2, isAvailable: true },
      { roomNumber: '201', roomType: 'Double', pricePerNight: 249, maxGuests: 2, isAvailable: true }
    ],
    starRating: 4,
    averageRating: 4.5,
    status: 'approved'
  },

  // United States - Los Angeles
  {
    name: "Sunset Boulevard Luxury Resort",
    description: "Immerse yourself in the glamour of Hollywood at Sunset Boulevard Luxury Resort, where classic elegance meets contemporary luxury. This iconic property has been a beacon of sophistication since the golden age of cinema, hosting legendary stars and continuing to attract discerning travelers from around the world. Our spacious suites feature marble bathrooms, private terraces with city or mountain views, and museum-quality art collections. The resort's world-class spa offers innovative treatments inspired by ancient wellness traditions, while our three restaurants showcase California's diverse culinary landscape from farm-to-table organic cuisine to molecular gastronomy. The rooftop infinity pool provides a serene oasis with stunning views of the Hollywood Hills and downtown skyline.",
    locationCity: 'Los Angeles',
    locationCountry: 'United States',
    imageUrls: [
      'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96',
      'https://images.unsplash.com/photo-1584132967334-10e028bd69f7'
    ],
    amenities: ['wifi', 'pool', 'spa', 'gym', 'restaurant', 'room_service', 'concierge', 'valet_parking', 'business_center', '24_hour_front_desk'],
    rooms: [
      { roomNumber: '101', roomType: 'Double', pricePerNight: 449, maxGuests: 2, isAvailable: true },
      { roomNumber: '102', roomType: 'Suite', pricePerNight: 799, maxGuests: 4, isAvailable: true },
      { roomNumber: '201', roomType: 'Suite', pricePerNight: 899, maxGuests: 4, isAvailable: true },
      { roomNumber: '301', roomType: 'Suite', pricePerNight: 1299, maxGuests: 6, isAvailable: true }
    ],
    starRating: 5,
    averageRating: 4.8,
    status: 'approved'
  },
  {
    name: "Santa Monica Beach House",
    description: "Experience coastal California living at its finest at Santa Monica Beach House, a charming beachfront property that captures the laid-back sophistication of the Pacific Coast. Our thoughtfully designed rooms feature natural materials, ocean-inspired color palettes, and floor-to-ceiling windows that frame spectacular sunset views over the Pacific Ocean. Guests can enjoy direct beach access, complimentary beach equipment, and guided sunrise yoga sessions on the sand. The hotel's sustainable practices include solar energy, ocean-friendly toiletries, and partnerships with local marine conservation organizations. Our beachside restaurant specializes in fresh seafood and organic produce from nearby farmers' markets, while the outdoor fire pits provide perfect gathering spots for evening conversations under the stars.",
    locationCity: 'Los Angeles',
    locationCountry: 'United States',
    imageUrls: [
      'https://images.unsplash.com/photo-1502780402662-acc01917851e',
      'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96'
    ],
    amenities: ['wifi', 'pool', 'restaurant', 'beach_access', 'family_friendly', 'pet_friendly', 'non_smoking', 'parking'],
    rooms: [
      { roomNumber: '101', roomType: 'Single', pricePerNight: 229, maxGuests: 1, isAvailable: true },
      { roomNumber: '102', roomType: 'Double', pricePerNight: 329, maxGuests: 2, isAvailable: true },
      { roomNumber: '201', roomType: 'Double', pricePerNight: 349, maxGuests: 2, isAvailable: true }
    ],
    starRating: 4,
    averageRating: 4.6,
    status: 'approved'
  },

  // United Kingdom - London
  {
    name: "Mayfair Heritage Hotel",
    description: "Step into centuries of British elegance at Mayfair Heritage Hotel, a distinguished Georgian townhouse that has been meticulously restored to offer modern luxury while preserving its historic charm. Located in one of London's most prestigious districts, our hotel features original period details including crystal chandeliers, ornate moldings, and antique furnishings alongside contemporary amenities. Each room tells a story of British history through carefully curated artwork and artifacts, while modern touches ensure comfort and convenience. Our traditional afternoon tea service in the oak-paneled library has become legendary among both guests and locals. The hotel's prime Mayfair location provides easy access to Bond Street shopping, Hyde Park's tranquil gardens, and the vibrant theater district of the West End.",
    locationCity: 'London',
    locationCountry: 'United Kingdom',
    imageUrls: [
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96',
      'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9'
    ],
    amenities: ['wifi', 'heating', 'restaurant', 'concierge', '24_hour_front_desk', 'laundry', 'business_center', 'room_service', 'non_smoking'],
    rooms: [
      { roomNumber: '101', roomType: 'Single', pricePerNight: 349, maxGuests: 1, isAvailable: true },
      { roomNumber: '102', roomType: 'Double', pricePerNight: 449, maxGuests: 2, isAvailable: true },
      { roomNumber: '201', roomType: 'Suite', pricePerNight: 699, maxGuests: 4, isAvailable: true },
      { roomNumber: '301', roomType: 'Suite', pricePerNight: 899, maxGuests: 4, isAvailable: true }
    ],
    starRating: 5,
    averageRating: 4.8,
    status: 'approved'
  },
  {
    name: "Thames Riverside Inn",
    description: "Discover London from a unique riverside perspective at Thames Riverside Inn, a contemporary hotel that celebrates the city's maritime heritage while offering stunning views of the historic Thames. Our modern rooms feature floor-to-ceiling windows overlooking the river, with many offering private balconies where guests can watch the gentle flow of London's lifeline. The hotel's design incorporates nautical elements with modern British style, creating an atmosphere that's both sophisticated and welcoming. Our riverside restaurant specializes in traditional British cuisine with a modern twist, sourcing ingredients from local markets and artisanal producers. The hotel's location provides easy access to iconic landmarks including the Tower of London, London Bridge, and the vibrant Borough Market, while our private dock offers unique arrival options for those traveling by river.",
    locationCity: 'London',
    locationCountry: 'United Kingdom',
    imageUrls: [
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945',
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461'
    ],
    amenities: ['wifi', 'heating', 'restaurant', 'balcony', 'family_friendly', 'pet_friendly', 'non_smoking', 'concierge'],
    rooms: [
      { roomNumber: '101', roomType: 'Double', pricePerNight: 279, maxGuests: 2, isAvailable: true },
      { roomNumber: '102', roomType: 'Double', pricePerNight: 299, maxGuests: 2, isAvailable: true },
      { roomNumber: '201', roomType: 'Suite', pricePerNight: 499, maxGuests: 4, isAvailable: true }
    ],
    starRating: 4,
    averageRating: 4.5,
    status: 'approved'
  },

  // United Kingdom - Edinburgh
  {
    name: "Edinburgh Castle View Manor",
    description: "Experience the magic of Scotland's capital at Edinburgh Castle View Manor, a luxurious hotel that offers unparalleled views of the iconic Edinburgh Castle and the historic Royal Mile. Housed in a beautifully restored Victorian building, our hotel seamlessly blends Scottish heritage with contemporary luxury. Each room features traditional tartan accents, locally-sourced artwork, and modern amenities, while many offer spectacular views of the castle illuminated against the evening sky. Our whisky lounge boasts one of Scotland's finest collections of single malts, with expert sommeliers offering guided tastings and pairing experiences. The hotel's location on the Royal Mile places guests at the heart of Edinburgh's Old Town, within walking distance of the Scottish Parliament, Holyrood Palace, and the vibrant festival venues that make Edinburgh a cultural capital.",
    locationCity: 'Edinburgh',
    locationCountry: 'United Kingdom',
    imageUrls: [
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d',
      'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9'
    ],
    amenities: ['wifi', 'heating', 'restaurant', 'bar', 'concierge', '24_hour_front_desk', 'laundry', 'non_smoking', 'business_center'],
    rooms: [
      { roomNumber: '101', roomType: 'Single', pricePerNight: 199, maxGuests: 1, isAvailable: true },
      { roomNumber: '102', roomType: 'Double', pricePerNight: 299, maxGuests: 2, isAvailable: true },
      { roomNumber: '201', roomType: 'Double', pricePerNight: 319, maxGuests: 2, isAvailable: true },
      { roomNumber: '301', roomType: 'Suite', pricePerNight: 499, maxGuests: 4, isAvailable: true }
    ],
    starRating: 4,
    averageRating: 4.7,
    status: 'approved'
  },

  // Japan - Tokyo
  {
    name: "Tokyo Zen Garden Hotel",
    description: "Immerse yourself in the perfect harmony of traditional Japanese aesthetics and modern luxury at Tokyo Zen Garden Hotel, a tranquil oasis in the heart of bustling Shibuya. Our hotel embodies the Japanese philosophy of 'omotenashi' (hospitality) through meticulous attention to detail and personalized service. Each room features tatami flooring, shoji screens, and minimalist design principles that create a sense of zen-like calm. Many rooms offer views of our authentic Japanese garden, complete with koi ponds, carefully manicured bonsai, and a traditional tea house where guests can participate in formal tea ceremonies. Our renowned restaurant serves both traditional kaiseki cuisine and innovative fusion dishes, while our onsen-style spa provides a authentic Japanese bathing experience. The hotel's location offers easy access to Shibuya Crossing, Meiji Shrine, and the fashionable Harajuku district.",
    locationCity: 'Tokyo',
    locationCountry: 'Japan',
    imageUrls: [
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d',
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945'
    ],
    amenities: ['wifi', 'spa', 'restaurant', 'concierge', '24_hour_front_desk', 'laundry', 'business_center', 'traditional_bath', 'garden'],
    rooms: [
      { roomNumber: '101', roomType: 'Single', pricePerNight: 299, maxGuests: 1, isAvailable: true },
      { roomNumber: '102', roomType: 'Double', pricePerNight: 399, maxGuests: 2, isAvailable: true },
      { roomNumber: '201', roomType: 'Double', pricePerNight: 419, maxGuests: 2, isAvailable: true },
      { roomNumber: '301', roomType: 'Suite', pricePerNight: 699, maxGuests: 4, isAvailable: true }
    ],
    starRating: 5,
    averageRating: 4.9,
    status: 'approved'
  },
  {
    name: "Ginza Modern Suites",
    description: "Experience the sophisticated elegance of Tokyo's most prestigious district at Ginza Modern Suites, where cutting-edge design meets unparalleled luxury. Our ultra-modern hotel features sleek architecture with floor-to-ceiling windows that showcase the dazzling neon landscape of Ginza's shopping and entertainment district. Each suite is a masterpiece of contemporary Japanese design, incorporating smart home technology, premium materials, and stunning city views. Our Michelin-starred restaurant offers innovative Japanese cuisine that reimagines traditional flavors through modern culinary techniques. The hotel's exclusive shopping concierge provides access to Ginza's luxury boutiques and department stores, while our rooftop bar offers panoramic views of Tokyo's skyline including glimpses of Mount Fuji on clear days.",
    locationCity: 'Tokyo',
    locationCountry: 'Japan',
    imageUrls: [
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96',
      'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9',
      'https://images.unsplash.com/photo-1584132967334-10e028bd69f7'
    ],
    amenities: ['wifi', 'air_conditioning', 'restaurant', 'bar', 'concierge', '24_hour_front_desk', 'business_center', 'room_service', 'valet_parking'],
    rooms: [
      { roomNumber: '101', roomType: 'Suite', pricePerNight: 599, maxGuests: 3, isAvailable: true },
      { roomNumber: '102', roomType: 'Suite', pricePerNight: 699, maxGuests: 4, isAvailable: true },
      { roomNumber: '201', roomType: 'Suite', pricePerNight: 799, maxGuests: 4, isAvailable: true }
    ],
    starRating: 5,
    averageRating: 4.8,
    status: 'approved'
  },

  // Japan - Kyoto
  {
    name: "Kyoto Traditional Ryokan Inn",
    description: "Step back in time and experience authentic Japanese hospitality at Kyoto Traditional Ryokan Inn, a meticulously preserved traditional inn that has welcomed travelers for over 200 years. Located in the historic Gion district, our ryokan offers an immersive cultural experience featuring tatami-matted rooms, futon bedding, and sliding paper doors that open to reveal stunning views of our centuries-old garden. Each morning begins with a traditional Japanese breakfast served in your room, while evenings offer the opportunity to witness geishas gracefully making their way to appointments in nearby tea houses. Our natural hot spring baths (onsen) provide a deeply relaxing experience, while our tea ceremony room offers daily demonstrations of this ancient art. The ryokan's location provides easy access to Kyoto's most treasured temples including Kiyomizu-dera and Fushimi Inari Shrine.",
    locationCity: 'Kyoto',
    locationCountry: 'Japan',
    imageUrls: [
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945'
    ],
    amenities: ['wifi', 'traditional_bath', 'restaurant', 'garden', 'cultural_activities', 'non_smoking', 'concierge'],
    rooms: [
      { roomNumber: '101', roomType: 'Single', pricePerNight: 249, maxGuests: 1, isAvailable: true },
      { roomNumber: '102', roomType: 'Double', pricePerNight: 399, maxGuests: 2, isAvailable: true },
      { roomNumber: '201', roomType: 'Double', pricePerNight: 419, maxGuests: 2, isAvailable: true }
    ],
    starRating: 4,
    averageRating: 4.8,
    status: 'approved'
  },

  // France - Paris
  {
    name: "Parisian Belle Époque Palace",
    description: "Indulge in the timeless elegance of Paris at Parisian Belle Époque Palace, a magnificent hotel that captures the romance and sophistication of France's golden age. Located on the prestigious Champs-Élysées, our historic property has been meticulously restored to showcase original Belle Époque architectural details including ornate moldings, crystal chandeliers, and marble staircases. Each room is individually decorated with period antiques, luxurious fabrics, and artwork from renowned French artists, while modern amenities ensure contemporary comfort. Our award-winning restaurant serves classic French cuisine prepared by Michelin-starred chefs, while our wine cellar houses one of Paris's most extensive collections of vintage Bordeaux and Burgundy. Guests enjoy privileged access to our private shopping concierge who can arrange exclusive experiences at Parisian ateliers and boutiques. The hotel's location provides easy access to the Louvre, Arc de Triomphe, and the charming cafés of Saint-Germain.",
    locationCity: 'Paris',
    locationCountry: 'France',
    imageUrls: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945',
      'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96'
    ],
    amenities: ['wifi', 'heating', 'restaurant', 'bar', 'concierge', '24_hour_front_desk', 'laundry', 'business_center', 'room_service', 'valet_parking'],
    rooms: [
      { roomNumber: '101', roomType: 'Double', pricePerNight: 459, maxGuests: 2, isAvailable: true },
      { roomNumber: '102', roomType: 'Suite', pricePerNight: 699, maxGuests: 4, isAvailable: true },
      { roomNumber: '201', roomType: 'Suite', pricePerNight: 799, maxGuests: 4, isAvailable: true },
      { roomNumber: '301', roomType: 'Suite', pricePerNight: 1199, maxGuests: 6, isAvailable: true }
    ],
    starRating: 5,
    averageRating: 4.9,
    status: 'approved'
  },
  {
    name: "Montmartre Artist's Retreat",
    description: "Discover the bohemian spirit of Paris at Montmartre Artist's Retreat, a charming boutique hotel nestled in the winding cobblestone streets of Montmartre village. Our intimate property celebrates the area's rich artistic heritage through original artwork, vintage furnishings, and carefully curated collections that tell the story of the legendary artists who once called this neighborhood home. Each room features unique décor inspired by famous painters like Picasso, Renoir, and Toulouse-Lautrec, with many offering stunning views of the Sacré-Cœur Basilica and the Paris skyline beyond. Our rooftop terrace provides an intimate setting for morning coffee or evening wine while watching the sunset paint the city in golden hues. The hotel's location places guests within steps of Place du Tertre's portrait artists, historic cabarets like the Moulin Rouge, and charming bistros serving traditional French fare.",
    locationCity: 'Paris',
    locationCountry: 'France',
    imageUrls: [
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d',
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461',
      'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9'
    ],
    amenities: ['wifi', 'heating', 'breakfast', 'balcony', 'artistic_workshops', 'non_smoking', 'concierge', 'family_friendly'],
    rooms: [
      { roomNumber: '101', roomType: 'Single', pricePerNight: 189, maxGuests: 1, isAvailable: true },
      { roomNumber: '102', roomType: 'Double', pricePerNight: 269, maxGuests: 2, isAvailable: true },
      { roomNumber: '201', roomType: 'Double', pricePerNight: 289, maxGuests: 2, isAvailable: true }
    ],
    starRating: 4,
    averageRating: 4.6,
    status: 'approved'
  },

  // France - Nice
  {
    name: "Nice Riviera Grand Hotel",
    description: "Experience the glamour of the French Riviera at Nice Riviera Grand Hotel, a legendary palace hotel that has been the epitome of Côte d'Azur luxury since the Belle Époque era. Perched on the famous Promenade des Anglais with direct access to the azure waters of the Mediterranean, our hotel offers unparalleled views and world-class amenities. Each room and suite features classic French Riviera décor with modern touches, private terraces or balconies, and panoramic sea views. Our Michelin-starred restaurant specializes in Provençal cuisine that celebrates the region's abundant fresh seafood, aromatic herbs, and sun-ripened vegetables. The hotel's private beach club provides exclusive access to pristine sands, while our spa offers treatments inspired by Mediterranean wellness traditions. Guests enjoy easy access to the glamorous casinos of Monte Carlo, the perfume factories of Grasse, and the artistic heritage of Cannes and Saint-Tropez.",
    locationCity: 'Nice',
    locationCountry: 'France',
    imageUrls: [
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945',
      'https://images.unsplash.com/photo-1584132967334-10e028bd69f7'
    ],
    amenities: ['wifi', 'air_conditioning', 'pool', 'spa', 'restaurant', 'beach_access', 'concierge', '24_hour_front_desk', 'room_service', 'valet_parking'],
    rooms: [
      { roomNumber: '101', roomType: 'Double', pricePerNight: 399, maxGuests: 2, isAvailable: true },
      { roomNumber: '102', roomType: 'Suite', pricePerNight: 699, maxGuests: 4, isAvailable: true },
      { roomNumber: '201', roomType: 'Suite', pricePerNight: 899, maxGuests: 4, isAvailable: true },
      { roomNumber: '301', roomType: 'Suite', pricePerNight: 1299, maxGuests: 6, isAvailable: true }
    ],
    starRating: 5,
    averageRating: 4.8,
    status: 'approved'
  },

  // Australia - Sydney
  {
    name: "Sydney Harbour Luxury Resort",
    description: "Experience Sydney's natural beauty and urban sophistication at Sydney Harbour Luxury Resort, a world-class property offering unobstructed views of the iconic Sydney Opera House and Harbour Bridge. Our contemporary resort seamlessly integrates indoor and outdoor living spaces, featuring floor-to-ceiling windows, private terraces, and infinity pools that seem to merge with the sparkling harbor waters. Each suite is designed to showcase Australia's natural beauty through organic materials, locally-crafted furnishings, and artwork by Aboriginal artists. Our signature restaurant celebrates modern Australian cuisine with native ingredients and influences from the country's diverse cultural communities. The resort's prime location in Circular Quay provides walking access to the Opera House, Royal Botanic Gardens, and The Rocks historic area, while our private marina offers exclusive harbor cruise experiences and sailing adventures.",
    locationCity: 'Sydney',
    locationCountry: 'Australia',
    imageUrls: [
      'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945'
    ],
    amenities: ['wifi', 'air_conditioning', 'pool', 'spa', 'restaurant', 'marina', 'concierge', '24_hour_front_desk', 'room_service', 'business_center'],
    rooms: [
      { roomNumber: '101', roomType: 'Double', pricePerNight: 449, maxGuests: 2, isAvailable: true },
      { roomNumber: '102', roomType: 'Suite', pricePerNight: 699, maxGuests: 4, isAvailable: true },
      { roomNumber: '201', roomType: 'Suite', pricePerNight: 899, maxGuests: 4, isAvailable: true },
      { roomNumber: '301', roomType: 'Suite', pricePerNight: 1399, maxGuests: 6, isAvailable: true }
    ],
    starRating: 5,
    averageRating: 4.9,
    status: 'approved'
  },
  {
    name: "Bondi Beach Eco Lodge",
    description: "Embrace sustainable luxury at Bondi Beach Eco Lodge, an innovative eco-friendly resort that demonstrates how environmental consciousness and luxury can coexist harmoniously. Located just steps from Australia's most famous beach, our property features solar-powered energy systems, rainwater harvesting, and buildings constructed from reclaimed and sustainable materials. Each room showcases contemporary Australian design with recycled timber furnishings, organic cotton linens, and panoramic ocean views. Our zero-waste restaurant serves organic, locally-sourced cuisine with a focus on native Australian ingredients and sustainable seafood. Guests can participate in guided nature walks, surfing lessons, and marine conservation programs, while our spa offers treatments using indigenous plant-based products. The lodge's commitment to sustainability extends to partnerships with local conservation organizations and carbon-neutral operations.",
    locationCity: 'Sydney',
    locationCountry: 'Australia',
    imageUrls: [
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d',
      'https://images.unsplash.com/photo-1502780402662-acc01917851e'
    ],
    amenities: ['wifi', 'air_conditioning', 'restaurant', 'beach_access', 'eco_friendly', 'family_friendly', 'pet_friendly', 'spa', 'surfing_lessons'],
    rooms: [
      { roomNumber: '101', roomType: 'Single', pricePerNight: 229, maxGuests: 1, isAvailable: true },
      { roomNumber: '102', roomType: 'Double', pricePerNight: 329, maxGuests: 2, isAvailable: true },
      { roomNumber: '201', roomType: 'Double', pricePerNight: 349, maxGuests: 2, isAvailable: true }
    ],
    starRating: 4,
    averageRating: 4.7,
    status: 'approved'
  },

  // Australia - Melbourne
  {
    name: "Melbourne Cultural Quarter Hotel",
    description: "Immerse yourself in Melbourne's renowned arts and culture scene at Melbourne Cultural Quarter Hotel, a sophisticated property located in the heart of the city's vibrant cultural precinct. Our hotel celebrates Melbourne's reputation as Australia's cultural capital through an extensive collection of local artwork, designer furnishings by Australian craftspeople, and architecture that pays homage to the city's Victorian heritage while embracing contemporary innovation. Each room features curated collections of books by Australian authors, locally-roasted coffee facilities, and views of the city's famous street art laneways. Our rooftop restaurant showcases modern Australian cuisine with influences from Melbourne's diverse immigrant communities, while our ground-floor gallery space hosts rotating exhibitions by emerging local artists. The hotel's location provides easy access to the Royal Exhibition Building, Melbourne Museum, and the bustling Queen Victoria Market.",
    locationCity: 'Melbourne',
    locationCountry: 'Australia',
    imageUrls: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945',
      'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96'
    ],
    amenities: ['wifi', 'air_conditioning', 'restaurant', 'art_gallery', 'cultural_activities', 'concierge', '24_hour_front_desk', 'business_center', 'laundry'],
    rooms: [
      { roomNumber: '101', roomType: 'Single', pricePerNight: 199, maxGuests: 1, isAvailable: true },
      { roomNumber: '102', roomType: 'Double', pricePerNight: 299, maxGuests: 2, isAvailable: true },
      { roomNumber: '201', roomType: 'Double', pricePerNight: 319, maxGuests: 2, isAvailable: true },
      { roomNumber: '301', roomType: 'Suite', pricePerNight: 499, maxGuests: 4, isAvailable: true }
    ],
    starRating: 4,
    averageRating: 4.6,
    status: 'approved'
  },

  // Additional Hotels to reach 30+ total

  // United States - Additional Properties
  {
    name: "Silicon Valley Tech Resort",
    description: "Experience innovation at Silicon Valley Tech Resort, where cutting-edge technology meets luxury hospitality in the heart of California's innovation capital. Our smart hotel features AI-powered room controls, high-speed fiber internet, wireless charging stations, and state-of-the-art conference facilities designed for tech professionals and entrepreneurs. Each room is equipped with multiple device connectivity options, premium workstations, and panoramic views of the San Francisco Bay. Our innovation lab provides guests with access to 3D printing, VR experiences, and startup mentorship programs. The hotel's restaurant features molecular gastronomy and sustainable tech-grown ingredients, while our rooftop provides networking spaces with views of major tech campuses.",
    locationCity: 'Los Angeles',
    locationCountry: 'United States',
    imageUrls: [
      'https://images.unsplash.com/photo-1584132967334-10e028bd69f7',
      'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945'
    ],
    amenities: ['wifi', 'air_conditioning', 'business_center', 'restaurant', 'gym', 'concierge', '24_hour_front_desk', 'laundry', 'parking'],
    rooms: [
      { roomNumber: '101', roomType: 'Single', pricePerNight: 329, maxGuests: 1, isAvailable: true },
      { roomNumber: '102', roomType: 'Double', pricePerNight: 429, maxGuests: 2, isAvailable: true },
      { roomNumber: '201', roomType: 'Suite', pricePerNight: 699, maxGuests: 4, isAvailable: true }
    ],
    starRating: 4,
    averageRating: 4.4,
    status: 'approved'
  },
  {
    name: "Napa Valley Vineyard Inn",
    description: "Discover the essence of California wine country at Napa Valley Vineyard Inn, an intimate boutique property surrounded by rolling vineyards and majestic mountains. Our rustic-elegant accommodations feature exposed beam ceilings, stone fireplaces, and private terraces overlooking organic grapevines. Each room includes a personal wine fridge stocked with premium local selections and artisanal cheese pairings. Our on-site sommelier offers private tastings and vineyard tours, while our farm-to-table restaurant showcases seasonal ingredients from our organic garden paired with award-winning wines. The spa features grape-seed treatments and wine therapy sessions, while our infinity pool provides stunning valley views during golden hour sunsets.",
    locationCity: 'Los Angeles',
    locationCountry: 'United States',
    imageUrls: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d'
    ],
    amenities: ['wifi', 'pool', 'spa', 'restaurant', 'wine_tasting', 'family_friendly', 'pet_friendly', 'concierge', 'parking'],
    rooms: [
      { roomNumber: '101', roomType: 'Double', pricePerNight: 399, maxGuests: 2, isAvailable: true },
      { roomNumber: '102', roomType: 'Suite', pricePerNight: 599, maxGuests: 4, isAvailable: true },
      { roomNumber: '201', roomType: 'Suite', pricePerNight: 799, maxGuests: 4, isAvailable: true }
    ],
    starRating: 5,
    averageRating: 4.8,
    status: 'approved'
  },

  // United Kingdom - Additional Properties
  {
    name: "Oxford Scholar's Retreat",
    description: "Immerse yourself in centuries of academic excellence at Oxford Scholar's Retreat, a distinguished hotel housed in a beautifully restored medieval college building within walking distance of the prestigious University of Oxford. Our historic property features original Gothic architecture, vaulted ceilings, and stained glass windows, while modern amenities ensure contemporary comfort. Each room is uniquely decorated with period furniture, rare books, and artwork celebrating Oxford's intellectual heritage. Our library lounge offers a quiet space for reading and reflection, while our traditional English restaurant serves locally-sourced cuisine in a grand dining hall with centuries-old portraits. The hotel provides exclusive access to private college gardens and scholarly lectures by Oxford professors.",
    locationCity: 'London',
    locationCountry: 'United Kingdom',
    imageUrls: [
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945'
    ],
    amenities: ['wifi', 'heating', 'restaurant', 'library', 'garden', 'cultural_activities', 'concierge', 'laundry', 'non_smoking'],
    rooms: [
      { roomNumber: '101', roomType: 'Single', pricePerNight: 249, maxGuests: 1, isAvailable: true },
      { roomNumber: '102', roomType: 'Double', pricePerNight: 349, maxGuests: 2, isAvailable: true },
      { roomNumber: '201', roomType: 'Suite', pricePerNight: 549, maxGuests: 3, isAvailable: true }
    ],
    starRating: 4,
    averageRating: 4.7,
    status: 'approved'
  },
  {
    name: "Lake District Lakeside Lodge",
    description: "Experience the natural beauty of England's Lake District at Lakeside Lodge, a charming country hotel nestled on the shores of pristine Windermere Lake. Our traditional Lakeland stone building offers cozy accommodations with antique furnishings, log fireplaces, and panoramic lake views from every room. Guests can enjoy complimentary use of kayaks, rowing boats, and hiking equipment to explore the surrounding fells and valleys that inspired poets like William Wordsworth. Our restaurant specializes in traditional Cumbrian cuisine featuring local lamb, freshly caught fish, and produce from nearby farms. The hotel's location provides easy access to historic villages, artisan shops, and the famous Beatrix Potter attractions.",
    locationCity: 'Edinburgh',
    locationCountry: 'United Kingdom',
    imageUrls: [
      'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d'
    ],
    amenities: ['wifi', 'heating', 'restaurant', 'lake_access', 'hiking', 'family_friendly', 'pet_friendly', 'concierge', 'parking'],
    rooms: [
      { roomNumber: '101', roomType: 'Double', pricePerNight: 229, maxGuests: 2, isAvailable: true },
      { roomNumber: '102', roomType: 'Double', pricePerNight: 249, maxGuests: 2, isAvailable: true },
      { roomNumber: '201', roomType: 'Suite', pricePerNight: 399, maxGuests: 4, isAvailable: true }
    ],
    starRating: 4,
    averageRating: 4.6,
    status: 'approved'
  },

  // Japan - Additional Properties
  {
    name: "Mount Fuji Wellness Resort",
    description: "Find tranquility and spiritual renewal at Mount Fuji Wellness Resort, a serene mountain retreat offering breathtaking views of Japan's sacred Mount Fuji. Our resort combines traditional Japanese hospitality with modern wellness practices, featuring meditation gardens, natural hot springs, and holistic spa treatments inspired by ancient healing traditions. Each room is designed according to feng shui principles with tatami flooring, minimalist décor, and private mountain-view terraces. Our wellness programs include guided meditation, forest bathing experiences, and traditional tea ceremonies conducted by certified masters. The resort's organic restaurant serves macrobiotic cuisine prepared with ingredients grown in our permaculture gardens, while our sake bar features premium selections from local breweries.",
    locationCity: 'Tokyo',
    locationCountry: 'Japan',
    imageUrls: [
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945'
    ],
    amenities: ['wifi', 'spa', 'traditional_bath', 'restaurant', 'meditation', 'garden', 'wellness_programs', 'concierge', 'non_smoking'],
    rooms: [
      { roomNumber: '101', roomType: 'Double', pricePerNight: 449, maxGuests: 2, isAvailable: true },
      { roomNumber: '102', roomType: 'Suite', pricePerNight: 699, maxGuests: 4, isAvailable: true },
      { roomNumber: '201', roomType: 'Suite', pricePerNight: 899, maxGuests: 4, isAvailable: true }
    ],
    starRating: 5,
    averageRating: 4.9,
    status: 'approved'
  },
  {
    name: "Osaka Culinary Experience Hotel",
    description: "Embark on a gastronomic journey at Osaka Culinary Experience Hotel, located in Japan's kitchen where street food culture meets haute cuisine innovation. Our unique hotel features cooking studios in every suite, allowing guests to learn traditional Japanese cooking techniques from master chefs. The property includes a rooftop herb garden, artisanal sake brewery, and the largest collection of Japanese knives available for guest use. Our multiple restaurants showcase different regional Japanese cuisines, from authentic Kansai comfort food to innovative molecular gastronomy. Daily food tours lead guests through Osaka's famous markets, street food districts, and hidden local gems, while evening cooking classes teach the art of sushi, ramen, and traditional kaiseki preparation.",
    locationCity: 'Kyoto',
    locationCountry: 'Japan',
    imageUrls: [
      'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9',
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945'
    ],
    amenities: ['wifi', 'air_conditioning', 'restaurant', 'cooking_classes', 'food_tours', 'garden', 'cultural_activities', 'concierge', '24_hour_front_desk'],
    rooms: [
      { roomNumber: '101', roomType: 'Suite', pricePerNight: 399, maxGuests: 3, isAvailable: true },
      { roomNumber: '102', roomType: 'Suite', pricePerNight: 499, maxGuests: 4, isAvailable: true },
      { roomNumber: '201', roomType: 'Suite', pricePerNight: 599, maxGuests: 4, isAvailable: true }
    ],
    starRating: 4,
    averageRating: 4.7,
    status: 'approved'
  },

  // France - Additional Properties
  {
    name: "Provence Lavender Fields Resort",
    description: "Discover the romantic beauty of southern France at Provence Lavender Fields Resort, an enchanting property surrounded by endless purple lavender fields and rolling countryside dotted with ancient olive groves. Our restored 18th-century mas (farmhouse) combines rustic Provençal charm with modern luxury, featuring stone walls, terracotta floors, and hand-painted tiles throughout. Each room opens onto private terraces with views of lavender fields and the distant Alps, while many feature original fireplaces and period antiques. Our spa specializes in lavender-based treatments and aromatherapy using herbs grown on the property. The restaurant serves authentic Provençal cuisine with ingredients sourced from local farmers' markets, paired with wines from nearby vineyards that guests can visit during private tastings.",
    locationCity: 'Nice',
    locationCountry: 'France',
    imageUrls: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d'
    ],
    amenities: ['wifi', 'air_conditioning', 'pool', 'spa', 'restaurant', 'wine_tasting', 'lavender_tours', 'family_friendly', 'pet_friendly'],
    rooms: [
      { roomNumber: '101', roomType: 'Double', pricePerNight: 299, maxGuests: 2, isAvailable: true },
      { roomNumber: '102', roomType: 'Suite', pricePerNight: 449, maxGuests: 4, isAvailable: true },
      { roomNumber: '201', roomType: 'Suite', pricePerNight: 599, maxGuests: 4, isAvailable: true }
    ],
    starRating: 4,
    averageRating: 4.8,
    status: 'approved'
  },
  {
    name: "Loire Valley Château Hotel",
    description: "Live like French royalty at Loire Valley Château Hotel, a magnificent Renaissance castle that has been lovingly restored to offer guests an authentic aristocratic experience. Our fairy-tale château features original medieval architecture including towers, moats, and formal French gardens designed by landscape architects who worked at Versailles. Each suite is uniquely decorated with museum-quality antiques, silk tapestries, and artwork spanning centuries of French history. Guests can participate in falconry demonstrations, guided tours of our wine caves, and exclusive after-hours visits to nearby châteaux. Our Michelin-starred restaurant serves refined French cuisine in a grand dining room with crystal chandeliers and gold-leafed ceilings, while our sommelier offers tastings from our collection of rare vintages dating back to the 18th century.",
    locationCity: 'Paris',
    locationCountry: 'France',
    imageUrls: [
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461',
      'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945'
    ],
    amenities: ['wifi', 'heating', 'restaurant', 'wine_cellar', 'gardens', 'cultural_activities', 'concierge', '24_hour_front_desk', 'laundry'],
    rooms: [
      { roomNumber: '101', roomType: 'Suite', pricePerNight: 699, maxGuests: 4, isAvailable: true },
      { roomNumber: '102', roomType: 'Suite', pricePerNight: 899, maxGuests: 4, isAvailable: true },
      { roomNumber: '201', roomType: 'Suite', pricePerNight: 1299, maxGuests: 6, isAvailable: true }
    ],
    starRating: 5,
    averageRating: 4.9,
    status: 'approved'
  },

  // Australia - Additional Properties
  {
    name: "Great Barrier Reef Island Resort",
    description: "Experience one of the world's natural wonders at Great Barrier Reef Island Resort, an exclusive eco-luxury property located on a private island surrounded by pristine coral reefs teeming with marine life. Our resort features overwater bungalows and beachfront villas constructed using sustainable materials and renewable energy systems. Each accommodation offers direct ocean access, glass-bottom floors for reef viewing, and private decks with infinity pools. Our marine biology center provides educational programs about reef conservation, while certified dive masters lead underwater explorations of the world's largest coral reef system. The resort partners with marine research organizations to offer guests opportunities to participate in coral restoration projects and sea turtle monitoring programs.",
    locationCity: 'Sydney',
    locationCountry: 'Australia',
    imageUrls: [
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96',
      'https://images.unsplash.com/photo-1502780402662-acc01917851e'
    ],
    amenities: ['wifi', 'air_conditioning', 'pool', 'diving', 'snorkeling', 'marine_biology', 'eco_friendly', 'restaurant', 'spa'],
    rooms: [
      { roomNumber: '101', roomType: 'Suite', pricePerNight: 899, maxGuests: 4, isAvailable: true },
      { roomNumber: '102', roomType: 'Suite', pricePerNight: 1199, maxGuests: 4, isAvailable: true },
      { roomNumber: '201', roomType: 'Suite', pricePerNight: 1599, maxGuests: 6, isAvailable: true }
    ],
    starRating: 5,
    averageRating: 4.9,
    status: 'approved'
  },
  {
    name: "Outback Glamping Experience",
    description: "Discover the raw beauty of the Australian Outback at Outback Glamping Experience, a unique luxury camping resort that offers comfort and adventure in one of the world's most remote wilderness areas. Our luxury safari tents feature full bathrooms, comfortable beds, and climate control while maintaining an authentic connection to the stunning desert landscape. Each tent offers unobstructed views of red rock formations, endless star-filled skies, and unique wildlife including kangaroos, echidnas, and colorful bird species. Our experienced guides lead sunrise hot air balloon rides, Aboriginal cultural experiences, and night-time astronomy sessions using professional telescopes. The resort's restaurant specializes in bush tucker cuisine featuring native ingredients and traditional cooking methods over open fires.",
    locationCity: 'Melbourne',
    locationCountry: 'Australia',
    imageUrls: [
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945',
      'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9'
    ],
    amenities: ['wifi', 'air_conditioning', 'restaurant', 'cultural_activities', 'stargazing', 'wildlife_tours', 'adventure_activities', 'family_friendly'],
    rooms: [
      { roomNumber: '101', roomType: 'Double', pricePerNight: 399, maxGuests: 2, isAvailable: true },
      { roomNumber: '102', roomType: 'Double', pricePerNight: 449, maxGuests: 2, isAvailable: true },
      { roomNumber: '201', roomType: 'Suite', pricePerNight: 699, maxGuests: 4, isAvailable: true }
    ],
    starRating: 4,
    averageRating: 4.7,
    status: 'approved'
  }
];

// Sample user IDs for reviews (simulating different users)
const SAMPLE_USER_IDS = [
  'user_2abc123def456ghi789',
  'user_2bcd234efg567hij890',
  'user_2cde345fgh678ijk901',
  'user_2def456ghi789jkl012',
  'user_2efg567hij890klm123',
  'user_2fgh678ijk901lmn234',
  'user_2ghi789jkl012mno345',
  'user_2hij890klm123nop456'
];

const SAMPLE_REVIEWS = [
  {
    rating: 5,
    comment: "Absolutely incredible experience! The service was impeccable and the views were breathtaking. Every detail was perfect."
  },
  {
    rating: 4,
    comment: "Beautiful hotel with excellent amenities. The staff was very helpful and the location was perfect for exploring the city."
  },
  {
    rating: 5,
    comment: "This hotel exceeded all expectations. The rooms were luxurious and the dining was exceptional. Will definitely return!"
  },
  {
    rating: 4,
    comment: "Great value for money. Clean, comfortable rooms and friendly staff. The breakfast was particularly good."
  },
  {
    rating: 5,
    comment: "Outstanding hospitality and attention to detail. The spa treatments were amazing and the food was world-class."
  },
  {
    rating: 4,
    comment: "Lovely property with unique character. The local recommendations from the concierge were spot-on."
  },
  {
    rating: 5,
    comment: "Perfect location and stunning architecture. The cultural experiences offered by the hotel were unforgettable."
  },
  {
    rating: 4,
    comment: "Excellent facilities and very well-maintained property. The eco-friendly practices were impressive."
  }
];

async function generateHotelEmbedding(hotel: any) {
  const embeddingText = `${hotel.name} ${hotel.description} ${hotel.locationCity} ${hotel.locationCountry} ${hotel.amenities.join(' ')} ${hotel.rooms.map((r: any) => r.roomType).join(' ')}`;
  try {
    return await generateEmbedding(embeddingText);
  } catch (error) {
    console.warn(`Failed to generate embedding for ${hotel.name}:`, error);
    return undefined;
  }
}

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Connect to database
    await connectDB();
    
    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await Promise.all([
      Location.deleteMany({}),
      Hotel.deleteMany({}),
      Amenity.deleteMany({}),
      Review.deleteMany({})
    ]);
    
    // Seed amenities
    console.log('🏷️  Seeding amenities...');
    const amenities = await Amenity.insertMany(AMENITIES_DATA);
    console.log(`✅ Created ${amenities.length} amenities`);
    
    // Seed locations
    console.log('📍 Seeding locations...');
    const locations = await Location.insertMany(LOCATIONS_DATA);
    console.log(`✅ Created ${locations.length} locations`);
    
    // Create location lookup map
    const locationMap = new Map();
    locations.forEach(location => {
      const key = `${location.city}-${location.country}`;
      locationMap.set(key, location._id);
    });
    
    // Seed hotels with embeddings
    console.log('🏨 Seeding hotels with embeddings...');
    const hotelPromises = HOTELS_DATA.map(async (hotelData) => {
      const locationKey = `${hotelData.locationCity}-${hotelData.locationCountry}`;
      const locationId = locationMap.get(locationKey);
      
      if (!locationId) {
        console.warn(`Location not found for ${hotelData.name}`);
        return null;
      }
      
      // Generate embedding
      console.log(`Generating embedding for ${hotelData.name}...`);
      const embedding = await generateHotelEmbedding(hotelData);
      
      // Calculate price starting from
      const priceStartingFrom = Math.min(...hotelData.rooms.map((r: any) => r.pricePerNight));
      
      const hotel = new Hotel({
        name: hotelData.name,
        description: hotelData.description,
        location: locationId,
        imageUrls: hotelData.imageUrls,
        amenities: hotelData.amenities,
        rooms: hotelData.rooms,
        priceStartingFrom,
        starRating: hotelData.starRating,
        averageRating: hotelData.averageRating,
        status: hotelData.status,
        embedding: embedding,
        reviews: []
      });
      
      return hotel.save();
    });
    
    const hotels = (await Promise.all(hotelPromises)).filter(hotel => hotel !== null);
    console.log(`✅ Created ${hotels.length} hotels with embeddings`);
    
    // Seed reviews
    console.log('⭐ Seeding reviews...');
    const reviewPromises: Promise<any>[] = [];
    
    hotels.forEach((hotel) => {
      if (!hotel) return;
      
      // Generate 2-4 reviews per hotel
      const numReviews = Math.floor(Math.random() * 3) + 2;
      
      for (let i = 0; i < numReviews; i++) {
        const randomReview = SAMPLE_REVIEWS[Math.floor(Math.random() * SAMPLE_REVIEWS.length)];
        const randomUserId = SAMPLE_USER_IDS[Math.floor(Math.random() * SAMPLE_USER_IDS.length)];
        
        const review = new Review({
          rating: randomReview.rating,
          comment: randomReview.comment,
          userId: randomUserId,
          hotelId: hotel._id
        });
        
        reviewPromises.push(review.save());
      }
    });
    
    const reviews = await Promise.all(reviewPromises);
    console.log(`✅ Created ${reviews.length} reviews`);
    
    // Update hotels with review references and recalculate average ratings
    console.log('🔄 Updating hotel review references...');
    const hotelUpdatePromises = hotels.map(async (hotel) => {
      if (!hotel) return null;
      
      const hotelReviews = reviews.filter(review => 
        review.hotelId.toString() === hotel._id?.toString()
      );
      
      const reviewIds = hotelReviews.map(review => review._id);
      const averageRating = hotelReviews.length > 0 
        ? Math.round((hotelReviews.reduce((sum, review) => sum + review.rating, 0) / hotelReviews.length) * 10) / 10
        : 0;
      
      return Hotel.findByIdAndUpdate(hotel._id, {
        reviews: reviewIds,
        averageRating: averageRating
      });
    });
    
    await Promise.all(hotelUpdatePromises);
    console.log(`✅ Updated hotel review references`);
    
    // Final statistics
    const stats = {
      locations: await Location.countDocuments(),
      hotels: await Hotel.countDocuments(),
      amenities: await Amenity.countDocuments(),
      reviews: await Review.countDocuments()
    };
    
    console.log('\n🎉 Database seeding completed successfully!');
    console.log('📊 Final Statistics:');
    console.log(`   📍 Locations: ${stats.locations}`);
    console.log(`   🏨 Hotels: ${stats.hotels}`);
    console.log(`   🏷️  Amenities: ${stats.amenities}`);
    console.log(`   ⭐ Reviews: ${stats.reviews}`);
    console.log('\n✨ Your database is now ready with rich, searchable hotel data!');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

// Run the seed function
if (require.main === module) {
  seedDatabase();
}

export default seedDatabase;