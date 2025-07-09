import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { 
  MapPin, 
  Star, 
  Users, 
  Heart,
  MessageCircle,
  Phone,
  Mail,
  Camera,
  Mountain,
  Car,
  Utensils,
  Globe,
  Award,
  Shield,
  Clock,
  Languages
} from 'lucide-react';

const LocalGuides = () => {
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');

  const cities = [
    { id: 'all', name: 'Toutes les villes' },
    { id: 'alger', name: 'Alger' },
    { id: 'oran', name: 'Oran' },
    { id: 'constantine', name: 'Constantine' },
    { id: 'annaba', name: 'Annaba' },
    { id: 'tlemcen', name: 'Tlemcen' },
    { id: 'ghardaia', name: 'Ghardaïa' },
    { id: 'tamanrasset', name: 'Tamanrasset' }
  ];

  const specialties = [
    { id: 'all', name: 'Toutes spécialités', icon: Globe },
    { id: 'culture', name: 'Culture & Histoire', icon: Award },
    { id: 'adventure', name: 'Aventure & Nature', icon: Mountain },
    { id: 'food', name: 'Gastronomie', icon: Utensils },
    { id: 'photography', name: 'Photographie', icon: Camera },
    { id: 'transport', name: 'Transport & Logistique', icon: Car }
  ];

  const guides = [
    {
      id: 1,
      name: "Ahmed Bensaid",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
      city: "alger",
      specialties: ["culture", "photography"],
      rating: 4.9,
      reviews: 127,
      languages: ["Français", "Arabe", "Anglais", "Espagnol"],
      experience: "8 ans",
      price: "3500 DZD/jour",
      description: "Guide professionnel spécialisé dans l'histoire de la Casbah d'Alger et la photographie urbaine. Photographe amateur passionné.",
      certifications: ["Guide officiel agréé", "Premier secours"],
      highlights: [
        "Expert de la Casbah d'Alger",
        "Photographe semi-professionnel", 
        "Histoire ottomane et coloniale",
        "Circuits photo personnalisés"
      ],
      availability: "Disponible toute l'année"
    },
    {
      id: 2,
      name: "Fatima Zahra Mokhtari",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b9df4b92",
      city: "oran",
      specialties: ["culture", "food"],
      rating: 4.8,
      reviews: 89,
      languages: ["Français", "Arabe", "Anglais"],
      experience: "6 ans",
      price: "3000 DZD/jour",
      description: "Guide passionnée par la culture oranaise et la gastronomie locale. Connaît tous les meilleurs restaurants traditionnels.",
      certifications: ["Guide touristique certifiée", "Hygiène alimentaire"],
      highlights: [
        "Spécialiste gastronomie oranaise",
        "Circuits culinaires authentiques",
        "Architecture hispano-mauresque",
        "Contacts restaurants locaux"
      ],
      availability: "Disponible 6j/7"
    },
    {
      id: 3,
      name: "Yacine Amellal",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
      city: "tamanrasset",
      specialties: ["adventure", "transport"],
      rating: 4.9,
      reviews: 156,
      languages: ["Français", "Arabe", "Tamachek", "Anglais"],
      experience: "12 ans",
      price: "5000 DZD/jour",
      description: "Guide touareg expert du Sahara. Organise des expéditions dans le Hoggar et connaît parfaitement les traditions touarègues.",
      certifications: ["Guide Sahara agréé", "Secourisme désert", "Conduite 4x4"],
      highlights: [
        "Expert du désert du Sahara",
        "Culture touarègue authentique",
        "Expéditions Hoggar/Tassili",
        "Survie en milieu désertique"
      ],
      availability: "Oct-Avril (saison fraîche)"
    },
    {
      id: 4,
      name: "Karim Bendjeloul",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
      city: "constantine",
      specialties: ["culture", "adventure"],
      rating: 4.7,
      reviews: 98,
      languages: ["Français", "Arabe", "Anglais"],
      experience: "5 ans",
      price: "2800 DZD/jour",
      description: "Guide dynamique spécialisé dans l'histoire de Constantine et les activités outdoor dans les gorges du Rhumel.",
      certifications: ["Guide montagne", "Premiers secours"],
      highlights: [
        "Histoire de Constantine la millénaire",
        "Randonnées gorges du Rhumel",
        "Ponts suspendus et architecture",
        "Activités outdoor sécurisées"
      ],
      availability: "Disponible toute l'année"
    },
    {
      id: 5,
      name: "Amina Taleb",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
      city: "ghardaia",
      specialties: ["culture", "food"],
      rating: 4.8,
      reviews: 73,
      languages: ["Français", "Arabe", "Mozabite"],
      experience: "4 ans",
      price: "3200 DZD/jour",
      description: "Guide locale mozabite, experte de l'architecture traditionnelle du M'Zab et de l'artisanat local.",
      certifications: ["Guide patrimoine UNESCO"],
      highlights: [
        "Architecture mozabite traditionnelle",
        "Patrimoine UNESCO du M'Zab",
        "Artisanat local authentique",
        "Culture mozabite préservée"
      ],
      availability: "Disponible sauf vendredi"
    },
    {
      id: 6,
      name: "Sofiane Boudiaf",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
      city: "tlemcen",
      specialties: ["culture", "photography"],
      rating: 4.6,
      reviews: 61,
      languages: ["Français", "Arabe", "Anglais"],
      experience: "3 ans",
      price: "2600 DZD/jour",
      description: "Jeune guide passionné par l'art andalou et l'architecture islamique de Tlemcen. Photographe professionnel.",
      certifications: ["Guide junior certifié"],
      highlights: [
        "Art et architecture andalouse",
        "Photographie professionnelle",
        "Histoire des dynasties islamiques",
        "Circuits culturels immersifs"
      ],
      availability: "Weekends et vacances"
    }
  ];

  const filteredGuides = guides.filter(guide => {
    const cityMatch = selectedCity === 'all' || guide.city === selectedCity;
    const specialtyMatch = selectedSpecialty === 'all' || guide.specialties.includes(selectedSpecialty);
    return cityMatch && specialtyMatch;
  });

  const handleContactGuide = (guide) => {
    const message = `Bonjour ${guide.name}, je suis intéressé(e) par vos services de guide local à ${cities.find(c => c.id === guide.city)?.name}. Pouvez-vous me donner plus d'informations sur vos disponibilités et tarifs ? Merci !`;
    const whatsappUrl = `https://wa.me/213${Math.floor(Math.random() * 900000000) + 100000000}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-600 to-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Users className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              Guides Locaux Authentiques
            </h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Découvrez l'Algérie avec des guides locaux passionnés et expérimentés. 
              Vivez des expériences authentiques et personnalisées.
            </p>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ville
              </label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {cities.map(city => (
                  <option key={city.id} value={city.id}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Spécialité
              </label>
              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {specialties.map(specialty => (
                  <option key={specialty.id} value={specialty.id}>
                    {specialty.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex items-end">
              <Button className="h-12 px-8 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
                Rechercher
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Guides Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {filteredGuides.length} Guide{filteredGuides.length > 1 ? 's' : ''} Disponible{filteredGuides.length > 1 ? 's' : ''}
            </h2>
            <p className="text-xl text-gray-600">
              Nos guides locaux certifiés et passionnés
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredGuides.map((guide) => (
              <Card key={guide.id} className="group hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <div className="flex items-start space-x-4">
                    <div className="relative">
                      <img 
                        src={guide.avatar} 
                        alt={guide.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <Shield className="w-3 h-3 text-white" />
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <CardTitle className="text-lg text-gray-900">
                        {guide.name}
                      </CardTitle>
                      <CardDescription className="flex items-center space-x-1 mb-2">
                        <MapPin className="w-4 h-4" />
                        <span>{cities.find(c => c.id === guide.city)?.name}</span>
                      </CardDescription>
                      
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="font-semibold">{guide.rating}</span>
                          <span className="text-gray-500">({guide.reviews})</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">{guide.experience}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                    {guide.description}
                  </p>
                  
                  {/* Specialties */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {guide.specialties.map((specialty) => {
                        const specialtyInfo = specialties.find(s => s.id === specialty);
                        const SpecialtyIcon = specialtyInfo?.icon || Globe;
                        return (
                          <Badge key={specialty} variant="secondary" className="bg-blue-100 text-blue-700">
                            <SpecialtyIcon className="w-3 h-3 mr-1" />
                            {specialtyInfo?.name}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                  
                  {/* Languages */}
                  <div className="mb-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Languages className="w-4 h-4" />
                      <span>{guide.languages.join(', ')}</span>
                    </div>
                  </div>
                  
                  {/* Highlights */}
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">Points forts :</h4>
                    <ul className="space-y-1">
                      {guide.highlights.slice(0, 3).map((highlight, index) => (
                        <li key={index} className="flex items-center text-xs text-gray-600">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* Availability & Price */}
                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-lg font-bold text-green-600">
                        {guide.price}
                      </div>
                      <div className="text-xs text-gray-500">
                        {guide.availability}
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        className="flex-1 bg-green-600 hover:bg-green-700"
                        onClick={() => handleContactGuide(guide)}
                      >
                        <MessageCircle className="w-4 h-4 mr-1" />
                        Contacter
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="border-green-500 text-green-600 hover:bg-green-50"
                      >
                        <Heart className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Comment ça marche ?
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">1. Choisissez votre guide</h3>
              <p className="text-gray-600">
                Parcourez les profils et sélectionnez le guide qui correspond à vos besoins
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">2. Contactez directement</h3>
              <p className="text-gray-600">
                Discutez de votre programme et négociez les détails par WhatsApp
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">3. Vivez l'expérience</h3>
              <p className="text-gray-600">
                Profitez d'une découverte authentique avec votre guide local
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-4">
            Vous êtes guide local ?
          </h2>
          <p className="text-xl mb-8">
            Rejoignez notre communauté de guides certifiés et partagez votre passion pour l'Algérie
          </p>
          <Button 
            size="lg" 
            className="bg-white text-green-600 hover:bg-gray-100"
          >
            Devenir Guide Partenaire
          </Button>
        </div>
      </section>
    </div>
  );
};

export default LocalGuides;