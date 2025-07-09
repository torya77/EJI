import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  User, 
  Building2, 
  MapPin, 
  Camera, 
  Calendar,
  DollarSign,
  BarChart3,
  Settings,
  Users,
  Heart
} from 'lucide-react';

const ProfileTypeSelector = ({ userType, onTypeChange }) => {
  const [selectedType, setSelectedType] = useState(userType || 'traveler');

  const profileTypes = [
    {
      id: 'traveler',
      title: 'Profil Voyageur',
      description: 'Découvrez l\'Algérie, réservez des expériences et partagez vos aventures',
      icon: User,
      color: 'blue',
      features: [
        'Réserver des événements et restaurants',
        'Acheter des produits artisanaux',
        'Partager vos expériences de voyage',
        'Créer et gérer vos listes de favoris',
        'Suivre d\'autres voyageurs',
        'Accéder au traducteur multilingue'
      ]
    },
    {
      id: 'provider',
      title: 'Profil Prestataire',
      description: 'Proposez vos services et gérez vos réservations comme un professionnel',
      icon: Building2,
      color: 'green',
      features: [
        'Tableau de bord de gestion',
        'Créer et gérer vos offres',
        'Suivre vos réservations en temps réel',
        'Statistiques et analytics',
        'Gestion des disponibilités',
        'Messagerie avec les clients'
      ]
    }
  ];

  const handleTypeSelect = (type) => {
    setSelectedType(type);
    onTypeChange(type);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Choisissez votre type de profil
        </h2>
        <p className="text-gray-600">
          Sélectionnez le profil qui correspond le mieux à vos besoins
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {profileTypes.map((type) => {
          const Icon = type.icon;
          const isSelected = selectedType === type.id;
          
          return (
            <Card 
              key={type.id}
              className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                isSelected 
                  ? `border-2 border-${type.color}-500 bg-${type.color}-50` 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleTypeSelect(type.id)}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 rounded-lg bg-${type.color}-100 flex items-center justify-center`}>
                      <Icon className={`w-6 h-6 text-${type.color}-600`} />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{type.title}</CardTitle>
                      <CardDescription className="text-sm">
                        {type.description}
                      </CardDescription>
                    </div>
                  </div>
                  {isSelected && (
                    <Badge className={`bg-${type.color}-500 text-white`}>
                      Sélectionné
                    </Badge>
                  )}
                </div>
              </CardHeader>
              
              <CardContent>
                <ul className="space-y-2">
                  {type.features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                      <div className={`w-1.5 h-1.5 rounded-full bg-${type.color}-500`}></div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                {isSelected && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <Button 
                      className={`w-full bg-${type.color}-600 hover:bg-${type.color}-700`}
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle profile setup
                      }}
                    >
                      Configurer mon profil {type.title.toLowerCase()}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Preview Cards */}
      {selectedType && (
        <Card className="bg-gradient-to-r from-gray-50 to-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="w-5 h-5" />
              <span>Aperçu de votre tableau de bord</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedType === 'traveler' ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg p-4 text-center">
                  <Heart className="w-8 h-8 text-red-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">12</div>
                  <div className="text-sm text-gray-600">Favoris</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <Calendar className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">5</div>
                  <div className="text-sm text-gray-600">Réservations</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <Camera className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">23</div>
                  <div className="text-sm text-gray-600">Photos</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <Users className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">156</div>
                  <div className="text-sm text-gray-600">Abonnés</div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg p-4 text-center">
                  <DollarSign className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">45,230</div>
                  <div className="text-sm text-gray-600">DZD ce mois</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <Calendar className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">28</div>
                  <div className="text-sm text-gray-600">Réservations</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <BarChart3 className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">4.8</div>
                  <div className="text-sm text-gray-600">Note moyenne</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <Users className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">342</div>
                  <div className="text-sm text-gray-600">Clients</div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProfileTypeSelector;