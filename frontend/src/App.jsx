import React from "react";
import { Routes, Route } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import HotelView from "./pages/HotelView";
import AboutUs from "./pages/AboutUs";
import MyAccount from "./pages/MyAccount";
import Hotels from "./pages/Hotels";
import Contact from "./pages/Contact";

function App() {
  return (
    <>
      <div className="min-h-screen bg-background">
        
        <main>
          
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/hotel/:id" element={<HotelView />} />
            <Route path="/hotels" element={<Hotels />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/my-account" element={<MyAccount />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </>
  );
}

export default App;
