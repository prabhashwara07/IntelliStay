import { Request, Response, NextFunction } from "express";
import Hotel from "../infrastructure/entities/Hotel";
import Location from "../infrastructure/entities/Location";
import { Types } from "mongoose";
import { fetchHotelDetailsForEmbedding, buildHotelEmbeddingText } from "./utils/hotelEmbedding";
import { generateEmbedding } from "./utils/embeddings";
import { BadRequestError, ValidationError } from "../domain/errors";
import { SearchHotelDTO } from "../domain/dtos/SearchHotelDTO";
import { CreateRoomDTO } from "../domain/dtos/RoomDTO";
import { getAuth } from "@clerk/express";
import { extractFiltersFromQuery } from "./utils/aiFilterExtraction";
import { searchAndFilterHotels, SearchAndFilterOptions } from "./utils/filterHotels";

// Extend Request type to include user from Clerk
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    [key: string]: any;
  };
}


export const getAllHotels = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { 
      country, 
      search, 
      minPrice, 
      maxPrice, 
      starRating, 
      amenities, 
      onlyTopRated 
    } = req.query as { 
      country?: string;
      search?: string;
      minPrice?: string;
      maxPrice?: string;
      starRating?: string | string[];
      amenities?: string | string[];
      onlyTopRated?: string;
    };

    // Get all hotels with basic query
    const hotels = await Hotel.find({})
      .populate('location')
      .select('_id name description imageUrls starRating averageRating priceStartingFrom amenities location status rooms')
      .lean();

    // Parse filters for the search function
    const parsedFilters: SearchAndFilterOptions = {
      country,
      search,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      starRating: starRating 
        ? (Array.isArray(starRating) ? starRating : [starRating]).map(r => parseInt(r)).filter(r => !isNaN(r))
        : undefined,
      amenities: amenities 
        ? (Array.isArray(amenities) ? amenities : [amenities])
        : undefined,
      onlyTopRated: onlyTopRated === 'true' || onlyTopRated === 'on'
    };

    // Use the extracted search and filter function
    const filteredHotels = searchAndFilterHotels(hotels as any, parsedFilters);

    // Transform data for frontend
    const transformedHotels = filteredHotels.map((hotel: any) => ({
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
  } catch (error) {
    next(error);
  }
};


export const getHotelById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params as { id: string };

    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid hotel ID format" });
    }

    const [hotel] = await Hotel.aggregate([
      { 
        $match: { 
          _id: new Types.ObjectId(id),
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
  } catch (error) {
    next(error);
  }
};

export const generateHotelEmbedding = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params as { id: string };
    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid hotel ID format" });
    }

    const details = await fetchHotelDetailsForEmbedding(id);
    if (!details) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    const text = buildHotelEmbeddingText(details);
    const embedding = await generateEmbedding(text);

    await Hotel.updateOne({ _id: new Types.ObjectId(id) }, { $set: { embedding } });

    res.status(200).json({ id, updated: true, dimensions: embedding.length });
  } catch (error) {
    next(error);
  }
};



export const createHotel = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { 
      hotelName, 
      description, 
      location: locationString, 
      amenities, 
      imageUrls 
    } = req.body;

    const userId = getAuth(req).userId;

    if (!hotelName || !description || !locationString || !amenities) {
      throw new ValidationError("Hotel name, description, location, and amenities are required");
    }

    if (!Array.isArray(amenities) || amenities.length === 0) {
      throw new ValidationError("At least one amenity must be selected");
    }

    if (!Array.isArray(imageUrls) || imageUrls.length === 0 || imageUrls.length > 3) {
      throw new ValidationError("Between 1-3 hotel images are required");
    }

    const locationParts = locationString.split(',').map((part: string) => part.trim());
    if (locationParts.length !== 2) {
      throw new ValidationError("Location must be in format: 'City, Country'");
    }

    const [city, country] = locationParts;

    let locationDoc = await Location.findOne({ 
      city: { $regex: new RegExp(`^${city}$`, 'i') },
      country: { $regex: new RegExp(`^${country}$`, 'i') }
    });

    if (!locationDoc) {
      locationDoc = new Location({
        city,
        country,
      });
      await locationDoc.save();
    }

    const newHotel = new Hotel({
      name: hotelName.trim(),
      description: description.trim(),
      location: locationDoc._id,
      imageUrls: imageUrls.filter((url: string) => url && url.trim()), // Remove empty URLs
      amenities: amenities,
      
      rooms: [],
      reviews: [],
      priceStartingFrom: 5000,
      starRating: 1,
      averageRating: 1,
      
      status: 'pending',
      ownerId: userId,
      submittedAt: new Date()
    });

    await newHotel.save();
    
    res.status(201).json({
      success: true,
      message: "Hotel submitted successfully! It will be reviewed within 24 hours."
    });

  } catch (error) {
    next(error);
  }
}

export const getAllHotelsBySearchQuery = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = SearchHotelDTO.safeParse(req.query);
    if (!result.success) {
      throw new ValidationError(`${result.error.message}`);
    }
    const { query } = result.data;

    console.log('[AI Search] Processing query:', query);
    const extractedFilters = await extractFiltersFromQuery(query);
    console.log('[AI Search] Extracted filters:', extractedFilters);

    const queryEmbedding = await generateEmbedding(query);

    const hotels = await Hotel.aggregate([
      {
        $vectorSearch: {
          index: "hotelVectorIndex",
          path: "embedding",
          queryVector: queryEmbedding,
          numCandidates: 150,
          limit: 50,
        },
      },
      // Pre-filter for basic requirements
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
      {
        $addFields: {
          vectorScore: { $meta: "vectorSearchScore" }
        }
      },
      // FIXED: Include status, rooms, and full amenities array
      {
        $project: {
          _id: 1,
          name: 1,
          description: 1,
          imageUrls: 1,  // Keep full array for flexibility
          starRating: 1,
          averageRating: 1,
          priceStartingFrom: 1,
          amenities: 1,  // FIXED: Don't slice here - let searchAndFilterHotels handle it
          status: 1,     // FIXED: Include for searchAndFilterHotels validation
          rooms: 1,      // FIXED: Include for searchAndFilterHotels validation
          location: {
            city: "$locationDetails.city",
            country: "$locationDetails.country"
          },
          vectorScore: 1
        }
      },
      {
        $sort: { vectorScore: -1 }
      }
    ]);

    console.log(`[AI Search] Vector search returned ${hotels.length} candidates`);

    // Debug: Log first hotel to see structure
    if (hotels.length > 0) {
      console.log('[AI Search] Sample hotel structure:', {
        hasStatus: !!hotels[0].status,
        hasRooms: !!hotels[0].rooms,
        location: hotels[0].location,
        amenitiesCount: hotels[0].amenities?.length
      });
    }

    const searchOptions: SearchAndFilterOptions = {
      minPrice: extractedFilters.priceRange?.min,
      maxPrice: extractedFilters.priceRange?.max,
      starRating: extractedFilters.starRating,
      amenities: extractedFilters.amenities,
      onlyTopRated: extractedFilters.onlyTopRated,
      city: extractedFilters.location?.city,
      country: extractedFilters.location?.country,
    };

    console.log('[AI Search] Applying filters:', searchOptions);

    const filteredHotels = searchAndFilterHotels(hotels, searchOptions);

    console.log(`[AI Search] Returning ${filteredHotels.length} hotels after hard filtering`);

    // Transform data for frontend response
    const transformedHotels = filteredHotels.map((hotel: any) => ({
      _id: hotel._id,
      name: hotel.name,
      description: hotel.description,
      imageUrl: hotel.imageUrls?.[0] || null,
      starRating: hotel.starRating,
      averageRating: hotel.averageRating,
      priceStartingFrom: hotel.priceStartingFrom,
      amenities: hotel.amenities?.slice(0, 8) || [],  // Slice here instead
      location: {
        city: hotel.location?.city,
        country: hotel.location?.country
      },
      relevanceScore: hotel.vectorScore
    }));

    res.status(200).json({
      success: true,
      query: query,
      extractedFilters: extractedFilters,
      count: transformedHotels.length,
      data: transformedHotels
    });
  } catch (error) {
    console.error('Error in getAllHotelsBySearchQuery:', error);
    next(error);
  }
};


// List hotels owned by the authenticated user (including pending/approved)
export const getOwnerHotels = async (req: Request, res: Response, next: NextFunction) => {
  try {
    
    const userId = getAuth(req).userId;
    
    const hotels = await Hotel.find({ ownerId: userId }).select('_id name status').lean();
    res.status(200).json({ success: true, data: hotels });
  } catch (error) {
    next(error);
  }
};

// Create a room under a hotel (owner only)
export const createRoom = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = getAuth(req).userId;
   

    const parsed = CreateRoomDTO.safeParse({ ...req.body, hotelId: req.params.id });
    if (!parsed.success) {
      throw new ValidationError(parsed.error.message);
    }
    const { hotelId, roomNumber, roomType, pricePerNight, maxGuests, isAvailable } = parsed.data;

    if (!Types.ObjectId.isValid(hotelId)) {
      throw new BadRequestError('Invalid hotel ID');
    }

    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }

    if (hotel.ownerId !== userId) {
      return res.status(403).json({ message: 'You do not have permission to modify this hotel' });
    }

    const exists = hotel.rooms?.some((r: any) => r.roomNumber === roomNumber);
    if (exists) {
      throw new ValidationError('A room with this number already exists for this hotel');
    }

    hotel.rooms.push({ roomNumber, roomType, pricePerNight, maxGuests, isAvailable: isAvailable ?? true } as any);

    
    const allPrices = (hotel.rooms || []).map((r: any) => r.pricePerNight);
    const minPrice = Math.min(...allPrices);
    hotel.priceStartingFrom = isFinite(minPrice) ? minPrice : hotel.priceStartingFrom;

    await hotel.save();

    
    try {
      const details = await fetchHotelDetailsForEmbedding(hotelId);
      if (details) {
        const text = buildHotelEmbeddingText(details);
        const embedding = await generateEmbedding(text);
        await Hotel.updateOne({ _id: new Types.ObjectId(hotelId) }, { $set: { embedding } });
      }
    } catch (embedErr) {
      console.warn('Embedding generation failed after room creation:', embedErr);
    }

    res.status(201).json({ success: true, message: 'Room added successfully' });
  } catch (error) {
    next(error);
  }
};

