import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/src/components/ui/card';
import { Badge } from '@/src/components/ui/badge';
import { useGetAllHotelsQuery, useGetCountriesQuery } from '@/src/store/api';

export default function HotelRecommendations() {
  const navigate = useNavigate();
  const [country, setCountry] = React.useState('');
  const { data: hotels, isLoading, isError, error } = useGetAllHotelsQuery(country);
  const { data: countries = [], isLoading: isLoadingCountries } = useGetCountriesQuery();

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
              <div key={i} className="animate-pulse h-72 rounded-xl border bg-muted" />
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
            <select
              id="country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
            >
              <option value="">All</option>
              {!isLoadingCountries && countries?.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {hotels?.map((hotel) => {
            const coverImage = hotel.imageUrl || 'https://via.placeholder.com/400x250?text=Hotel';
            const priceFrom = typeof hotel.priceFrom === 'number' ? hotel.priceFrom : null;
            const ratingValue = typeof hotel.rating === 'number' ? hotel.rating : 0;
            const amenities = Array.isArray(hotel.amenities) ? hotel.amenities.slice(0, 3) : [];

            return (
              <Card
                key={hotel._id}
                role="button"
                tabIndex={0}
                aria-label={`View ${hotel.name}`}
                onClick={() => handleViewDetails(hotel._id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleViewDetails(hotel._id);
                  }
                }}
                className="overflow-hidden hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 group border bg-card flex flex-col h-full cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg p-0 gap-0"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={coverImage}
                    alt={hotel.name}
                    className="w-full h-48 object-cover object-center group-hover:scale-105 transition-transform duration-300 rounded-t-lg"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/10" />
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <div className="flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-xs font-medium shadow-sm">
                      <Star className="h-3.5 w-3.5 text-yellow-500 fill-current" />
                      <span className="text-gray-800">{ratingValue}</span>
                    </div>
                  </div>
                  {priceFrom !== null && (
                    <Badge className="absolute top-3 right-3 bg-white/90 text-foreground border font-semibold backdrop-blur-sm">
                     Starting at Rs {priceFrom.toLocaleString('en-LK')}/night
                    </Badge>
                  )}
                </div>

                <CardHeader className="pb-3 pt-6 flex-shrink-0">
                  <h4 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors leading-tight line-clamp-2 mb-1">
                    {hotel.name}
                  </h4>

                  <p className="text-muted-foreground text-sm line-clamp-2">
                    {hotel.description}
                  </p>
                </CardHeader>

                {amenities.length > 0 && (
                  <CardContent className="pt-2 pb-4 flex-shrink-0">
                    <div className="flex flex-wrap gap-2">
                      {amenities.map((am, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {am}
                        </Badge>
                      ))}
                      {Array.isArray(hotel.amenities) && hotel.amenities.length > amenities.length && (
                        <span className="text-xs text-muted-foreground">+{hotel.amenities.length - amenities.length} more</span>
                      )}
                    </div>
                  </CardContent>
                )}

              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
