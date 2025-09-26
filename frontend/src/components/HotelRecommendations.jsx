import React from 'react';
import { useNavigate } from 'react-router-dom';
import HotelCard from './HotelCard';
import HotelCardSkeleton from './HotelCardSkeleton';
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
          {hotels?.map((hotel) => (
            <HotelCard
              key={hotel._id}
              hotel={hotel}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
