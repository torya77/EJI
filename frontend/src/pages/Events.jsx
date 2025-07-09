import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Calendar, MapPin, Star, Users, Search, Filter, Clock } from 'lucide-react';
import { mockEvents, mockCategories } from '../data/mock';

const Events = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  const filteredEvents = mockEvents.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
                           event.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const sortedEvents = [...filteredEvents].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(a.date) - new Date(b.date);
      case 'price':
        return a.price - b.price;
      case 'rating':
        return b.rating - a.rating;
      case 'popularity':
        return b.attendees - a.attendees;
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
            Événements en Algérie
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Découvrez les événements culturels, festivals et expériences uniques à travers l'Algérie
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="grid md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Rechercher un événement..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 h-12 border-gray-200 focus:border-green-500"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full h-12 pl-11 pr-4 border border-gray-200 rounded-lg focus:border-green-500 focus:outline-none bg-white"
              >
                <option value="all">Toutes catégories</option>
                <option value="culture">Culture</option>
                <option value="musique">Musique</option>
                <option value="aventure">Aventure</option>
                <option value="gastronomie">Gastronomie</option>
              </select>
            </div>

            {/* Sort */}
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full h-12 pl-11 pr-4 border border-gray-200 rounded-lg focus:border-green-500 focus:outline-none bg-white"
              >
                <option value="date">Par date</option>
                <option value="price">Par prix</option>
                <option value="rating">Par note</option>
                <option value="popularity">Par popularité</option>
              </select>
            </div>

            {/* Search Button */}
            <Button className="h-12 bg-gradient-to-r from-green-600 to-red-600 hover:from-green-700 hover:to-red-700 text-white font-semibold">
              <Search className="w-5 h-5 mr-2" />
              Filtrer
            </Button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-8">
          <p className="text-gray-600">
            {sortedEvents.length} événement{sortedEvents.length > 1 ? 's' : ''} trouvé{sortedEvents.length > 1 ? 's' : ''}
          </p>
        </div>

        {/* Events Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {sortedEvents.map(event => (
            <Card key={event.id} className="group hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1">
              <div className="relative">
                <img 
                  src={event.image} 
                  alt={event.title}
                  className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4">
                  <Badge className="bg-red-500 text-white shadow-lg">
                    {event.category}
                  </Badge>
                </div>
                <div className="absolute bottom-4 left-4">
                  <div className="flex items-center space-x-1 text-white bg-black/50 px-2 py-1 rounded">
                    <Star className="w-4 h-4 fill-current text-yellow-400" />
                    <span className="text-sm font-medium">{event.rating}</span>
                  </div>
                </div>
                
                {/* Price Badge */}
                <div className="absolute top-4 left-4">
                  <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                    <span className="text-sm font-bold text-green-600">
                      {event.price} {event.currency}
                    </span>
                  </div>
                </div>
              </div>
              
              <CardHeader>
                <CardTitle className="text-xl group-hover:text-green-600 transition-colors">
                  {event.title}
                </CardTitle>
                <CardDescription className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span>{event.location}</span>
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <p className="text-gray-600 mb-4 line-clamp-3">{event.description}</p>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(event.date).toLocaleDateString('fr-FR', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Users className="w-4 h-4" />
                    <span>{event.attendees} participants prévus</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-xs">
                      {event.category}
                    </Badge>
                  </div>
                  <Button size="sm" className="bg-green-600 hover:bg-green-700 transform hover:scale-105 transition-all duration-200">
                    Réserver Maintenant
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {sortedEvents.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🎭</div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
              Aucun événement trouvé
            </h3>
            <p className="text-gray-600 mb-6">
              Essayez de modifier vos critères de recherche ou explorez toutes les catégories
            </p>
            <Button 
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="bg-green-600 hover:bg-green-700"
            >
              Réinitialiser les filtres
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;