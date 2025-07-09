import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { ShoppingBag, MapPin, Star, Search, Filter, Store, Heart, ShoppingCart } from 'lucide-react';
import { mockProducts } from '../data/mock';

const Marketplace = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('rating');
  const [cart, setCart] = useState([]);
  const [favorites, setFavorites] = useState([]);

  const categories = ['all', 'Artisanat', 'Céramique', 'Bijoux', 'Textile', 'Alimentaire'];

  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating;
      case 'price_low':
        return a.price - b.price;
      case 'price_high':
        return b.price - a.price;
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  const addToCart = (product) => {
    setCart(prev => [...prev, product]);
  };

  const toggleFavorite = (productId) => {
    setFavorites(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Marketplace Artisanal
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Découvrez et achetez des produits artisanaux authentiques créés par les artisans algériens
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="grid md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Rechercher un produit..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 h-12 border-gray-200 focus:border-yellow-500"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full h-12 pl-11 pr-4 border border-gray-200 rounded-lg focus:border-yellow-500 focus:outline-none bg-white"
              >
                <option value="all">Toutes catégories</option>
                {categories.slice(1).map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div className="relative">
              <Store className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full h-12 pl-11 pr-4 border border-gray-200 rounded-lg focus:border-yellow-500 focus:outline-none bg-white"
              >
                <option value="rating">Par note</option>
                <option value="price_low">Prix croissant</option>
                <option value="price_high">Prix décroissant</option>
                <option value="name">Par nom</option>
              </select>
            </div>

            {/* Cart */}
            <div className="flex items-center space-x-2">
              <Button className="h-12 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white font-semibold flex-1">
                <ShoppingCart className="w-5 h-5 mr-2" />
                Panier ({cart.length})
              </Button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-8">
          <p className="text-gray-600">
            {sortedProducts.length} produit{sortedProducts.length > 1 ? 's' : ''} trouvé{sortedProducts.length > 1 ? 's' : ''}
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {sortedProducts.map(product => (
            <Card key={product.id} className="group hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1">
              <div className="relative">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4">
                  <Badge className="bg-yellow-500 text-white shadow-lg">
                    {product.category}
                  </Badge>
                </div>
                <div className="absolute bottom-4 left-4">
                  <div className="flex items-center space-x-1 text-white bg-black/50 px-2 py-1 rounded">
                    <Star className="w-4 h-4 fill-current text-yellow-400" />
                    <span className="text-sm font-medium">{product.rating}</span>
                  </div>
                </div>
                
                {/* Heart Icon */}
                <div className="absolute top-4 left-4">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => toggleFavorite(product.id)}
                    className="h-8 w-8 p-0 bg-white/90 backdrop-blur-sm hover:bg-white"
                  >
                    <Heart 
                      className={`w-4 h-4 ${favorites.includes(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
                    />
                  </Button>
                </div>

                {/* Stock Badge */}
                <div className="absolute bottom-4 right-4">
                  <Badge variant={product.inStock ? "default" : "destructive"} className="text-xs">
                    {product.inStock ? "En stock" : "Rupture"}
                  </Badge>
                </div>
              </div>
              
              <CardHeader>
                <CardTitle className="text-xl group-hover:text-yellow-600 transition-colors">
                  {product.name}
                </CardTitle>
                <CardDescription className="flex items-center space-x-1">
                  <Store className="w-4 h-4 text-gray-500" />
                  <span>{product.seller}</span>
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <MapPin className="w-4 h-4" />
                    <span>{product.location}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Badge variant="outline" className="text-xs">
                      {product.category}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium">{product.rating}</span>
                    </div>
                  </div>
                  <div className="text-xl font-bold text-yellow-600">
                    {product.price.toLocaleString()} {product.currency}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button 
                    size="sm" 
                    className="bg-yellow-600 hover:bg-yellow-700 transform hover:scale-105 transition-all duration-200 flex-1"
                    disabled={!product.inStock}
                    onClick={() => addToCart(product)}
                  >
                    <ShoppingBag className="w-4 h-4 mr-1" />
                    {product.inStock ? 'Ajouter au panier' : 'Rupture de stock'}
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="transform hover:scale-105 transition-all duration-200"
                  >
                    Voir détails
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {sortedProducts.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🛍️</div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
              Aucun produit trouvé
            </h3>
            <p className="text-gray-600 mb-6">
              Essayez de modifier vos critères de recherche ou explorez toutes les catégories
            </p>
            <Button 
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="bg-yellow-600 hover:bg-yellow-700"
            >
              Réinitialiser les filtres
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Marketplace;