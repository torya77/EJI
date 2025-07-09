import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { 
  MapPin, 
  Navigation, 
  Star, 
  Clock, 
  Camera,
  Route,
  Bookmark,
  Download,
  X,
  Search,
  Filter,
  Eye,
  Heart,
  Share2
} from 'lucide-react';

const InteractiveGuide = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('places');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data for the guide
  const secretPlaces = [
    {
      id: 1,
      name: "Grotte de Beni Add",
      location: "Tlemcen",
      description: "Grotte spectaculaire avec stalactites et stalagmites",
      difficulty: "Facile",
      time: "2h",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&h=300&fit=crop",
      coordinates: { lat: 34.878, lng: -1.315 },
      tips: ["Apporter une lampe torche", "Chaussures antidérapantes recommandées"],
      category: "Nature"
    },
    {
      id: 2,
      name: "Ksar de Ghardaïa",
      location: "Ghardaïa",
      description: "Architecture mozabite traditionnelle préservée",
      difficulty: "Facile",
      time: "3h",
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=400&h=300&fit=crop",
      coordinates: { lat: 32.484, lng: 3.677 },
      tips: ["Visite guidée recommandée", "Respecter les traditions locales"],
      category: "Culture"
    },
    {
      id: 3,
      name: "Cascade de Kefrida",
      location: "Bejaia",
      description: "Cascade cachée dans la forêt de Babors",
      difficulty: "Modéré",
      time: "4h",
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=400&h=300&fit=crop",
      coordinates: { lat: 36.420, lng: 4.926 },
      tips: ["Randonnée nécessaire", "Baignade possible en été"],
      category: "Nature"
    }
  ];

  const itineraries = [
    {
      id: 1,
      title: "Tour des Aurès en 5 jours",
      description: "Découverte des montagnes berbères et villages traditionnels",
      duration: "5 jours",
      difficulty: "Modéré",
      highlights: ["Timgad", "Lambèse", "Batna", "Biskra"],
      distance: "450 km",
      price: "15000 DZD"
    },
    {
      id: 2,
      title: "Circuit du Hoggar",
      description: "Expédition dans le cœur du Sahara algérien",
      duration: "7 jours",
      difficulty: "Difficile",
      highlights: ["Tamanrasset", "Assekrem", "Tassili", "Djanet"],
      distance: "800 km",
      price: "35000 DZD"
    },
    {
      id: 3,
      title: "Côte algéroise",
      description: "Plages et sites historiques de la côte",
      duration: "3 jours",
      difficulty: "Facile",
      highlights: ["Alger", "Tipaza", "Cherchell", "Dellys"],
      distance: "200 km",
      price: "8000 DZD"
    }
  ];

  const offlineFeatures = [
    {
      icon: MapPin,
      title: "Cartes Offline",
      description: "Téléchargez les cartes pour naviguer sans internet",
      size: "2.5 GB"
    },
    {
      icon: Navigation,
      title: "GPS Intégré",
      description: "Navigation turn-by-turn même hors connexion",
      size: "500 MB"
    },
    {
      icon: Bookmark,
      title: "Points d'Intérêt",
      description: "Base de données complète des lieux emblématiques",
      size: "150 MB"
    },
    {
      icon: Camera,
      title: "Guide Photo",
      description: "Conseils photo géolocalisés pour chaque site",
      size: "300 MB"
    }
  ];

  const filteredPlaces = secretPlaces.filter(place => 
    place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    place.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-y-auto bg-white">
        <CardHeader className="text-center relative bg-white border-b">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClose}
            className="absolute top-4 right-4 hover:bg-gray-100"
          >
            <X className="w-4 h-4" />
          </Button>
          
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center">
              <MapPin className="w-8 h-8 text-white" />
            </div>
            <div>
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                Guide Interactif
              </CardTitle>
              <CardDescription className="text-lg text-gray-600">
                Découvrez l'Algérie comme un local
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="bg-white">
          {/* Tabs */}
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-6">
            {[
              { id: 'places', label: 'Lieux Secrets', icon: MapPin },
              { id: 'itineraries', label: 'Itinéraires', icon: Route },
              { id: 'offline', label: 'Mode Offline', icon: Download }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-white text-orange-600 shadow'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Places Tab */}
          {activeTab === 'places' && (
            <div className="space-y-6">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Rechercher un lieu secret..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-11 border-gray-300 focus:border-orange-500"
                />
              </div>

              {/* Places Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPlaces.map(place => (
                  <Card key={place.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative">
                      <img 
                        src={place.image} 
                        alt={place.name}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-3 right-3">
                        <Badge className="bg-orange-500 text-white">
                          {place.category}
                        </Badge>
                      </div>
                      <div className="absolute bottom-3 left-3">
                        <div className="flex items-center space-x-1 text-white bg-black/50 px-2 py-1 rounded">
                          <Star className="w-4 h-4 fill-current text-yellow-400" />
                          <span className="text-sm">{place.rating}</span>
                        </div>
                      </div>
                    </div>
                    
                    <CardContent className="p-4">
                      <h3 className="font-bold text-lg mb-1">{place.name}</h3>
                      <p className="text-sm text-gray-600 mb-2 flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {place.location}
                      </p>
                      <p className="text-gray-700 text-sm mb-3 line-clamp-2">{place.description}</p>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                        <span className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {place.time}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {place.difficulty}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="text-xs font-medium text-gray-700">Conseils locaux:</div>
                        <ul className="text-xs text-gray-600 space-y-1">
                          {place.tips.map((tip, index) => (
                            <li key={index} className="flex items-start">
                              <span className="w-1 h-1 bg-orange-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="flex space-x-2 mt-4">
                        <Button size="sm" className="bg-orange-500 hover:bg-orange-600 flex-1">
                          <Eye className="w-4 h-4 mr-1" />
                          Voir
                        </Button>
                        <Button size="sm" variant="outline">
                          <Heart className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Share2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Itineraries Tab */}
          {activeTab === 'itineraries' && (
            <div className="space-y-6">
              {itineraries.map(itinerary => (
                <Card key={itinerary.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold mb-2">{itinerary.title}</h3>
                        <p className="text-gray-600 mb-3">{itinerary.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-orange-600">{itinerary.price}</div>
                        <div className="text-sm text-gray-500">par personne</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="text-center">
                        <div className="font-semibold text-gray-900">{itinerary.duration}</div>
                        <div className="text-sm text-gray-500">Durée</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-gray-900">{itinerary.distance}</div>
                        <div className="text-sm text-gray-500">Distance</div>
                      </div>
                      <div className="text-center">
                        <Badge className={`${
                          itinerary.difficulty === 'Facile' ? 'bg-green-500' :
                          itinerary.difficulty === 'Modéré' ? 'bg-yellow-500' : 'bg-red-500'
                        } text-white`}>
                          {itinerary.difficulty}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <div className="text-sm font-medium text-gray-700 mb-2">Points forts:</div>
                      <div className="flex flex-wrap gap-2">
                        {itinerary.highlights.map((highlight, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {highlight}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex space-x-3">
                      <Button className="bg-orange-500 hover:bg-orange-600">
                        <Route className="w-4 h-4 mr-2" />
                        Voir l'itinéraire
                      </Button>
                      <Button variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Télécharger
                      </Button>
                      <Button variant="outline">
                        <Bookmark className="w-4 h-4 mr-2" />
                        Sauvegarder
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Offline Tab */}
          {activeTab === 'offline' && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2">Mode Offline</h3>
                <p className="text-gray-600">
                  Téléchargez les ressources pour naviguer sans connexion internet
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                {offlineFeatures.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <Card key={index} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-lg mb-1">{feature.title}</h4>
                            <p className="text-gray-600 mb-3">{feature.description}</p>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-500">{feature.size}</span>
                              <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                                <Download className="w-4 h-4 mr-1" />
                                Télécharger
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
              
              <Card className="bg-gradient-to-r from-orange-50 to-red-50">
                <CardContent className="p-6 text-center">
                  <h4 className="font-bold text-lg mb-2">Pack Complet Offline</h4>
                  <p className="text-gray-600 mb-4">
                    Téléchargez tout le contenu pour une expérience complète hors ligne
                  </p>
                  <div className="text-2xl font-bold text-orange-600 mb-4">3.5 GB</div>
                  <Button className="bg-orange-500 hover:bg-orange-600">
                    <Download className="w-4 h-4 mr-2" />
                    Télécharger le Pack Complet
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InteractiveGuide;