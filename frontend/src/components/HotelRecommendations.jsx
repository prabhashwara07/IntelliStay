import React from 'react';
import { useNavigate } from 'react-router-dom';
import HotelCard from './HotelCard';
import HotelCardSkeleton from './HotelCardSkeleton';
import { Loader2 } from 'lucide-react';
import { 
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/src/components/ui/pagination';
import { useGetAllHotelsQuery, useGetCountriesQuery } from '@/src/store/api';

export default function HotelRecommendations() {
  const navigate = useNavigate();
  const [country, setCountry] = React.useState('');
  const [currentPage, setCurrentPage] = React.useState(1);
  const [isCountryChanging, setIsCountryChanging] = React.useState(false);
  const itemsPerPage = 8;
  
  const { data: hotelsResponse, isLoading, isError, error, isFetching } = useGetAllHotelsQuery({ country });
  const { data: countries = [], isLoading: isLoadingCountries } = useGetCountriesQuery();
  const countriesList = Array.isArray(countries) ? countries : [];
  
  // Extract hotels from the new response format
  const hotels = hotelsResponse?.data || [];
  
  // Pagination calculations
  const totalItems = hotels.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentHotels = hotels.slice(startIndex, endIndex);
  
  // Handle country change with loading state
  const handleCountryChange = (newCountry) => {
    setIsCountryChanging(true);
    setCountry(newCountry);
  };
  
  // Reset to first page when country filter changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [country]);
  
  // Reset country changing state when data is loaded
  React.useEffect(() => {
    if (!isFetching && isCountryChanging) {
      setIsCountryChanging(false);
    }
  }, [isFetching, isCountryChanging]);

  const handleViewDetails = (hotelId) => {
    navigate(`/hotel/${hotelId}`);
  };

  if (isLoading) {
    return (
      <section className="py-16 bg-card">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">Featured Hotels</h2>
            <p className="text-xl text-muted-foreground">Loading hotels…</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
                <HotelCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="py-16 bg-card">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">Featured Hotels</h2>
            <p className="text-xl text-destructive">Failed to load hotels</p>
            <p className="text-sm text-muted-foreground">{String(error?.status || '')}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-card">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="text-left">
            <h2 className="text-4xl font-bold text-foreground mb-2">Featured Hotels</h2>
            <p className="text-xl text-muted-foreground">Explore top stays curated for you</p>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <label htmlFor="country" className="text-sm text-muted-foreground">Country</label>
            <div className="relative">
              <select
                id="country"
                value={country}
                onChange={(e) => handleCountryChange(e.target.value)}
                disabled={isLoadingCountries || isCountryChanging}
                className="h-9 rounded-md border border-input bg-background px-3 pr-8 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">All</option>
                {!isLoadingCountries && countriesList.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              {(isLoadingCountries || isCountryChanging) && (
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {isCountryChanging || isFetching ? (
            // Show skeleton loading when country is changing or data is fetching
            Array.from({ length: itemsPerPage }).map((_, i) => (
              <HotelCardSkeleton key={i} />
            ))
          ) : (
            // Show actual hotel cards when data is loaded
            currentHotels?.map((hotel) => (
              <HotelCard
                key={hotel._id}
                hotel={hotel}
                onViewDetails={handleViewDetails}
              />
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    className={currentPage <= 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
                
                {/* First page */}
                {currentPage > 3 && (
                  <>
                    <PaginationItem>
                      <PaginationLink 
                        onClick={() => setCurrentPage(1)}
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
                {Array.from({ length: totalPages }, (_, index) => index + 1)
                  .filter(page => page >= currentPage - 2 && page <= currentPage + 2)
                  .map(page => (
                    <PaginationItem key={page}>
                      <PaginationLink 
                        onClick={() => setCurrentPage(page)}
                        isActive={currentPage === page}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                
                {/* Last page */}
                {currentPage < totalPages - 2 && (
                  <>
                    {currentPage < totalPages - 3 && (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )}
                    <PaginationItem>
                      <PaginationLink 
                        onClick={() => setCurrentPage(totalPages)}
                        className="cursor-pointer"
                      >
                        {totalPages}
                      </PaginationLink>
                    </PaginationItem>
                  </>
                )}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    className={currentPage >= totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </section>
  );
}
