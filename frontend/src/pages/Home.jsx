import React, { useState, useEffect } from "react";
import HomeHero from "../components/HomeHero";
import HotelRecommendations from "../components/HotelRecommendations";
import { useLazyGetResultsByAiSearchQuery } from "../store/api";
import { useSelector, useDispatch } from "react-redux";
import { selectCurrentQuery, clearSearchQuery } from "../store/features/searchSlice";
import AISearchResults from "../components/AISearchResults";

export default function Home() {
  const dispatch = useDispatch();
  const searchQuery = useSelector(selectCurrentQuery);
  // Use lazy query - returns a trigger function
  const [
    triggerSearch,
    { data: aiSearchResults, isLoading, isFetching, isError, error },
  ] = useLazyGetResultsByAiSearchQuery();

  const [results, setResults] = useState([]);
  const [localLoading, setLocalLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setLocalLoading(true);
    setHasSearched(true);
    // Trigger the search manually
    try {
      const result = await triggerSearch(searchQuery).unwrap();
      setResults(result);
      console.log("Search results:", result);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setLocalLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleClearSearch = () => {
    dispatch(clearSearchQuery());
    setResults([]);
    setHasSearched(false);
  };

  const handleNewSearch = () => {
    dispatch(clearSearchQuery());
    setResults([]);
    setHasSearched(false);
    // You could also navigate to a search page or focus the search input
  };

  // Keyboard shortcut handler for Escape key
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && hasSearched) {
        handleClearSearch();
        console.log("Search cleared with Escape key");
      }
    };

    // Add event listener
    document.addEventListener('keydown', handleKeyDown);

    // Cleanup event listener
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [hasSearched]); // Re-run effect when hasSearched changes

  return (
    <>
      <HomeHero
        handleSearch={handleSearch}
        handleKeyPress={handleKeyPress}
        isLoading={isLoading || isFetching || localLoading}
      />
      {!hasSearched ? (
        <HotelRecommendations />
      ) : (
        <AISearchResults
          searchResults={results}
          isLoading={isLoading || isFetching || localLoading}
          isError={isError}
          error={error}
          searchQuery={searchQuery}
          onClearSearch={handleClearSearch}
          onNewSearch={handleNewSearch}
        />
      )}
    </>
  );
}
