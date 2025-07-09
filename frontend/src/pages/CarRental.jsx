import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { 
  Car, 
  MapPin, 
  Calendar, 
  Users, 
  Star, 
  ExternalLink,
  Shield,
  CreditCard,
  Clock,
  Fuel,
  Settings,
  Phone
} from 'lucide-react';

const CarRental = () => {
  const [selectedCar, setSelectedCar] = useState(null);

  const carTypes = [
    {
      id: 1,
      name: "Économique",
      example: "Hyundai i10, Renault Clio",
      price: "2500 DZD/jour",
      image: "https://images.unsplash.com/photo-1627477574861-1426f26e82dc",
      features: ["5 places", "Climatisation", "Transmission manuelle"],
      perfect: "Parfait pour la ville"
    },
    {
      id: 2,
      name: "Compacte",
      example: "Peugeot 208, Renault Sandero",
      price: "3500 DZD/jour",
      image: "https://images.unsplash.com/photo-1610133290889-0ed892ce5157",
      features: ["5 places", "Climatisation", "GPS inclus"],
      perfect: "Idéal pour les couples"
    },
    {
      id: 3,
      name: "SUV",
      example: "Dacia Duster, Renault Captur",
      price: "5500 DZD/jour",
      image: "https://images.unsplash.com/photo-1486314030120-d5ab85fe58cd",
      features: ["7 places", "4x4", "Grande capacité bagages"],
      perfect: "Parfait pour les familles et le Sahara"
    }
  ];

  const rentalApps = [
    {
      id: 1,
      name: "Yassir",
      description: "Leader de la mobilité en Algérie",
      logo: "https://images.unsplash.com/photo-1631995872935-d964797502e0",
      features: [
        "Réservation instantanée",
        "Conducteurs vérifiés", 
        "Paiement sécurisé",
        "Support 24/7"
      ],
      downloadLinks: {
        playStore: "https://play.google.com/store/apps/details?id=com.yassir.rider",
        appStore: "https://apps.apple.com/app/yassir/id1234567890"
      },
      website: "https://yassir.com",
      rating: 4.8,
      users: "2M+"
    },
    {
      id: 2,
      name: "iDrive",
      description: "Location de voitures nouvelle génération",
      logo: "https://images.pexels.com/photos/719771/pexels-photo-719771.jpeg",
      features: [
        "Flotte moderne",
        "Prix transparents",
        "Assurance incluse",
        "Points de retrait multiples"
      ],
      downloadLinks: {
        playStore: "https://play.google.com/store/apps/details?id=com.idrive.algeria",
        appStore: "https://apps.apple.com/app/idrive/id0987654321"
      },
      website: "https://idrive.dz",
      rating: 4.6,
      users: "500K+"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-green-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Car className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              Location de Voitures en Algérie
            </h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Explorez l'Algérie en toute liberté avec nos partenaires de confiance. 
              Des voitures pour tous vos besoins, de la ville au désert.
            </p>
          </div>
        </div>
      </section>

      {/* Car Types Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Types de Véhicules Disponibles
            </h2>
            <p className="text-xl text-gray-600">
              Choisissez le véhicule parfait pour votre aventure algérienne
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {carTypes.map((car) => (
              <Card 
                key={car.id} 
                className={`group hover:shadow-xl transition-all duration-300 cursor-pointer ${
                  selectedCar === car.id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => setSelectedCar(car.id)}
              >
                <div className="relative">
                  <img 
                    src={car.image} 
                    alt={car.name}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <Badge className="absolute top-4 right-4 bg-blue-600">
                    {car.perfect}
                  </Badge>
                </div>
                
                <CardHeader>
                  <CardTitle className="text-xl text-gray-900">
                    {car.name}
                  </CardTitle>
                  <CardDescription>
                    {car.example}
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-3 mb-4">
                    {car.features.map((feature, index) => (
                      <div key={index} className="flex items-center text-sm text-gray-600">
                        <Shield className="w-4 h-4 text-green-500 mr-2" />
                        {feature}
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-lg font-bold text-blue-600">
                      {car.price}
                    </div>
                    <Button 
                      size="sm" 
                      className="bg-blue-600 hover:bg-blue-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedCar(car.id);
                      }}
                    >
                      Choisir
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Rental Apps Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Nos Partenaires de Location
            </h2>
            <p className="text-xl text-gray-600">
              Applications mobiles pour réserver votre véhicule en quelques clics
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {rentalApps.map((app) => (
              <Card key={app.id} className="group hover:shadow-xl transition-all duration-300">
                <CardHeader className="text-center">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-2xl overflow-hidden shadow-lg">
                    <img 
                      src={app.logo} 
                      alt={`${app.name} logo`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardTitle className="text-2xl text-gray-900">
                    {app.name}
                  </CardTitle>
                  <CardDescription className="text-lg">
                    {app.description}
                  </CardDescription>
                  
                  <div className="flex items-center justify-center space-x-4 mt-4">
                    <div className="flex items-center space-x-1">
                      <Star className="w-5 h-5 text-yellow-500 fill-current" />
                      <span className="font-semibold">{app.rating}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="w-5 h-5 text-gray-500" />
                      <span className="text-gray-600">{app.users} utilisateurs</span>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-3 mb-6">
                    {app.features.map((feature, index) => (
                      <div key={index} className="flex items-center text-sm text-gray-600">
                        <Shield className="w-4 h-4 text-green-500 mr-3" />
                        {feature}
                      </div>
                    ))}
                  </div>
                  
                  <div className="space-y-3">
                    <Button 
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      onClick={() => window.open(app.website, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Visiter le Site Web
                    </Button>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <Button 
                        variant="outline"
                        className="border-green-500 text-green-600 hover:bg-green-50"
                        onClick={() => window.open(app.downloadLinks.playStore, '_blank')}
                      >
                        <Phone className="w-4 h-4 mr-2" />
                        Play Store
                      </Button>
                      <Button 
                        variant="outline"
                        className="border-gray-500 text-gray-600 hover:bg-gray-50"
                        onClick={() => window.open(app.downloadLinks.appStore, '_blank')}
                      >
                        <Phone className="w-4 h-4 mr-2" />
                        App Store
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Reservation Form */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Réservation Rapide
            </h2>
            <p className="text-xl text-gray-600">
              Trouvez la voiture parfaite pour vos dates
            </p>
          </div>

          <Card className="bg-white shadow-xl">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <Label htmlFor="pickup">Lieu de prise en charge</Label>
                  <div className="relative mt-2">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      id="pickup"
                      placeholder="Alger, Oran, Constantine..."
                      className="pl-11"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="pickup-date">Date de prise en charge</Label>
                  <div className="relative mt-2">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      id="pickup-date"
                      type="date"
                      className="pl-11"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="return-date">Date de retour</Label>
                  <div className="relative mt-2">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      id="return-date"
                      type="date"
                      className="pl-11"
                    />
                  </div>
                </div>
                
                <div className="flex items-end">
                  <Button className="w-full h-11 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
                    Rechercher
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Tips Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Conseils pour la Location
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Assurance Complète</h3>
              <p className="text-gray-600">Vérifiez toujours que l'assurance est incluse</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Fuel className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Carburant</h3>
              <p className="text-gray-600">Politique du plein à plein généralement appliquée</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Paiement</h3>
              <p className="text-gray-600">Carte de crédit requise pour la caution</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Horaires</h3>
              <p className="text-gray-600">Services disponibles 24h/24 dans les aéroports</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CarRental;