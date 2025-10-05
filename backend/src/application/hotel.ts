import { Request, Response, NextFunction } from "express";
import Hotel from "../infrastructure/entities/Hotel";
import Location from "../infrastructure/entities/Location";
import { Types } from "mongoose";
import { fetchHotelDetailsForEmbedding, buildHotelEmbeddingText } from "./utils/hotelEmbedding";
import { generateEmbedding } from "./utils/embeddings";
import { BadRequestError, ValidationError } from "../domain/errors";
import { SearchHotelDTO } from "../domain/dtos/SearchHotelDTO";


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

    let query: any = {};
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

    const hotels = await Hotel.find(query)
      .populate(populateOptions)
      .select('_id name description imageUrls starRating averageRating priceStartingFrom amenities location')
      .lean();

    // Apply additional filters that require populated data or text search
    let filteredHotels = hotels;

    // Country filtering
    if (country && country.trim().length > 0) {
      filteredHotels = filteredHotels.filter((hotel: any) => 
        hotel.location?.country?.toLowerCase() === country.toLowerCase()
      );
    }

    // Search by name or location (case-insensitive)
    if (search && search.trim().length > 0) {
      const searchTerm = search.toLowerCase().trim();
      filteredHotels = filteredHotels.filter((hotel: any) => {
        const nameMatch = hotel.name?.toLowerCase().includes(searchTerm);
        const cityMatch = hotel.location?.city?.toLowerCase().includes(searchTerm);
        const countryMatch = hotel.location?.country?.toLowerCase().includes(searchTerm);
        return nameMatch || cityMatch || countryMatch;
      });
    }

    // Sort by rating (highest first) and then by price (lowest first)
    filteredHotels.sort((a: any, b: any) => {
      // First sort by average rating (descending)
      if (b.averageRating !== a.averageRating) {
        return (b.averageRating || 0) - (a.averageRating || 0);
      }
      // Then sort by price (ascending)
      return (a.priceStartingFrom || 0) - (b.priceStartingFrom || 0);
    });

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

    // Validate ObjectId
    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid hotel ID format" });
    }

    const [hotel] = await Hotel.aggregate([
      { $match: { _id: new Types.ObjectId(id) } },
      
      // Lookup location details
      {
        $lookup: {
          from: "locations",
          localField: "location",
          foreignField: "_id",
          as: "locationDetails"
        }
      },
      { $unwind: { path: "$locationDetails", preserveNullAndEmptyArrays: true } },
      
      // Lookup and populate reviews with user details
      {
        $lookup: {
          from: "reviews",
          localField: "reviews",
          foreignField: "_id",
          as: "reviewDetails"
        }
      },
      
      // Calculate detailed room and pricing statistics
      {
        $addFields: {
          totalReviews: { $size: "$reviewDetails" },
          
          // Calculate price range from rooms
          priceRange: {
            minPrice: { $min: "$rooms.pricePerNight" },
            maxPrice: { $max: "$rooms.pricePerNight" }
          },
          
          // Separate available and unavailable rooms
          availableRooms: {
            $filter: {
              input: "$rooms",
              cond: { $eq: ["$$this.isAvailable", true] }
            }
          },
          unavailableRooms: {
            $filter: {
              input: "$rooms",
              cond: { $eq: ["$$this.isAvailable", false] }
            }
          },
          
          // Group rooms by type for better organization
          roomsByType: {
            $reduce: {
              input: "$rooms",
              initialValue: {},
              in: {
                $mergeObjects: [
                  "$$value",
                  {
                    $switch: {
                      branches: [
                        {
                          case: { $eq: ["$$this.roomType", "Single"] },
                          then: {
                            Single: {
                              $concatArrays: [
                                { $ifNull: ["$$value.Single", []] },
                                ["$$this"]
                              ]
                            }
                          }
                        },
                        {
                          case: { $eq: ["$$this.roomType", "Double"] },
                          then: {
                            Double: {
                              $concatArrays: [
                                { $ifNull: ["$$value.Double", []] },
                                ["$$this"]
                              ]
                            }
                          }
                        },
                        {
                          case: { $eq: ["$$this.roomType", "Suite"] },
                          then: {
                            Suite: {
                              $concatArrays: [
                                { $ifNull: ["$$value.Suite", []] },
                                ["$$this"]
                              ]
                            }
                          }
                        }
                      ],
                      default: "$$value"
                    }
                  }
                ]
              }
            }
          }
        }
      },
      
      // Final projection with all hotel details
      {
        $project: {
          _id: 1,
          name: 1,
          description: 1,
          imageUrls: 1,
          amenities: 1,
          
          // Location information
          location: {
            _id: "$locationDetails._id",
            city: "$locationDetails.city",
            country: "$locationDetails.country",
            coordinates: "$locationDetails.coordinates"
          },
          
          // Room information with detailed breakdown
          rooms: "$rooms",
          availableRooms: 1,
          unavailableRooms: 1,
          roomsByType: 1,
          totalRooms: { $size: "$rooms" },
          availableRoomsCount: { $size: "$availableRooms" },
          
          // Pricing information (using stored values + calculated range)
          priceRange: 1,
          priceStartingFrom: 1,  // Direct from stored field
          
          // Rating information (using stored values)
          starRating: 1,         // Direct from stored field
          averageRating: 1,      // Direct from stored field
          totalReviews: 1,
          
          // Reviews with detailed information
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
          
          // Metadata
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

export const createHotel = async (req: Request, res: Response, next: NextFunction) => {

  

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

    const queryEmbedding = await generateEmbedding(query);

    const hotels = await Hotel.aggregate([
      {
        $vectorSearch: {
          index: "hotelVectorIndex",
          path: "embedding",
          queryVector: queryEmbedding,
          numCandidates: 100,  // Increased for better results
          limit: 8,           // Return more results
          // Optional: Add filters if needed
          // filter: {
          //   averageRating: { $gte: 4.0 },
          //   priceStartingFrom: { $lte: 10000 }
          // }
        },
      },
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
  } catch (error) {
    next(error);
  }
};