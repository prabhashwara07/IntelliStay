import React, { useState } from "react";
import { Sparkles, Search, Mic } from "lucide-react";
import { Input } from "./ui/input";
import { useGetResultsByAiSearchQuery, useLazyGetResultsByAiSearchQuery } from "../store/api";
import { setSearchQuery, selectCurrentQuery } from "../store/features/searchSlice";
import { useDispatch, useSelector } from "react-redux";

export default function HomeHero({ handleSearch: onSearch, handleKeyPress: onKeyPress , isLoading}) {
  const dispatch = useDispatch();
  const searchQuery = useSelector(selectCurrentQuery);

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    // Call the parent's handleSearch function
    if (onSearch) {
      onSearch();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
    // Also call parent's handleKeyPress if provided
    if (onKeyPress) {
      onKeyPress(e);
    }
  };

  const handleQueryChange = (e) => {
    dispatch(setSearchQuery(e.target.value));
  };

  const handleSuggestionClick = (suggestion) => {
    dispatch(setSearchQuery(suggestion));
  };



  return (
    <section className="relative min-h-[60vh] sm:min-h-[70vh] md:min-h-[75vh] my-4 mx-3 sm:my-6 sm:mx-6 md:mx-10 flex flex-col items-center justify-center overflow-hidden rounded-2xl sm:rounded-3xl border border-white/15 shadow-2xl bg-black/80">
      {/* Background Image with Blur */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat filter blur-md scale-105"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=400&fit=crop')`,
        }}
      ></div>

      {/* Stronger Dark Overlay for better text visibility */}
      <div className="absolute inset-0 bg-black/65 backdrop-brightness-75"></div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center pt-8 sm:pt-12 md:pt-8">
        {/* Hero Title */}
        <div className="mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight drop-shadow-lg">
            Find Your Perfect
            <span className="text-brand-primary ml-2 sm:ml-3 inline-flex items-center">
              Stay <Sparkles className="ml-1 sm:ml-2 h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8" />
            </span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed drop-shadow-md px-2">
            Discover amazing hotels from around the world. Browse our curated collection of luxury accommodations and find your perfect getaway.
          </p>
        </div>

        {/* Natural Language Search */}
        <div className="mb-8 sm:mb-12 max-w-2xl mx-auto px-2">
          
            <div className="relative bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 group-focus-within:bg-white/15 group-focus-within:border-white/30">
              <div className="flex items-center p-1 sm:p-2">
                <div className="flex-shrink-0 pl-3 sm:pl-4">
                  <Search className="h-4 w-4 sm:h-5 sm:w-5 text-white/70" />
                </div>
                <Input
                  type="text"
                  placeholder="Ask me anything... 'Find a beachfront hotel in Miami with spa' or 'Romantic getaway under $200'"
                  value={searchQuery}
                  onChange={handleQueryChange}
                  onKeyPress={handleKeyPress}
                  className="flex-1 bg-transparent border-0 text-white placeholder:text-white/60 text-sm sm:text-base md:text-lg px-2 sm:px-4 py-3 sm:py-4 focus-visible:ring-0 focus-visible:border-0 focus-visible:outline-none shadow-none"
                />
                <div className="flex items-center gap-1 sm:gap-2 pr-1 sm:pr-2">
                  <button
                    type="button"
                    className="p-1.5 sm:p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg sm:rounded-xl transition-all duration-200"
                    title="Voice search"
                  >
                    
                  </button>
                  <button
                    type="button"
                    onClick={handleSearch}
                    disabled={!searchQuery.trim() || isLoading}
                    className="bg-brand-primary hover:bg-brand-primary/90 disabled:bg-brand-primary/50 text-white px-3 sm:px-6 py-1.5 sm:py-2 rounded-lg sm:rounded-xl font-medium transition-all duration-200 disabled:cursor-not-allowed flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
                  >
                    <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline">{isLoading ? "Searching..." : "Search"}</span>
                    <span className="sm:hidden">{isLoading ? "..." : "Go"}</span>
                  </button>
                </div>
              </div>
            </div>
            
            {/* Search suggestions */}
            <div className="mt-3 sm:mt-4 flex flex-wrap justify-center gap-1.5 sm:gap-2 px-2">
              {[
                "Luxury hotels in Paris",
                "Pet-friendly resorts",
                "Hotels with pools near me"
              ].map((suggestion, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-white/80 bg-white/10 hover:bg-white/20 rounded-full border border-white/20 hover:border-white/30 transition-all duration-200 backdrop-blur-sm"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          
        </div>
        
        {/* Trust indicators using theme colors - Hidden on small screens */}
        <div className="mt-8 sm:mt-12 md:mt-16 hidden sm:flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-6 md:gap-8 text-xs sm:text-sm text-white/80 px-4">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-brand-accent rounded-full"></div>
            <span>Trusted by 50,000+ travelers</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-brand-accent rounded-full"></div>
            <span>Premium accommodations</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-brand-accent rounded-full"></div>
            <span>Best price guarantee</span>
          </div>
        </div>
      </div>

      {/* Subtle decorative elements using brand colors */}
      <div className="absolute top-1/4 left-4 sm:left-8 w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-brand-primary/25 rounded-full backdrop-blur-sm"></div>
      <div className="absolute bottom-1/4 right-4 sm:right-8 w-12 h-12 sm:w-16 sm:h-16 md:w-24 md:h-24 bg-brand-accent/25 rounded-full backdrop-blur-sm"></div>
      <div className="absolute top-1/3 right-8 sm:right-16 w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 bg-brand-accent/40 rounded-full backdrop-blur-sm"></div>
    </section>
  );
}
