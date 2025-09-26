import { Request, Response, NextFunction } from "express";
import Hotel from "../infrastructure/entities/Hotel";
import Location from "../infrastructure/entities/Location";
import { Types } from "mongoose";
import { fetchHotelDetailsForEmbedding, buildHotelEmbeddingText } from "./utils/hotelEmbedding";
import { generateEmbedding } from "./utils/embeddings";


export const getAllHotels = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { country } = req.query as { country?: string };

    let query = {};
    let populateOptions = '';

    // If country filter is needed, we need to populate location
    if (country && country.trim().length > 0) {
      populateOptions = 'location';
    }

    const hotels = await Hotel.find(query)
      .populate(populateOptions)
      .select('_id name description imageUrls starRating averageRating priceStartingFrom amenities location')
      .lean();

    // Filter by country if specified and add imageUrl
    let filteredHotels = hotels;
    if (country && country.trim().length > 0) {
      filteredHotels = hotels.filter((hotel: any) => 
        hotel.location?.country?.toLowerCase() === country.toLowerCase()
      );
    }

    // Transform data for frontend
    const transformedHotels = filteredHotels.map((hotel: any) => ({
      _id: hotel._id,
      name: hotel.name,
      description: hotel.description,
      imageUrl: hotel.imageUrls?.[0] || null,
      starRating: hotel.starRating,
      averageRating: hotel.averageRating,
      priceStartingFrom: hotel.priceStartingFrom,
      amenities: hotel.amenities?.slice(0, 8) || []
    }));

    res.status(200).json(transformedHotels);
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