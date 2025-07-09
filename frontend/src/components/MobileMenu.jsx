import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  X, 
  MapPin, 
  Calendar, 
  Store, 
  Users,
  Languages,
  Calculator,
  User,
  BarChart3,
  Settings,
  LogOut,
  Globe,
  Heart
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const MobileMenu = ({ isOpen, onClose, onOpenTranslator, onOpenCurrencyConverter }) => {
  const location = useLocation();
  const { t, currentLanguage, changeLanguage, availableLanguages } = useLanguage();
  
  const navItems = [
    { path: '/', label: t('home'), icon: MapPin },
    { path: '/events', label: t('events'), icon: Calendar },
    { path: '/restaurants', label: t('restaurants'), icon: Store },
    { path: '/marketplace', label: t('marketplace'), icon: Store },
    { path: '/social', label: t('social'), icon: Users }
  ];

  const languageLabels = {
    fr: { label: 'FR', name: 'Français', flag: '🇫🇷' },
    ar: { label: 'ع', name: 'العربية', flag: '🇩🇿' },
    ko: { label: 'KO', name: '한국어', flag: '🇰🇷' },
    de: { label: 'DE', name: 'Deutsch', flag: '🇩🇪' },
    en: { label: 'EN', name: 'English', flag: '🇺🇸' }
  };

  const handleLinkClick = (path) => {
    window.location.href = path;
    onClose();
  };

  const handleLanguageChange = (lang) => {
    changeLanguage(lang);
  };

  const handleToolClick = (tool) => {
    onClose();
    if (tool === 'translator') {
      onOpenTranslator();
    } else if (tool === 'currency') {
      onOpenCurrencyConverter();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden">
      <div className="fixed inset-y-0 right-0 w-80 bg-white shadow-xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-green-600 to-red-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">🎒</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-red-600 bg-clip-text text-transparent">
                EJI
              </span>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 space-y-2">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Navigation
              </h3>
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <button
                    key={item.path}
                    onClick={() => handleLinkClick(item.path)}
                    className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-left transition-colors ${
                      isActive
                        ? 'bg-green-50 text-green-700 border border-green-200'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Services */}
            <div className="p-4 space-y-2 border-t">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Services
              </h3>
              <button
                onClick={() => handleToolClick('translator')}
                className="w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-left text-gray-700 hover:bg-blue-50 transition-colors"
              >
                <Languages className="w-5 h-5 text-blue-600" />
                <span className="font-medium">Traducteur</span>
              </button>
              <button
                onClick={() => handleToolClick('currency')}
                className="w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-left text-gray-700 hover:bg-green-50 transition-colors"
              >
                <Calculator className="w-5 h-5 text-green-600" />
                <span className="font-medium">Convertisseur</span>
              </button>
            </div>

            {/* Languages */}
            <div className="p-4 space-y-2 border-t">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Langues
              </h3>
              <div className="space-y-1">
                {availableLanguages.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => handleLanguageChange(lang)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors ${
                      currentLanguage === lang
                        ? 'bg-green-50 text-green-700'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{languageLabels[lang]?.flag}</span>
                      <span className="text-sm font-medium">{languageLabels[lang]?.name}</span>
                    </div>
                    {currentLanguage === lang && (
                      <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                        ✓
                      </Badge>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* User Menu */}
            <div className="p-4 space-y-2 border-t">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Compte
              </h3>
              <button
                onClick={() => handleLinkClick('/profile')}
                className="w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-left text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <User className="w-5 h-5" />
                <span className="font-medium">Profil Voyageur</span>
              </button>
              <button
                onClick={() => handleLinkClick('/provider-dashboard')}
                className="w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-left text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <BarChart3 className="w-5 h-5" />
                <span className="font-medium">Tableau de Bord</span>
              </button>
              <button
                onClick={() => handleLinkClick('/settings')}
                className="w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-left text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Settings className="w-5 h-5" />
                <span className="font-medium">Paramètres</span>
              </button>
              <button className="w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-left text-red-600 hover:bg-red-50 transition-colors">
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Déconnexion</span>
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t bg-gray-50">
            <div className="text-center">
              <p className="text-sm text-gray-500 flex items-center justify-center space-x-1">
                <Heart className="w-4 h-4 text-red-500" />
                <span>Créé avec passion pour l'Algérie</span>
                <span className="text-lg">🇩🇿</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;