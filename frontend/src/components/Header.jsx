import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from './ui/dropdown-menu';
import { Search, Menu, MapPin, Calendar, Store, User, Settings, LogOut, BarChart3, Car, Users } from 'lucide-react';
import { mockUser } from '../data/mock';
import LanguageSelector from './LanguageSelector';
import TranslatorModal from './translator/TranslatorModal';
import CurrencyConverter from './CurrencyConverter';
import EJIServicesMenu from './EJIServicesMenu';
import InteractiveGuide from './InteractiveGuide';
import MobileMenu from './MobileMenu';
import NotificationCenter from './NotificationCenter';
import { useLanguage } from '../contexts/LanguageContext';

const Header = () => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [isTranslatorOpen, setIsTranslatorOpen] = useState(false);
  const [isCurrencyConverterOpen, setIsCurrencyConverterOpen] = useState(false);
  const [isServicesMenuOpen, setIsServicesMenuOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t } = useLanguage();
  
  const navItems = [
    { path: '/events', label: t('events'), icon: Calendar },
    { path: '/restaurants', label: t('restaurants'), icon: Store },
    { path: '/marketplace', label: t('marketplace'), icon: Store },
    { path: '/car-rental', label: 'Location Voitures', icon: Car },
    { path: '/local-guides', label: 'Guides Locaux', icon: Users }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo with Services */}
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setIsServicesMenuOpen(true)}
                className="flex items-center space-x-2 group relative"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-red-600 rounded-lg flex items-center justify-center transform group-hover:scale-110 transition-all duration-300 group-hover:shadow-lg">
                  <span className="text-white font-bold text-lg">🎒</span>
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-red-600 bg-clip-text text-transparent group-hover:from-green-700 group-hover:to-red-700 transition-all duration-300">
                  EJI
                </span>
                
                {/* Floating indicator */}
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-pulse group-hover:bg-green-500 transition-colors"></div>
              </button>
              
              <div className="hidden sm:block text-xs text-gray-500 border-l border-gray-300 pl-4">
                <div className="font-medium">Services</div>
                <div className="text-gray-400">Traducteur • Devises • Social</div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="hidden sm:flex items-center space-x-1 overflow-x-auto">
              <Link
                to="/"
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                  location.pathname === '/'
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <MapPin className="w-4 h-4" />
                <span>{t('home')}</span>
              </Link>
              
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                      isActive(item.path)
                        ? 'bg-green-50 text-green-700 border border-green-200'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Search and User Controls */}
            <div className="flex items-center space-x-3">
              {/* Search Bar */}
              <div className="relative hidden lg:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder={t('search') || "Rechercher..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-56 border-gray-300 focus:border-green-500 focus:ring-green-500"
                />
              </div>

              {/* Language Selector */}
              <LanguageSelector />

              {/* Notification Center */}
              <NotificationCenter />

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full p-0">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={mockUser.avatar} alt={mockUser.name} />
                      <AvatarFallback className="bg-green-100 text-green-700 text-xs">
                        {mockUser.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profil Voyageur</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => window.location.href = '/provider-dashboard'}>
                    <BarChart3 className="mr-2 h-4 w-4" />
                    <span>Tableau de Bord Prestataire</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Paramètres</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Déconnexion</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Mobile Menu */}
              <Button 
                variant="ghost" 
                size="sm" 
                className="lg:hidden p-1"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Modals */}
      <EJIServicesMenu 
        isOpen={isServicesMenuOpen}
        onClose={() => setIsServicesMenuOpen(false)}
        onOpenTranslator={() => {
          setIsServicesMenuOpen(false);
          setIsTranslatorOpen(true);
        }}
        onOpenCurrencyConverter={() => {
          setIsServicesMenuOpen(false);
          setIsCurrencyConverterOpen(true);
        }}
        onOpenGuide={() => {
          setIsServicesMenuOpen(false);
          setIsGuideOpen(true);
        }}
      />
      
      <TranslatorModal 
        isOpen={isTranslatorOpen}
        onClose={() => setIsTranslatorOpen(false)}
      />
      
      <CurrencyConverter 
        isOpen={isCurrencyConverterOpen}
        onClose={() => setIsCurrencyConverterOpen(false)}
      />

      <InteractiveGuide 
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />

      <MobileMenu 
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        onOpenTranslator={() => {
          setIsMobileMenuOpen(false);
          setIsTranslatorOpen(true);
        }}
        onOpenCurrencyConverter={() => {
          setIsMobileMenuOpen(false);
          setIsCurrencyConverterOpen(true);
        }}
      />
    </>
  );
};

export default Header;