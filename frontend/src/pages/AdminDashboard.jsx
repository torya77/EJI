import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  BarChart3, 
  Users, 
  Calendar, 
  Store, 
  MapPin,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  Eye,
  Edit,
  Trash2,
  Plus,
  Filter,
  Search,
  Download,
  RefreshCw
} from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProviders: 45,
    pendingApprovals: 8,
    totalActivities: 156,
    totalBookings: 1240,
    totalRevenue: 245000,
    monthlyGrowth: 15.3
  });

  const [recentActivities, setRecentActivities] = useState([
    {
      id: 1,
      type: 'provider_registration',
      provider: 'Hotel Djurdjura',
      status: 'pending',
      date: '2025-07-09',
      time: '14:30'
    },
    {
      id: 2,
      type: 'activity_created',
      provider: 'Ahmed Bensaid',
      activity: 'Visite Casbah Premium',
      status: 'approved',
      date: '2025-07-09',
      time: '12:15'
    },
    {
      id: 3,
      type: 'booking_made',
      client: 'Marie Dubois',
      activity: 'Excursion Sahara',
      amount: '15000 DZD',
      status: 'confirmed',
      date: '2025-07-09',
      time: '10:45'
    }
  ]);

  const [pendingApprovals, setPendingApprovals] = useState([
    {
      id: 1,
      name: 'Restaurant Atlas',
      type: 'Restaurant',
      location: 'Alger',
      submitted: '2025-07-08',
      email: 'contact@restaurant-atlas.dz',
      status: 'pending'
    },
    {
      id: 2,
      name: 'Karim Boutaiba',
      type: 'Guide Local',
      location: 'Constantine',
      submitted: '2025-07-07',
      email: 'karim.boutaiba@gmail.com',
      status: 'pending'
    }
  ]);

  const statCards = [
    {
      title: 'Prestataires Actifs',
      value: stats.totalProviders,
      change: '+12%',
      trend: 'up',
      icon: Users,
      color: 'blue'
    },
    {
      title: 'Activités Publiées',
      value: stats.totalActivities,
      change: '+8%',
      trend: 'up',
      icon: Calendar,
      color: 'green'
    },
    {
      title: 'Réservations Totales',
      value: stats.totalBookings,
      change: '+23%',
      trend: 'up',
      icon: BarChart3,
      color: 'purple'
    },
    {
      title: 'Revenus (DZD)',
      value: `${stats.totalRevenue.toLocaleString()}`,
      change: '+15.3%',
      trend: 'up',
      icon: DollarSign,
      color: 'orange'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'confirmed': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <AlertCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const handleApprove = (id) => {
    setPendingApprovals(prev => 
      prev.map(item => 
        item.id === id ? { ...item, status: 'approved' } : item
      )
    );
  };

  const handleReject = (id) => {
    setPendingApprovals(prev => 
      prev.map(item => 
        item.id === id ? { ...item, status: 'rejected' } : item
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-green-600 to-red-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">🎒</span>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-red-600 bg-clip-text text-transparent">
                  EJI Admin
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Actualiser
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      <p className={`text-sm flex items-center ${
                        stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        <TrendingUp className="w-4 h-4 mr-1" />
                        {stat.change}
                      </p>
                    </div>
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      stat.color === 'blue' ? 'bg-blue-100' :
                      stat.color === 'green' ? 'bg-green-100' :
                      stat.color === 'purple' ? 'bg-purple-100' :
                      'bg-orange-100'
                    }`}>
                      <Icon className={`w-6 h-6 ${
                        stat.color === 'blue' ? 'text-blue-600' :
                        stat.color === 'green' ? 'text-green-600' :
                        stat.color === 'purple' ? 'text-purple-600' :
                        'text-orange-600'
                      }`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="approvals" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="approvals">Approbations</TabsTrigger>
                <TabsTrigger value="activities">Activités Récentes</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>
              
              <TabsContent value="approvals" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <AlertCircle className="w-5 h-5 mr-2 text-yellow-500" />
                      Approbations en Attente ({pendingApprovals.length})
                    </CardTitle>
                    <CardDescription>
                      Nouveaux prestataires à valider
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {pendingApprovals.map((approval) => (
                        <div key={approval.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                                <span className="text-white font-bold text-sm">
                                  {approval.name.charAt(0)}
                                </span>
                              </div>
                              <div>
                                <h3 className="font-medium text-gray-900">{approval.name}</h3>
                                <p className="text-sm text-gray-500">{approval.type} • {approval.location}</p>
                                <p className="text-xs text-gray-400">{approval.email}</p>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className={getStatusColor(approval.status)}>
                              {getStatusIcon(approval.status)}
                              <span className="ml-1 capitalize">{approval.status}</span>
                            </Badge>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleApprove(approval.id)}
                              className="text-green-600 hover:bg-green-50"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Approuver
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleReject(approval.id)}
                              className="text-red-600 hover:bg-red-50"
                            >
                              <AlertCircle className="w-4 h-4 mr-1" />
                              Rejeter
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="activities" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Activités Récentes</CardTitle>
                    <CardDescription>
                      Dernières actions sur la plateforme
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentActivities.map((activity) => (
                        <div key={activity.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <div>
                                <p className="font-medium text-gray-900">
                                  {activity.type === 'provider_registration' && 'Nouvelle inscription prestataire'}
                                  {activity.type === 'activity_created' && 'Nouvelle activité créée'}
                                  {activity.type === 'booking_made' && 'Nouvelle réservation'}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {activity.provider} {activity.activity && `• ${activity.activity}`}
                                  {activity.client && `Par ${activity.client}`}
                                  {activity.amount && ` • ${activity.amount}`}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className={getStatusColor(activity.status)}>
                              {activity.status}
                            </Badge>
                            <span className="text-xs text-gray-400">
                              {activity.time}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="analytics" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Analytics Avancés</CardTitle>
                    <CardDescription>
                      Métriques et tendances détaillées
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <h3 className="font-medium">Top Villes</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Alger</span>
                            <span className="text-sm font-medium">45%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Oran</span>
                            <span className="text-sm font-medium">25%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Constantine</span>
                            <span className="text-sm font-medium">18%</span>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <h3 className="font-medium">Types d'Activités</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Restaurants</span>
                            <span className="text-sm font-medium">35%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Guides</span>
                            <span className="text-sm font-medium">30%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Événements</span>
                            <span className="text-sm font-medium">25%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Actions Rapides</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter Prestataire
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Calendar className="w-4 h-4 mr-2" />
                  Créer Événement
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Store className="w-4 h-4 mr-2" />
                  Gérer Produits
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Voir Rapports
                </Button>
              </CardContent>
            </Card>

            {/* System Status */}
            <Card>
              <CardHeader>
                <CardTitle>État du Système</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">API Status</span>
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Opérationnel
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Base de données</span>
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Normale
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Dernière sauvegarde</span>
                  <span className="text-sm text-gray-500">Il y a 2h</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;