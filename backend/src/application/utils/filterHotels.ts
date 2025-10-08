export interface SearchAndFilterOptions {
  // Hard filters (from AI-extracted filters)
  minPrice?: number;
  maxPrice?: number;
  starRating?: number[];        // e.g., [4, 5]
  amenities?: string[];         // e.g., ["wifi", "pool"]
  onlyTopRated?: boolean;       // 4.5+ rating
  
  // Text search filters
  country?: string;
  search?: string;              // Search in name, city, country
  
  // Location-based (from AI)
  city?: string;
}

export interface HotelDocument {
  _id: any;
  name: string;
  description?: string;
  imageUrls?: string[];
  starRating?: number;
  averageRating?: number;
  priceStartingFrom?: number;
  amenities?: string[];
  location?: {
    city?: string;
    country?: string;
  };
  status?: string;
  rooms?: any[];
}

/**
 * Applies comprehensive filtering and sorting to hotel documents
 * Perfect for post-processing RAG/vector search results with hard filters
 * 
 * @param hotels - Array of hotel documents (from RAG, MongoDB, or any source)
 * @param filters - Filter options including price, rating, amenities, location
 * @returns Filtered and sorted array of hotels
 */
export function searchAndFilterHotels(
  hotels: HotelDocument[],
  filters: SearchAndFilterOptions = {}
): HotelDocument[] {
  let filteredHotels = [...hotels];

  // === HARD FILTERS (Database-level logic applied in-memory) ===
  
  // Status and rooms validation
  filteredHotels = filteredHotels.filter(hotel => 
    hotel.status === 'approved' && 
    hotel.rooms && 
    Array.isArray(hotel.rooms) && 
    hotel.rooms.length > 0
  );

  // Price range filtering
  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    filteredHotels = filteredHotels.filter(hotel => {
      const price = hotel.priceStartingFrom || 0;
      
      if (filters.minPrice !== undefined && price < filters.minPrice) {
        return false;
      }
      if (filters.maxPrice !== undefined && price > filters.maxPrice) {
        return false;
      }
      return true;
    });
  }

  // Star rating filtering (can be multiple values - OR logic)
  if (filters.starRating && filters.starRating.length > 0) {
    filteredHotels = filteredHotels.filter(hotel => 
      hotel.starRating !== undefined && 
      filters.starRating!.includes(hotel.starRating)
    );
  }

  // Amenities filtering (AND logic - hotel must have ALL specified amenities)
  if (filters.amenities && filters.amenities.length > 0) {
    filteredHotels = filteredHotels.filter(hotel => {
      if (!hotel.amenities || hotel.amenities.length === 0) {
        return false;
      }
      // Check if hotel has ALL required amenities
      return filters.amenities!.every(requiredAmenity => 
        hotel.amenities!.includes(requiredAmenity)
      );
    });
  }

  // Top rated filtering (4.5+ rating)
  if (filters.onlyTopRated === true) {
    filteredHotels = filteredHotels.filter(hotel => 
      (hotel.averageRating || 0) >= 4.5
    );
  }

  // === TEXT SEARCH FILTERS (Post-processing filters) ===

  // Country filtering (exact match, case-insensitive)
  if (filters.country && filters.country.trim().length > 0) {
    const countryLower = filters.country.toLowerCase().trim();
    filteredHotels = filteredHotels.filter(hotel => 
      hotel.location?.country?.toLowerCase() === countryLower
    );
  }

  // City filtering (exact match, case-insensitive)
  if (filters.city && filters.city.trim().length > 0) {
    const cityLower = filters.city.toLowerCase().trim();
    filteredHotels = filteredHotels.filter(hotel => 
      hotel.location?.city?.toLowerCase() === cityLower
    );
  }

  // Search by name or location (partial match, case-insensitive)
  if (filters.search && filters.search.trim().length > 0) {
    const searchTerm = filters.search.toLowerCase().trim();
    filteredHotels = filteredHotels.filter(hotel => {
      const nameMatch = hotel.name?.toLowerCase().includes(searchTerm);
      const cityMatch = hotel.location?.city?.toLowerCase().includes(searchTerm);
      const countryMatch = hotel.location?.country?.toLowerCase().includes(searchTerm);
      return nameMatch || cityMatch || countryMatch;
    });
  }

  // === SORTING ===
  // Sort by rating (highest first) and then by price (lowest first)
  filteredHotels.sort((a, b) => {
    // First sort by average rating (descending)
    const ratingDiff = (b.averageRating || 0) - (a.averageRating || 0);
    if (ratingDiff !== 0) {
      return ratingDiff;
    }
    // Then sort by price (ascending)
    return (a.priceStartingFrom || 0) - (b.priceStartingFrom || 0);
  });

  return filteredHotels;
}
