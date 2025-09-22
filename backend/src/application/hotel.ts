import { Request, Response, NextFunction } from "express";
import Hotel from "../infrastructure/entities/Hotel";
import Location from "../infrastructure/entities/Location";
import { Types } from "mongoose";
import { fetchHotelDetailsForEmbedding, buildHotelEmbeddingText } from "./utils/hotelEmbedding";
import { generateEmbedding } from "./utils/embeddings";


export const getAllHotels = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { country } = req.query as { country?: string };

    const pipeline: any[] = [];

    if (country && country.trim().length > 0) {
      const escaped = country.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      pipeline.push(
        {
          $lookup: {
            from: "locations",
            localField: "location",
            foreignField: "_id",
            as: "locationDoc",
          }
        },
        { $unwind: "$locationDoc" },
        { $match: { "locationDoc.country": { $regex: `^${escaped}$`, $options: "i" } } },
      );
    }

    pipeline.push(
      {
        $lookup: {
          from: "reviews",
          let: { hotelId: "$_id" },
          pipeline: [
            { $match: { $expr: { $eq: ["$hotelId", "$$hotelId"] } } },
            { $project: { rating: 1 } }
          ],
          as: "reviewsDocs"
        }
      },
      {
        $addFields: {
          rating: {
            $cond: [
              { $gt: [{ $size: "$reviewsDocs" }, 0] },
              { $round: [{ $avg: "$reviewsDocs.rating" }, 1] },
              0
            ]
          },
          priceFrom: { $min: "$rooms.pricePerNight" },
          imageUrl: { $ifNull: [{ $arrayElemAt: ["$imageUrls", 0] }, null] }
        }
      },
      {
        $project: {
          _id: 1,
          name: 1,
          description: 1,
          imageUrl: 1,
          priceFrom: 1,
          rating: 1,
          amenities: { $slice: ["$amenities", 8] }
        }
      }
    );

    const hotels = await Hotel.aggregate(pipeline);
    res.status(200).json(hotels);
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
      
      // Calculate rating statistics
      {
        $addFields: {
          // Calculate average rating and review count
          averageRating: {
            $cond: [
              { $gt: [{ $size: "$reviewDetails" }, 0] },
              { $round: [{ $avg: "$reviewDetails.rating" }, 1] },
              0
            ]
          },
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
          
          // Group rooms by type
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
          
          // Room information
          rooms: "$rooms",
          availableRooms: 1,
          unavailableRooms: 1,
          roomsByType: 1,
          totalRooms: { $size: "$rooms" },
          availableRoomsCount: { $size: "$availableRooms" },
          
          // Pricing information
          priceRange: 1,
          
          // Rating and review information
          averageRating: 1,
          totalReviews: 1,
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