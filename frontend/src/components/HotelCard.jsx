import React from "react";
import { Star, StarHalf, Plus, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { getAmenityIcons, AmenityIcon } from "@/src/utils/amenities";

export default function HotelCard({ hotel, onViewDetails }) {
  const coverImage =
    hotel.imageUrl || "https://via.placeholder.com/400x250?text=Hotel";
  const priceFrom =
    typeof hotel.priceStartingFrom === "number"
      ? hotel.priceStartingFrom
      : null;
  const starRating =
    typeof hotel.starRating === "number" ? hotel.starRating : 0;
  const averageRating =
    typeof hotel.averageRating === "number" ? hotel.averageRating : 0;
  const amenityIcons = getAmenityIcons(hotel.amenities, 7);
  const totalAmenities = Array.isArray(hotel.amenities)
    ? hotel.amenities.length
    : 0;

  // Helper function to render star rating display
  const renderStarRating = (rating, size = "h-3.5 w-3.5") => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Star key={i} className={`${size} text-yellow-500 fill-current`} />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <StarHalf
            key={i}
            className={`${size} text-yellow-500 fill-current`}
          />
        );
      } else {
        stars.push(<Star key={i} className={`${size} text-gray-300`} />);
      }
    }
    return stars;
  };

  const handleClick = () => {
    if (onViewDetails) {
      onViewDetails(hotel._id);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <Card
      role="button"
      tabIndex={0}
      aria-label={`View ${hotel.name}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className="overflow-hidden hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 group border bg-card flex flex-col h-full cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg p-0 gap-0"
    >
      <div className="relative overflow-hidden">
        <img
          src={coverImage}
          alt={hotel.name}
          className="w-full h-48 object-cover object-center group-hover:scale-105 transition-transform duration-300 rounded-t-lg bg-black/50 backdrop-blur-sm"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/10" />

        {/* Hotel Star Rating Badge */}
        {starRating > 0 && (
          <div className="absolute top-3 left-3 flex items-center gap-1 rounded-full bg-white/95 px-3 py-1.5 text-xs font-medium shadow-sm backdrop-blur-sm">
            <div className="flex items-center">
              {renderStarRating(starRating, "h-3 w-3")}
            </div>
            <span className="text-gray-800 font-semibold ml-1">
              {starRating}-Star
            </span>
          </div>
        )}

        {priceFrom !== null && (
          <Badge className="absolute top-3 right-3 bg-primary text-primary-foreground border-0 font-semibold backdrop-blur-sm">
            From Rs {priceFrom.toLocaleString("en-LK")}
          </Badge>
        )}
      </div>

      <CardHeader className="pb-2 pt-4 flex-shrink-0">
        <div className="flex items-start justify-between gap-3 mb-3">
          <h4 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors leading-tight line-clamp-2 flex-1">
            {hotel.name}
          </h4>
          
          {/* Customer Rating */}
          {averageRating > 0 && (
            <div className="flex flex-col items-end text-right flex-shrink-0">
              <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded-md">
                <Star className="h-3.5 w-3.5 text-yellow-500 fill-current" />
                <span className="font-bold text-sm text-green-800">
                  {averageRating.toFixed(1)}
                </span>
              </div>
              
            </div>
          )}
        </div>

        <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">
          {hotel.description}
        </p>
      </CardHeader>

      {amenityIcons.length > 0 && (
        <CardContent className="pt-0 pb-4 flex-shrink-0 mt-auto">
          <div className="border-t pt-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 flex-wrap">
                {amenityIcons.map((amenity) => (
                  <div key={amenity.key} className="group relative">
                    <AmenityIcon
                      amenityKey={amenity.key}
                      className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors"
                    />
                    
                  </div>
                ))}
              </div>
              
              {totalAmenities > amenityIcons.length && (
                <div className="flex items-center gap-1 text-muted-foreground bg-gray-50 px-2 py-1 rounded-md">
                  <Plus className="h-3 w-3" />
                  <span className="text-xs font-medium">
                    {totalAmenities - amenityIcons.length} more
                  </span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
