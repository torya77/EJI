// Mock data for EJI Algeria Tourism App

export const mockEvents = [
  {
    id: 1,
    title: "Festival de Jazz d'Alger",
    location: "Alger, Algérie",
    date: "2025-08-15",
    time: "19:00",
    price: 2500,
    currency: "DZD",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=400&fit=crop",
    description: "Un festival de jazz international avec des artistes locaux et internationaux",
    coordinates: { lat: 36.737232, lng: 3.086472 },
    category: "Musique",
    rating: 4.5,
    attendees: 1200
  },
  {
    id: 2,
    title: "Visite Guidée de la Casbah",
    location: "Casbah d'Alger",
    date: "2025-07-20",
    time: "10:00",
    price: 1800,
    currency: "DZD",
    image: "https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=600&h=400&fit=crop",
    description: "Découvrez l'histoire fascinante de la Casbah d'Alger",
    coordinates: { lat: 36.784, lng: 3.060 },
    category: "Culture",
    rating: 4.8,
    attendees: 25
  },
  {
    id: 3,
    title: "Excursion au Sahara",
    location: "Taghit, Béchar",
    date: "2025-09-10",
    time: "06:00",
    price: 15000,
    currency: "DZD",
    image: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=600&h=400&fit=crop",
    description: "Aventure de 3 jours dans le désert du Sahara",
    coordinates: { lat: 30.106, lng: -2.026 },
    category: "Aventure",
    rating: 4.9,
    attendees: 15
  }
];

export const mockRestaurants = [
  {
    id: 1,
    name: "Restaurant Le Tantra",
    location: "Alger Centre",
    cuisine: "Algérienne Traditionnelle",
    rating: 4.7,
    priceRange: "€€€",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=400&fit=crop",
    description: "Cuisine algérienne authentique dans un cadre traditionnel",
    coordinates: { lat: 36.753768, lng: 3.058756 },
    specialties: ["Couscous", "Tajine", "Pastilla"],
    hours: "12:00 - 23:00"
  },
  {
    id: 2,
    name: "Café des Délices",
    location: "Sidi Bou Said, Alger",
    cuisine: "Café & Pâtisserie",
    rating: 4.5,
    priceRange: "€€",
    image: "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=600&h=400&fit=crop",
    description: "Café traditionnel avec vue sur la mer",
    coordinates: { lat: 36.768, lng: 3.055 },
    specialties: ["Makroud", "Café turc", "Thé à la menthe"],
    hours: "08:00 - 22:00"
  },
  {
    id: 3,
    name: "Restaurant Zitouna",
    location: "Constantine",
    cuisine: "Méditerranéenne",
    rating: 4.6,
    priceRange: "€€€",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop",
    description: "Restaurant méditerranéen moderne avec terrasse",
    coordinates: { lat: 36.365, lng: 6.615 },
    specialties: ["Poissons grillés", "Salade mechouia", "Baklava"],
    hours: "19:00 - 01:00"
  }
];

export const mockProducts = [
  {
    id: 1,
    name: "Tapis Berbère Traditionnel",
    price: 25000,
    currency: "DZD",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop",
    description: "Tapis berbère tissé à la main avec motifs traditionnels",
    category: "Artisanat",
    seller: "Atelier Tamazight",
    location: "Tizi Ouzou",
    rating: 4.8,
    inStock: true
  },
  {
    id: 2,
    name: "Poterie de Guellala",
    price: 3500,
    currency: "DZD",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop",
    description: "Poterie traditionnelle algérienne peinte à la main",
    category: "Céramique",
    seller: "Poterie Authentique",
    location: "Guellala",
    rating: 4.5,
    inStock: true
  },
  {
    id: 3,
    name: "Bijoux en Argent Kabyle",
    price: 8500,
    currency: "DZD",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&h=400&fit=crop",
    description: "Bijoux traditionnels kabyles en argent massif",
    category: "Bijoux",
    seller: "Bijouterie Amazigh",
    location: "Béjaïa",
    rating: 4.9,
    inStock: true
  }
];

export const mockPosts = [
  {
    id: 1,
    author: "Amina Benaissa",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b9df4b92?w=50&h=50&fit=crop&crop=face",
    content: "Magnifique coucher de soleil à Oran aujourd'hui ! 🌅 L'Algérie est vraiment un pays extraordinaire.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop",
    location: "Oran, Algérie",
    timestamp: "2025-07-15T18:30:00Z",
    likes: 234,
    comments: 18,
    shares: 12
  },
  {
    id: 2,
    author: "Karim Hamdi",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face",
    content: "Visite incroyable des ruines romaines de Timgad ! Un voyage dans le temps. Merci EJI pour cette expérience unique.",
    image: "https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=500&h=300&fit=crop",
    location: "Timgad, Batna",
    timestamp: "2025-07-14T14:20:00Z",
    likes: 156,
    comments: 23,
    shares: 8
  },
  {
    id: 3,
    author: "Salma Mokhtar",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face",
    content: "Dégustation de couscous traditionnel chez ma grand-mère à Ghardaïa 🍛 Les saveurs authentiques de l'Algérie !",
    location: "Ghardaïa, Algérie",
    timestamp: "2025-07-13T12:45:00Z",
    likes: 189,
    comments: 31,
    shares: 15
  }
];

export const mockUser = {
  id: 1,
  name: "Yacine Benali",
  email: "yacine@example.com",
  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face",
  location: "Alger, Algérie",
  joinDate: "2024-01-15",
  following: 156,
  followers: 234,
  posts: 23
};

export const mockCategories = [
  { id: 1, name: "Culture & Histoire", icon: "🏛️", count: 45 },
  { id: 2, name: "Aventure & Nature", icon: "🏔️", count: 32 },
  { id: 3, name: "Gastronomie", icon: "🍽️", count: 28 },
  { id: 4, name: "Festivals & Événements", icon: "🎭", count: 19 },
  { id: 5, name: "Plages & Détente", icon: "🏖️", count: 24 },
  { id: 6, name: "Artisanat Local", icon: "🎨", count: 31 }
];

export const mockReviews = [
  {
    id: 1,
    author: "Fatima Zahra",
    rating: 5,
    comment: "Expérience extraordinaire ! Guide très professionnel et passionné.",
    date: "2025-07-10",
    eventId: 1
  },
  {
    id: 2,
    author: "Ahmed Bensaid",
    rating: 4,
    comment: "Très bonne organisation, je recommande vivement !",
    date: "2025-07-08",
    eventId: 2
  }
];