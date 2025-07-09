import React, { useState, useEffect } from 'react';
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
  const { currentLanguage, changeLanguage, availableLanguages } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  
  const languageLabels = {
    fr: { label: 'FR', name: 'Français', flag: '🇫🇷' },
    ar: { label: 'ع', name: 'العربية', flag: '🇩🇿' },
    ko: { label: 'KO', name: '한국어', flag: '🇰🇷' },
    de: { label: 'DE', name: 'Deutsch', flag: '🇩🇪' },
    en: { label: 'EN', name: 'English', flag: '🇺🇸' }
  };
  
  const handleLanguageChange = (lang) => {
    changeLanguage(lang);
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest('[data-language-selector]')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isOpen]);
  
  return (
    <div className="relative" data-language-selector>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center space-x-1 px-2 min-w-[60px]">
            <span className="text-sm">{languageLabels[currentLanguage]?.flag}</span>
            <span className="font-medium text-xs">{languageLabels[currentLanguage]?.label}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 z-50">
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
                <span className="text-sm">{languageLabels[lang]?.name}</span>
              </div>
              {currentLanguage === lang && (
                <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                  ✓
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