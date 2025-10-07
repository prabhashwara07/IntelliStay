"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRoom = exports.getOwnerHotels = exports.getAllHotelsBySearchQuery = exports.createHotel = exports.generateHotelEmbedding = exports.getHotelById = exports.getAllHotels = void 0;
const Hotel_1 = __importDefault(require("../infrastructure/entities/Hotel"));
const Location_1 = __importDefault(require("../infrastructure/entities/Location"));
const mongoose_1 = require("mongoose");
const hotelEmbedding_1 = require("./utils/hotelEmbedding");
const embeddings_1 = require("./utils/embeddings");
const errors_1 = require("../domain/errors");
const SearchHotelDTO_1 = require("../domain/dtos/SearchHotelDTO");
const RoomDTO_1 = require("../domain/dtos/RoomDTO");
const express_1 = require("@clerk/express");
const getAllHotels = async (req, res, next) => {
    try {
        const { country, search, minPrice, maxPrice, starRating, amenities, onlyTopRated } = req.query;
        let query = {
            status: 'approved',
            rooms: { $exists: true, $ne: [] }
        };
        let populateOptions = 'location';
        // Build the MongoDB query based on filters
        // Price range filtering
        if (minPrice || maxPrice) {
            query.priceStartingFrom = {};
            if (minPrice) {
                query.priceStartingFrom.$gte = parseFloat(minPrice);
            }
            if (maxPrice) {
                query.priceStartingFrom.$lte = parseFloat(maxPrice);
            }
        }
        // Star rating filtering (can be multiple values)
        if (starRating) {
            const ratings = Array.isArray(starRating) ? starRating : [starRating];
            const numericRatings = ratings.map(r => parseInt(r)).filter(r => !isNaN(r));
            if (numericRatings.length > 0) {
                query.starRating = { $in: numericRatings };
            }
        }
        // Amenities filtering (can be multiple values)
        if (amenities) {
            const amenitiesList = Array.isArray(amenities) ? amenities : [amenities];
            if (amenitiesList.length > 0) {
                // Filter for hotels that have ALL of the selected amenities (AND logic)
                query.amenities = { $all: amenitiesList };
            }
        }
        // Top rated filtering (4.5+ rating)
        if (onlyTopRated === 'true' || onlyTopRated === 'on') {
            query.averageRating = { $gte: 4.5 };
        }
        const hotels = await Hotel_1.default.find(query)
            .populate(populateOptions)
            .select('_id name description imageUrls starRating averageRating priceStartingFrom amenities location')
            .lean();
        // Apply additional filters that require populated data or text search
        let filteredHotels = hotels;
        // Country filtering
        if (country && country.trim().length > 0) {
            filteredHotels = filteredHotels.filter((hotel) => hotel.location?.country?.toLowerCase() === country.toLowerCase());
        }
        // Search by name or location (case-insensitive)
        if (search && search.trim().length > 0) {
            const searchTerm = search.toLowerCase().trim();
            filteredHotels = filteredHotels.filter((hotel) => {
                const nameMatch = hotel.name?.toLowerCase().includes(searchTerm);
                const cityMatch = hotel.location?.city?.toLowerCase().includes(searchTerm);
                const countryMatch = hotel.location?.country?.toLowerCase().includes(searchTerm);
                return nameMatch || cityMatch || countryMatch;
            });
        }
        // Sort by rating (highest first) and then by price (lowest first)
        filteredHotels.sort((a, b) => {
            // First sort by average rating (descending)
            if (b.averageRating !== a.averageRating) {
                return (b.averageRating || 0) - (a.averageRating || 0);
            }
            // Then sort by price (ascending)
            return (a.priceStartingFrom || 0) - (b.priceStartingFrom || 0);
        });
        // Transform data for frontend
        const transformedHotels = filteredHotels.map((hotel) => ({
            _id: hotel._id,
            name: hotel.name,
            description: hotel.description,
            imageUrl: hotel.imageUrls?.[0] || null,
            starRating: hotel.starRating,
            averageRating: hotel.averageRating,
            priceStartingFrom: hotel.priceStartingFrom,
            amenities: hotel.amenities?.slice(0, 8) || [],
            location: {
                city: hotel.location?.city,
                country: hotel.location?.country
            }
        }));
        res.status(200).json({
            success: true,
            count: transformedHotels.length,
            filters: {
                country,
                search,
                priceRange: { min: minPrice, max: maxPrice },
                starRating: starRating ? (Array.isArray(starRating) ? starRating : [starRating]) : null,
                amenities: amenities ? (Array.isArray(amenities) ? amenities : [amenities]) : null,
                onlyTopRated: onlyTopRated === 'true' || onlyTopRated === 'on'
            },
            data: transformedHotels
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getAllHotels = getAllHotels;
const getHotelById = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!mongoose_1.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid hotel ID format" });
        }
        const [hotel] = await Hotel_1.default.aggregate([
            {
                $match: {
                    _id: new mongoose_1.Types.ObjectId(id),
                    status: 'approved',
                    rooms: { $exists: true, $ne: [] }
                }
            },
            {
                $lookup: {
                    from: "locations",
                    localField: "location",
                    foreignField: "_id",
                    as: "locationDetails"
                }
            },
            { $unwind: { path: "$locationDetails", preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: "reviews",
                    localField: "reviews",
                    foreignField: "_id",
                    as: "reviewDetails"
                }
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    description: 1,
                    imageUrls: 1,
                    amenities: 1,
                    location: {
                        _id: "$locationDetails._id",
                        city: "$locationDetails.city",
                        country: "$locationDetails.country",
                        coordinates: "$locationDetails.coordinates"
                    },
                    rooms: 1,
                    totalRooms: { $size: "$rooms" },
                    priceRange: {
                        minPrice: { $min: "$rooms.pricePerNight" },
                        maxPrice: { $max: "$rooms.pricePerNight" }
                    },
                    priceStartingFrom: 1,
                    starRating: 1,
                    averageRating: 1,
                    totalReviews: { $size: "$reviewDetails" },
                    reviews: {
                        $map: {
                            input: "$reviewDetails",
                            as: "review",
                            in: {
                                _id: "$$review._id",
                                rating: "$$review.rating",
                                comment: "$$review.comment",
                                userId: "$$review.userId",
                                createdAt: "$$review.createdAt"
                            }
                        }
                    },
                    createdAt: 1,
                    updatedAt: 1
                }
            }
        ]);
        if (!hotel) {
            return res.status(404).json({ message: "Hotel not found" });
        }
        res.status(200).json(hotel);
    }
    catch (error) {
        next(error);
    }
};
exports.getHotelById = getHotelById;
const generateHotelEmbedding = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!mongoose_1.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid hotel ID format" });
        }
        const details = await (0, hotelEmbedding_1.fetchHotelDetailsForEmbedding)(id);
        if (!details) {
            return res.status(404).json({ message: "Hotel not found" });
        }
        const text = (0, hotelEmbedding_1.buildHotelEmbeddingText)(details);
        const embedding = await (0, embeddings_1.generateEmbedding)(text);
        await Hotel_1.default.updateOne({ _id: new mongoose_1.Types.ObjectId(id) }, { $set: { embedding } });
        res.status(200).json({ id, updated: true, dimensions: embedding.length });
    }
    catch (error) {
        next(error);
    }
};
exports.generateHotelEmbedding = generateHotelEmbedding;
const createHotel = async (req, res, next) => {
    try {
        const { hotelName, description, location: locationString, amenities, imageUrls } = req.body;
        const userId = (0, express_1.getAuth)(req).userId;
        if (!hotelName || !description || !locationString || !amenities) {
            throw new errors_1.ValidationError("Hotel name, description, location, and amenities are required");
        }
        if (!Array.isArray(amenities) || amenities.length === 0) {
            throw new errors_1.ValidationError("At least one amenity must be selected");
        }
        if (!Array.isArray(imageUrls) || imageUrls.length === 0 || imageUrls.length > 3) {
            throw new errors_1.ValidationError("Between 1-3 hotel images are required");
        }
        const locationParts = locationString.split(',').map((part) => part.trim());
        if (locationParts.length !== 2) {
            throw new errors_1.ValidationError("Location must be in format: 'City, Country'");
        }
        const [city, country] = locationParts;
        let locationDoc = await Location_1.default.findOne({
            city: { $regex: new RegExp(`^${city}$`, 'i') },
            country: { $regex: new RegExp(`^${country}$`, 'i') }
        });
        if (!locationDoc) {
            locationDoc = new Location_1.default({
                city,
                country,
            });
            await locationDoc.save();
        }
        const newHotel = new Hotel_1.default({
            name: hotelName.trim(),
            description: description.trim(),
            location: locationDoc._id,
            imageUrls: imageUrls.filter((url) => url && url.trim()), // Remove empty URLs
            amenities: amenities,
            rooms: [],
            reviews: [],
            priceStartingFrom: 5000,
            starRating: 0,
            averageRating: 0,
            status: 'pending',
            ownerId: userId,
            submittedAt: new Date()
        });
        await newHotel.save();
        res.status(201).json({
            success: true,
            message: "Hotel submitted successfully! It will be reviewed within 24 hours."
        });
    }
    catch (error) {
        next(error);
    }
};
exports.createHotel = createHotel;
const getAllHotelsBySearchQuery = async (req, res, next) => {
    try {
        const result = SearchHotelDTO_1.SearchHotelDTO.safeParse(req.query);
        if (!result.success) {
            throw new errors_1.ValidationError(`${result.error.message}`);
        }
        const { query } = result.data;
        const queryEmbedding = await (0, embeddings_1.generateEmbedding)(query);
        const hotels = await Hotel_1.default.aggregate([
            {
                $vectorSearch: {
                    index: "hotelVectorIndex",
                    path: "embedding",
                    queryVector: queryEmbedding,
                    numCandidates: 100, // Increased for better results
                    limit: 8, // Return more results
                },
            },
            // Ensure hotels have at least one room (array non-empty) after vector search
            { $match: { rooms: { $exists: true, $ne: [] } } },
            { $match: { status: { $eq: "approved" } } },
            // Lookup location details
            {
                $lookup: {
                    from: "locations",
                    localField: "location",
                    foreignField: "_id",
                    as: "locationDetails"
                }
            },
            {
                $unwind: {
                    path: "$locationDetails",
                    preserveNullAndEmptyArrays: true
                }
            },
            // Calculate review statistics if needed
            {
                $lookup: {
                    from: "reviews",
                    localField: "reviews",
                    foreignField: "_id",
                    as: "reviewDetails"
                }
            },
            {
                $addFields: {
                    totalReviews: { $size: "$reviewDetails" },
                    vectorScore: { $meta: "vectorSearchScore" }
                }
            },
            // Final projection with correct field names
            {
                $project: {
                    _id: 1,
                    name: 1,
                    description: 1,
                    imageUrl: { $arrayElemAt: ["$imageUrls", 0] }, // Get first image
                    imageUrls: 1,
                    starRating: 1,
                    averageRating: 1,
                    priceStartingFrom: 1,
                    amenities: { $slice: ["$amenities", 8] }, // Limit amenities
                    location: {
                        city: "$locationDetails.city",
                        country: "$locationDetails.country"
                    },
                    totalReviews: 1,
                    score: "$vectorScore", // Relevance score from vector search
                    // Don't return the actual embedding or review details
                }
            },
            // Sort by relevance score (highest first)
            {
                $sort: { score: -1 }
            }
        ]);
        res.status(200).json({
            success: true,
            query: query,
            count: hotels.length,
            data: hotels
        });
    }
    catch (error) {
        console.error('Error in getAllHotelsBySearchQuery:', error);
        next(error);
    }
};
exports.getAllHotelsBySearchQuery = getAllHotelsBySearchQuery;
// List hotels owned by the authenticated user (including pending/approved)
const getOwnerHotels = async (req, res, next) => {
    try {
        const userId = (0, express_1.getAuth)(req).userId;
        const hotels = await Hotel_1.default.find({ ownerId: userId }).select('_id name status').lean();
        res.status(200).json({ success: true, data: hotels });
    }
    catch (error) {
        next(error);
    }
};
exports.getOwnerHotels = getOwnerHotels;
// Create a room under a hotel (owner only)
const createRoom = async (req, res, next) => {
    try {
        const userId = (0, express_1.getAuth)(req).userId;
        const parsed = RoomDTO_1.CreateRoomDTO.safeParse({ ...req.body, hotelId: req.params.id });
        if (!parsed.success) {
            throw new errors_1.ValidationError(parsed.error.message);
        }
        const { hotelId, roomNumber, roomType, pricePerNight, maxGuests, isAvailable } = parsed.data;
        if (!mongoose_1.Types.ObjectId.isValid(hotelId)) {
            throw new errors_1.BadRequestError('Invalid hotel ID');
        }
        const hotel = await Hotel_1.default.findById(hotelId);
        if (!hotel) {
            return res.status(404).json({ message: 'Hotel not found' });
        }
        if (hotel.ownerId !== userId) {
            return res.status(403).json({ message: 'You do not have permission to modify this hotel' });
        }
        const exists = hotel.rooms?.some((r) => r.roomNumber === roomNumber);
        if (exists) {
            throw new errors_1.ValidationError('A room with this number already exists for this hotel');
        }
        hotel.rooms.push({ roomNumber, roomType, pricePerNight, maxGuests, isAvailable: isAvailable ?? true });
        const allPrices = (hotel.rooms || []).map((r) => r.pricePerNight);
        const minPrice = Math.min(...allPrices);
        hotel.priceStartingFrom = isFinite(minPrice) ? minPrice : hotel.priceStartingFrom;
        await hotel.save();
        try {
            const details = await (0, hotelEmbedding_1.fetchHotelDetailsForEmbedding)(hotelId);
            if (details) {
                const text = (0, hotelEmbedding_1.buildHotelEmbeddingText)(details);
                const embedding = await (0, embeddings_1.generateEmbedding)(text);
                await Hotel_1.default.updateOne({ _id: new mongoose_1.Types.ObjectId(hotelId) }, { $set: { embedding } });
            }
        }
        catch (embedErr) {
            console.warn('Embedding generation failed after room creation:', embedErr);
        }
        res.status(201).json({ success: true, message: 'Room added successfully' });
    }
    catch (error) {
        next(error);
    }
};
exports.createRoom = createRoom;
//# sourceMappingURL=hotel.js.map