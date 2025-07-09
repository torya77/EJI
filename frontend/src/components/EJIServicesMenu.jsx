import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { 
  Languages, 
  Calculator, 
  Users,
  Camera,
  MessageCircle,
  DollarSign,
  Map,
  X,
  Sparkles,
  Globe,
  Heart
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const EJIServicesMenu = ({ isOpen, onClose, onOpenTranslator, onOpenCurrencyConverter }) => {
  const { t } = useLanguage();

  const services = [
    {
      id: 'translator',
      title: 'Traducteur Intelligent',
      description: 'Traduisez en temps réel avec vos hôtes locaux',
      icon: Languages,
      color: 'blue',
      gradient: 'from-blue-500 to-cyan-500',
      features: ['Traduction photo', 'Conversation', '5 langues'],
      action: onOpenTranslator
    },
    {
      id: 'currency',
      title: 'Convertisseur de Devises',
      description: 'Taux de change en temps réel',
      icon: Calculator,
      color: 'green',
      gradient: 'from-green-500 to-emerald-500',
      features: ['Taux réels', '11 devises', 'Hors ligne'],
      action: onOpenCurrencyConverter
    },
    {
      id: 'social',
      title: 'Communauté Voyageurs',
      description: 'Partagez vos aventures algériennes',
      icon: Users,
      color: 'purple',
      gradient: 'from-purple-500 to-pink-500',
      features: ['Photos', 'Conseils', 'Rencontres'],
      action: () => window.location.href = '/social'
    },
    {
      id: 'guide',
      title: 'Guide Interactif',
      description: 'Découvrez l\'Algérie comme un local',
      icon: Map,
      color: 'orange',
      gradient: 'from-orange-500 to-red-500',
      features: ['Carte offline', 'Lieux secrets', 'Itinéraires'],
      action: () => console.log('Guide feature')
    }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="text-center relative">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClose}
            className="absolute top-4 right-4"
          >
            <X className="w-4 h-4" />
          </Button>
          
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-red-600 rounded-2xl flex items-center justify-center">
              <span className="text-white font-bold text-2xl">🎒</span>
            </div>
            <div>
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-green-600 to-red-600 bg-clip-text text-transparent">
                EJI Services
              </CardTitle>
              <CardDescription className="text-lg">
                Vos outils essentiels pour voyager en Algérie
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <Card 
                  key={service.id} 
                  className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-gray-300 overflow-hidden"
                  onClick={service.action}
                >
                  <div className={`h-2 bg-gradient-to-r ${service.gradient}`}></div>
                  
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${service.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-gray-700 transition-colors">
                          {service.title}
                        </h3>
                        <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                          {service.description}
                        </p>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                          {service.features.map((feature, index) => (
                            <span 
                              key={index}
                              className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700"
                            >
                              <Sparkles className="w-3 h-3 mr-1" />
                              {feature}
                            </span>
                          ))}
                        </div>
                        
                        <Button 
                          className={`w-full bg-gradient-to-r ${service.gradient} hover:opacity-90 text-white font-semibold group-hover:shadow-lg transition-all duration-300`}
                          onClick={(e) => {
                            e.stopPropagation();
                            service.action();
                          }}
                        >
                          Utiliser maintenant
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          
          {/* Quick Actions */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 text-center">
              Actions Rapides
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: Camera, label: 'Prendre Photo', action: () => onOpenTranslator() },
                { icon: MessageCircle, label: 'Conversation', action: () => onOpenTranslator() },
                { icon: DollarSign, label: 'Prix DZD', action: () => onOpenCurrencyConverter() },
                { icon: Globe, label: 'Explorer', action: () => window.location.href = '/' }
              ].map((action, index) => {
                const ActionIcon = action.icon;
                return (
                  <Button
                    key={index}
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center space-y-2 hover:bg-gray-50 border-2 hover:border-green-300"
                    onClick={action.action}
                  >
                    <ActionIcon className="w-6 h-6 text-gray-600" />
                    <span className="text-xs font-medium text-gray-600">{action.label}</span>
                  </Button>
                );
              })}
            </div>
          </div>
          
          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-500 flex items-center justify-center space-x-1">
              <Heart className="w-4 h-4 text-red-500" />
              <span>Créé avec passion pour l'Algérie</span>
              <span className="text-lg">🇩🇿</span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EJIServicesMenu;