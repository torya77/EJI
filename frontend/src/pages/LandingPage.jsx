import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { 
  MapPin, 
  Calendar, 
  Users, 
  Star, 
  Play,
  ChevronRight,
  Globe,
  Camera,
  Car,
  Compass,
  Heart,
  Shield,
  Trophy,
  Zap,
  ArrowRight,
  CheckCircle,
  Phone,
  Mail,
  Facebook,
  Instagram,
  Twitter
} from 'lucide-react';

const LandingPage = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const heroImages = [
    {
      url: 'https://images.unsplash.com/photo-1489573280374-2e193c63726c',
      title: 'Sahara Algérien',
      subtitle: 'L\'immensité dorée du plus grand désert du monde'
    },
    {
      url: 'https://images.unsplash.com/photo-1610133290889-0ed892ce5157',
      title: 'Casbah d\'Alger',
      subtitle: 'Patrimoine mondial UNESCO au cœur de la Méditerranée'
    },
    {
      url: 'https://images.unsplash.com/photo-1720607130885-acc11d73bed6',
      title: 'Architecture Islamique',
      subtitle: 'Trésors architecturaux millénaires'
    },
    {
      url: 'https://images.unsplash.com/photo-1486314030120-d5ab85fe58cd',
      title: 'Coucher de Soleil Saharien',
      subtitle: 'Spectacles naturels à couper le souffle'
    }
  ];

  const features = [
    {
      icon: <MapPin className="w-8 h-8 text-green-600" />,
      title: "Découverte Authentique",
      description: "Explorez les trésors cachés de l'Algérie avec nos guides locaux passionnés"
    },
    {
      icon: <Users className="w-8 h-8 text-blue-600" />,
      title: "Guides Certifiés",
      description: "Rencontrez des experts locaux pour une expérience inoubliable"
    },
    {
      icon: <Camera className="w-8 h-8 text-purple-600" />,
      title: "Traducteur Photo",
      description: "Comprenez les menus et panneaux grâce à notre traducteur intelligent"
    },
    {
      icon: <Car className="w-8 h-8 text-red-600" />,
      title: "Transport Facile",
      description: "Location de voitures avec nos partenaires Yassir et iDrive"
    },
    {
      icon: <Globe className="w-8 h-8 text-indigo-600" />,
      title: "Multilingue",
      description: "Support en 5 langues : Français, Arabe, Anglais, Allemand, Coréen"
    },
    {
      icon: <Shield className="w-8 h-8 text-red-500" />,
      title: "Qualité Garantie",
      description: "Prestataires certifiés et approuvés par notre équipe qualité"
    }
  ];

  const destinations = [
    {
      image: 'https://images.unsplash.com/photo-1610133290889-0ed892ce5157',
      name: 'Alger - La Blanche',
      description: 'Capitale historique avec la célèbre Casbah UNESCO',
      activities: 12,
      rating: 4.8
    },
    {
      image: 'https://images.unsplash.com/photo-1489573280374-2e193c63726c',
      name: 'Sahara Algérien',
      description: 'Aventures dans les dunes dorées du grand désert',
      activities: 8,
      rating: 4.9
    },
    {
      image: 'https://images.unsplash.com/photo-1658996403259-5a2dd3efc6fa',
      name: 'Monuments Historiques',
      description: 'Architecture islamique et sites patrimoniaux',
      activities: 15,
      rating: 4.7
    }
  ];

  const testimonials = [
    {
      name: "Marie Dubois",
      location: "Paris, France",
      rating: 5,
      text: "Une expérience extraordinaire ! La Casbah d'Alger est magique et notre guide Ahmed était passionnant.",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
    },
    {
      name: "James Wilson",
      location: "London, UK",
      rating: 5,
      text: "Le Sahara... je n'ai jamais rien vu d'aussi beau. EJI a rendu ce voyage parfait du début à la fin.",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
    },
    {
      name: "Yuki Tanaka",
      location: "Tokyo, Japon",
      text: "L'application multilingue m'a beaucoup aidée. Les prestataires sont professionnels et accueillants.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
    }
  ];

  const stats = [
    { number: "500+", label: "Expériences Uniques" },
    { number: "200+", label: "Guides Certifiés" },
    { number: "50k+", label: "Voyageurs Satisfaits" },
    { number: "48", label: "Wilayas Couvertes" }
  ];

  // Auto-rotate hero images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        (prevIndex + 1) % heroImages.length
      );
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Images Carousel */}
        <div className="absolute inset-0">
          {heroImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentImageIndex ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <div
                className="w-full h-full bg-cover bg-center"
                style={{ backgroundImage: `url(${image.url})` }}
              />
              <div className="absolute inset-0 bg-black bg-opacity-40" />
            </div>
          ))}
        </div>
        
        {/* Content */}
        <div className="relative z-10 text-center text-white px-4 max-w-6xl mx-auto">
          <Badge className="mb-6 bg-gradient-to-r from-green-600 to-red-600 text-white px-6 py-2 text-lg">
            🏛️ Découvrez l'Algérie Authentique
          </Badge>
          
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-green-400 via-red-500 to-green-400 bg-clip-text text-transparent">EJI</span> - Explore
            <br />
            Journey Intelligence
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-3xl mx-auto">
            {heroImages[currentImageIndex].subtitle}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link to="/events">
              <Button className="bg-gradient-to-r from-green-600 via-red-600 to-green-700 hover:from-green-700 hover:via-red-700 hover:to-green-800 text-white px-8 py-4 text-lg rounded-full shadow-lg transform hover:scale-105 transition-all">
                <Play className="w-5 h-5 mr-2" />
                Commencer l'Aventure
              </Button>
            </Link>
            
            <Link to="/provider-registration">
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-black px-8 py-4 text-lg rounded-full">
                Devenir Prestataire
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
          
          {/* Image indicators */}
          <div className="flex justify-center space-x-2">
            {heroImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                }`}
              />
            ))}
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2"></div>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-20 bg-gradient-to-r from-green-600 via-red-600 to-green-700 text-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="transform hover:scale-105 transition-transform">
                <div className="text-4xl md:text-5xl font-bold mb-2">{stat.number}</div>
                <div className="text-green-100 text-lg">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-blue-100 text-blue-800 px-4 py-2">
              Pourquoi Choisir EJI ?
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Une Expérience <span className="text-green-600">Exceptionnelle</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Découvrez l'Algérie comme jamais auparavant avec notre plateforme innovante
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <CardContent className="p-8 text-center">
                  <div className="mb-4 flex justify-center">{feature.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Destinations */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-purple-100 text-purple-800 px-4 py-2">
              Destinations Populaires
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Explorez les <span className="bg-gradient-to-r from-green-600 via-red-600 to-green-600 bg-clip-text text-transparent">Merveilles</span> d'Algérie
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {destinations.map((destination, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                <div className="relative h-64">
                  <img 
                    src={destination.image} 
                    alt={destination.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-white rounded-full px-3 py-1 flex items-center">
                    <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                    <span className="text-sm font-semibold">{destination.rating}</span>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{destination.name}</h3>
                  <p className="text-gray-600 mb-4">{destination.description}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {destination.activities} activités
                    </span>
                    <Link to="/events" className="text-green-600 hover:text-green-700 font-semibold flex items-center">
                      Découvrir
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gradient-to-r from-blue-50 to-green-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-yellow-100 text-yellow-800 px-4 py-2">
              Témoignages Clients
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Ce que nos <span className="bg-gradient-to-r from-green-600 via-red-600 to-green-600 bg-clip-text text-transparent">Voyageurs</span> disent
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-lg transition-all">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full mr-4"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                      <p className="text-sm text-gray-500">{testimonial.location}</p>
                    </div>
                  </div>
                  <div className="flex mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 italic">"{testimonial.text}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 via-red-600 to-green-800 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Prêt pour votre Aventure Algérienne ?
          </h2>
          <p className="text-xl mb-8 text-green-100">
            Rejoignez des milliers de voyageurs qui ont découvert la magie de l'Algérie avec EJI
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Link to="/events">
              <Button className="bg-white text-red-600 hover:bg-gray-100 hover:text-red-700 px-8 py-4 text-lg rounded-full font-semibold transform hover:scale-105 transition-all shadow-lg">
                <Compass className="w-5 h-5 mr-2" />
                Explorer Maintenant
              </Button>
            </Link>
            
            <Link to="/provider-registration">
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-red-600 px-8 py-4 text-lg rounded-full transition-all">
                Devenir Partenaire
                <Heart className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
          
          <div className="flex justify-center space-x-4 text-green-200">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              <span>Inscription Gratuite</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              <span>Support 24/7</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              <span>Guides Certifiés</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-red-600 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-lg">EJI</span>
                </div>
                <span className="text-2xl font-bold">Explore Journey Intelligence</span>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                Votre compagnon de voyage pour découvrir les trésors cachés de l'Algérie avec des guides locaux authentiques.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Navigation</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/events" className="hover:text-white transition-colors">Événements</Link></li>
                <li><Link to="/restaurants" className="hover:text-white transition-colors">Restaurants</Link></li>
                <li><Link to="/marketplace" className="hover:text-white transition-colors">Marketplace</Link></li>
                <li><Link to="/car-rental" className="hover:text-white transition-colors">Location Voitures</Link></li>
                <li><Link to="/local-guides" className="hover:text-white transition-colors">Guides Locaux</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  +213 xxx xxx xxx
                </li>
                <li className="flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  contact@eji-algerie.com
                </li>
                <li className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  Alger, Algérie
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2025 EJI - Explore Journey Intelligence. Tous droits réservés.</p>
            <p className="mt-2">Fait avec ❤️ pour promouvoir le tourisme algérien</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;