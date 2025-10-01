import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/src/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/src/components/ui/tabs';
import { Badge } from '@/src/components/ui/badge';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Separator } from '@/src/components/ui/separator';
import { Star, MapPin, SlidersHorizontal, Filter, Trash2, Search, Plus, Minus } from 'lucide-react';
import HotelCard from '@/src/components/HotelCard';
import { PREDEFINED_AMENITIES } from '@/src/utils/amenities';

const MOCK_HOTELS = [
  {
    _id: 'hotel_001',
    name: 'Ocean View Resort',
    description: 'Beautiful beachfront resort with amazing ocean views.',
    imageUrl: 'https://images.unsplash.com/photo-1501117716987-c8e1ecb2103d?w=900&h=600&fit=crop',
    priceStartingFrom: 25000,
    starRating: 5,
    averageRating: 4.8,
    amenities: ['wifi', 'parking', 'pool', 'restaurant', 'spa', 'air_conditioning'],
    location: 'Mirissa, Sri Lanka',
  },
  {
    _id: 'hotel_002',
    name: 'City Business Hotel',
    description: 'Modern hotel perfect for business travelers.',
    imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=900&h=600&fit=crop',
    priceStartingFrom: 12000,
    starRating: 4,
    averageRating: 4.2,
    amenities: ['wifi', 'parking', 'gym', 'restaurant', 'business_center', 'air_conditioning'],
    location: 'Colombo, Sri Lanka',
  },
  {
    _id: 'hotel_003',
    name: 'Highland Retreat',
    description: 'Cozy mountain retreat with breathtaking valley views.',
    imageUrl: 'https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba?w=900&h=600&fit=crop',
    priceStartingFrom: 18000,
    starRating: 4,
    averageRating: 4.6,
    amenities: ['wifi', 'restaurant', 'spa', 'parking', 'air_conditioning'],
    location: 'Nuwara Eliya, Sri Lanka',
  },
  {
    _id: 'hotel_004',
    name: 'Lagoon Paradise',
    description: 'Serene lagoon-side property ideal for a peaceful getaway.',
    imageUrl: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=900&h=600&fit=crop',
    priceStartingFrom: 22000,
    starRating: 5,
    averageRating: 4.9,
    amenities: ['wifi', 'pool', 'spa', 'restaurant', 'air_conditioning', 'parking'],
    location: 'Bentota, Sri Lanka',
  },
  {
    _id: 'hotel_005',
    name: 'Urban Chic Suites',
    description: 'Stylish suites in the heart of the city with great connectivity.',
    imageUrl: 'https://images.unsplash.com/photo-1496412705862-e0088f16f791?w=900&h=600&fit=crop',
    priceStartingFrom: 16000,
    starRating: 4,
    averageRating: 4.4,
    amenities: ['wifi', 'gym', 'restaurant', 'parking', 'air_conditioning'],
    location: 'Colombo, Sri Lanka',
  },
];

const STAR_OPTIONS = [5, 4, 3, 2, 1];

export default function Hotels() {
  const navigate = useNavigate();

  const [query, setQuery] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [selectedStars, setSelectedStars] = useState([]);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [onlyTopRated, setOnlyTopRated] = useState(false);

  const allAmenityKeys = useMemo(() => Object.keys(PREDEFINED_AMENITIES), []);

  const filtered = useMemo(() => {
    return MOCK_HOTELS.filter((hotel) => {
      if (query && !hotel.name.toLowerCase().includes(query.toLowerCase()) && !hotel.location.toLowerCase().includes(query.toLowerCase())) {
        return false;
      }
      if (minPrice && hotel.priceStartingFrom < Number(minPrice)) return false;
      if (maxPrice && hotel.priceStartingFrom > Number(maxPrice)) return false;
      if (selectedStars.length > 0 && !selectedStars.includes(Math.round(hotel.starRating))) return false;
      if (selectedAmenities.length > 0 && !selectedAmenities.every(a => hotel.amenities.includes(a))) return false;
      if (onlyTopRated && hotel.averageRating < 4.5) return false;
      return true;
    });
  }, [query, minPrice, maxPrice, selectedStars, selectedAmenities, onlyTopRated]);

  const clearFilters = () => {
    setQuery('');
    setMinPrice('');
    setMaxPrice('');
    setSelectedStars([]);
    setSelectedAmenities([]);
    setOnlyTopRated(false);
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
          <div className="lg:col-span-4">
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
                    <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by name or location" />
                    <Button variant="outline" size="sm"><Search className="h-4 w-4" /></Button>
                  </div>
                </div>

                <Separator />

                {/* Price Range */}
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Price range (Rs)</label>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <Input type="number" placeholder="Min" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
                    <Input type="number" placeholder="Max" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
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
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {allAmenityKeys.slice(0, 12).map((a) => (
                      <button
                        key={a}
                        onClick={() => toggleAmenity(a)}
                        className={`px-3 py-1 rounded-md border text-sm ${selectedAmenities.includes(a) ? 'bg-accent text-accent-foreground border-accent' : 'bg-background border-input text-foreground'}`}
                        title={PREDEFINED_AMENITIES[a].label}
                      >
                        {PREDEFINED_AMENITIES[a].label}
                      </button>
                    ))}
                  </div>
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
          <div className="lg:col-span-8">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm text-muted-foreground">{filtered.length} results</div>
              <div className="flex items-center gap-2">
                <Badge className="bg-accent/10 text-accent border-accent/20"><SlidersHorizontal className="h-3 w-3 mr-1" /> Smart sort</Badge>
              </div>
            </div>
            {filtered.length === 0 ? (
              <Card className="p-8 text-center">
                <div className="text-muted-foreground">No hotels match your filters.</div>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {filtered.map((hotel) => (
                  <HotelCard key={hotel._id} hotel={hotel} onViewDetails={(id) => navigate(`/hotel/${id}`)} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


