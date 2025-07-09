import React from 'react';
import Hero from '../components/Hero';
import InteractiveMap from '../components/InteractiveMap';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Calendar, MapPin, Star, Users, Store, Utensils, ShoppingBag } from 'lucide-react';
import { mockEvents, mockRestaurants, mockProducts, mockCategories } from '../data/mock';

const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <InteractiveMap />
      
      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Explorez par Catégorie
            </h2>
            <p className="text-xl text-gray-600">
              Découvrez l'Algérie selon vos passions
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockCategories.map(category => (
              <Card key={category.id} className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:border-green-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-4xl">{category.icon}</div>
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      {category.count}
                    </Badge>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                    {category.name}
                  </h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Events */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Événements Populaires
              </h2>
              <p className="text-xl text-gray-600">
                Ne manquez pas ces expériences uniques
              </p>
            </div>
            <Button variant="outline" className="hidden sm:block">
              Voir tous les événements
            </Button>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mockEvents.map(event => (
              <Card key={event.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
                <div className="relative">
                  <img 
                    src={event.image} 
                    alt={event.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-red-500 text-white">
                      {event.category}
                    </Badge>
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <div className="flex items-center space-x-1 text-white">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm font-medium">{event.rating}</span>
                    </div>
                  </div>
                </div>
                
                <CardHeader>
                  <CardTitle className="text-xl group-hover:text-green-600 transition-colors">
                    {event.title}
                  </CardTitle>
                  <CardDescription className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{event.location}</span>
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      <span>{event.date} à {event.time}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Users className="w-4 h-4" />
                      <span>{event.attendees} participants</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-lg font-bold text-green-600">
                      {event.price} {event.currency}
                    </div>
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                      Réserver
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Restaurants */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Restaurants Recommandés
              </h2>
              <p className="text-xl text-gray-600">
                Savourez la gastronomie algérienne authentique
              </p>
            </div>
            <Button variant="outline" className="hidden sm:block">
              Voir tous les restaurants
            </Button>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mockRestaurants.map(restaurant => (
              <Card key={restaurant.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
                <div className="relative">
                  <img 
                    src={restaurant.image} 
                    alt={restaurant.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-blue-500 text-white">
                      {restaurant.priceRange}
                    </Badge>
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <div className="flex items-center space-x-1 text-white">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm font-medium">{restaurant.rating}</span>
                    </div>
                  </div>
                </div>
                
                <CardHeader>
                  <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">
                    {restaurant.name}
                  </CardTitle>
                  <CardDescription className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{restaurant.location}</span>
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <p className="text-gray-600 mb-4">{restaurant.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Utensils className="w-4 h-4" />
                      <span>{restaurant.cuisine}</span>
                    </div>
                    <div className="text-sm text-gray-500">
                      <span className="font-medium">Spécialités:</span> {restaurant.specialties.join(', ')}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      {restaurant.hours}
                    </div>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      Réserver
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Artisanat Algérien
              </h2>
              <p className="text-xl text-gray-600">
                Découvrez les créations uniques de nos artisans
              </p>
            </div>
            <Button variant="outline" className="hidden sm:block">
              Voir la marketplace
            </Button>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mockProducts.map(product => (
              <Card key={product.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
                <div className="relative">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-yellow-500 text-white">
                      {product.category}
                    </Badge>
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <div className="flex items-center space-x-1 text-white">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm font-medium">{product.rating}</span>
                    </div>
                  </div>
                </div>
                
                <CardHeader>
                  <CardTitle className="text-xl group-hover:text-yellow-600 transition-colors">
                    {product.name}
                  </CardTitle>
                  <CardDescription className="flex items-center space-x-1">
                    <Store className="w-4 h-4" />
                    <span>{product.seller}</span>
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <p className="text-gray-600 mb-4">{product.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <MapPin className="w-4 h-4" />
                      <span>{product.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={product.inStock ? "default" : "destructive"}>
                        {product.inStock ? "En stock" : "Rupture"}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-lg font-bold text-yellow-600">
                      {product.price} {product.currency}
                    </div>
                    <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700" disabled={!product.inStock}>
                      <ShoppingBag className="w-4 h-4 mr-1" />
                      Acheter
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;