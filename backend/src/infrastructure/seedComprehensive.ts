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
    // Asian Countries
    {
      city: "Tokyo",
      country: "Japan",
      coordinates: {
        type: 'Point',
        coordinates: [139.6917, 35.6895]
      }
    },
    {
      city: "Bangkok",
      country: "Thailand", 
      coordinates: {
        type: 'Point',
        coordinates: [100.5018, 13.7563]
      }
    },
    {
      city: "Singapore",
      country: "Singapore",
      coordinates: {
        type: 'Point',
        coordinates: [103.8198, 1.3521]
      }
    },
    {
      city: "Dubai",
      country: "United Arab Emirates",
      coordinates: {
        type: 'Point',
        coordinates: [55.2708, 25.2048]
      }
    },
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
    // European Countries
    {
      city: "Paris",
      country: "France",
      coordinates: {
        type: 'Point',
        coordinates: [2.3522, 48.8566]
      }
    },
    {
      city: "London",
      country: "United Kingdom",
      coordinates: {
        type: 'Point',
        coordinates: [-0.1276, 51.5074]
      }
    },
    {
      city: "Rome",
      country: "Italy",
      coordinates: {
        type: 'Point',
        coordinates: [12.4964, 41.9028]
      }
    },
    {
      city: "Barcelona",
      country: "Spain",
      coordinates: {
        type: 'Point',
        coordinates: [2.1734, 41.3851]
      }
    },
    {
      city: "Amsterdam",
      country: "Netherlands",
      coordinates: {
        type: 'Point',
        coordinates: [4.9041, 52.3676]
      }
    },
    // American Countries
    {
      city: "New York",
      country: "United States",
      coordinates: {
        type: 'Point',
        coordinates: [-74.0059, 40.7128]
      }
    },
    {
      city: "Los Angeles",
      country: "United States",
      coordinates: {
        type: 'Point',
        coordinates: [-118.2437, 34.0522]
      }
    },
    {
      city: "Toronto",
      country: "Canada",
      coordinates: {
        type: 'Point',
        coordinates: [-79.3832, 43.6532]
      }
    },
    // Other Countries
    {
      city: "Sydney",
      country: "Australia",
      coordinates: {
        type: 'Point',
        coordinates: [151.2093, -33.8688]
      }
    },
    {
      city: "Cape Town",
      country: "South Africa",
      coordinates: {
        type: 'Point',
        coordinates: [18.4241, -33.9249]
      }
    }
  ],

  hotels: [
    // Luxury Hotels
    {
      name: "The Ritz-Carlton Tokyo",
      description: "Experience unparalleled luxury at Tokyo's most prestigious address. Situated on the top floors of the iconic Tokyo Midtown complex, our hotel offers breathtaking views of Mount Fuji and the Imperial Palace. Each meticulously designed room features contemporary Japanese aesthetics blended with Western comfort. Our award-winning spa provides traditional Japanese treatments, while our Michelin-starred restaurants serve exquisite cuisine. The hotel's location in Roppongi places you at the heart of Tokyo's cultural and business district, minutes from world-class shopping, art galleries, and entertainment venues.",
      imageUrls: [
        "https://images.unsplash.com/photo-1564501049412-61c2a3083791",
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d",
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b"
      ],
      amenities: ["wifi", "spa", "restaurant", "gym", "pool", "concierge", "room_service", "business_center", "parking", "laundry"],
      rooms: [
        { roomNumber: "4501", roomType: "Single", pricePerNight: 25000, maxGuests: 1, isAvailable: true },
        { roomNumber: "4502", roomType: "Double", pricePerNight: 32000, maxGuests: 2, isAvailable: true },
        { roomNumber: "4601", roomType: "Suite", pricePerNight: 65000, maxGuests: 3, isAvailable: true }
      ],
      priceStartingFrom: 25000,
      starRating: 5,
      averageRating: 4.9
    },
    {
      name: "Mandarin Oriental Bangkok",
      description: "A legendary riverside sanctuary on the banks of the Chao Phraya River, where timeless elegance meets modern luxury. This iconic hotel has been welcoming discerning travelers since 1876, offering an oasis of calm in the vibrant heart of Bangkok. Our spacious rooms and suites feature classic Thai silk furnishings, marble bathrooms, and stunning river or city views. The hotel's award-winning spa draws on ancient Thai healing traditions, while our restaurants offer everything from authentic Thai cuisine to international fine dining. With private boat transfers and proximity to major shopping districts, cultural sites, and business centers, we provide the perfect base for exploring the City of Angels.",
      imageUrls: [
        "https://images.unsplash.com/photo-1566073771259-6a8506099945",
        "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4",
        "https://images.unsplash.com/photo-1578662996442-48f60103fc96"
      ],
      amenities: ["wifi", "spa", "pool", "restaurant", "gym", "concierge", "room_service", "business_center", "airport_shuttle", "laundry", "balcony"],
      rooms: [
        { roomNumber: "201", roomType: "Double", pricePerNight: 18000, maxGuests: 2, isAvailable: true },
        { roomNumber: "301", roomType: "Suite", pricePerNight: 35000, maxGuests: 4, isAvailable: true }
      ],
      priceStartingFrom: 18000,
      starRating: 5,
      averageRating: 4.8
    },
    {
      name: "Marina Bay Sands Singapore",
      description: "An architectural marvel that has redefined Singapore's skyline, featuring the world's longest elevated swimming pool suspended 200 meters above ground. This integrated resort combines luxury accommodation with world-class entertainment, dining, and shopping experiences. Our rooms offer panoramic views of Marina Bay, the Singapore Strait, or the city skyline, each designed with contemporary elegance and cutting-edge technology. The SkyPark Infinity Pool provides an unforgettable swimming experience with unobstructed 360-degree views. Home to celebrity chef restaurants, luxury shopping at The Shoppes, and the ArtScience Museum, the hotel offers endless possibilities for exploration and indulgence. The central location provides easy access to Gardens by the Bay, the Merlion, and Singapore's financial district.",
      imageUrls: [
        "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa",
        "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6",
        "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9"
      ],
      amenities: ["wifi", "pool", "spa", "restaurant", "gym", "business_center", "concierge", "room_service", "parking", "24_hour_front_desk"],
      rooms: [
        { roomNumber: "2801", roomType: "Double", pricePerNight: 22000, maxGuests: 2, isAvailable: true },
        { roomNumber: "3501", roomType: "Suite", pricePerNight: 45000, maxGuests: 3, isAvailable: true }
      ],
      priceStartingFrom: 22000,
      starRating: 5,
      averageRating: 4.7
    },
    {
      name: "Burj Al Arab Dubai",
      description: "The world's most luxurious hotel, standing majestically on its own artificial island, connected to mainland Dubai by a private bridge. This sail-shaped architectural icon offers the ultimate in opulent accommodations, with each suite spanning two floors and featuring floor-to-ceiling windows with breathtaking views of the Arabian Gulf. Your personal butler ensures every need is anticipated, while the gold-accented interiors and bespoke furnishings create an atmosphere of unparalleled grandeur. Dine at underwater restaurants, enjoy helicopter transfers, and experience the private beach with dedicated service. The hotel's fleet of Rolls-Royce vehicles and private yacht provide exclusive transportation options. Located near Jumeirah Beach and Wild Wadi Waterpark, with easy access to Dubai Mall and Palm Jumeirah.",
      imageUrls: [
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b",
        "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4"
      ],
      amenities: ["wifi", "spa", "pool", "restaurant", "gym", "concierge", "room_service", "business_center", "airport_shuttle", "laundry", "balcony"],
      rooms: [
        { roomNumber: "1501", roomType: "Suite", pricePerNight: 85000, maxGuests: 4, isAvailable: true },
        { roomNumber: "2501", roomType: "Suite", pricePerNight: 120000, maxGuests: 6, isAvailable: true }
      ],
      priceStartingFrom: 85000,
      starRating: 5,
      averageRating: 4.9
    },
    {
      name: "The Taj Mahal Palace Mumbai",
      description: "A magnificent palace hotel overlooking the Gateway of India and Arabian Sea, this legendary establishment has been Mumbai's most iconic landmark since 1903. Combining Moorish, Oriental, and Florentine architectural styles, the hotel stands as a testament to Indian hospitality and grandeur. Each room and suite reflects the rich heritage of the property, featuring antique furniture, original artworks, and modern amenities. The hotel's restaurants offer everything from authentic Indian cuisine to international fine dining, while the Jiva Spa provides traditional Ayurvedic treatments. With its prime location in Colaba, guests are steps away from the vibrant markets, art galleries, and business districts of South Mumbai. The hotel's impeccable service and attention to detail have made it a favorite among world leaders, celebrities, and discerning travelers.",
      imageUrls: [
        "https://images.unsplash.com/photo-1564501049412-61c2a3083791",
        "https://images.unsplash.com/photo-1590490360182-c33d57733427"
      ],
      amenities: ["wifi", "spa", "pool", "restaurant", "gym", "concierge", "room_service", "business_center", "laundry", "24_hour_front_desk"],
      rooms: [
        { roomNumber: "301", roomType: "Double", pricePerNight: 15000, maxGuests: 2, isAvailable: true },
        { roomNumber: "501", roomType: "Suite", pricePerNight: 28000, maxGuests: 3, isAvailable: true }
      ],
      priceStartingFrom: 15000,
      starRating: 5,
      averageRating: 4.6
    },
    // European Luxury
    {
      name: "Hotel Plaza Athénée Paris",
      description: "Epitomizing Parisian elegance on the prestigious Avenue Montaigne, this palace hotel offers an incomparable luxury experience in the heart of the fashion and cultural capital. Each room and suite is a masterpiece of French design, featuring Regency-style furnishings, crystal chandeliers, and breathtaking views of the Eiffel Tower or charming Parisian courtyards. The hotel's Michelin-starred restaurants, led by world-renowned chefs, showcase the finest French cuisine and innovative culinary artistry. The Dior Institute spa provides exclusive beauty treatments in an opulent setting. Located steps from the Champs-Élysées, Louvre Museum, and luxury boutiques, the hotel provides the perfect base for exploring the City of Light. The rooftop terrace offers panoramic views and an unforgettable dining experience.",
      imageUrls: [
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d",
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b"
      ],
      amenities: ["wifi", "spa", "restaurant", "gym", "concierge", "room_service", "business_center", "laundry", "24_hour_front_desk", "balcony"],
      rooms: [
        { roomNumber: "401", roomType: "Double", pricePerNight: 35000, maxGuests: 2, isAvailable: true },
        { roomNumber: "601", roomType: "Suite", pricePerNight: 65000, maxGuests: 4, isAvailable: true }
      ],
      priceStartingFrom: 35000,
      starRating: 5,
      averageRating: 4.8
    },
    {
      name: "The Savoy London",
      description: "A legendary Art Deco masterpiece on the Thames, where tradition meets contemporary luxury in the heart of London's cultural district. Since 1889, this iconic hotel has welcomed royalty, celebrities, and discerning travelers with its impeccable service and timeless elegance. Each room and suite features bespoke furnishings, marble bathrooms, and either river or courtyard views. The world-famous American Bar serves legendary cocktails, while our restaurants offer everything from traditional British fare to innovative modern cuisine. The hotel's prime location places guests steps from Covent Garden, the West End theaters, and the financial district. With its own private entrance to the Savoy Theatre and proximity to major attractions like the London Eye and Tate Modern, the hotel offers an unparalleled London experience.",
      imageUrls: [
        "https://images.unsplash.com/photo-1566073771259-6a8506099945",
        "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4"
      ],
      amenities: ["wifi", "spa", "restaurant", "gym", "concierge", "room_service", "business_center", "laundry", "24_hour_front_desk"],
      rooms: [
        { roomNumber: "701", roomType: "Double", pricePerNight: 28000, maxGuests: 2, isAvailable: true },
        { roomNumber: "801", roomType: "Suite", pricePerNight: 55000, maxGuests: 3, isAvailable: true }
      ],
      priceStartingFrom: 28000,
      starRating: 5,
      averageRating: 4.7
    },
    // Business Hotels
    {
      name: "Conrad Tokyo",
      description: "A sophisticated business hotel in the heart of Tokyo's prestigious Shiodome district, offering modern luxury with panoramic city and Tokyo Bay views. Designed for the discerning business traveler, each room features cutting-edge technology, ergonomic workspaces, and floor-to-ceiling windows. The hotel's restaurants showcase innovative Japanese and international cuisine, while the spa provides a tranquil escape from the bustling city. With direct access to the JR Shimbashi Station and proximity to Ginza's luxury shopping district, the hotel offers unparalleled convenience. State-of-the-art meeting facilities and business services ensure successful conferences and events. The rooftop bar provides spectacular city views and signature cocktails.",
      imageUrls: [
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d",
        "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6"
      ],
      amenities: ["wifi", "business_center", "restaurant", "gym", "spa", "concierge", "room_service", "laundry", "24_hour_front_desk"],
      rooms: [
        { roomNumber: "2101", roomType: "Single", pricePerNight: 18000, maxGuests: 1, isAvailable: true },
        { roomNumber: "2201", roomType: "Double", pricePerNight: 22000, maxGuests: 2, isAvailable: true }
      ],
      priceStartingFrom: 18000,
      starRating: 4,
      averageRating: 4.5
    },
    {
      name: "The Langham New York",
      description: "A refined business hotel in Midtown Manhattan, combining classic elegance with modern amenities for the sophisticated traveler. Located in the heart of New York's business and cultural district, each room offers contemporary luxury with marble bathrooms and city views. The hotel's restaurant serves modern American cuisine with international influences, while the fitness center and spa provide relaxation after busy days. With easy access to Times Square, Central Park, and major corporate headquarters, the location is ideal for both business and leisure. Advanced meeting facilities and personalized business services ensure productive stays. The rooftop lounge offers panoramic city views and craft cocktails.",
      imageUrls: [
        "https://images.unsplash.com/photo-1566073771259-6a8506099945",
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b"
      ],
      amenities: ["wifi", "business_center", "restaurant", "gym", "concierge", "room_service", "laundry", "24_hour_front_desk", "parking"],
      rooms: [
        { roomNumber: "1501", roomType: "Single", pricePerNight: 25000, maxGuests: 1, isAvailable: true },
        { roomNumber: "1601", roomType: "Double", pricePerNight: 32000, maxGuests: 2, isAvailable: true }
      ],
      priceStartingFrom: 25000,
      starRating: 4,
      averageRating: 4.4
    },
    // Boutique Hotels
    {
      name: "Casa Bonay Barcelona",
      description: "A vibrant boutique hotel in the trendy Eixample district, where contemporary design meets local culture and artistic flair. This stylish property features individually designed rooms with vintage furnishings, local artwork, and modern amenities. The rooftop terrace offers stunning views of the city and serves craft cocktails and Mediterranean-inspired cuisine. The hotel's restaurant celebrates local ingredients and traditional Catalonian flavors with a modern twist. Located near Park Güell and the Sagrada Familia, guests can easily explore Barcelona's architectural wonders and vibrant neighborhoods. The hotel's curated art collection and design-forward spaces reflect the creative spirit of Barcelona.",
      imageUrls: [
        "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9",
        "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6"
      ],
      amenities: ["wifi", "restaurant", "gym", "balcony", "laundry", "24_hour_front_desk", "pet_friendly"],
      rooms: [
        { roomNumber: "301", roomType: "Single", pricePerNight: 8500, maxGuests: 1, isAvailable: true },
        { roomNumber: "401", roomType: "Double", pricePerNight: 12000, maxGuests: 2, isAvailable: true }
      ],
      priceStartingFrom: 8500,
      starRating: 3,
      averageRating: 4.3
    },
    {
      name: "The Hoxton Amsterdam",
      description: "A design-driven boutique hotel in the historic canal district, featuring individually styled rooms with vintage finds and modern comforts. Each room tells a unique story through carefully curated furnishings, local artwork, and thoughtful amenities. The hotel's restaurant and bar serve seasonal dishes and craft cocktails in a relaxed, welcoming atmosphere. Located in the heart of Amsterdam's cultural district, guests are steps from world-class museums, charming canals, and vibrant markets. The hotel's lobby serves as a community space where locals and travelers connect over coffee and conversation. Bicycle rentals provide the authentic Amsterdam experience of exploring the city's picturesque streets and waterways.",
      imageUrls: [
        "https://images.unsplash.com/photo-1590490360182-c33d57733427",
        "https://images.unsplash.com/photo-1584132967334-10e028bd69f7"
      ],
      amenities: ["wifi", "restaurant", "gym", "business_center", "laundry", "24_hour_front_desk", "pet_friendly"],
      rooms: [
        { roomNumber: "201", roomType: "Single", pricePerNight: 9500, maxGuests: 1, isAvailable: true },
        { roomNumber: "301", roomType: "Double", pricePerNight: 13500, maxGuests: 2, isAvailable: true }
      ],
      priceStartingFrom: 9500,
      starRating: 3,
      averageRating: 4.2
    },
    // Budget-Friendly Hotels
    {
      name: "Ibis Bangkok Riverside",
      description: "A modern budget hotel offering comfortable accommodations along the scenic Chao Phraya River. Featuring contemporary rooms with essential amenities and river views, this property provides excellent value for money without compromising on quality. The hotel's restaurant serves international cuisine with local Thai specialties, while the rooftop bar offers panoramic city views. With easy access to public transportation and major attractions like the Grand Palace and Wat Pho, guests can explore Bangkok's rich cultural heritage affordably. The hotel's location provides a peaceful riverside setting while maintaining connectivity to the city's business and entertainment districts.",
      imageUrls: [
        "https://images.unsplash.com/photo-1561501900-3701fa6a0864",
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d"
      ],
      amenities: ["wifi", "restaurant", "gym", "air_conditioning", "24_hour_front_desk", "laundry"],
      rooms: [
        { roomNumber: "501", roomType: "Single", pricePerNight: 3500, maxGuests: 1, isAvailable: true },
        { roomNumber: "601", roomType: "Double", pricePerNight: 4800, maxGuests: 2, isAvailable: true }
      ],
      priceStartingFrom: 3500,
      starRating: 2,
      averageRating: 3.8
    },
    {
      name: "Budget Inn Central London",
      description: "A practical and affordable hotel in central London, providing clean and comfortable accommodations for budget-conscious travelers. Located within walking distance of major attractions like the British Museum and Oxford Street, the hotel offers essential amenities and friendly service. Rooms feature modern furnishings, private bathrooms, and complimentary Wi-Fi. The continental breakfast provides a good start to exploring London's countless attractions. With easy access to public transportation, guests can efficiently navigate the city while staying within budget. The hotel's central location makes it an ideal base for first-time visitors to London.",
      imageUrls: [
        "https://images.unsplash.com/photo-1561501900-3701fa6a0864"
      ],
      amenities: ["wifi", "breakfast", "24_hour_front_desk", "laundry", "non_smoking"],
      rooms: [
        { roomNumber: "101", roomType: "Single", pricePerNight: 6500, maxGuests: 1, isAvailable: true },
        { roomNumber: "201", roomType: "Double", pricePerNight: 8500, maxGuests: 2, isAvailable: true }
      ],
      priceStartingFrom: 6500,
      starRating: 2,
      averageRating: 3.6
    },
    // Resort Hotels
    {
      name: "Four Seasons Resort Bali",
      description: "An exquisite tropical paradise nestled on the pristine beaches of Jimbaran Bay, where traditional Balinese architecture meets contemporary luxury. Each villa and suite features private terraces, some with infinity pools, offering breathtaking ocean or tropical garden views. The resort's restaurants showcase authentic Indonesian cuisine alongside international fine dining, with beachfront and cliffside settings. The award-winning spa provides traditional Balinese treatments using local ingredients and ancient healing techniques. With access to white sand beaches, water sports, and cultural excursions, guests can experience the best of Bali's natural beauty and rich heritage. The resort's kids' club and family-friendly amenities make it perfect for multigenerational travel.",
      imageUrls: [
        "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4",
        "https://images.unsplash.com/photo-1578662996442-48f60103fc96"
      ],
      amenities: ["wifi", "spa", "pool", "restaurant", "gym", "room_service", "concierge", "laundry", "balcony", "family_friendly"],
      rooms: [
        { roomNumber: "Villa1", roomType: "Suite", pricePerNight: 45000, maxGuests: 4, isAvailable: true },
        { roomNumber: "Villa2", roomType: "Suite", pricePerNight: 65000, maxGuests: 6, isAvailable: true }
      ],
      priceStartingFrom: 45000,
      starRating: 5,
      averageRating: 4.8
    },
    {
      name: "Atlantis The Palm Dubai",
      description: "An iconic resort destination on the crescent of Dubai's Palm Jumeirah, offering an unforgettable aquatic adventure combined with luxury accommodations. The resort features underwater suites with floor-to-ceiling aquarium views, spacious rooms with Arabian Gulf vistas, and exclusive beach access. Home to Aquaventure Waterpark, one of the world's largest water parks, and the Lost Chambers Aquarium with over 65,000 marine animals. Multiple world-class restaurants, including celebrity chef establishments, provide diverse culinary experiences. The ShuiQi Spa offers holistic treatments, while the private beach and pools provide relaxation. With dolphin encounters, water sports, and proximity to Dubai's attractions, the resort caters to families and adventure seekers.",
      imageUrls: [
        "https://images.unsplash.com/photo-1566073771259-6a8506099945",
        "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4"
      ],
      amenities: ["wifi", "spa", "pool", "restaurant", "gym", "room_service", "concierge", "laundry", "family_friendly", "balcony"],
      rooms: [
        { roomNumber: "2001", roomType: "Double", pricePerNight: 35000, maxGuests: 2, isAvailable: true },
        { roomNumber: "3001", roomType: "Suite", pricePerNight: 55000, maxGuests: 4, isAvailable: true }
      ],
      priceStartingFrom: 35000,
      starRating: 5,
      averageRating: 4.6
    },
    // Urban Hotels
    {
      name: "Park Hyatt Sydney",
      description: "Perfectly positioned on Sydney Harbour with unobstructed views of the Opera House and Harbour Bridge, this contemporary hotel offers an unparalleled Sydney experience. Each room and suite features floor-to-ceiling windows showcasing the iconic harbor views, while interiors reflect modern Australian design with Aboriginal art and natural materials. The hotel's restaurants celebrate local produce and seafood, with harbor-view dining terraces. The spa provides treatments inspired by Australian wellness traditions, while the fitness center overlooks the harbor. Located near the Royal Botanic Gardens and Circular Quay, guests can easily explore Sydney's attractions on foot. The hotel's private harbor-view bar offers signature cocktails and an extensive wine list featuring Australian vintages.",
      imageUrls: [
        "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9",
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b"
      ],
      amenities: ["wifi", "spa", "restaurant", "gym", "concierge", "room_service", "business_center", "laundry", "balcony"],
      rooms: [
        { roomNumber: "801", roomType: "Double", pricePerNight: 28000, maxGuests: 2, isAvailable: true },
        { roomNumber: "901", roomType: "Suite", pricePerNight: 48000, maxGuests: 3, isAvailable: true }
      ],
      priceStartingFrom: 28000,
      starRating: 5,
      averageRating: 4.7
    },
    {
      name: "The Silo Cape Town",
      description: "A striking boutique hotel housed in a converted grain silo, offering panoramic views of Table Mountain, the harbor, and the city below. This architectural marvel features individually designed rooms with floor-to-ceiling windows, bespoke furnishings, and contemporary African art. The rooftop bar and restaurant provide 360-degree views and modern South African cuisine. The Zeitz Museum of Contemporary African Art, located in the same building, offers world-class cultural experiences. With proximity to the V&A Waterfront, guests can explore shopping, dining, and entertainment options. The hotel's unique design and prime location make it a destination in itself, perfect for design enthusiasts and culture lovers.",
      imageUrls: [
        "https://images.unsplash.com/photo-1590490360182-c33d57733427",
        "https://images.unsplash.com/photo-1584132967334-10e028bd69f7"
      ],
      amenities: ["wifi", "restaurant", "gym", "spa", "concierge", "room_service", "laundry", "balcony"],
      rooms: [
        { roomNumber: "1201", roomType: "Double", pricePerNight: 22000, maxGuests: 2, isAvailable: true },
        { roomNumber: "1301", roomType: "Suite", pricePerNight: 38000, maxGuests: 3, isAvailable: true }
      ],
      priceStartingFrom: 22000,
      starRating: 4,
      averageRating: 4.5
    },
    // Heritage Hotels
    {
      name: "Hotel Imperial Vienna",
      description: "A grand palace hotel steeped in Habsburg history, where emperors once resided and world leaders continue to gather. This magnificent property, dating back to 1873, features opulent rooms and suites with period furnishings, crystal chandeliers, and marble bathrooms. The hotel's restaurants serve traditional Viennese cuisine alongside international fine dining, with the famous Café Imperial offering legendary pastries and coffee culture. Located on the prestigious Ringstrasse, guests are steps from the Vienna State Opera, St. Stephen's Cathedral, and imperial palaces. The hotel's rich history is evident in every detail, from the grand staircase to the museum-quality artwork adorning the walls.",
      imageUrls: [
        "https://images.unsplash.com/photo-1564501049412-61c2a3083791",
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d"
      ],
      amenities: ["wifi", "spa", "restaurant", "gym", "concierge", "room_service", "business_center", "laundry", "24_hour_front_desk"],
      rooms: [
        { roomNumber: "201", roomType: "Double", pricePerNight: 26000, maxGuests: 2, isAvailable: true },
        { roomNumber: "301", roomType: "Suite", pricePerNight: 45000, maxGuests: 3, isAvailable: true }
      ],
      priceStartingFrom: 26000,
      starRating: 5,
      averageRating: 4.6
    },
    {
      name: "The Gritti Palace Venice",
      description: "A legendary palace hotel on the Grand Canal, where Venetian nobility once lived and international dignitaries continue to stay. This 15th-century palace combines historical grandeur with contemporary luxury, featuring rooms and suites with hand-painted silk walls, Murano glass chandeliers, and breathtaking canal views. The hotel's restaurants showcase Venetian cuisine with modern interpretations, while the rooftop terrace offers panoramic city views. Located near St. Mark's Square and major attractions, guests can explore Venice's artistic treasures and romantic waterways. The hotel's private water taxi service provides elegant transportation through the canals, while the concierge arranges exclusive cultural experiences.",
      imageUrls: [
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b",
        "https://images.unsplash.com/photo-1590490360182-c33d57733427"
      ],
      amenities: ["wifi", "spa", "restaurant", "concierge", "room_service", "business_center", "laundry", "balcony"],
      rooms: [
        { roomNumber: "101", roomType: "Double", pricePerNight: 32000, maxGuests: 2, isAvailable: true },
        { roomNumber: "201", roomType: "Suite", pricePerNight: 58000, maxGuests: 3, isAvailable: true }
      ],
      priceStartingFrom: 32000,
      starRating: 5,
      averageRating: 4.8
    },
    // Mountain/Nature Hotels
    {
      name: "Amangani Jackson Hole",
      description: "A serene mountain retreat perched on a hillside overlooking the dramatic Jackson Hole valley and the Grand Teton mountain range. This contemporary lodge features floor-to-ceiling windows, natural materials, and minimalist design that highlights the stunning natural surroundings. Each suite offers panoramic mountain views, stone fireplaces, and private terraces. The spa provides treatments inspired by Native American traditions, while the restaurant serves locally sourced cuisine with global influences. With direct access to world-class skiing, hiking, and wildlife viewing, the hotel is perfect for outdoor enthusiasts. The infinity pool appears to merge with the landscape, while the library and lounges provide cozy spaces to appreciate the mountain views.",
      imageUrls: [
        "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa",
        "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6"
      ],
      amenities: ["wifi", "spa", "pool", "restaurant", "gym", "concierge", "room_service", "laundry", "balcony"],
      rooms: [
        { roomNumber: "101", roomType: "Suite", pricePerNight: 55000, maxGuests: 3, isAvailable: true },
        { roomNumber: "201", roomType: "Suite", pricePerNight: 75000, maxGuests: 4, isAvailable: true }
      ],
      priceStartingFrom: 55000,
      starRating: 5,
      averageRating: 4.9
    },
    // Additional Hotels for Variety
    {
      name: "The Fairmont Banff Springs",
      description: "A majestic castle-like resort nestled in the heart of the Canadian Rockies, offering breathtaking mountain views and world-class outdoor adventures. This historic property, known as the 'Castle in the Rockies,' features elegant rooms and suites with mountain or valley views, complemented by the natural hot springs and championship golf course. The hotel's restaurants showcase Canadian cuisine with international influences, while the spa provides alpine-inspired treatments. With access to Banff National Park, guests can enjoy hiking, skiing, wildlife viewing, and scenic drives. The hotel's rich history and stunning location make it a bucket-list destination for nature lovers and luxury travelers alike.",
      imageUrls: [
        "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9",
        "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4"
      ],
      amenities: ["wifi", "spa", "pool", "restaurant", "gym", "concierge", "room_service", "business_center", "laundry", "family_friendly"],
      rooms: [
        { roomNumber: "401", roomType: "Double", pricePerNight: 18000, maxGuests: 2, isAvailable: true },
        { roomNumber: "501", roomType: "Suite", pricePerNight: 32000, maxGuests: 4, isAvailable: true }
      ],
      priceStartingFrom: 18000,
      starRating: 4,
      averageRating: 4.4
    },
    // Eco-Friendly Hotels
    {
      name: "1 Hotels Central Park",
      description: "An innovative eco-luxury hotel overlooking Central Park, where sustainability meets sophisticated design. Each room features reclaimed materials, living plant walls, and floor-to-ceiling windows with park views. The hotel's farm-to-table restaurants use locally sourced, organic ingredients, while the rooftop bar offers panoramic city views and craft cocktails made with house-grown herbs. The spa incorporates natural and organic treatments, emphasizing wellness and environmental consciousness. With its prime location across from Central Park and near Lincoln Center, guests can enjoy both urban conveniences and natural beauty. The hotel's commitment to sustainability extends to every aspect of the guest experience.",
      imageUrls: [
        "https://images.unsplash.com/photo-1566073771259-6a8506099945",
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d"
      ],
      amenities: ["wifi", "spa", "restaurant", "gym", "concierge", "room_service", "business_center", "laundry", "pet_friendly"],
      rooms: [
        { roomNumber: "1501", roomType: "Double", pricePerNight: 28000, maxGuests: 2, isAvailable: true },
        { roomNumber: "1601", roomType: "Suite", pricePerNight: 48000, maxGuests: 3, isAvailable: true }
      ],
      priceStartingFrom: 28000,
      starRating: 4,
      averageRating: 4.5
    },
    // Tech-Forward Hotels
    {
      name: "Henn na Hotel Tokyo",
      description: "A futuristic hotel experience where technology meets hospitality, featuring robot staff and cutting-edge amenities. This innovative property offers compact, efficiently designed rooms with smart technology controls, holographic concierges, and automated services. Guests can enjoy facial recognition check-in, robot luggage assistance, and AI-powered room customization. The hotel's restaurant showcases molecular gastronomy and automated food preparation, while common areas feature interactive digital art installations. Located in Tokyo's tech district, the hotel provides easy access to electronics markets, startup incubators, and innovation centers. Perfect for tech enthusiasts and travelers seeking a glimpse into the future of hospitality.",
      imageUrls: [
        "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa",
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d"
      ],
      amenities: ["wifi", "restaurant", "gym", "24_hour_front_desk", "business_center", "laundry"],
      rooms: [
        { roomNumber: "3001", roomType: "Single", pricePerNight: 12000, maxGuests: 1, isAvailable: true },
        { roomNumber: "3101", roomType: "Double", pricePerNight: 16000, maxGuests: 2, isAvailable: true }
      ],
      priceStartingFrom: 12000,
      starRating: 3,
      averageRating: 4.1
    }
  ],

  reviews: [
    {
      rating: 5,
      comment: "Absolutely extraordinary experience at The Ritz-Carlton Tokyo! The views of Mount Fuji were breathtaking, and the service was flawless. Every detail was perfect, from the welcome ceremony to the goodbye gift. The spa treatments were divine, and the restaurants offered the most exquisite Japanese cuisine I've ever tasted. The staff anticipated every need with genuine warmth and professionalism. This hotel truly sets the gold standard for luxury hospitality.",
      userId: "user_luxury_1"
    },
    {
      rating: 5,
      comment: "Marina Bay Sands exceeded all expectations! The infinity pool experience was magical - swimming while overlooking the entire Singapore skyline is unforgettable. Our suite was elegantly appointed with stunning city views. The shopping and dining options within the resort are world-class. The concierge arranged private tours that showcased Singapore's hidden gems. Every moment was Instagram-worthy, but more importantly, genuinely memorable.",
      userId: "user_luxury_2"
    },
    {
      rating: 4,
      comment: "Conrad Tokyo is perfect for business travelers who appreciate luxury. The room's workspace was thoughtfully designed with all necessary amenities and stunning city views that inspired productivity. The hotel's location provided easy access to meetings throughout the city. The spa was a welcome retreat after long conference days. The restaurant's innovative fusion cuisine was exceptional. Minor issue with room service timing, but overall an outstanding stay.",
      userId: "user_business_1"
    },
    {
      rating: 5,
      comment: "Casa Bonay Barcelona captured the artistic soul of the city perfectly! Each corner of this boutique hotel tells a story through carefully curated design elements. The rooftop terrace became our favorite evening spot, offering panoramic city views and creative cocktails. The staff's local recommendations led us to hidden neighborhood gems we never would have discovered otherwise. The breakfast featured amazing local ingredients. A truly authentic Barcelona experience.",
      userId: "user_boutique_1"
    },
    {
      rating: 4,
      comment: "Ibis Bangkok Riverside offers incredible value along the beautiful Chao Phraya River. The rooms were clean, comfortable, and surprisingly spacious for the price point. The river views from our room were lovely, especially at sunset. The location provided easy access to major temples and markets via affordable boat transport. The restaurant served decent international food with some tasty Thai options. Great choice for budget-conscious travelers who don't want to sacrifice cleanliness and comfort.",
      userId: "user_budget_1"
    },
    {
      rating: 5,
      comment: "Four Seasons Resort Bali is paradise personified! Our villa with private infinity pool overlooking Jimbaran Bay was absolutely stunning. The traditional Balinese architecture blended seamlessly with modern luxury amenities. The spa treatments using local ingredients were transformative - I felt completely rejuvenated. The beachfront dining under the stars was romantic beyond words. The staff's attention to detail and genuine Balinese hospitality made our honeymoon truly magical.",
      userId: "user_resort_1"
    },
    {
      rating: 4,
      comment: "Park Hyatt Sydney's harbor views are simply unmatched! Waking up to see the Opera House and Harbour Bridge from our bed was a daily joy. The hotel's contemporary Australian design perfectly complemented the stunning location. The restaurants showcased excellent local seafood and wines. The spa treatments were relaxing after days of exploring Sydney's attractions. The only minor complaint was the high cost of parking, but the location convenience made it worthwhile.",
      userId: "user_urban_1"
    },
    {
      rating: 5,
      comment: "Hotel Imperial Vienna transported us back to the golden age of European hospitality! The opulent rooms with period furnishings and crystal chandeliers created an atmosphere of timeless elegance. The traditional Viennese breakfast was a culinary journey through local specialties. The location on the Ringstrasse put us within walking distance of incredible architecture, museums, and the famous opera house. The staff's knowledge of Vienna's history enriched our entire visit.",
      userId: "user_heritage_1"
    },
    {
      rating: 5,
      comment: "Amangani Jackson Hole offers the most serene luxury mountain experience imaginable! The views of the Grand Tetons from our suite took our breath away every morning. The infinity pool appeared to merge with the landscape, creating a meditative atmosphere. The spa treatments using Native American-inspired techniques were deeply relaxing. The guided wildlife tours arranged by the concierge allowed us to see elk, moose, and even a bear safely. Perfect for reconnecting with nature in ultimate comfort.",
      userId: "user_nature_1"
    },
    {
      rating: 4,
      comment: "1 Hotels Central Park perfectly balances luxury with environmental consciousness. The living plant walls in our room created a unique, fresh atmosphere, and the park views were constantly changing with the seasons. The farm-to-table restaurant served the most flavorful, organic cuisine. We appreciated the hotel's commitment to sustainability without compromising on comfort or service. The rooftop bar's herb garden added fresh flavors to creative cocktails. A responsible luxury choice.",
      userId: "user_eco_1"
    },
    {
      rating: 4,
      comment: "Henn na Hotel Tokyo is a fascinating glimpse into the future of hospitality! The robot check-in process was surprisingly smooth and entertaining. Our room's smart technology allowed us to control everything from lighting to temperature with simple voice commands. The molecular gastronomy restaurant was an adventure for the taste buds. While some tech features occasionally glitched, the innovative concept and central Tokyo location made for a memorable and unique stay.",
      userId: "user_tech_1"
    },
    {
      rating: 5,
      comment: "The Taj Mahal Palace Mumbai is living history! The architectural grandeur and attention to detail reflect India's royal heritage beautifully. Our suite overlooking the Gateway of India provided stunning harbor views. The Jiva Spa's Ayurvedic treatments were authentic and deeply therapeutic. The multiple restaurants offered everything from traditional Indian royal cuisine to contemporary international dishes. The staff's pride in their hotel's legacy and their warm hospitality made us feel like honored guests.",
      userId: "user_heritage_2"
    },
    {
      rating: 4,
      comment: "The Hoxton Amsterdam perfectly captures the city's creative spirit! Our uniquely designed room felt like staying in a local artist's stylish apartment. The hotel's location in the canal district put us steps away from charming cafes, vintage shops, and world-class museums. The complimentary bicycle rentals allowed us to explore Amsterdam like locals. The lobby's community atmosphere facilitated interesting conversations with fellow travelers and Amsterdam residents.",
      userId: "user_boutique_2"
    },
    {
      rating: 3,
      comment: "Budget Inn Central London provides solid value in an expensive city. The rooms are basic but clean and comfortable, with all essential amenities functioning well. The location near the British Museum is excellent for sightseeing on foot. The continental breakfast, while simple, provided good fuel for day-long explorations. The staff was helpful with directions and local recommendations. Perfect for travelers prioritizing location and cleanliness over luxury amenities.",
      userId: "user_budget_2"
    },
    {
      rating: 5,
      comment: "Burj Al Arab Dubai is the epitome of luxury hospitality! From the helicopter transfer to the gold-accented suite spanning two floors, every moment felt like a fairy tale. The personal butler service was exceptional - they anticipated needs we didn't even realize we had. The underwater restaurant provided a surreal dining experience surrounded by marine life. The private beach and pool area offered complete privacy and relaxation. This is luxury hospitality at its absolute pinnacle.",
      userId: "user_ultra_luxury_1"
    }
  ],

  bookings: [
    {
      userId: "user_31hF9t4hS5yL5SE3kHLzY9Z3Nb4",
      checkIn: new Date("2024-12-15"),
      checkOut: new Date("2024-12-18"), 
      numberOfGuests: 2,
      totalPrice: 75000,
      paymentStatus: "PAID"
    },
    {
      userId: "user_31hF9t4hS5yL5SE3kHLzY9Z3Nb4",
      checkIn: new Date("2025-01-10"),
      checkOut: new Date("2025-01-15"),
      numberOfGuests: 1,
      totalPrice: 90000,
      paymentStatus: "PENDING"
    },
    {
      userId: "user_luxury_1", 
      checkIn: new Date("2024-11-20"),
      checkOut: new Date("2024-11-25"),
      numberOfGuests: 2,
      totalPrice: 180000,
      paymentStatus: "PAID"
    },
    {
      userId: "user_business_1",
      checkIn: new Date("2024-10-15"),
      checkOut: new Date("2024-10-18"),
      numberOfGuests: 1,
      totalPrice: 54000,
      paymentStatus: "PAID"
    }
  ],

  billingProfiles: [
    {
      userId: "user_31hF9t4hS5yL5SE3kHLzY9Z3Nb4",
      address: "123 Marina Bay Avenue",
      mobile: "+65 9123 4567",
      city: "Singapore",
      country: "Singapore",
      currency: "USD",
      isDefault: true,
      isActive: true
    },
    {
      userId: "user_luxury_1",
      address: "456 Shibuya Crossing",
      mobile: "+81 90 1234 5678",
      city: "Tokyo", 
      country: "Japan",
      currency: "USD",
      isDefault: true,
      isActive: true
    },
    {
      userId: "user_business_1",
      address: "789 Business District",
      mobile: "+65 8765 4321",
      city: "Singapore",
      country: "Singapore", 
      currency: "USD",
      isDefault: true,
      isActive: true
    },
    {
      userId: "user_boutique_1",
      address: "321 Eixample District",
      mobile: "+34 612 345 678",
      city: "Barcelona",
      country: "Spain",
      currency: "EUR",
      isDefault: true,
      isActive: true
    },
    {
      userId: "user_resort_1",
      address: "555 Beach Road",
      mobile: "+1 555 123 4567",
      city: "Miami",
      country: "United States",
      currency: "USD",
      isDefault: true,
      isActive: true
    },
    {
      userId: "user_heritage_1",
      address: "777 Imperial Plaza",
      mobile: "+43 664 123 4567",
      city: "Vienna",
      country: "Austria",
      currency: "EUR",
      isDefault: true,
      isActive: true
    }
  ]
};

export const seedDatabase = async () => {
  try {
    console.log('🌱 Starting comprehensive database seeding with 20+ diverse hotels...');

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
    console.log('📍 Seeding global locations...');
    const createdLocations = await Location.insertMany(seedData.locations);
    console.log(`✅ Created ${createdLocations.length} locations across ${new Set(createdLocations.map(l => l.country)).size} countries`);

    // Seed hotels with location references and enhanced embeddings
    console.log('🏨 Seeding diverse hotels with enhanced embeddings...');
    const hotelsWithLocationsAndEmbeddings = [];
    
    for (let i = 0; i < seedData.hotels.length; i++) {
      const hotel = seedData.hotels[i];
      const location = createdLocations[i % createdLocations.length];
      
      console.log(`🤖 Generating enhanced embedding for ${hotel.name}...`);
      
      try {
        // Enhanced embedding text including star rating, price, and customer rating
        const embeddingText = `${hotel.name} ${hotel.description} ${hotel.amenities.join(' ')} ${location.city} ${location.country} ${hotel.starRating} star rating price starting from ${hotel.priceStartingFrom} customer rating ${hotel.averageRating} luxury hotel accommodation`;
        const embedding = await generateEmbedding(embeddingText);
        
        hotelsWithLocationsAndEmbeddings.push({
          ...hotel,
          location: location._id,
          embedding: embedding
        });
        
        console.log(`✅ Generated enhanced embedding for ${hotel.name} (${hotel.starRating}⭐, $${hotel.priceStartingFrom}, ${hotel.averageRating}🌟)`);
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
    console.log(`✅ Created ${createdHotels.length} diverse hotels with enhanced embeddings`);

    // Seed reviews with hotel references
    console.log('⭐ Seeding detailed reviews...');
    const reviewsWithHotels = seedData.reviews.map((review, index) => ({
      ...review,
      hotelId: createdHotels[index % createdHotels.length]._id
    }));
    const createdReviews = await Review.insertMany(reviewsWithHotels);
    console.log(`✅ Created ${createdReviews.length} detailed reviews`);

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

    // Seed billing profiles
    console.log('💳 Seeding billing profiles...');
    const createdBillingProfiles = await BillingProfile.insertMany(seedData.billingProfiles);
    console.log(`✅ Created ${createdBillingProfiles.length} billing profiles`);

    console.log('🎉 Comprehensive database seeding completed successfully!');
    console.log(`
📊 Detailed Summary:
   🌍 ${createdLocations.length} Global Locations (${new Set(createdLocations.map(l => l.country)).size} Countries)
   🏨 ${createdHotels.length} Diverse Hotels:
      - ${createdHotels.filter(h => h.starRating === 5).length} Five-Star Luxury Hotels
      - ${createdHotels.filter(h => h.starRating === 4).length} Four-Star Hotels  
      - ${createdHotels.filter(h => h.starRating === 3).length} Three-Star Boutique Hotels
      - ${createdHotels.filter(h => h.starRating === 2).length} Budget-Friendly Hotels
   ⭐ ${createdReviews.length} Detailed Reviews
   📅 ${createdBookings.length} Sample Bookings
   💳 ${createdBillingProfiles.length} Billing Profiles
   
   🏷️ Hotel Categories Included:
   - Luxury Palace Hotels
   - Business Hotels
   - Boutique Design Hotels
   - Budget-Friendly Options
   - Resort Destinations
   - Heritage Properties
   - Eco-Luxury Hotels
   - Tech-Forward Hotels
   - Mountain Retreats
   - Urban Destinations
    `);

  } catch (error) {
    console.error('❌ Comprehensive seeding failed:', error);
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
      console.log('✨ Comprehensive seeding process completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Comprehensive seeding process failed:', error);
      process.exit(1);
    });
}

export default seedDatabase;