import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  Calendar, 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  Users,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  FileText,
  Calculator,
  Percent
} from 'lucide-react';

const AdminActivities = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');

  // Commission EJI (peut être configurée)
  const [ejiCommission] = useState(15); // 15% de commission

  const [activities, setActivities] = useState([
    {
      id: 1,
      title: 'Visite Guidée de la Casbah',
      provider: 'Ahmed Bensaid',
      providerId: 1,
      type: 'Guide Local',
      location: 'Alger',
      price: 3500,
      currency: 'DZD',
      status: 'active',
      created: '2025-07-08',
      bookings: 45,
      revenue: 157500,
      rating: 4.9,
      reviews: 23,
      qualityScore: 95,
      commission: 15,
      providerEarnings: 2975,
      ejiEarnings: 525,
      lastBooking: '2025-07-09',
      category: 'Culture',
      duration: '3h',
      maxParticipants: 8,
      language: ['Français', 'Arabe', 'Anglais']
    },
    {
      id: 2,
      title: 'Excursion Sahara 3 jours',
      provider: 'Yacine Amellal',
      providerId: 3,
      type: 'Guide Local',
      location: 'Tamanrasset',
      price: 45000,
      currency: 'DZD',
      status: 'pending_validation',
      created: '2025-07-09',
      bookings: 0,
      revenue: 0,
      rating: 0,
      reviews: 0,
      qualityScore: 0,
      commission: 15,
      providerEarnings: 38250,
      ejiEarnings: 6750,
      lastBooking: null,
      category: 'Aventure',
      duration: '3 jours',
      maxParticipants: 6,
      language: ['Français', 'Arabe', 'Tamachek']
    },
    {
      id: 3,
      title: 'Restaurant Le Tantra - Menu Découverte',
      provider: 'Restaurant Atlas',
      providerId: 2,
      type: 'Restaurant',
      location: 'Alger',
      price: 4500,
      currency: 'DZD',
      status: 'rejected',
      created: '2025-07-07',
      bookings: 0,
      revenue: 0,
      rating: 0,
      reviews: 0,
      qualityScore: 45,
      commission: 12,
      providerEarnings: 3960,
      ejiEarnings: 540,
      lastBooking: null,
      category: 'Gastronomie',
      duration: '2h',
      maxParticipants: 4,
      language: ['Français', 'Arabe'],
      rejectionReason: 'Photos insuffisantes, description incomplète'
    },
    {
      id: 4,
      title: 'Nuit dans le Désert - Bivouac',
      provider: 'Yacine Amellal',
      providerId: 3,
      type: 'Guide Local',
      location: 'Tamanrasset',
      price: 25000,
      currency: 'DZD',
      status: 'active',
      created: '2025-06-15',
      bookings: 23,
      revenue: 575000,
      rating: 4.8,
      reviews: 18,
      qualityScore: 92,
      commission: 15,
      providerEarnings: 21250,
      ejiEarnings: 3750,
      lastBooking: '2025-07-08',
      category: 'Aventure',
      duration: '2 jours',
      maxParticipants: 8,
      language: ['Français', 'Arabe', 'Tamachek']
    }
  ]);

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || activity.status === filterStatus;
    const matchesType = filterType === 'all' || activity.type === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending_validation': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'suspended': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4" />;
      case 'pending_validation': return <Clock className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      case 'inactive': return <AlertTriangle className="w-4 h-4" />;
      case 'suspended': return <AlertTriangle className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return 'Active';
      case 'pending_validation': return 'En validation';
      case 'rejected': return 'Rejetée';
      case 'inactive': return 'Inactive';
      case 'suspended': return 'Suspendue';
      default: return status;
    }
  };

  const calculateEarnings = (price, commission) => {
    const ejiEarnings = (price * commission) / 100;
    const providerEarnings = price - ejiEarnings;
    return { ejiEarnings, providerEarnings };
  };

  const handleStatusChange = (id, newStatus, reason = '') => {
    setActivities(prev => 
      prev.map(activity => 
        activity.id === id 
          ? { 
              ...activity, 
              status: newStatus,
              ...(reason && { rejectionReason: reason })
            } 
          : activity
      )
    );
  };

  const handleDeleteActivity = (id) => {
    setActivities(prev => prev.filter(activity => activity.id !== id));
  };

  const stats = {
    total: activities.length,
    active: activities.filter(a => a.status === 'active').length,
    pending: activities.filter(a => a.status === 'pending_validation').length,
    rejected: activities.filter(a => a.status === 'rejected').length,
    totalRevenue: activities.reduce((sum, a) => sum + a.revenue, 0),
    totalBookings: activities.reduce((sum, a) => sum + a.bookings, 0)
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Calendar className="w-6 h-6 text-green-600" />
              <h1 className="text-xl font-semibold text-gray-900">Gestion des Activités</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline">
                <Calculator className="w-4 h-4 mr-2" />
                Commission: {ejiCommission}%
              </Button>
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="w-4 h-4 mr-2" />
                Ajouter Activité
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total</p>
                  <p className="text-xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Actives</p>
                  <p className="text-xl font-bold text-green-600">{stats.active}</p>
                </div>
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">En validation</p>
                  <p className="text-xl font-bold text-yellow-600">{stats.pending}</p>
                </div>
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Rejetées</p>
                  <p className="text-xl font-bold text-red-600">{stats.rejected}</p>
                </div>
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Réservations</p>
                  <p className="text-xl font-bold text-purple-600">{stats.totalBookings}</p>
                </div>
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Revenus (DZD)</p>
                  <p className="text-lg font-bold text-blue-600">{stats.totalRevenue.toLocaleString()}</p>
                </div>
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charte Qualité Info */}
        <Card className="mb-8 border-green-200 bg-green-50">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <FileText className="w-6 h-6 text-green-600 mt-1" />
              <div>
                <h3 className="font-semibold text-green-900 mb-2">Charte Qualité EJI</h3>
                <p className="text-sm text-green-800 mb-3">
                  Toutes les activités doivent respecter nos standards de qualité avant validation :
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-green-700">
                  <div>• Photos haute qualité (min. 3)</div>
                  <div>• Description détaillée (min. 100 mots)</div>
                  <div>• Certifications valides</div>
                  <div>• Assurance responsabilité civile</div>
                  <div>• Respect normes sécurité</div>
                  <div>• Transparence tarifaire</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

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
                    placeholder="Titre, prestataire, localisation..."
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
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                >
                  <option value="all">Tous</option>
                  <option value="active">Actives</option>
                  <option value="pending_validation">En validation</option>
                  <option value="rejected">Rejetées</option>
                  <option value="suspended">Suspendues</option>
                </select>
              </div>
              <div>
                <Label htmlFor="type">Type</Label>
                <select
                  id="type"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
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

        {/* Activities List */}
        <div className="space-y-4">
          {filteredActivities.map((activity) => {
            const earnings = calculateEarnings(activity.price, activity.commission);
            
            return (
              <Card key={activity.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">{activity.title}</h3>
                        <Badge className={getStatusColor(activity.status)}>
                          {getStatusIcon(activity.status)}
                          <span className="ml-1">{getStatusText(activity.status)}</span>
                        </Badge>
                        {activity.qualityScore > 0 && (
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                            Score: {activity.qualityScore}%
                          </Badge>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4" />
                          <span>{activity.provider}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4" />
                          <span>{activity.location}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4" />
                          <span>{activity.duration}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4" />
                          <span>Max {activity.maxParticipants} pers.</span>
                        </div>
                      </div>

                      {/* Transparence Rémunération */}
                      <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                          <Calculator className="w-4 h-4 mr-2" />
                          Transparence Rémunération
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Prix Client</span>
                            <p className="font-semibold text-lg">{activity.price.toLocaleString()} DZD</p>
                          </div>
                          <div>
                            <span className="text-gray-600">Commission EJI ({activity.commission}%)</span>
                            <p className="font-semibold text-red-600">{earnings.ejiEarnings.toLocaleString()} DZD</p>
                          </div>
                          <div>
                            <span className="text-gray-600">Gain Prestataire</span>
                            <p className="font-semibold text-green-600">{earnings.providerEarnings.toLocaleString()} DZD</p>
                          </div>
                          <div>
                            <span className="text-gray-600">Total Revenus</span>
                            <p className="font-semibold text-blue-600">{activity.revenue.toLocaleString()} DZD</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-6 text-sm">
                        <div className="flex items-center space-x-1">
                          <TrendingUp className="w-4 h-4 text-green-500" />
                          <span className="font-medium">{activity.bookings} réservations</span>
                        </div>
                        {activity.rating > 0 && (
                          <div className="flex items-center space-x-1">
                            <span className="text-yellow-500">⭐</span>
                            <span className="font-medium">{activity.rating} ({activity.reviews} avis)</span>
                          </div>
                        )}
                        <div className="flex flex-wrap gap-1">
                          {activity.language.map((lang, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {lang}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {activity.status === 'rejected' && activity.rejectionReason && (
                        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                          <p className="text-sm text-red-800">
                            <strong>Raison du rejet :</strong> {activity.rejectionReason}
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4 mr-1" />
                        Voir
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="w-4 h-4 mr-1" />
                        Modifier
                      </Button>
                      
                      {activity.status === 'pending_validation' && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleStatusChange(activity.id, 'active')}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Valider
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              const reason = prompt('Raison du rejet :');
                              if (reason) handleStatusChange(activity.id, 'rejected', reason);
                            }}
                            className="text-red-600 hover:bg-red-50"
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Rejeter
                          </Button>
                        </>
                      )}
                      
                      {activity.status === 'active' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusChange(activity.id, 'suspended')}
                          className="text-orange-600 hover:bg-orange-50"
                        >
                          Suspendre
                        </Button>
                      )}
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteActivity(activity.id)}
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
        
        {filteredActivities.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune activité trouvée</h3>
              <p className="text-gray-600">Aucune activité ne correspond à vos critères de recherche.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminActivities;