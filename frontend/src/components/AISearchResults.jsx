import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Search, X } from 'lucide-react';
import HotelCard from './HotelCard';
import HotelCardSkeleton from './HotelCardSkeleton';

export default function AISearchResults({ 
  searchResults = null, 
  isLoading = false, 
  isError = false, 
  error = null,
  searchQuery = '',
  onNewSearch,
  onClearSearch 
}) {
  const navigate = useNavigate();
  
  // Extract data from search results
  const hotels = searchResults?.data || [];
  const resultCount = searchResults?.count || 0;
  const originalQuery = searchResults?.query || searchQuery;

  const handleViewDetails = (hotelId) => {
    navigate(`/hotel/${hotelId}`);
  };

  if (isLoading) {
    return (
      <section className="py-16 bg-card">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="h-8 w-8 text-brand-primary" />
              <h2 className="text-4xl font-bold text-foreground">AI Search Results</h2>
            </div>
            <p className="text-xl text-muted-foreground">
              Searching for: "{searchQuery}"
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Our AI is finding the perfect hotels for you...
            </p>
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
            <div className="flex items-center justify-center gap-2 mb-4">
              <Search className="h-8 w-8 text-destructive" />
              <h2 className="text-4xl font-bold text-foreground">Search Error</h2>
            </div>
            <p className="text-xl text-destructive">Failed to search hotels</p>
            <p className="text-sm text-muted-foreground mt-2">
              Query: "{searchQuery}"
            </p>
            {error && (
              <p className="text-sm text-muted-foreground mt-1">
                {String(error?.message || error?.status || 'Unknown error')}
              </p>
            )}
            <button
              onClick={onNewSearch}
              className="mt-4 px-6 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (!searchResults || hotels.length === 0) {
    return (
      <section className="py-16 bg-card">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Search className="h-8 w-8 text-muted-foreground" />
              <h2 className="text-4xl font-bold text-foreground">No Results Found</h2>
            </div>
            <p className="text-xl text-muted-foreground">
              No hotels found for: "{searchQuery}"
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Try refining your search or use different keywords
            </p>
            <button
              onClick={onNewSearch}
              className="mt-4 px-6 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 transition-colors"
            >
              New Search
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-card">
      <div className="max-w-7xl mx-auto px-6">
        {/* Clear Search Banner */}
        <div className="mb-6 bg-brand-primary/5 border border-brand-primary/20 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-brand-primary" />
              <span className="text-sm font-medium text-foreground">
                Showing AI search results for "{originalQuery}"
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground hidden sm:block">
              Press ESC to clear
            </span>
            <button
              onClick={onClearSearch}
              className="flex items-center gap-1 px-3 py-1.5 text-sm bg-background hover:bg-muted border border-border rounded-md transition-colors"
              title="Clear search and show all hotels"
            >
              <X className="h-3 w-3" />
              <span className="hidden sm:inline">Clear</span>
            </button>
          </div>
        </div>

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="text-left">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-6 w-6 text-brand-primary" />
              <h2 className="text-4xl font-bold text-foreground">AI Search Results</h2>
            </div>
            <p className="text-xl text-muted-foreground mb-2">
              Found {resultCount} hotel{resultCount !== 1 ? 's' : ''} for your search
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Search className="h-4 w-4" />
              <span className="font-medium">Query:</span>
              <span className="bg-muted px-2 py-1 rounded-md font-mono text-xs">
                "{originalQuery}"
              </span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <button
              onClick={onClearSearch}
              className="px-4 py-2 bg-destructive/10 text-destructive border border-destructive/20 rounded-lg hover:bg-destructive/20 transition-colors flex items-center gap-2 justify-center font-medium"
              title="Clear search and browse all hotels (ESC)"
            >
              <X className="h-4 w-4" />
              <span>Clear Search</span>
              <span className="hidden lg:inline text-xs opacity-70">(ESC)</span>
            </button>
            <button
              onClick={onNewSearch}
              className="px-4 py-2 bg-brand-primary/10 text-brand-primary border border-brand-primary/20 rounded-lg hover:bg-brand-primary/20 transition-colors flex items-center gap-2 justify-center"
              title="Start a new search"
            >
              <Search className="h-4 w-4" />
              New Search
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {hotels.map((hotel) => (
            <div key={hotel._id} className="relative">
              <HotelCard
                hotel={hotel}
                onViewDetails={handleViewDetails}
              />
              {/* AI Score Badge */}
              {hotel.score && (
                <div className="absolute bottom-2 right-2 bg-brand-primary text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  {(hotel.score * 100).toFixed(0)}%
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Search insights */}
        <div className="mt-12 bg-muted/50 rounded-xl p-6 border border-border">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="h-5 w-5 text-brand-primary" />
            <h3 className="text-lg font-semibold text-foreground">AI Search Insights</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex flex-col gap-1">
              <span className="font-medium text-foreground">Total Results</span>
              <span className="text-muted-foreground">{resultCount} hotels found</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-medium text-foreground">Search Query</span>
              <span className="text-muted-foreground font-mono bg-background px-2 py-1 rounded">
                {originalQuery}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-medium text-foreground">Match Quality</span>
              <span className="text-muted-foreground">
                {hotels.length > 0 && hotels[0].score 
                  ? `${((hotels[0].score || 0) * 100).toFixed(0)}% relevance`
                  : 'High relevance'
                }
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}