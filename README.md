# IntelliStay - AI-Powered Hotel Management & Booking Platform

A comprehensive hotel management and booking platform featuring advanced AI search capabilities, multi-role architecture, and complete hotel lifecycle management. Built with MERN stack and integrated with cutting-edge AI technologies for natural language processing and semantic search.

## 🌟 Key Features

### For Travelers
- 🤖 **AI-Powered Search**: Natural language hotel search with RAG (Retrieval-Augmented Generation)
- 🧠 **Smart Feature Extraction**: AI automatically extracts preferences from user queries
- 🏨 **Semantic Recommendations**: Vector-based hotel matching using embeddings
- � **Secure Payments**: PayHere payment gateway integration
- ⭐ **Review System**: Complete booking review and rating functionality
- 📱 **Responsive Design**: Mobile-first, seamless experience

### For Hotel Owners
- 🏢 **Property Management**: Complete hotel and room management dashboard  
- 🏠 **Dynamic Room Control**: Add, edit, and manage room inventory
- 📊 **Booking Analytics**: Real-time booking insights and revenue tracking
- 👥 **Guest Management**: Customer booking details and communication
- 📸 **Media Management**: Cloudinary integration for image uploads

### For Administrators
- 🔍 **Hotel Approval Workflow**: Review and approve new hotel listings
- 🚫 **Rejection Management**: Handle rejections with detailed feedback
- �️ **Platform Administration**: Complete system oversight and management

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 18 + Vite
- **Language**: JavaScript (ES6+)
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: Redux Toolkit + RTK Query
- **Authentication**: Clerk
- **UI Components**: Lucide React icons, Swiper.js carousel
- **Form Handling**: React Hook Form + Zod validation

### Backend
- **Runtime**: Node.js + Express.js
- **Language**: TypeScript
- **Database**: MongoDB + Mongoose ODM
- **Authentication**: Clerk Express SDK
- **Validation**: Zod schema validation
- **File Upload**: Multer + Cloudinary
- **AI Integration**: OpenAI API
- **Payment Processing**: PayHere (Sri Lankan payment gateway)

### Infrastructure & DevOps
- **Database**: MongoDB Atlas (Cloud)
- **Media Storage**: Cloudinary
- **Deployment**: Vercel (Frontend), Railway/Heroku (Backend)
- **Development**: Hot reloading with Nodemon



## 📁 Project Structure

```
IntelliStay/
├── backend/
│   ├── src/
│   │   ├── api/                    # API routes & middleware
│   │   │   ├── admin.ts           # Admin management endpoints
│   │   │   ├── booking.ts         # Booking & review management
│   │   │   ├── hotel.ts           # Hotel CRUD & AI search
│   │   │   ├── location.ts        # Location services
│   │   │   ├── billingProfile.ts  # User billing profiles
│   │   │   └── middleware/        # Authentication & validation
│   │   ├── application/           # Business logic layer
│   │   │   ├── admin.ts          # Admin operations
│   │   │   ├── booking.ts        # Booking workflows
│   │   │   ├── hotel.ts          # Hotel management
│   │   │   ├── review.ts         # Review system
│   │   │   ├── location.ts       # Location services
│   │   │   ├── billingProfile.ts # Billing operations
│   │   │   └── utils/            # AI & utility functions
│   │   │       ├── embeddings.ts      # OpenAI vector embeddings
│   │   │       ├── hotelEmbedding.ts  # Hotel semantic search
│   │   │       ├── aiFilterExtraction.ts # AI feature extraction
│   │   │       ├── filterHotels.ts    # Hotel filtering logic
│   │   │       └── payhere.ts         # Payment integration
│   │   ├── domain/               # Domain models & DTOs
│   │   │   ├── dtos/            # Data transfer objects
│   │   │   │   ├── BookingDTO.ts
│   │   │   │   ├── ReviewDTO.ts
│   │   │   │   ├── RoomDTO.ts
│   │   │   │   ├── SearchHotelDTO.ts
│   │   │   │   └── BillingProfileDTO.ts
│   │   │   └── errors/          # Custom error classes
│   │   ├── infrastructure/       # Data access layer
│   │   │   ├── database.ts      # MongoDB connection
│   │   │   ├── clerk.ts         # Authentication setup
│   │   │   ├── seed.ts          # Database seeding
│   │   │   ├── updatePrices.ts  # Price update utilities
│   │   │   └── entities/        # Mongoose models
│   │   │       ├── Hotel.ts     # Hotel schema
│   │   │       ├── Booking.ts   # Booking schema
│   │   │       ├── Review.ts    # Review schema
│   │   │       ├── Location.ts  # Location schema
│   │   │       ├── Amenity.ts   # Amenity schema
│   │   │       └── BillingProfile.ts
│   │   └── types/               # TypeScript definitions
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/              # shadcn/ui components
│   │   │   ├── layouts/         # Layout components
│   │   │   ├── NotFound/        # Error pages
│   │   │   ├── Header.jsx       # Navigation with auth
│   │   │   ├── HomeHero.jsx     # AI search hero section
│   │   │   ├── HotelCard.jsx    # Hotel display cards
│   │   │   ├── BookingCard.jsx  # Customer booking cards
│   │   │   ├── OwnerBookingCard.jsx # Owner booking management
│   │   │   ├── ReviewModal.jsx  # Review creation modal
│   │   │   ├── HotelReviews.jsx # Review display component
│   │   │   ├── BillingProfileDialog.jsx
│   │   │   ├── AISearchResults.jsx
│   │   │   ├── HotelRecommendations.jsx
│   │   │   └── ImageUpload.jsx  # Cloudinary integration
│   │   ├── pages/
│   │   │   ├── Home.jsx         # Landing page
│   │   │   ├── Hotels.jsx       # Hotel listing
│   │   │   ├── HotelView.jsx    # Hotel details & reviews
│   │   │   ├── Bookings.jsx     # User bookings
│   │   │   ├── OwnerBookings.jsx # Owner dashboard
│   │   │   ├── BecomePartner.jsx # Hotel registration
│   │   │   ├── RoomManagement.jsx # Room inventory management
│   │   │   ├── AdminHotelRequests.jsx # Admin approval system
│   │   │   ├── Contact.jsx      # Contact page
│   │   │   └── SignIn.jsx       # Authentication
│   │   ├── store/
│   │   │   ├── api.js           # RTK Query API
│   │   │   ├── store.js         # Redux store
│   │   │   └── features/        # Redux slices
│   │   ├── hooks/               # Custom React hooks
│   │   ├── schemas/             # Form validation schemas
│   │   └── utils/               # Utility functions
│   ├── package.json
│   └── vite.config.js
```

## 🤖 AI Features Implementation

### Advanced Search Capabilities
- **RAG (Retrieval-Augmented Generation)**: Combines vector search with contextual understanding
- **Feature Extraction**: AI automatically extracts filters from natural language queries
- **Vector Embeddings**: Hotel descriptions converted to semantic embeddings for similarity matching
- **Query Understanding**: Handles complex queries like "romantic beachfront resort under $300 with spa"

### Smart Review System
- **Contextual Reviews**: AI-enhanced review analysis and categorization
- **Rating Analytics**: Intelligent rating aggregation and insights
- **Review Recommendations**: Personalized review prompts based on booking experience

### Multi-Role Architecture
- **Guest Users**: AI-powered search, booking, and review management
- **Hotel Owners**: Property and room management with booking analytics
- **Administrators**: Platform oversight with hotel approval workflows

### Payment & Security
- **PayHere Gateway**: Secure Sri Lankan payment processing
- **Webhook Integration**: Real-time payment verification
- **Role-based Access**: Clerk authentication with granular permissions

## 🔌 API Endpoints

### Hotels
- `GET /hotels` - Get all hotels with filters
- `GET /hotels/:id` - Get hotel details  
- `GET /hotels/:id/reviews` - Get hotel reviews
- `GET /hotels/search/ai` - AI-powered semantic search
- `POST /hotels/createHotel` - Create new hotel (Owner) 🔐
- `GET /hotels/owner/my-hotels` - Get owner's hotels 🔐
- `POST /hotels/:id/rooms` - Add room to hotel 🔐
- `POST /hotels/:id/embedding` - Generate hotel embeddings

### Bookings & Reviews
- `POST /bookings` - Create new booking 🔐
- `GET /bookings/user/:userId` - Get user bookings 🔐  
- `GET /bookings/owner` - Get owner's property bookings 🔐
- `POST /bookings/reviews/:bookingId` - Create booking review 🔐
- `POST /bookings/payment/notify` - PayHere payment webhook

### Admin
- `GET /admin/hotel-requests` - Get pending hotel approvals 🔐
- `PUT /admin/approve/:id` - Approve hotel 🔐
- `PUT /admin/reject/:id` - Reject hotel with reason 🔐

### Locations & Billing
- `GET /locations` - Get all locations
- `POST /billing-profiles` - Create billing profile 🔐
- `GET /billing-profiles/user/:userId` - Get user billing profile 🔐

*🔐 = Authentication Required*



## 🔍 AI Search Examples

### Natural Language Queries
```javascript
// Example queries that work:
"Find me a luxury 5-star hotel in Paris with spa facilities"
"Romantic beachfront resort under Rs. 30,000 per night" 
"Pet-friendly accommodation in Tokyo with free WiFi and breakfast"
"Budget hotel near downtown with parking and gym"
"Family-friendly resort with pool and kids activities"
```

### AI Implementation Details
- **RAG Architecture**: Combines retrieval with generation for contextual results
- **Feature Extraction**: Automatically identifies location, price, amenities from queries
- **Vector Similarity**: Uses OpenAI embeddings for semantic hotel matching
- **Smart Filtering**: AI converts natural language to structured database filters

## 👥 User Workflows

### Guest Experience
1. **AI Search** → Enter natural language query for hotels
2. **Browse Results** → View AI-ranked hotel recommendations  
3. **Hotel Details** → Read reviews, check amenities and pricing
4. **Secure Booking** → Complete payment with PayHere integration
5. **Post-Stay Review** → Rate and review your experience

### Hotel Owner Experience  
1. **Property Registration** → Submit hotel for admin approval
2. **Room Management** → Add rooms, set pricing, upload images
3. **Booking Analytics** → Monitor reservations and revenue
4. **Guest Reviews** → Respond to customer feedback

### Admin Experience
1. **Hotel Approval** → Review new property submissions
2. **Quality Control** → Approve/reject with detailed feedback
3. **Platform Management** → Oversee system operations

## � Performance & Security

### Optimizations
- **Vector Search**: Fast semantic similarity matching
- **Database Indexing**: Optimized MongoDB queries for search performance
- **CDN Integration**: Cloudinary for optimized image delivery
- **Caching**: RTK Query for efficient API state management

### Security Features
- **Clerk Authentication**: Enterprise-grade user authentication
- **Role-based Access**: Granular permissions for different user types
- **Payment Security**: Encrypted PayHere gateway integration
- **Data Validation**: Comprehensive Zod schema validation


## �👨‍💻 Author

**Prabhash Wara**
- GitHub: [@prabhashwara07](https://github.com/prabhashwara07)
- Repository: [IntelliStay](https://github.com/prabhashwara07/IntelliStay)

## 🙏 Acknowledgments

- **OpenAI** for GPT and embedding capabilities
- **Clerk** for authentication and user management
- **MongoDB Atlas** for cloud database hosting
- **Tailwind CSS & shadcn/ui** for beautiful UI components
- **Cloudinary** for media storage and optimization
- **PayHere** for payment gateway services
