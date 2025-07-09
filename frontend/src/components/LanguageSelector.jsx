import React, { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from './ui/dropdown-menu';
import { Languages, Globe } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const LanguageSelector = () => {
  const { currentLanguage, changeLanguage, t, availableLanguages } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  
  const languageLabels = {
    fr: { label: 'FR', name: 'Français', flag: '🇫🇷' },
    ar: { label: 'AR', name: 'العربية', flag: '🇩🇿' },
    ko: { label: 'KO', name: '한국어', flag: '🇰🇷' },
    de: { label: 'DE', name: 'Deutsch', flag: '🇩🇪' },
    en: { label: 'EN', name: 'English', flag: '🇺🇸' }
  };
  
  const handleLanguageChange = (lang) => {
    changeLanguage(lang);
    setIsOpen(false);
  };
  
  return (
    <div className="relative">
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center space-x-2">
            <Globe className="w-4 h-4" />
            <span className="hidden sm:inline">{languageLabels[currentLanguage]?.flag}</span>
            <span className="font-medium">{languageLabels[currentLanguage]?.label}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {availableLanguages.map((lang) => (
            <DropdownMenuItem
              key={lang}
              onClick={() => handleLanguageChange(lang)}
              className={`flex items-center justify-between cursor-pointer ${
                currentLanguage === lang ? 'bg-green-50 text-green-700' : ''
              }`}
            >
              <div className="flex items-center space-x-2">
                <span className="text-lg">{languageLabels[lang]?.flag}</span>
                <span>{languageLabels[lang]?.name}</span>
              </div>
              {currentLanguage === lang && (
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  {t('selected') || 'Actuel'}
                </Badge>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default LanguageSelector;