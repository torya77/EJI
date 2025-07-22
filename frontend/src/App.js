import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import LandingPage from "./pages/LandingPage";
import Events from "./pages/Events";
import Restaurants from "./pages/Restaurants";
import Marketplace from "./pages/Marketplace";
import Social from "./pages/Social";
import ProviderDashboard from "./pages/ProviderDashboard";
import CarRental from "./pages/CarRental";
import LocalGuides from "./pages/LocalGuides";
import AdminDashboard from "./pages/AdminDashboard";
import AdminProviders from "./pages/AdminProviders";
import AdminActivities from "./pages/AdminActivities";
import ProviderRegistration from "./pages/ProviderRegistration";
import { Toaster } from "./components/ui/toaster";
import { LanguageProvider } from "./contexts/LanguageContext";

function App() {
  return (
    <LanguageProvider>
      <div className="App">
        <BrowserRouter>
          <Routes>
            {/* Landing Page as Home - no header for immersive experience */}
            <Route path="/" element={<LandingPage />} />
            
            {/* App Pages with Header */}
            <Route path="/app/*" element={
              <>
                <Header />
                <Routes>
                  <Route path="home" element={<Home />} />
                  <Route path="events" element={<Events />} />
                  <Route path="restaurants" element={<Restaurants />} />
                  <Route path="marketplace" element={<Marketplace />} />
                  <Route path="social" element={<Social />} />
                  <Route path="car-rental" element={<CarRental />} />
                  <Route path="local-guides" element={<LocalGuides />} />
                  <Route path="provider-dashboard" element={<ProviderDashboard />} />
                  <Route path="provider-registration" element={<ProviderRegistration />} />
                  <Route path="admin" element={<AdminDashboard />} />
                  <Route path="admin/providers" element={<AdminProviders />} />
                  <Route path="admin/activities" element={<AdminActivities />} />
                </Routes>
              </>
            } />
            
            {/* Legacy routes with header for direct access */}
            <Route path="/events" element={<><Header /><Events /></>} />
            <Route path="/restaurants" element={<><Header /><Restaurants /></>} />
            <Route path="/marketplace" element={<><Header /><Marketplace /></>} />
            <Route path="/social" element={<><Header /><Social /></>} />
            <Route path="/car-rental" element={<><Header /><CarRental /></>} />
            <Route path="/local-guides" element={<><Header /><LocalGuides /></>} />
            <Route path="/provider-dashboard" element={<><Header /><ProviderDashboard /></>} />
            <Route path="/provider-registration" element={<><Header /><ProviderRegistration /></>} />
            <Route path="/admin" element={<><Header /><AdminDashboard /></>} />
            <Route path="/admin/providers" element={<><Header /><AdminProviders /></>} />
            <Route path="/admin/activities" element={<><Header /><AdminActivities /></>} />
          </Routes>
          <Toaster />
        </BrowserRouter>
      </div>
    </LanguageProvider>
  );
}

export default App;