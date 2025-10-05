import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/src/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/src/components/ui/tabs';
import { Badge } from '@/src/components/ui/badge';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Separator } from '@/src/components/ui/separator';
import { 
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/src/components/ui/pagination';
import { Star, MapPin, SlidersHorizontal, Filter, Trash2, Search, Plus, Minus, Loader2, Grid, List, ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { Slider } from '@/src/components/ui/slider';
import HotelCard from '@/src/components/HotelCard';
import HotelCardSkeleton from '@/src/components/HotelCardSkeleton';
import { PREDEFINED_AMENITIES } from '@/src/utils/amenities';
import { useGetAllHotelsQuery, useGetCountriesQuery } from '@/src/store/api';

const STAR_OPTIONS = [5, 4, 3, 2, 1];

const SORT_OPTIONS = [
  { value: 'price-low-high', label: 'Price: Low to High' },
  { value: 'price-high-low', label: 'Price: High to Low' },
  { value: 'rating-high-low', label: 'Rating: High to Low' },
  { value: 'alphabetical-az', label: 'Alphabetical: A-Z' },
  { value: 'featured', label: 'Featured/Recommended' }
];

export default function Hotels() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // State management
  const [query, setQuery] = useState(searchParams.get('search') || '');
  const [selectedLocation, setSelectedLocation] = useState(searchParams.get('location') || '');
  const [priceRange, setPriceRange] = useState([
    parseInt(searchParams.get('minPrice')) || 0,
    parseInt(searchParams.get('maxPrice')) || 50000
  ]);
  const [selectedStars, setSelectedStars] = useState(
    searchParams.get('stars') ? searchParams.get('stars').split(',').map(Number) : []
  );
  const [selectedAmenities, setSelectedAmenities] = useState(
    searchParams.get('amenities') ? searchParams.get('amenities').split(',') : []
  );
  const [onlyTopRated, setOnlyTopRated] = useState(searchParams.get('topRated') === 'true');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'featured');
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page')) || 1);
  const [showAllAmenities, setShowAllAmenities] = useState(false);

  const ITEMS_PER_PAGE = 6;
  const MIN_PRICE = 0;
  const MAX_PRICE = 50000;

  const allAmenityKeys = useMemo(() => Object.keys(PREDEFINED_AMENITIES), []);

  // Get countries for location dropdown
  const { data: countries = [], isLoading: isLoadingCountries } = useGetCountriesQuery();

  // Build filters object for API
  const filters = useMemo(() => {
    const apiFilters = {};
    
    if (query.trim()) apiFilters.search = query.trim();
    if (selectedLocation.trim()) apiFilters.country = selectedLocation.trim();
    if (priceRange[0] > MIN_PRICE) apiFilters.minPrice = priceRange[0];
    if (priceRange[1] < MAX_PRICE) apiFilters.maxPrice = priceRange[1];
    if (selectedStars.length > 0) apiFilters.starRating = selectedStars;
    if (selectedAmenities.length > 0) {
      // Send amenity keys directly to the API (not labels)
      apiFilters.amenities = selectedAmenities;
    }
    if (onlyTopRated) apiFilters.onlyTopRated = true;
    
    return apiFilters;
  }, [query, selectedLocation, priceRange, selectedStars, selectedAmenities, onlyTopRated]);

  // Use the API hook
  const { data: hotelsResponse, isLoading, isError, error } = useGetAllHotelsQuery(filters);
  
  // Extract and sort data from response
  const rawHotels = hotelsResponse?.data || [];
  const totalCount = hotelsResponse?.count || 0;

  // Client-side sorting and pagination
  const { hotels, paginationInfo } = useMemo(() => {
    // First, sort the hotels
    const sorted = [...rawHotels];
    switch (sortBy) {
      case 'price-low-high':
        sorted.sort((a, b) => (a.priceStartingFrom || 0) - (b.priceStartingFrom || 0));
        break;
      case 'price-high-low':
        sorted.sort((a, b) => (b.priceStartingFrom || 0) - (a.priceStartingFrom || 0));
        break;
      case 'rating-high-low':
        sorted.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
        break;
      case 'alphabetical-az':
        sorted.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        break;
      case 'featured':
      default:
        // Backend already returns sorted by rating then price
        break;
    }

    // Then, apply pagination
    const totalItems = sorted.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedHotels = sorted.slice(startIndex, endIndex);

    return {
      hotels: paginatedHotels,
      paginationInfo: {
        currentPage,
        totalPages,
        totalItems,
        itemsPerPage: ITEMS_PER_PAGE,
        startIndex: startIndex + 1,
        endIndex: Math.min(endIndex, totalItems),
        hasNextPage: currentPage < totalPages,
        hasPrevPage: currentPage > 1
      }
    };
  }, [rawHotels, sortBy, currentPage]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [query, selectedLocation, priceRange, selectedStars, selectedAmenities, onlyTopRated, sortBy]);

  // Update URL parameters when filters or page change
  useEffect(() => {
    const params = new URLSearchParams();
    if (query) params.set('search', query);
    if (selectedLocation) params.set('location', selectedLocation);
    if (priceRange[0] > MIN_PRICE) params.set('minPrice', priceRange[0].toString());
    if (priceRange[1] < MAX_PRICE) params.set('maxPrice', priceRange[1].toString());
    if (selectedStars.length > 0) params.set('stars', selectedStars.join(','));
    if (selectedAmenities.length > 0) params.set('amenities', selectedAmenities.join(','));
    if (onlyTopRated) params.set('topRated', 'true');
    if (sortBy !== 'featured') params.set('sort', sortBy);
    if (currentPage > 1) params.set('page', currentPage.toString());

    setSearchParams(params);
  }, [query, selectedLocation, priceRange, selectedStars, selectedAmenities, onlyTopRated, sortBy, currentPage, setSearchParams]);

  const clearFilters = () => {
    setQuery('');
    setSelectedLocation('');
    setPriceRange([MIN_PRICE, MAX_PRICE]);
    setSelectedStars([]);
    setSelectedAmenities([]);
    setOnlyTopRated(false);
    setSortBy('featured');
    setCurrentPage(1);
    setSearchParams(new URLSearchParams());
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Scroll to top of results
    document.querySelector('.lg\\:col-span-9')?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleStar = (s) => {
    setSelectedStars((prev) => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  };

  const toggleAmenity = (a) => {
    setSelectedAmenities((prev) => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 pt-28 pb-10">
        {/* Page Header */}
        <div className="mb-6">
          <Badge className="mb-2 bg-primary/10 text-primary border-primary/20">Browse Hotels</Badge>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">Find your perfect stay</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Filters */}
          <div className="lg:col-span-3">
            <Card className="p-6 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  <h3 className="text-lg font-semibold">Filters</h3>
                </div>
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  <Trash2 className="h-4 w-4 mr-1" /> Clear
                </Button>
              </div>

              <div className="space-y-6">
                {/* Search */}
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Search</label>
                  <div className="mt-1 flex items-center gap-2">
                    <Input 
                      value={query} 
                      onChange={(e) => setQuery(e.target.value)} 
                      placeholder="Search by name or location" 
                    />
                    <Button variant="outline" size="sm">
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <Separator />

                {/* Location Filtering */}
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Location</label>
                  <div className="mt-1">
                    <select
                      value={selectedLocation}
                      onChange={(e) => setSelectedLocation(e.target.value)}
                      className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                    >
                      <option value="">All Locations</option>
                      {!isLoadingCountries && countries?.map((country) => (
                        <option key={country} value={country}>{country}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <Separator />

                {/* Price Range */}
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Price range (Rs)</label>
                  <div className="mt-4 px-2">
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      max={MAX_PRICE}
                      min={MIN_PRICE}
                      step={1000}
                      className="w-full"
                    />
                    <div className="flex justify-between items-center mt-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">Min:</span>
                        <Input
                          type="number"
                          value={priceRange[0]}
                          onChange={(e) => {
                            const value = Math.max(MIN_PRICE, Math.min(parseInt(e.target.value) || MIN_PRICE, priceRange[1]));
                            setPriceRange([value, priceRange[1]]);
                          }}
                          className="w-20 h-7 text-xs"
                          min={MIN_PRICE}
                          max={priceRange[1]}
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">Max:</span>
                        <Input
                          type="number"
                          value={priceRange[1]}
                          onChange={(e) => {
                            const value = Math.min(MAX_PRICE, Math.max(parseInt(e.target.value) || MAX_PRICE, priceRange[0]));
                            setPriceRange([priceRange[0], value]);
                          }}
                          className="w-20 h-7 text-xs"
                          min={priceRange[0]}
                          max={MAX_PRICE}
                        />
                      </div>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>Rs. {priceRange[0].toLocaleString()}</span>
                      <span>Rs. {priceRange[1].toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Star Rating */}
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Star rating</label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {STAR_OPTIONS.map((s) => (
                      <button
                        key={s}
                        onClick={() => toggleStar(s)}
                        className={`px-3 py-1 rounded-md border text-sm flex items-center gap-1 ${selectedStars.includes(s) ? 'bg-primary text-primary-foreground border-primary' : 'bg-background border-input'}`}
                      >
                        <Star className="h-4 w-4 text-yellow-500" />
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Amenities */}
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Amenities</label>
                  <div className="mt-2 grid grid-cols-1 gap-2">
                    {(showAllAmenities ? allAmenityKeys : allAmenityKeys.slice(0, 8)).map((a) => {
                      const amenity = PREDEFINED_AMENITIES[a];
                      const IconComponent = amenity?.icon;
                      const isSelected = selectedAmenities.includes(a);
                      
                      return (
                        <button
                          key={a}
                          onClick={() => toggleAmenity(a)}
                          className={`px-3 py-2 rounded-md border text-sm flex items-center gap-2 transition-colors ${
                            isSelected 
                              ? 'bg-accent text-accent-foreground border-accent' 
                              : 'bg-background border-input text-foreground hover:bg-muted'
                          }`}
                          title={amenity?.label || a}
                        >
                          {IconComponent && <IconComponent className="h-4 w-4 flex-shrink-0" />}
                          <span className="truncate text-xs">{amenity?.label || a}</span>
                        </button>
                      );
                    })}
                  </div>
                  
                  {/* Show More/Less Button */}
                  {allAmenityKeys.length > 8 && (
                    <div className="mt-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowAllAmenities(!showAllAmenities)}
                        className="text-xs text-muted-foreground w-full"
                      >
                        {showAllAmenities ? (
                          <>
                            <Minus className="h-3 w-3 mr-1" />
                            Show Less
                          </>
                        ) : (
                          <>
                            <Plus className="h-3 w-3 mr-1" />
                            Show More ({allAmenityKeys.length - 8} more)
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Top Rated Toggle */}
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium text-muted-foreground">Only top rated (4.5+)</div>
                  <button
                    onClick={() => setOnlyTopRated((v) => !v)}
                    className={`px-3 py-1 rounded-md border text-sm ${onlyTopRated ? 'bg-primary text-primary-foreground border-primary' : 'bg-background border-input'}`}
                  >
                    {onlyTopRated ? 'On' : 'Off'}
                  </button>
                </div>
              </div>
            </Card>
          </div>

          {/* Results */}
          <div className="lg:col-span-9">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
              <div className="text-sm text-muted-foreground">
                {isLoading ? 'Loading...' : (
                  <>
                    Showing {paginationInfo?.startIndex || 0}-{paginationInfo?.endIndex || 0} of {totalCount} results
                  </>
                )}
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {/* Sort Dropdown */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                >
                  {SORT_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>

                {/* View Mode Toggle */}
                <div className="flex border border-input rounded-md">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`px-3 py-1.5 text-sm ${viewMode === 'grid' ? 'bg-accent text-accent-foreground' : 'bg-background text-foreground'} rounded-l-md`}
                  >
                    <Grid className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`px-3 py-1.5 text-sm ${viewMode === 'list' ? 'bg-accent text-accent-foreground' : 'bg-background text-foreground'} rounded-r-md border-l border-input`}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <HotelCardSkeleton key={i} />
                ))}
              </div>
            )}

            {/* Error State */}
            {isError && (
              <Card className="p-8 text-center">
                <div className="text-destructive mb-2">Failed to load hotels</div>
                <div className="text-sm text-muted-foreground">
                  {error?.data?.message || error?.message || 'Something went wrong'}
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-4"
                  onClick={() => window.location.reload()}
                >
                  Try Again
                </Button>
              </Card>
            )}

            {/* No Results */}
            {!isLoading && !isError && hotels.length === 0 && (
              <Card className="p-8 text-center">
                <div className="text-muted-foreground mb-2">No hotels match your filters.</div>
                <div className="text-sm text-muted-foreground mb-4">
                  Try adjusting your search criteria or clearing some filters.
                </div>
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  Clear All Filters
                </Button>
              </Card>
            )}

            {/* Results */}
            {!isLoading && !isError && hotels.length > 0 && (
              <>
                {/* Active Filters Display */}
                {(query || selectedLocation || priceRange[0] > MIN_PRICE || priceRange[1] < MAX_PRICE || selectedStars.length > 0 || selectedAmenities.length > 0 || onlyTopRated) && (
                  <div className="mb-4 p-3 bg-muted/50 rounded-lg">
                    <div className="text-xs text-muted-foreground mb-2">Active filters:</div>
                    <div className="flex flex-wrap gap-2">
                      {query && <Badge variant="secondary">Search: {query}</Badge>}
                      {selectedLocation && <Badge variant="secondary">Location: {selectedLocation}</Badge>}
                      {priceRange[0] > MIN_PRICE && <Badge variant="secondary">Min: Rs.{priceRange[0].toLocaleString()}</Badge>}
                      {priceRange[1] < MAX_PRICE && <Badge variant="secondary">Max: Rs.{priceRange[1].toLocaleString()}</Badge>}
                      {selectedStars.map(star => (
                        <Badge key={star} variant="secondary">{star} Star</Badge>
                      ))}
                      {selectedAmenities.map(amenity => (
                        <Badge key={amenity} variant="secondary">{PREDEFINED_AMENITIES[amenity]?.label}</Badge>
                      ))}
                      {onlyTopRated && <Badge variant="secondary">Top Rated 4.5+</Badge>}
                      {sortBy !== 'featured' && <Badge variant="secondary">Sort: {SORT_OPTIONS.find(opt => opt.value === sortBy)?.label}</Badge>}
                    </div>
                  </div>
                )}

                <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 gap-6' : 'space-y-4'}>
                  {hotels.map((hotel) => (
                    <HotelCard 
                      key={hotel._id} 
                      hotel={{
                        ...hotel,
                        // Transform the new API response to match HotelCard expectations
                        imageUrl: hotel.imageUrl,
                        location: hotel.location ? `${hotel.location.city}, ${hotel.location.country}` : 'Unknown Location'
                      }} 
                      onViewDetails={(id) => navigate(`/hotel/${id}`)} 
                      variant={viewMode}
                    />
                  ))}
                </div>

                {/* Pagination Controls */}
                {paginationInfo && paginationInfo.totalPages > 1 && (
                  <div className="mt-8 flex justify-center">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious 
                            onClick={() => handlePageChange(currentPage - 1)}
                            className={!paginationInfo.hasPrevPage ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                          />
                        </PaginationItem>
                        
                        {/* First page */}
                        {currentPage > 3 && (
                          <>
                            <PaginationItem>
                              <PaginationLink 
                                onClick={() => handlePageChange(1)}
                                className="cursor-pointer"
                              >
                                1
                              </PaginationLink>
                            </PaginationItem>
                            {currentPage > 4 && (
                              <PaginationItem>
                                <PaginationEllipsis />
                              </PaginationItem>
                            )}
                          </>
                        )}
                        
                        {/* Page numbers around current page */}
                        {Array.from({ length: paginationInfo.totalPages }, (_, index) => index + 1)
                          .filter(page => page >= currentPage - 2 && page <= currentPage + 2)
                          .map(page => (
                            <PaginationItem key={page}>
                              <PaginationLink 
                                onClick={() => handlePageChange(page)}
                                isActive={currentPage === page}
                                className="cursor-pointer"
                              >
                                {page}
                              </PaginationLink>
                            </PaginationItem>
                          ))}
                        
                        {/* Last page */}
                        {currentPage < paginationInfo.totalPages - 2 && (
                          <>
                            {currentPage < paginationInfo.totalPages - 3 && (
                              <PaginationItem>
                                <PaginationEllipsis />
                              </PaginationItem>
                            )}
                            <PaginationItem>
                              <PaginationLink 
                                onClick={() => handlePageChange(paginationInfo.totalPages)}
                                className="cursor-pointer"
                              >
                                {paginationInfo.totalPages}
                              </PaginationLink>
                            </PaginationItem>
                          </>
                        )}
                        
                        <PaginationItem>
                          <PaginationNext 
                            onClick={() => handlePageChange(currentPage + 1)}
                            className={!paginationInfo.hasNextPage ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}

                {/* Pagination Info */}
                {paginationInfo && paginationInfo.totalPages > 1 && (
                  <div className="mt-4 text-center text-sm text-muted-foreground">
                    Page {paginationInfo.currentPage} of {paginationInfo.totalPages} 
                    ({paginationInfo.totalItems} total results)
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


