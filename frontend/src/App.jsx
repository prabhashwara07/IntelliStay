import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import HotelView from "./pages/HotelView";
import Bookings from "./pages/Bookings";
import Layout from "./components/Layout";
import Hotels from "./pages/Hotels";
import Contact from "./pages/Contact";
import BecomePartner from "./pages/BecomePartner";
import RoomManagement from "./pages/RoomManagement";
import OwnerBookings from "./pages/OwnerBookings";
import AdminHotelRequests from "./pages/AdminHotelRequests";
import Unauthorized from "./pages/Unauthorized";
import DashboardLayout from "./components/DashboardLayout";
import AdminDashboardLayout from "./components/AdminDashboardLayout";
import { ProtectedRoute, HotelOwnerRoute, AdminRoute, PublicRoute } from "./components/ProtectedRoute";

function App() {
  return (
    <div className="min-h-screen bg-background">
      <main>
        <Routes>
          {/* Public routes */}
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/hotel/:id" element={<HotelView />} />
            <Route path="/hotels" element={<Hotels />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/become-partner" element={<BecomePartner />} />
          </Route>

          {/* Protected user routes */}
          <Route element={<Layout />}>
            <Route 
              path="/bookings" 
              element={
                <ProtectedRoute>
                  <Bookings />
                </ProtectedRoute>
              } 
            />
          </Route>

          {/* Hotel Owner Dashboard - Protected with role check */}
          <Route 
            element={
              <HotelOwnerRoute>
                <DashboardLayout />
              </HotelOwnerRoute>
            }
          >
            <Route path="/dashboard" element={<Navigate to="/dashboard/rooms" replace />} />
            <Route path="/dashboard/rooms" element={<RoomManagement />} />
            <Route path="/dashboard/bookings" element={<OwnerBookings />} />
          </Route>

          {/* Admin Dashboard - Protected with admin role check */}
          <Route 
            element={
              <AdminRoute>
                <AdminDashboardLayout />
              </AdminRoute>
            }
          >
            <Route path="/admin" element={<Navigate to="/admin/requests" replace />} />
            <Route path="/admin/requests" element={<AdminHotelRequests />} />
            {/* Analytics removed */}
          </Route>

          {/* Error pages */}
          <Route path="/unauthorized" element={<Unauthorized />} />
        </Routes>
      </main>
      <Toaster position="top-right" richColors />
    </div>
  );
}

export default App;
