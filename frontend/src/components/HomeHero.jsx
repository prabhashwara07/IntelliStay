import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { Search, Sparkles } from 'lucide-react';
import { Input } from '@/src/components/ui/input';
import { Button } from '@/src/components/ui/button';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const hotelImages = [
  {
    url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=400&fit=crop',
    title: 'Luxury Resort'
  },
  {
    url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=400&fit=crop',
    title: 'City Hotel'
  },
  {
    url: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&h=400&fit=crop',
    title: 'Beach Resort'
  },
  {
    url: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&h=400&fit=crop',
    title: 'Mountain Lodge'
  }
];

export default function HomeHero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-20">
      {/* Background Image with Blur */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat filter blur-md"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=400&fit=crop')`
        }}
      ></div>
      
      {/* Stronger Dark Overlay for better text visibility */}
      <div className="absolute inset-0 bg-black/70"></div>
      
      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        {/* Hero Title */}
        <div className="mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
            Find Your Perfect
            <span className="text-brand-primary ml-3 inline-flex items-center">
              Stay <Sparkles className="ml-2 h-8 w-8" />
            </span>
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto leading-relaxed drop-shadow-md">
            Simply describe what you're looking for in plain English. Our AI will understand your needs and find the perfect hotel for you.
          </p>
        </div>

        {/* AI Search Input */}
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              type="text"
              placeholder="e.g., 'I need a pet-friendly hotel in Paris near the Eiffel Tower with a pool for 3 nights'"
              className="w-full pl-5 pr-24 py-6 text-lg h-auto border focus:border-brand-primary focus:ring-brand-primary bg-white/95 backdrop-blur-sm"
            />
            <Button 
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
            >
              Search
            </Button>
          </div>
          
        </div>

        {/* Trust indicators using theme colors */}
        <div className="mt-16 flex justify-center items-center gap-8 text-sm text-white/80">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-brand-accent rounded-full"></div>
            <span>Trusted by 50,000+ travelers</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-brand-accent rounded-full"></div>
            <span>AI-powered search</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-brand-accent rounded-full"></div>
            <span>Best price guarantee</span>
          </div>
        </div>
      </div>

      {/* Subtle decorative elements using brand colors */}
      <div className="absolute top-1/4 left-8 w-16 h-16 bg-brand-primary/20 rounded-full backdrop-blur-sm"></div>
      <div className="absolute bottom-1/4 right-8 w-24 h-24 bg-brand-accent/20 rounded-full backdrop-blur-sm"></div>
      <div className="absolute top-1/3 right-16 w-8 h-8 bg-brand-accent/30 rounded-full backdrop-blur-sm"></div>
    </section>
  );
}