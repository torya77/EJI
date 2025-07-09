import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import Events from "./pages/Events";
import Restaurants from "./pages/Restaurants";
import Marketplace from "./pages/Marketplace";
import Social from "./pages/Social";
import ProviderDashboard from "./pages/ProviderDashboard";
import CarRental from "./pages/CarRental";
import LocalGuides from "./pages/LocalGuides";
import { Toaster } from "./components/ui/toaster";
import { LanguageProvider } from "./contexts/LanguageContext";

function App() {
  return (
    <LanguageProvider>
      <div className="App">
        <BrowserRouter>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/events" element={<Events />} />
            <Route path="/restaurants" element={<Restaurants />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/social" element={<Social />} />
            <Route path="/car-rental" element={<CarRental />} />
            <Route path="/local-guides" element={<LocalGuides />} />
            <Route path="/provider-dashboard" element={<ProviderDashboard />} />
          </Routes>
          <Toaster />
        </BrowserRouter>
      </div>
    </LanguageProvider>
  );
}

export default App;