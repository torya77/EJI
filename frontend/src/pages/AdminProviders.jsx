import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Mail,
  Phone,
  MapPin,
  Star,
  TrendingUp,
  DollarSign,
  Calendar,
  AlertTriangle
} from 'lucide-react';

const AdminProviders = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');

  const [providers, setProviders] = useState([
    {
      id: 1,
      name: 'Ahmed Bensaid',
      email: 'ahmed.bensaid@gmail.com',
      phone: '+213 555 123 456',
      type: 'Guide Local',
      location: 'Alger',
      status: 'active',
      joinDate: '2024-12-15',
      rating: 4.9,
      totalBookings: 127,
      totalRevenue: 145000,
      lastActivity: '2025-07-09',
      documents: {
        idCard: 'verified',
        license: 'verified',
        insurance: 'pending'
      },
      specialties: ['Culture', 'Histoire', 'Photographie']
    },
    {
      id: 2,
      name: 'Restaurant Atlas',
      email: 'contact@restaurant-atlas.dz',
      phone: '+213 555 987 654',
      type: 'Restaurant',
      location: 'Alger',
      status: 'pending',
      joinDate: '2025-07-08',
      rating: 0,
      totalBookings: 0,
      totalRevenue: 0,
      lastActivity: '2025-07-08',
      documents: {
        businessLicense: 'verified',
        healthCertificate: 'pending',
        insurance: 'missing'
      },
      specialties: ['Cuisine Traditionnelle', 'Gastronomie']
    },
    {
      id: 3,
      name: 'Yacine Amellal',
      email: 'yacine.amellal@gmail.com',
      phone: '+213 555 246 810',
      type: 'Guide Local',
      location: 'Tamanrasset',
      status: 'active',
      joinDate: '2024-10-20',
      rating: 4.9,
      totalBookings: 89,
      totalRevenue: 445000,
      lastActivity: '2025-07-07',
      documents: {
        idCard: 'verified',
        license: 'verified',
        insurance: 'verified'
      },
      specialties: ['Sahara', 'Aventure', 'Culture Touarègue']
    },
    {
      id: 4,
      name: 'Hôtel Djurdjura',
      email: 'reservation@hotel-djurdjura.dz',
      phone: '+213 555 135 792',
      type: 'Hébergement',
      location: 'Tizi Ouzou',
      status: 'suspended',
      joinDate: '2024-08-10',
      rating: 4.2,
      totalBookings: 245,
      totalRevenue: 890000,
      lastActivity: '2025-07-05',
      documents: {
        businessLicense: 'verified',
        tourismLicense: 'expired',
        insurance: 'verified'
      },
      specialties: ['Hébergement', 'Tourisme Montagne']
    }
  ]);

  const filteredProviders = providers.filter(provider => {
    const matchesSearch = provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         provider.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         provider.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || provider.status === filterStatus;
    const matchesType = filterType === 'all' || provider.type === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'suspended': return <XCircle className="w-4 h-4" />;
      case 'inactive': return <AlertTriangle className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const getDocumentStatus = (documents) => {
    const total = Object.keys(documents).length;
    const verified = Object.values(documents).filter(status => status === 'verified').length;
    const pending = Object.values(documents).filter(status => status === 'pending').length;
    const missing = Object.values(documents).filter(status => status === 'missing').length;
    
    return { total, verified, pending, missing };
  };

  const handleStatusChange = (id, newStatus) => {
    setProviders(prev => 
      prev.map(provider => 
        provider.id === id ? { ...provider, status: newStatus } : provider
      )
    );
  };

  const handleDeleteProvider = (id) => {
    setProviders(prev => prev.filter(provider => provider.id !== id));
  };

  const stats = {
    total: providers.length,
    active: providers.filter(p => p.status === 'active').length,
    pending: providers.filter(p => p.status === 'pending').length,
    suspended: providers.filter(p => p.status === 'suspended').length
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Users className="w-6 h-6 text-blue-600" />
              <h1 className="text-xl font-semibold text-gray-900">Gestion des Prestataires</h1>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Ajouter Prestataire
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Actifs</p>
                  <p className="text-2xl font-bold text-green-600">{stats.active}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">En attente</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Suspendus</p>
                  <p className="text-2xl font-bold text-red-600">{stats.suspended}</p>
                </div>
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Label htmlFor="search">Rechercher</Label>
                <div className="relative mt-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="search"
                    placeholder="Nom, email, localisation..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="status">Statut</Label>
                <select
                  id="status"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">Tous</option>
                  <option value="active">Actifs</option>
                  <option value="pending">En attente</option>
                  <option value="suspended">Suspendus</option>
                </select>
              </div>
              <div>
                <Label htmlFor="type">Type</Label>
                <select
                  id="type"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">Tous</option>
                  <option value="Guide Local">Guide Local</option>
                  <option value="Restaurant">Restaurant</option>
                  <option value="Hébergement">Hébergement</option>
                  <option value="Transport">Transport</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Providers List */}
        <div className="space-y-4">
          {filteredProviders.map((provider) => {
            const docStatus = getDocumentStatus(provider.documents);
            
            return (
              <Card key={provider.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-lg">
                          {provider.name.charAt(0)}
                        </span>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{provider.name}</h3>
                          <Badge className={getStatusColor(provider.status)}>
                            {getStatusIcon(provider.status)}
                            <span className="ml-1 capitalize">{provider.status}</span>
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-2">
                            <Mail className="w-4 h-4" />
                            <span>{provider.email}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Phone className="w-4 h-4" />
                            <span>{provider.phone}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4" />
                            <span>{provider.location}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4" />
                            <span>Inscrit le {provider.joinDate}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-6 mt-3 text-sm">
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-500" />
                            <span className="font-medium">{provider.rating}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <TrendingUp className="w-4 h-4 text-green-500" />
                            <span className="font-medium">{provider.totalBookings} réservations</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <DollarSign className="w-4 h-4 text-blue-500" />
                            <span className="font-medium">{provider.totalRevenue.toLocaleString()} DZD</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 mt-2">
                          <span className="text-xs text-gray-500">Spécialités:</span>
                          <div className="flex flex-wrap gap-1">
                            {provider.specialties.map((specialty, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {specialty}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div className="mt-2 text-xs text-gray-500">
                          Documents: {docStatus.verified}/{docStatus.total} vérifiés
                          {docStatus.pending > 0 && `, ${docStatus.pending} en attente`}
                          {docStatus.missing > 0 && `, ${docStatus.missing} manquants`}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4 mr-1" />
                        Voir
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="w-4 h-4 mr-1" />
                        Modifier
                      </Button>
                      {provider.status === 'pending' && (
                        <Button
                          size="sm"
                          onClick={() => handleStatusChange(provider.id, 'active')}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Approuver
                        </Button>
                      )}
                      {provider.status === 'active' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusChange(provider.id, 'suspended')}
                          className="text-red-600 hover:bg-red-50"
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Suspendre
                        </Button>
                      )}
                      {provider.status === 'suspended' && (
                        <Button
                          size="sm"
                          onClick={() => handleStatusChange(provider.id, 'active')}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Réactiver
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteProvider(provider.id)}
                        className="text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        {filteredProviders.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun prestataire trouvé</h3>
              <p className="text-gray-600">Aucun prestataire ne correspond à vos critères de recherche.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminProviders;