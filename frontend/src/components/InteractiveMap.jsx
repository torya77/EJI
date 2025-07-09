import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { MapPin, Calendar, Star, Users, Clock } from 'lucide-react';
import { mockEvents, mockRestaurants } from '../data/mock';

const InteractiveMap = () => {
  const [selectedType, setSelectedType] = useState('all');
  const [selectedItem, setSelectedItem] = useState(null);

  const mapItems = [
    ...mockEvents.map(event => ({ ...event, type: 'event' })),
    ...mockRestaurants.map(restaurant => ({ ...restaurant, type: 'restaurant' }))
  ];

  const filteredItems = selectedType === 'all' 
    ? mapItems 
    : mapItems.filter(item => item.type === selectedType);

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Explorez l'Algérie
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Découvrez les événements, restaurants et attractions près de vous
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Map Controls */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-green-600" />
                  <span>Filtres</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {[
                    { value: 'all', label: 'Tout', count: mapItems.length },
                    { value: 'event', label: 'Événements', count: mockEvents.length },
                    { value: 'restaurant', label: 'Restaurants', count: mockRestaurants.length }
                  ].map(filter => (
                    <Button
                      key={filter.value}
                      variant={selectedType === filter.value ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedType(filter.value)}
                      className={selectedType === filter.value 
                        ? 'bg-green-600 hover:bg-green-700' 
                        : 'border-green-200 hover:border-green-300'
                      }
                    >
                      {filter.label} ({filter.count})
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Selected Item Details */}
            {selectedItem && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {selectedItem.title || selectedItem.name}
                  </CardTitle>
                  <CardDescription>
                    {selectedItem.location}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <img 
                    src={selectedItem.image} 
                    alt={selectedItem.title || selectedItem.name}
                    className="w-full h-40 object-cover rounded-lg mb-4"
                  />
                  <p className="text-gray-600 mb-4">{selectedItem.description}</p>
                  
                  <div className="space-y-2">
                    {selectedItem.type === 'event' && (
                      <>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <Calendar className="w-4 h-4" />
                          <span>{selectedItem.date} à {selectedItem.time}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <Users className="w-4 h-4" />
                          <span>{selectedItem.attendees} participants</span>
                        </div>
                      </>
                    )}
                    
                    {selectedItem.type === 'restaurant' && (
                      <>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <Clock className="w-4 h-4" />
                          <span>{selectedItem.hours}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <span>Cuisine: {selectedItem.cuisine}</span>
                        </div>
                      </>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium">{selectedItem.rating}</span>
                      </div>
                      {selectedItem.price && (
                        <Badge variant="secondary">
                          {selectedItem.price} {selectedItem.currency}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Map Display */}
          <div className="lg:col-span-2">
            <Card className="h-[600px]">
              <CardContent className="p-0 h-full">
                <div className="relative h-full bg-gradient-to-br from-green-100 to-blue-100 rounded-lg overflow-hidden">
                  {/* Simplified Map Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-blue-50"></div>
                  
                  {/* Algeria Map Outline */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-80 h-80 bg-green-200/30 rounded-lg transform rotate-12 flex items-center justify-center">
                      <span className="text-6xl">🇩🇿</span>
                    </div>
                  </div>
                  
                  {/* Map Points */}
                  {filteredItems.map((item, index) => (
                    <div
                      key={item.id}
                      className={`absolute cursor-pointer transform hover:scale-110 transition-transform ${
                        selectedItem?.id === item.id ? 'z-10' : ''
                      }`}
                      style={{
                        left: `${20 + (index * 15) % 60}%`,
                        top: `${20 + (index * 10) % 60}%`
                      }}
                      onClick={() => setSelectedItem(item)}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg ${
                        item.type === 'event' 
                          ? 'bg-red-500 text-white' 
                          : 'bg-green-500 text-white'
                      } ${selectedItem?.id === item.id ? 'ring-4 ring-blue-300' : ''}`}>
                        {item.type === 'event' ? (
                          <Calendar className="w-4 h-4" />
                        ) : (
                          <MapPin className="w-4 h-4" />
                        )}
                      </div>
                      
                      {/* Hover Card */}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 hover:opacity-100 transition-opacity">
                        <div className="bg-white rounded-lg shadow-xl p-3 min-w-[200px] border">
                          <h4 className="font-semibold text-sm">{item.title || item.name}</h4>
                          <p className="text-xs text-gray-500">{item.location}</p>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center space-x-1">
                              <Star className="w-3 h-3 text-yellow-500 fill-current" />
                              <span className="text-xs">{item.rating}</span>
                            </div>
                            <Badge variant="secondary" className="text-xs">
                              {item.type === 'event' ? 'Événement' : 'Restaurant'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InteractiveMap;