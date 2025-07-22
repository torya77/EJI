import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { providerApi } from '../services/adminApi';
import { useToast } from '../hooks/use-toast';
import { 
  BarChart3, 
  Calendar, 
  DollarSign, 
  Users, 
  TrendingUp, 
  MapPin,
  Clock,
  Star,
  MessageCircle,
  Settings,
  Plus,
  Edit,
  Eye,
  Trash2,
  Filter,
  Download,
  User,
  Percent,
  Activity,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';

const ProviderDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [profile, setProfile] = useState(null);
  const [activities, setActivities] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [showCreateActivity, setShowCreateActivity] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [newActivity, setNewActivity] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    duration: '',
    max_participants: '',
    location: '',
    images: []
  });
  const [profileUpdate, setProfileUpdate] = useState({
    business_name: '',
    description: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    website: ''
  });

  const { toast } = useToast();

  // Commission rates by provider type
  const commissionRates = {
    'guide_local': 15,
    'restaurant': 12,
    'hebergement': 10,
    'transport': 15,
    'artisan': 8,
    'organisateur_evenements': 15
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [dashboardStats, profileData, activitiesData, bookingsData] = await Promise.all([
        providerApi.getDashboardStats(),
        providerApi.getProfile(),
        providerApi.getMyActivities(),
        providerApi.getBookings()
      ]);

      setStats(dashboardStats);
      setProfile(profileData);
      setProfileUpdate(profileData);
      setActivities(activitiesData);
      setBookings(bookingsData);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données du tableau de bord",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateActivity = async () => {
    try {
      const activityData = {
        ...newActivity,
        price: parseFloat(newActivity.price),
        duration: parseInt(newActivity.duration),
        max_participants: parseInt(newActivity.max_participants)
      };

      await providerApi.createActivity(activityData);
      
      toast({
        title: "Succès",
        description: "Activité créée avec succès",
      });

      setShowCreateActivity(false);
      setNewActivity({
        name: '',
        description: '',
        category: '',
        price: '',
        duration: '',
        max_participants: '',
        location: '',
        images: []
      });
      
      loadDashboardData();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de créer l'activité",
        variant: "destructive",
      });
    }
  };

  const handleUpdateProfile = async () => {
    try {
      await providerApi.updateProfile(profileUpdate);
      
      toast({
        title: "Succès",
        description: "Profil mis à jour avec succès",
      });

      setShowProfile(false);
      loadDashboardData();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le profil",
        variant: "destructive",
      });
    }
  };

  const handleBookingStatusUpdate = async (bookingId, status) => {
    try {
      await providerApi.updateBookingStatus(bookingId, status);
      
      toast({
        title: "Succès",
        description: "Statut de la réservation mis à jour",
      });

      loadDashboardData();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut",
        variant: "destructive",
      });
    }
  };

  const calculateCommission = (price, providerType) => {
    const rate = commissionRates[providerType] || 15;
    const commission = (price * rate) / 100;
    return {
      commission,
      earnings: price - commission,
      rate
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du tableau de bord...</p>
        </div>
      </div>
    );
  }

  // Fallback data if API fails - moved before usage
  const fallbackStats = {
    revenue: { value: 45230, growth: +12, currency: 'DZD' },
    bookings: { value: 28, growth: +8 },
    rating: { value: 4.8, total: 156 },
    clients: { value: 342, growth: +15 }
  };

  // Ensure we always have valid stats data
  const displayStats = stats || fallbackStats;

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmé': return 'bg-green-100 text-green-800';
      case 'en_attente': return 'bg-yellow-100 text-yellow-800';
      case 'annulé': return 'bg-red-100 text-red-800';
      case 'actif': return 'bg-green-100 text-green-800';
      case 'pause': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR').format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Tableau de bord Prestataire
          </h1>
          <p className="text-gray-600 mt-2">
            Gérez vos services et suivez vos performances
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Revenus ce mois</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(displayStats.revenue.value)} {displayStats.revenue.currency}
                  </p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +{displayStats.revenue.growth}% vs mois dernier
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Réservations</p>
                  <p className="text-2xl font-bold text-gray-900">{displayStats.bookings.value}</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +{displayStats.bookings.growth} cette semaine
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Note moyenne</p>
                  <p className="text-2xl font-bold text-gray-900">{(stats || fallbackStats).rating.value}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {(stats || fallbackStats).rating.total} avis clients
                  </p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Star className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Clients totaux</p>
                  <p className="text-2xl font-bold text-gray-900">{(stats || fallbackStats).clients.value}</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +{(stats || fallbackStats).clients.growth}% ce mois
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="flex justify-between items-center">
            <TabsList className="grid w-full max-w-md grid-cols-4">
              <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
              <TabsTrigger value="bookings">Réservations</TabsTrigger>
              <TabsTrigger value="services">Mes services</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>
            
            <div className="flex space-x-2">
              <Dialog open={showProfile} onOpenChange={setShowProfile}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <User className="w-4 h-4 mr-2" />
                    Profil
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Modifier le profil</DialogTitle>
                    <DialogDescription>
                      Mettez à jour vos informations de prestataire
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="business_name">Nom de l'entreprise</Label>
                      <Input
                        id="business_name"
                        value={profileUpdate.business_name || ''}
                        onChange={(e) => setProfileUpdate({...profileUpdate, business_name: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={profileUpdate.description || ''}
                        onChange={(e) => setProfileUpdate({...profileUpdate, description: e.target.value})}
                        rows={3}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Téléphone</Label>
                        <Input
                          id="phone"
                          value={profileUpdate.phone || ''}
                          onChange={(e) => setProfileUpdate({...profileUpdate, phone: e.target.value})}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="city">Ville</Label>
                        <Input
                          id="city"
                          value={profileUpdate.city || ''}
                          onChange={(e) => setProfileUpdate({...profileUpdate, city: e.target.value})}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="address">Adresse</Label>
                      <Input
                        id="address"
                        value={profileUpdate.address || ''}
                        onChange={(e) => setProfileUpdate({...profileUpdate, address: e.target.value})}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="website">Site web (optionnel)</Label>
                      <Input
                        id="website"
                        value={profileUpdate.website || ''}
                        onChange={(e) => setProfileUpdate({...profileUpdate, website: e.target.value})}
                        placeholder="https://exemple.com"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setShowProfile(false)}>
                      Annuler
                    </Button>
                    <Button onClick={handleUpdateProfile}>
                      Sauvegarder
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              
              {profile && (
                <div className="flex items-center space-x-2 px-3 py-2 bg-green-50 rounded-lg">
                  <div className="text-sm">
                    <p className="font-medium text-green-900">{profile.business_name || 'Prestataire'}</p>
                    <p className="text-green-600">Commission: {commissionRates[profile.provider_type] || 15}%</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Recent Bookings */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Réservations récentes</CardTitle>
                    <CardDescription>Vos dernières réservations</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setActiveTab('bookings')}>
                    Voir tout
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {bookings.slice(0, 3).map(booking => {
                      const commission = calculateCommission(booking.amount || 0, profile?.provider_type || 'guide_local');
                      return (
                        <div key={booking.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-medium text-gray-900">{booking.service_name || booking.activity_name}</h4>
                              <Badge className={`text-xs ${getStatusColor(booking.status)}`}>
                                {booking.status?.replace('_', ' ')}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600">{booking.customer_name}</p>
                            <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                              <span className="flex items-center">
                                <Calendar className="w-3 h-3 mr-1" />
                                {booking.booking_date ? new Date(booking.booking_date).toLocaleDateString('fr-FR') : 'Date non définie'}
                              </span>
                              <span className="flex items-center">
                                <Clock className="w-3 h-3 mr-1" />
                                {booking.booking_time || 'Heure non définie'}
                              </span>
                              <span className="flex items-center">
                                <Users className="w-3 h-3 mr-1" />
                                {booking.participants || 1}
                              </span>
                            </div>
                          </div>
                          <div className="text-right ml-4">
                            <div className="font-semibold text-green-600">
                              {formatCurrency(commission.earnings)} DZD
                            </div>
                            <div className="text-xs text-gray-500">
                              (Total: {formatCurrency(booking.amount || 0)})
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    
                    {bookings.length === 0 && (
                      <div className="text-center py-8">
                        <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">Aucune réservation récente</p>
                        <p className="text-sm text-gray-400">Vos réservations apparaîtront ici</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Commission Transparency */}
              <Card>
                <CardHeader>
                  <CardTitle>Transparence des Commissions</CardTitle>
                  <CardDescription>Vos revenus et commissions EJI</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {profile && (
                      <div className="bg-green-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-green-900">Votre commission</span>
                          <span className="text-lg font-bold text-green-600">
                            {commissionRates[profile.provider_type] || 15}%
                          </span>
                        </div>
                        <p className="text-xs text-green-700">
                          Type: {profile.provider_type?.replace('_', ' ').toUpperCase()}
                        </p>
                      </div>
                    )}
                    
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-900">Exemple de calcul:</h4>
                      <div className="bg-gray-50 p-3 rounded-lg text-sm">
                        <div className="flex justify-between mb-1">
                          <span>Prix du service:</span>
                          <span className="font-medium">10,000 DZD</span>
                        </div>
                        <div className="flex justify-between mb-1 text-red-600">
                          <span>Commission EJI ({commissionRates[profile?.provider_type] || 15}%):</span>
                          <span className="font-medium">-{formatCurrency((10000 * (commissionRates[profile?.provider_type] || 15)) / 100)} DZD</span>
                        </div>
                        <div className="flex justify-between text-green-600 font-semibold pt-2 border-t">
                          <span>Vos revenus:</span>
                          <span>{formatCurrency(10000 - ((10000 * (commissionRates[profile?.provider_type] || 15)) / 100))} DZD</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Bookings Tab */}
          <TabsContent value="bookings" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Gestion des réservations</CardTitle>
                  <CardDescription>Suivez et gérez toutes vos réservations</CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Filtrer
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Exporter
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bookings.map(booking => {
                    const commission = calculateCommission(booking.amount || 0, profile?.provider_type || 'guide_local');
                    return (
                      <div key={booking.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-gray-900">{booking.service_name || booking.activity_name}</h4>
                            <Badge className={`${getStatusColor(booking.status)}`}>
                              {booking.status?.replace('_', ' ')}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                            <div>
                              <span className="font-medium">Client:</span> {booking.customer_name || 'N/A'}
                            </div>
                            <div>
                              <span className="font-medium">Date:</span> {booking.booking_date ? new Date(booking.booking_date).toLocaleDateString('fr-FR') : 'N/A'}
                            </div>
                            <div>
                              <span className="font-medium">Heure:</span> {booking.booking_time || 'N/A'}
                            </div>
                            <div>
                              <span className="font-medium">Invités:</span> {booking.participants || 1}
                            </div>
                          </div>
                          <div className="mt-2 text-xs text-gray-500">
                            <span className="font-medium">Commission EJI:</span> {formatCurrency(commission.commission)} DZD ({commission.rate}%)
                          </div>
                        </div>
                        <div className="flex items-center space-x-4 ml-6">
                          <div className="text-right">
                            <div className="font-bold text-green-600">
                              {formatCurrency(commission.earnings)} DZD
                            </div>
                            <div className="text-xs text-gray-500">#{booking.id}</div>
                          </div>
                          <div className="flex space-x-1">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleBookingStatusUpdate(booking.id, 'confirmed')}
                              disabled={booking.status === 'confirmed'}
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleBookingStatusUpdate(booking.id, 'cancelled')}
                              disabled={booking.status === 'cancelled'}
                            >
                              <XCircle className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <MessageCircle className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  
                  {bookings.length === 0 && (
                    <div className="text-center py-12">
                      <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune réservation</h3>
                      <p className="text-gray-500">Vos réservations apparaîtront ici une fois que les clients commenceront à réserver vos services.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Services Tab */}
          <TabsContent value="services" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Mes services</CardTitle>
                  <CardDescription>Gérez vos offres et services</CardDescription>
                </div>
                
                <Dialog open={showCreateActivity} onOpenChange={setShowCreateActivity}>
                  <DialogTrigger asChild>
                    <Button className="bg-green-600 hover:bg-green-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Ajouter un service
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-lg">
                    <DialogHeader>
                      <DialogTitle>Créer un nouveau service</DialogTitle>
                      <DialogDescription>
                        Ajoutez une nouvelle activité ou service à votre offre
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nom du service</Label>
                        <Input
                          id="name"
                          value={newActivity.name}
                          onChange={(e) => setNewActivity({...newActivity, name: e.target.value})}
                          placeholder="Ex: Visite guidée de la Casbah"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={newActivity.description}
                          onChange={(e) => setNewActivity({...newActivity, description: e.target.value})}
                          rows={3}
                          placeholder="Décrivez votre service..."
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="category">Catégorie</Label>
                          <Select value={newActivity.category} onValueChange={(value) => setNewActivity({...newActivity, category: value})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Choisir..." />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="tour">Visite guidée</SelectItem>
                              <SelectItem value="restaurant">Restaurant</SelectItem>
                              <SelectItem value="experience">Expérience</SelectItem>
                              <SelectItem value="accommodation">Hébergement</SelectItem>
                              <SelectItem value="transport">Transport</SelectItem>
                              <SelectItem value="workshop">Atelier</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="price">Prix (DZD)</Label>
                          <Input
                            id="price"
                            type="number"
                            value={newActivity.price}
                            onChange={(e) => setNewActivity({...newActivity, price: e.target.value})}
                            placeholder="0"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="duration">Durée (heures)</Label>
                          <Input
                            id="duration"
                            type="number"
                            value={newActivity.duration}
                            onChange={(e) => setNewActivity({...newActivity, duration: e.target.value})}
                            placeholder="1"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="max_participants">Participants max</Label>
                          <Input
                            id="max_participants"
                            type="number"
                            value={newActivity.max_participants}
                            onChange={(e) => setNewActivity({...newActivity, max_participants: e.target.value})}
                            placeholder="10"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="location">Lieu</Label>
                        <Input
                          id="location"
                          value={newActivity.location}
                          onChange={(e) => setNewActivity({...newActivity, location: e.target.value})}
                          placeholder="Ex: Casbah d'Alger"
                        />
                      </div>

                      {newActivity.price && (
                        <div className="bg-green-50 p-3 rounded-lg">
                          <div className="flex items-center space-x-2 mb-2">
                            <Percent className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-medium text-green-900">Calcul de commission</span>
                          </div>
                          <div className="text-sm text-green-700">
                            <div className="flex justify-between">
                              <span>Prix du service:</span>
                              <span>{formatCurrency(parseFloat(newActivity.price) || 0)} DZD</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Commission EJI ({commissionRates[profile?.provider_type] || 15}%):</span>
                              <span>-{formatCurrency(((parseFloat(newActivity.price) || 0) * (commissionRates[profile?.provider_type] || 15)) / 100)} DZD</span>
                            </div>
                            <div className="flex justify-between font-semibold pt-2 border-t border-green-200">
                              <span>Vos revenus:</span>
                              <span>{formatCurrency((parseFloat(newActivity.price) || 0) - (((parseFloat(newActivity.price) || 0) * (commissionRates[profile?.provider_type] || 15)) / 100))} DZD</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setShowCreateActivity(false)}>
                        Annuler
                      </Button>
                      <Button onClick={handleCreateActivity}>
                        Créer le service
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {activities.map(activity => {
                    const commission = calculateCommission(activity.price || 0, profile?.provider_type || 'guide_local');
                    return (
                      <Card key={activity.id} className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <Badge variant="outline">{activity.category}</Badge>
                            <Badge className={`${getStatusColor(activity.status)}`}>
                              {activity.status}
                            </Badge>
                          </div>
                          
                          <h3 className="font-semibold text-gray-900 mb-2">{activity.name}</h3>
                          
                          <div className="space-y-2 mb-4">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">Prix:</span>
                              <span className="font-semibold">{formatCurrency(activity.price)} DZD</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">Vos revenus:</span>
                              <span className="font-semibold text-green-600">{formatCurrency(commission.earnings)} DZD</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">Réservations:</span>
                              <span className="font-semibold">{activity.bookings || 0}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">Note:</span>
                              <div className="flex items-center">
                                <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                                <span className="font-semibold">{activity.rating || 'N/A'}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" className="flex-1">
                              <Edit className="w-4 h-4 mr-1" />
                              Modifier
                            </Button>
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Settings className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
                
                {activities.length === 0 && (
                  <div className="text-center py-12">
                    <Activity className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun service créé</h3>
                    <p className="text-gray-500 mb-4">Commencez par créer votre premier service pour attirer des clients.</p>
                    <Button 
                      onClick={() => setShowCreateActivity(true)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Créer mon premier service
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Revenus mensuels</CardTitle>
                  <CardDescription>Évolution de vos revenus</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <BarChart3 className="w-16 h-16 text-green-600 mx-auto mb-4" />
                      <p className="text-gray-600">Graphique des revenus</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Taux de satisfaction</CardTitle>
                  <CardDescription>Notes et avis clients</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <Star className="w-16 h-16 text-yellow-600 mx-auto mb-4" />
                      <p className="text-gray-600">Satisfaction client</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProviderDashboard;