"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchHotelDetailsForEmbedding = fetchHotelDetailsForEmbedding;
exports.buildHotelEmbeddingText = buildHotelEmbeddingText;
const mongoose_1 = require("mongoose");
const Hotel_1 = __importDefault(require("../../infrastructure/entities/Hotel"));
async function fetchHotelDetailsForEmbedding(hotelId) {
    if (!mongoose_1.Types.ObjectId.isValid(hotelId))
        return null;
    const [hotel] = await Hotel_1.default.aggregate([
        { $match: { _id: new mongoose_1.Types.ObjectId(hotelId) } },
        {
            $lookup: {
                from: "locations",
                localField: "location",
                foreignField: "_id",
                as: "locationDoc",
            }
        },
        { $unwind: { path: "$locationDoc", preserveNullAndEmptyArrays: true } },
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
                averageRating: {
                    $cond: [
                        { $gt: [{ $size: "$reviewDetails" }, 0] },
                        { $round: [{ $avg: "$reviewDetails.rating" }, 1] },
                        0
                    ]
                },
                priceRange: {
                    minPrice: { $min: "$rooms.pricePerNight" },
                    maxPrice: { $max: "$rooms.pricePerNight" },
                }
            }
        },
        {
            $project: {
                _id: 1,
                name: 1,
                description: 1,
                amenities: 1,
                rooms: { roomType: 1, pricePerNight: 1 },
                location: {
                    city: "$locationDoc.city",
                    country: "$locationDoc.country"
                },
                priceRange: 1,
                averageRating: 1,
            }
        }
    ]);
    return hotel || null;
}
function buildHotelEmbeddingText(details) {
    const sections = [];
    sections.push(`Hotel Name: ${details.name || ""}`);
    if (details.description)
        sections.push(`Description: ${details.description}`);
    const city = details.location?.city;
    const country = details.location?.country;
    if (city || country)
        sections.push(`Location: ${[city, country].filter(Boolean).join(", ")}`);
    if (details.priceRange?.minPrice != null) {
        const min = details.priceRange.minPrice;
        const max = details.priceRange?.maxPrice;
        if (max != null && max !== min) {
            sections.push(`Price Range (per night): LKR ${min} - LKR ${max}`);
        }
        else {
            sections.push(`Starting Price (per night): LKR ${min}`);
        }
    }
    if (Array.isArray(details.rooms) && details.rooms.length > 0) {
        const roomTypes = Array.from(new Set(details.rooms.map(r => r.roomType).filter(Boolean))).join(", ");
        sections.push(`Room Types: ${roomTypes}`);
    }
    if (Array.isArray(details.amenities) && details.amenities.length > 0) {
        sections.push(`Amenities: ${details.amenities.join(", ")}`);
    }
    if (typeof details.averageRating === "number") {
        sections.push(`Average Rating: ${details.averageRating} out of 5`);
    }
    return sections.join("\n");
}
//# sourceMappingURL=hotelEmbedding.js.map