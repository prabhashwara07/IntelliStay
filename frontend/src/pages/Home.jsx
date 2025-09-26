import React from 'react';
import HomeHero from '../components/HomeHero';
import HotelRecommendations from '../components/HotelRecommendations';
import Header from '../components/Header';

export default function Home() {
  return (
    <>
      <Header />
      <HomeHero />
      <HotelRecommendations />
    </>
  );
}
