import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { MapPin, Star, Search, Filter, Clock, Utensils, Phone } from 'lucide-react';
import { mockRestaurants } from '../data/mock';

const Restaurants = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('all');
  const [selectedPriceRange, setSelectedPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('rating');

  const cuisineTypes = ['all', 'Algérienne Traditionnelle', 'Méditerranéenne', 'Café & Pâtisserie'];
  const priceRanges = ['all', '€', '€€', '€€€'];

  const filteredRestaurants = mockRestaurants.filter(restaurant => {
    const matchesSearch = restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         restaurant.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCuisine = selectedCuisine === 'all' || restaurant.cuisine === selectedCuisine;
    const matchesPrice = selectedPriceRange === 'all' || restaurant.priceRange === selectedPriceRange;
    return matchesSearch && matchesCuisine && matchesPrice;
  });

  const sortedRestaurants = [...filteredRestaurants].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating;
      case 'name':
        return a.name.localeCompare(b.name);
      case 'location':
        return a.location.localeCompare(b.location);
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-gray-50 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Restaurants en Algérie
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Savourez la gastronomie algérienne authentique dans les meilleurs restaurants du pays
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="grid md:grid-cols-5 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Rechercher un restaurant..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 h-12 border-gray-200 focus:border-blue-500"
              />
            </div>

            {/* Cuisine Filter */}
            <div className="relative">
              <Utensils className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={selectedCuisine}
                onChange={(e) => setSelectedCuisine(e.target.value)}
                className="w-full h-12 pl-11 pr-4 border border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none bg-white"
              >
                <option value="all">Toutes cuisines</option>
                {cuisineTypes.slice(1).map(cuisine => (
                  <option key={cuisine} value={cuisine}>{cuisine}</option>
                ))}
              </select>
            </div>

            {/* Price Range Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={selectedPriceRange}
                onChange={(e) => setSelectedPriceRange(e.target.value)}
                className="w-full h-12 pl-11 pr-4 border border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none bg-white"
              >
                <option value="all">Tous budgets</option>
                {priceRanges.slice(1).map(range => (
                  <option key={range} value={range}>{range}</option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full h-12 pl-11 pr-4 border border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none bg-white"
              >
                <option value="rating">Par note</option>
                <option value="name">Par nom</option>
                <option value="location">Par localisation</option>
              </select>
            </div>

            {/* Search Button */}
            <Button className="h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold">
              <Search className="w-5 h-5 mr-2" />
              Filtrer
            </Button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-8">
          <p className="text-gray-600">
            {sortedRestaurants.length} restaurant{sortedRestaurants.length > 1 ? 's' : ''} trouvé{sortedRestaurants.length > 1 ? 's' : ''}
          </p>
        </div>

        {/* Restaurants Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {sortedRestaurants.map(restaurant => (
            <Card key={restaurant.id} className="group hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1">
              <div className="relative">
                <img 
                  src={restaurant.image} 
                  alt={restaurant.name}
                  className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4">
                  <Badge className="bg-blue-500 text-white shadow-lg">
                    {restaurant.priceRange}
                  </Badge>
                </div>
                <div className="absolute bottom-4 left-4">
                  <div className="flex items-center space-x-1 text-white bg-black/50 px-2 py-1 rounded">
                    <Star className="w-4 h-4 fill-current text-yellow-400" />
                    <span className="text-sm font-medium">{restaurant.rating}</span>
                  </div>
                </div>
                
                {/* Cuisine Badge */}
                <div className="absolute top-4 left-4">
                  <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                    <span className="text-xs font-medium text-blue-600">
                      {restaurant.cuisine}
                    </span>
                  </div>
                </div>
              </div>
              
              <CardHeader>
                <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">
                  {restaurant.name}
                </CardTitle>
                <CardDescription className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span>{restaurant.location}</span>
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <p className="text-gray-600 mb-4 line-clamp-2">{restaurant.description}</p>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span>{restaurant.hours}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Utensils className="w-4 h-4" />
                    <span>{restaurant.cuisine}</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    <span className="font-medium">Spécialités:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {restaurant.specialties.map(specialty => (
                        <Badge key={specialty} variant="outline" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium">{restaurant.rating}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {restaurant.priceRange}
                    </Badge>
                  </div>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700 transform hover:scale-105 transition-all duration-200">
                    Réserver Table
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {sortedRestaurants.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🍽️</div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
              Aucun restaurant trouvé
            </h3>
            <p className="text-gray-600 mb-6">
              Essayez de modifier vos critères de recherche ou explorez toutes les cuisines
            </p>
            <Button 
              onClick={() => {
                setSearchQuery('');
                setSelectedCuisine('all');
                setSelectedPriceRange('all');
              }}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Réinitialiser les filtres
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Restaurants;