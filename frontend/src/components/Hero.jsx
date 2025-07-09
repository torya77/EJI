import React from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Search, MapPin, Calendar, Store } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative min-h-[80vh] bg-gradient-to-br from-green-50 via-white to-red-50 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-32 h-32 bg-green-600 rounded-full"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-red-600 rounded-full"></div>
        <div className="absolute bottom-32 left-1/4 w-20 h-20 bg-yellow-500 rounded-full"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-black text-gray-900 leading-tight">
                Découvrez l'
                <span className="bg-gradient-to-r from-green-600 to-red-600 bg-clip-text text-transparent">
                  Algérie
                </span>
                <br />
                Authentique
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed max-w-xl">
                Explorez les trésors cachés de l'Algérie, savourez sa gastronomie locale, 
                et connectez-vous avec une communauté passionnée de voyageurs.
              </p>
            </div>

            {/* Search Bar */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <div className="grid md:grid-cols-4 gap-4">
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="Destination"
                    className="pl-11 h-12 border-gray-200 focus:border-green-500"
                  />
                </div>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="date"
                    className="pl-11 h-12 border-gray-200 focus:border-green-500"
                  />
                </div>
                <div className="relative">
                  <Store className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select className="w-full h-12 pl-11 pr-4 border border-gray-200 rounded-lg focus:border-green-500 focus:outline-none bg-white">
                    <option>Catégorie</option>
                    <option>Événements</option>
                    <option>Restaurants</option>
                    <option>Marketplace</option>
                  </select>
                </div>
                <Button className="h-12 bg-gradient-to-r from-green-600 to-red-600 hover:from-green-700 hover:to-red-700 text-white font-semibold">
                  <Search className="w-5 h-5 mr-2" />
                  Rechercher
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">500+</div>
                <div className="text-gray-600">Événements</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600">200+</div>
                <div className="text-gray-600">Restaurants</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-600">1000+</div>
                <div className="text-gray-600">Produits</div>
              </div>
            </div>
          </div>

          {/* Right Content - Hero Image */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-700">
              <img 
                src="https://images.unsplash.com/photo-1610133290889-0ed892ce5157" 
                alt="Casbah d'Alger" 
                className="w-full h-[600px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <h3 className="text-2xl font-bold mb-2">Casbah d'Alger</h3>
                <p className="text-white/90">Patrimoine mondial de l'UNESCO</p>
              </div>
            </div>
            
            {/* Floating Cards */}
            <div className="absolute -top-4 -right-4 bg-white rounded-xl shadow-lg p-4 animate-bounce">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <div className="text-sm font-semibold">Alger</div>
                  <div className="text-xs text-gray-500">Capitale</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;