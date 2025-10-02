import React from "react";
import { Routes, Route } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import HotelView from "./pages/HotelView";
import Bookings from "./pages/Bookings";
import Layout from "./components/Layout";
import Hotels from "./pages/Hotels";
import Contact from "./pages/Contact";

function App() {
  return (
    <>
      <div className="min-h-screen bg-background">
        
        <main>
          
          <Routes>
            <Route element={<Layout /> }>
              <Route path="/" element={<Home />} />
              <Route path="/hotel/:id" element={<HotelView />} />
              <Route path="/hotels" element={<Hotels />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/bookings" element={<Bookings />} />
            </Route>
          </Routes>
        </main>
       
      </div>
    </>
  );
}

export default App;
