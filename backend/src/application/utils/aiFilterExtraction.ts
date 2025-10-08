import OpenAI from 'openai';
import dotenv from 'dotenv';
import Location from '../../infrastructure/entities/Location';
import { Amenity } from '../../infrastructure/entities/Amenity';

dotenv.config();

export interface ExtractedFilters {
  priceRange?: { min?: number; max?: number };
  location?: { city?: string; country?: string };
  amenities?: string[];
  starRating?: number[];      // Array of ratings like [4, 5]
  onlyTopRated?: boolean;     // 4.5+ rating filter
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Cache for database data to avoid repeated queries
let cachedLocations: { cities: string[], countries: string[] } | null = null;
let cachedAmenities: string[] | null = null;

async function getAvailableOptions() {
  // Load and cache locations
  if (!cachedLocations) {
    const locations = await Location.find({}).select('city country').lean();
    const cities = [...new Set(locations.map(loc => loc.city).filter(Boolean))];
    const countries = [...new Set(locations.map(loc => loc.country).filter(Boolean))];
    cachedLocations = { cities, countries };
  }

  // Load and cache amenities
  if (!cachedAmenities) {
    cachedAmenities = await Amenity.distinct('key');
  }

  return {
    locations: cachedLocations,
    amenities: cachedAmenities
  };
}

export async function extractFiltersFromQuery(userQuery: string): Promise<ExtractedFilters> {
  try {
    // Get actual available options from database
    const { locations, amenities } = await getAvailableOptions();

    const prompt = `You are a hotel search filter extraction assistant. Extract filters from the user's natural language query and return ONLY valid JSON.

**Available Options from Database:**

Countries: ${locations.countries.join(', ')}
Cities: ${locations.cities.slice(0, 50).join(', ')}${locations.cities.length > 50 ? ' (and more)' : ''}
Amenities: ${amenities.join(', ')}

**Output JSON Schema:**
{
  "priceRange": { "min": number, "max": number },
  "location": { 
    "city": string,     // Match to cities list (recognize variations/synonyms)
    "country": string   // Match to countries list (recognize abbreviations like UK, US, UAE)
  },
  "amenities": [string],    // Match to amenities list (recognize synonyms)
  "starRating": [number],   // Hotel classification (1-5 stars) - for "3 star hotel", "5 star hotel"
  "onlyTopRated": boolean   // Customer reviews (4.5+ avg rating) - for "highly rated", "top rated", "excellent reviews"
}

**IMPORTANT: Two Different Rating Types**

1. **starRating** = Hotel classification by stars (1-5 star hotels)
   - Use when: "3 star hotel", "5 star hotel", "four star", "luxury hotel" (5 stars)
   - Based on: Hotel amenities, service level, official classification
   - Examples: "3 star" → [3], "4 or 5 star" → [4, 5]

2. **onlyTopRated** = Customer review ratings (4.5+ out of 5)
   - Use when: "highly rated", "top rated", "best rated", "excellent reviews", "good reviews"
   - Use when: "4.5 rating", "4+ rating", "above 4 stars rated"
   - Based on: Customer feedback and review scores
   - Examples: "highly rated" → true, "top rated hotels" → true

**Extraction Rules:**
1. Use your knowledge to match user input to the exact database names above
2. Recognize common abbreviations (UK→United Kingdom, US→United States, UAE→United Arab Emirates)
3. Recognize synonyms (wifi→Wi-Fi, pool→swimming pool, gym→fitness center)
4. Always return the EXACT name from the database list, not the user's variation
5. **Star ratings (1-5 stars)**: Hotel classification → use starRating: [number]
6. **Customer reviews (highly/top rated)**: Review scores → use onlyTopRated: true
7. "Luxury hotels" can mean BOTH: starRating: [5] AND onlyTopRated: true
8. Convert prices to LKR (USD×300, EUR×350, GBP×400)
9. Only include explicitly mentioned filters
10. Return {} if no clear filters found

**Examples:**

Query: "5 star hotels in london"
→ {"location": {"city": "London", "country": "United Kingdom"}, "starRating": [5]}

Query: "highly rated hotels in paris"
→ {"location": {"city": "Paris", "country": "France"}, "onlyTopRated": true}

Query: "top rated 4 star hotels in New York"
→ {"location": {"city": "New York", "country": "United States"}, "starRating": [4], "onlyTopRated": true}

Query: "luxury hotels in dubai with pool"
→ {"location": {"city": "Dubai", "country": "United Arab Emirates"}, "starRating": [5], "amenities": ["swimming pool"], "onlyTopRated": true}

Query: "hotels with 4.5+ rating in tokyo"
→ {"location": {"city": "Tokyo", "country": "Japan"}, "onlyTopRated": true}

Query: "3 star budget hotels"
→ {"starRating": [3]}

Query: "best reviewed hotels in sri lanka"
→ {"location": {"country": "Sri Lanka"}, "onlyTopRated": true}

Query: "cheap hotels under $100"
→ {"priceRange": {"max": 30000}}

Query: "hotels in UK"
→ {"location": {"country": "United Kingdom"}}

**User Query:** "${userQuery}"

**Extracted Filters (JSON only):**`;



    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a precise filter extraction assistant for a hotel booking system. Extract only explicitly mentioned filters and use exact values from provided lists.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.1,
      max_tokens: 400,
    });

    const content = response.choices[0]?.message?.content?.trim();
    if (!content) return {};

    const filters = JSON.parse(content) as ExtractedFilters;
    console.log('Extracted filters:', filters);
    return validateAndSanitizeFilters(filters, { locations, amenities });
    
  } catch (error) {
    console.error('AI filter extraction failed:', error);
    return {}; // Fallback to empty filters
  }
}

function validateAndSanitizeFilters(
  filters: ExtractedFilters, 
  availableOptions: { locations: { cities: string[], countries: string[] }, amenities: string[] }
): ExtractedFilters {
  const sanitized: ExtractedFilters = {};

  // Validate price range
  if (filters.priceRange) {
    const { min, max } = filters.priceRange;
    if (min !== undefined && typeof min === 'number' && min > 0) {
      sanitized.priceRange = { min };
      if (max !== undefined && typeof max === 'number' && max > min) {
        sanitized.priceRange.max = max;
      }
    } else if (max !== undefined && typeof max === 'number' && max > 0) {
      sanitized.priceRange = { max };
    }
  }

  // Validate location (fuzzy match against available options)
  if (filters.location) {
    sanitized.location = {};
    
    if (filters.location.city) {
      const cityLower = filters.location.city.toLowerCase();
      const matchedCity = availableOptions.locations.cities.find(
        c => c.toLowerCase() === cityLower || c.toLowerCase().includes(cityLower)
      );
      if (matchedCity) {
        sanitized.location.city = matchedCity;
      }
    }
    
    if (filters.location.country) {
      const countryLower = filters.location.country.toLowerCase();
      const matchedCountry = availableOptions.locations.countries.find(
        c => c.toLowerCase() === countryLower || c.toLowerCase().includes(countryLower)
      );
      if (matchedCountry) {
        sanitized.location.country = matchedCountry;
      }
    }

    // Remove location if no valid city or country found
    if (!sanitized.location.city && !sanitized.location.country) {
      delete sanitized.location;
    }
  }

  // Validate amenities (must exist in database)
  if (Array.isArray(filters.amenities) && filters.amenities.length > 0) {
    const validAmenities = filters.amenities.filter(amenity => {
      const amenityLower = amenity.toLowerCase();
      return availableOptions.amenities.some(
        a => a.toLowerCase() === amenityLower || a.toLowerCase().includes(amenityLower)
      );
    });
    
    if (validAmenities.length > 0) {
      // Map to exact database labels
      sanitized.amenities = validAmenities.map(amenity => {
        const amenityLower = amenity.toLowerCase();
        return availableOptions.amenities.find(
          a => a.toLowerCase() === amenityLower || a.toLowerCase().includes(amenityLower)
        ) || amenity;
      });
    }
  }

  // Validate star rating (must be 1-5, array format)
  if (Array.isArray(filters.starRating) && filters.starRating.length > 0) {
    const validRatings = filters.starRating
      .map(r => typeof r === 'number' ? r : parseInt(String(r)))
      .filter(r => !isNaN(r) && r >= 1 && r <= 5);
    
    if (validRatings.length > 0) {
      sanitized.starRating = [...new Set(validRatings)]; // Remove duplicates
    }
  }

  // Validate onlyTopRated boolean
  if (typeof filters.onlyTopRated === 'boolean') {
    sanitized.onlyTopRated = filters.onlyTopRated;
  }

  return sanitized;
}
