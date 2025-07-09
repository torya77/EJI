import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import Events from "./pages/Events";
import Restaurants from "./pages/Restaurants";
import Marketplace from "./pages/Marketplace";
import Social from "./pages/Social";
import { Toaster } from "./components/ui/toaster";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/restaurants" element={<Restaurants />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/social" element={<Social />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </div>
  );
}

export default App;