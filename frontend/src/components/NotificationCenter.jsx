import React, { useState, useEffect } from 'react';
import { Bell, X, Check, Archive, ChevronDown, Clock, AlertCircle, CheckCircle, Info, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { useToast } from '../hooks/use-toast';

// Mock API service for notifications - replace with real API
const notificationsApi = {
  async getNotifications(params = {}) {
    const token = localStorage.getItem('provider_token') || localStorage.getItem('admin_token') || 'provider_1_token';
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001'}/api/notifications?${new URLSearchParams(params)}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) throw new Error('Failed to fetch notifications');
    return response.json();
  },

  async markAsRead(notificationId) {
    const token = localStorage.getItem('provider_token') || localStorage.getItem('admin_token') || 'provider_1_token';
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001'}/api/notifications/${notificationId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status: 'read' })
    });
    if (!response.ok) throw new Error('Failed to mark notification as read');
    return response.json();
  },

  async markAllRead() {
    const token = localStorage.getItem('provider_token') || localStorage.getItem('admin_token') || 'provider_1_token';
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001'}/api/notifications/mark-all-read`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) throw new Error('Failed to mark all notifications as read');
    return response.json();
  },

  async deleteNotification(notificationId) {
    const token = localStorage.getItem('provider_token') || localStorage.getItem('admin_token') || 'provider_1_token';
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001'}/api/notifications/${notificationId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) throw new Error('Failed to delete notification');
    return response.json();
  }
};

const NotificationIcon = ({ type, priority }) => {
  const iconProps = { className: "w-4 h-4" };
  
  if (priority === 'urgent' || priority === 'high') {
    return <AlertCircle {...iconProps} className="w-4 h-4 text-red-500" />;
  } else if (type === 'new_booking' || type === 'booking_confirmed') {
    return <CheckCircle {...iconProps} className="w-4 h-4 text-green-500" />;
  } else if (type === 'payment_received') {
    return <CheckCircle {...iconProps} className="w-4 h-4 text-green-600" />;
  }
  
  return <Info {...iconProps} className="w-4 h-4 text-blue-500" />;
};

const NotificationItem = ({ notification, onMarkRead, onDelete, onClick }) => {
  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const notificationDate = new Date(dateString);
    const diffInMinutes = Math.floor((now - notificationDate) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'À l\'instant';
    if (diffInMinutes < 60) return `Il y a ${diffInMinutes} min`;
    if (diffInMinutes < 1440) return `Il y a ${Math.floor(diffInMinutes / 60)}h`;
    return `Il y a ${Math.floor(diffInMinutes / 1440)}j`;
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'low': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleClick = () => {
    if (notification.status === 'unread') {
      onMarkRead(notification.id);
    }
    if (onClick) onClick(notification);
  };

  return (
    <div
      className={`p-4 border-l-4 cursor-pointer transition-colors hover:bg-gray-50 ${
        notification.status === 'unread' ? 'border-l-blue-500 bg-blue-50/30' : 'border-l-gray-300'
      }`}
      onClick={handleClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <div className="flex-shrink-0 mt-1">
            <NotificationIcon type={notification.type} priority={notification.priority} />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h4 className={`text-sm font-medium ${notification.status === 'unread' ? 'text-gray-900' : 'text-gray-600'}`}>
                {notification.title}
              </h4>
              <Badge className={`text-xs ${getPriorityColor(notification.priority)}`}>
                {notification.priority}
              </Badge>
            </div>
            
            <p className={`text-sm ${notification.status === 'unread' ? 'text-gray-700' : 'text-gray-500'}`}>
              {notification.message}
            </p>
            
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center space-x-2 text-xs text-gray-400">
                <Clock className="w-3 h-3" />
                <span>{formatTimeAgo(notification.created_at)}</span>
              </div>
              
              {notification.action_label && notification.action_url && (
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (notification.action_url.startsWith('/')) {
                      window.location.href = notification.action_url;
                    } else {
                      window.open(notification.action_url, '_blank');
                    }
                  }}
                >
                  {notification.action_label}
                </Button>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-1 ml-4">
          {notification.status === 'unread' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onMarkRead(notification.id);
              }}
              className="p-1"
            >
              <Check className="w-3 h-3" />
            </Button>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(notification.id);
            }}
            className="p-1 text-red-500 hover:text-red-700"
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </div>
  );
};

const NotificationCenter = ({ className = "" }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const { toast } = useToast();

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const response = await notificationsApi.getNotifications({
        page: 1,
        per_page: showAll ? 50 : 5
      });
      setNotifications(response.notifications);
      setUnreadCount(response.unread_count);
    } catch (error) {
      console.error('Error loading notifications:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les notifications",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
    
    // Poll for new notifications every 30 seconds
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, [showAll]);

  const handleMarkRead = async (notificationId) => {
    try {
      await notificationsApi.markAsRead(notificationId);
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, status: 'read' } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
      
      toast({
        title: "Notification marquée comme lue",
        description: "La notification a été marquée comme lue",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de marquer la notification comme lue",
        variant: "destructive",
      });
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationsApi.markAllRead();
      setNotifications(prev => prev.map(n => ({ ...n, status: 'read' })));
      setUnreadCount(0);
      
      toast({
        title: "Toutes les notifications marquées comme lues",
        description: "Toutes vos notifications ont été marquées comme lues",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de marquer toutes les notifications comme lues",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (notificationId) => {
    try {
      await notificationsApi.deleteNotification(notificationId);
      const deletedNotification = notifications.find(n => n.id === notificationId);
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      
      if (deletedNotification?.status === 'unread') {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
      
      toast({
        title: "Notification supprimée",
        description: "La notification a été supprimée avec succès",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la notification",
        variant: "destructive",
      });
    }
  };

  return (
    <div className={className}>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <Badge className="absolute -top-1 -right-1 px-1 py-0 text-xs bg-red-500 text-white rounded-full min-w-[18px] h-4 flex items-center justify-center">
                {unreadCount > 99 ? '99+' : unreadCount}
              </Badge>
            )}
          </Button>
        </DialogTrigger>
        
        <DialogContent className="max-w-md max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <div className="flex items-center justify-between">
              <DialogTitle>Notifications</DialogTitle>
              <div className="flex items-center space-x-2">
                {unreadCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={handleMarkAllRead}>
                    <Check className="w-4 h-4 mr-1" />
                    Tout marquer comme lu
                  </Button>
                )}
                <Badge variant="outline">
                  {notifications.length} notifications
                </Badge>
              </div>
            </div>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              </div>
            ) : notifications.length === 0 ? (
              <div className="text-center py-8">
                <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune notification</h3>
                <p className="text-gray-500">Vous n'avez aucune notification pour le moment</p>
              </div>
            ) : (
              <div className="space-y-0 border border-gray-200 rounded-lg overflow-hidden">
                {notifications.map((notification, index) => (
                  <div key={notification.id}>
                    <NotificationItem
                      notification={notification}
                      onMarkRead={handleMarkRead}
                      onDelete={handleDelete}
                    />
                    {index < notifications.length - 1 && <div className="border-b border-gray-200" />}
                  </div>
                ))}
              </div>
            )}
            
            {notifications.length > 0 && !showAll && (
              <div className="text-center py-4">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowAll(true)}
                >
                  Voir toutes les notifications
                  <ChevronDown className="w-4 h-4 ml-1" />
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NotificationCenter;