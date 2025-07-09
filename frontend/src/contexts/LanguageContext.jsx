import React, { createContext, useContext, useState, useEffect } from 'react';

// Language translations
const translations = {
  fr: {
    // Navigation
    home: "Accueil",
    events: "Événements",
    restaurants: "Restaurants",
    marketplace: "Marketplace",
    social: "Social",
    
    // Common
    search: "Rechercher",
    filter: "Filtrer",
    sort: "Trier",
    location: "Localisation",
    price: "Prix",
    rating: "Note",
    category: "Catégorie",
    date: "Date",
    time: "Heure",
    book: "Réserver",
    buy: "Acheter",
    like: "J'aime",
    share: "Partager",
    comment: "Commenter",
    
    // Home page
    heroTitle: "Découvrez l'Algérie Authentique",
    heroSubtitle: "Explorez les trésors cachés de l'Algérie, savourez sa gastronomie locale, et connectez-vous avec une communauté passionnée de voyageurs.",
    exploreByCategory: "Explorez par Catégorie",
    popularEvents: "Événements Populaires",
    recommendedRestaurants: "Restaurants Recommandés",
    algerianCrafts: "Artisanat Algérien",
    
    // Translation
    translator: "Traducteur",
    translatePhoto: "Traduire une photo",
    translateText: "Traduire du texte",
    conversation: "Conversation",
    takePhoto: "Prendre une photo",
    uploadPhoto: "Télécharger une photo",
    detectingText: "Détection du texte...",
    translating: "Traduction en cours...",
    translatedText: "Texte traduit",
    originalText: "Texte original",
    
    // Languages
    languages: {
      fr: "Français",
      ar: "العربية",
      ko: "한국어", 
      de: "Deutsch",
      en: "English"
    }
  },
  en: {
    // Navigation
    home: "Home",
    events: "Events",
    restaurants: "Restaurants",
    marketplace: "Marketplace",
    social: "Social",
    
    // Common
    search: "Search",
    filter: "Filter",
    sort: "Sort",
    location: "Location",
    price: "Price",
    rating: "Rating",
    category: "Category",
    date: "Date",
    time: "Time",
    book: "Book",
    buy: "Buy",
    like: "Like",
    share: "Share",
    comment: "Comment",
    
    // Home page
    heroTitle: "Discover Authentic Algeria",
    heroSubtitle: "Explore Algeria's hidden treasures, savor local gastronomy, and connect with a passionate community of travelers.",
    exploreByCategory: "Explore by Category",
    popularEvents: "Popular Events",
    recommendedRestaurants: "Recommended Restaurants",
    algerianCrafts: "Algerian Crafts",
    
    // Translation
    translator: "Translator",
    translatePhoto: "Translate Photo",
    translateText: "Translate Text",
    conversation: "Conversation",
    takePhoto: "Take Photo",
    uploadPhoto: "Upload Photo",
    detectingText: "Detecting text...",
    translating: "Translating...",
    translatedText: "Translated text",
    originalText: "Original text",
    
    // Languages
    languages: {
      fr: "Français",
      ar: "العربية",
      ko: "한국어",
      de: "Deutsch",
      en: "English"
    }
  },
  ar: {
    // Navigation
    home: "الرئيسية",
    events: "الأحداث",
    restaurants: "المطاعم",
    marketplace: "السوق",
    social: "التواصل",
    
    // Common
    search: "بحث",
    filter: "تصفية",
    sort: "ترتيب",
    location: "الموقع",
    price: "السعر",
    rating: "التقييم",
    category: "الفئة",
    date: "التاريخ",
    time: "الوقت",
    book: "حجز",
    buy: "شراء",
    like: "إعجاب",
    share: "مشاركة",
    comment: "تعليق",
    
    // Home page
    heroTitle: "اكتشف الجزائر الأصيلة",
    heroSubtitle: "استكشف كنوز الجزائر المخفية، تذوق المأكولات المحلية، وتواصل مع مجتمع شغوف من المسافرين.",
    exploreByCategory: "استكشف حسب الفئة",
    popularEvents: "الأحداث الشائعة",
    recommendedRestaurants: "المطاعم الموصى بها",
    algerianCrafts: "الحرف اليدوية الجزائرية",
    
    // Translation
    translator: "المترجم",
    translatePhoto: "ترجمة صورة",
    translateText: "ترجمة نص",
    conversation: "محادثة",
    takePhoto: "التقاط صورة",
    uploadPhoto: "رفع صورة",
    detectingText: "كشف النص...",
    translating: "جاري الترجمة...",
    translatedText: "النص المترجم",
    originalText: "النص الأصلي",
    
    // Languages
    languages: {
      fr: "الفرنسية",
      ar: "العربية",
      ko: "الكورية",
      de: "الألمانية",
      en: "الإنجليزية"
    }
  },
  ko: {
    // Navigation
    home: "홈",
    events: "이벤트",
    restaurants: "레스토랑",
    marketplace: "마켓플레이스",
    social: "소셜",
    
    // Common
    search: "검색",
    filter: "필터",
    sort: "정렬",
    location: "위치",
    price: "가격",
    rating: "평점",
    category: "카테고리",
    date: "날짜",
    time: "시간",
    book: "예약",
    buy: "구매",
    like: "좋아요",
    share: "공유",
    comment: "댓글",
    
    // Home page
    heroTitle: "진정한 알제리를 발견하세요",
    heroSubtitle: "알제리의 숨겨진 보물들을 탐험하고, 현지 음식을 맛보며, 열정적인 여행자 커뮤니티와 연결하세요.",
    exploreByCategory: "카테고리별 탐색",
    popularEvents: "인기 이벤트",
    recommendedRestaurants: "추천 레스토랑",
    algerianCrafts: "알제리 수공예품",
    
    // Translation
    translator: "번역기",
    translatePhoto: "사진 번역",
    translateText: "텍스트 번역",
    conversation: "대화",
    takePhoto: "사진 찍기",
    uploadPhoto: "사진 업로드",
    detectingText: "텍스트 감지 중...",
    translating: "번역 중...",
    translatedText: "번역된 텍스트",
    originalText: "원본 텍스트",
    
    // Languages
    languages: {
      fr: "프랑스어",
      ar: "아랍어",
      ko: "한국어",
      de: "독일어",
      en: "영어"
    }
  },
  de: {
    // Navigation
    home: "Startseite",
    events: "Veranstaltungen",
    restaurants: "Restaurants",
    marketplace: "Marktplatz",
    social: "Sozial",
    
    // Common
    search: "Suchen",
    filter: "Filter",
    sort: "Sortieren",
    location: "Ort",
    price: "Preis",
    rating: "Bewertung",
    category: "Kategorie",
    date: "Datum",
    time: "Zeit",
    book: "Buchen",
    buy: "Kaufen",
    like: "Gefällt mir",
    share: "Teilen",
    comment: "Kommentar",
    
    // Home page
    heroTitle: "Entdecken Sie das authentische Algerien",
    heroSubtitle: "Erkunden Sie Algeriens verborgene Schätze, genießen Sie die lokale Gastronomie und verbinden Sie sich mit einer leidenschaftlichen Reisegemeinschaft.",
    exploreByCategory: "Nach Kategorie erkunden",
    popularEvents: "Beliebte Veranstaltungen",
    recommendedRestaurants: "Empfohlene Restaurants",
    algerianCrafts: "Algerisches Handwerk",
    
    // Translation
    translator: "Übersetzer",
    translatePhoto: "Foto übersetzen",
    translateText: "Text übersetzen",
    conversation: "Gespräch",
    takePhoto: "Foto aufnehmen",
    uploadPhoto: "Foto hochladen",
    detectingText: "Text erkennen...",
    translating: "Übersetzen...",
    translatedText: "Übersetzter Text",
    originalText: "Originaltext",
    
    // Languages
    languages: {
      fr: "Französisch",
      ar: "Arabisch",
      ko: "Koreanisch",
      de: "Deutsch",
      en: "Englisch"
    }
  }
};

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('fr');
  
  useEffect(() => {
    // Load saved language from localStorage
    const savedLanguage = localStorage.getItem('eji-language');
    if (savedLanguage && translations[savedLanguage]) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);
  
  const changeLanguage = (languageCode) => {
    if (translations[languageCode]) {
      setCurrentLanguage(languageCode);
      localStorage.setItem('eji-language', languageCode);
    }
  };
  
  const t = (key) => {
    const keys = key.split('.');
    let value = translations[currentLanguage];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    return value || key;
  };
  
  const value = {
    currentLanguage,
    changeLanguage,
    t,
    availableLanguages: Object.keys(translations),
    translations: translations[currentLanguage]
  };
  
  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};