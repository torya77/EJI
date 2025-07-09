// Service pour l'API Admin
const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

class AdminApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('admin_token') || 'admin_token_123'; // Token par défaut pour le développement
  }

  // Headers par défaut avec authentification
  getHeaders() {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    };
  }

  // Gestion des erreurs
  async handleResponse(response) {
    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Erreur serveur' }));
      throw new Error(error.detail || 'Erreur de requête');
    }
    return response.json();
  }

  // === STATISTIQUES ADMIN ===
  async getStats() {
    const response = await fetch(`${this.baseURL}/api/admin/stats`, {
      headers: this.getHeaders()
    });
    return this.handleResponse(response);
  }

  // === GESTION DES PRESTATAIRES ===
  async getProviders(filters = {}) {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.provider_type) params.append('provider_type', filters.provider_type);
    if (filters.city) params.append('city', filters.city);

    const response = await fetch(`${this.baseURL}/api/admin/providers?${params}`, {
      headers: this.getHeaders()
    });
    return this.handleResponse(response);
  }

  async getProvider(providerId) {
    const response = await fetch(`${this.baseURL}/api/admin/providers/${providerId}`, {
      headers: this.getHeaders()
    });
    return this.handleResponse(response);
  }

  async updateProvider(providerId, updates) {
    const response = await fetch(`${this.baseURL}/api/admin/providers/${providerId}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(updates)
    });
    return this.handleResponse(response);
  }

  async updateProviderStatus(providerId, status, reason = null) {
    const response = await fetch(`${this.baseURL}/api/admin/providers/${providerId}/status`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify({ status, reason })
    });
    return this.handleResponse(response);
  }

  async deleteProvider(providerId) {
    const response = await fetch(`${this.baseURL}/api/admin/providers/${providerId}`, {
      method: 'DELETE',
      headers: this.getHeaders()
    });
    return this.handleResponse(response);
  }

  // === GESTION DES ACTIVITÉS ===
  async getActivities(filters = {}) {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.provider_id) params.append('provider_id', filters.provider_id);
    if (filters.category) params.append('category', filters.category);

    const response = await fetch(`${this.baseURL}/api/admin/activities?${params}`, {
      headers: this.getHeaders()
    });
    return this.handleResponse(response);
  }

  async getActivity(activityId) {
    const response = await fetch(`${this.baseURL}/api/admin/activities/${activityId}`, {
      headers: this.getHeaders()
    });
    return this.handleResponse(response);
  }

  async createActivity(activityData) {
    const response = await fetch(`${this.baseURL}/api/admin/activities`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(activityData)
    });
    return this.handleResponse(response);
  }

  async updateActivity(activityId, updates) {
    const response = await fetch(`${this.baseURL}/api/admin/activities/${activityId}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(updates)
    });
    return this.handleResponse(response);
  }

  async updateActivityStatus(activityId, status, reason = null) {
    const response = await fetch(`${this.baseURL}/api/admin/activities/${activityId}/status`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify({ status, reason })
    });
    return this.handleResponse(response);
  }

  async deleteActivity(activityId) {
    const response = await fetch(`${this.baseURL}/api/admin/activities/${activityId}`, {
      method: 'DELETE',
      headers: this.getHeaders()
    });
    return this.handleResponse(response);
  }

  // === AUTHENTIFICATION ===
  setToken(token) {
    this.token = token;
    localStorage.setItem('admin_token', token);
  }

  logout() {
    this.token = null;
    localStorage.removeItem('admin_token');
  }
}

// Service pour l'API Prestataires
class ProviderApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('provider_token');
  }

  // Headers par défaut avec authentification
  getHeaders() {
    return {
      'Content-Type': 'application/json',
      ...(this.token && { 'Authorization': `Bearer ${this.token}` })
    };
  }

  // Gestion des erreurs
  async handleResponse(response) {
    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Erreur serveur' }));
      throw new Error(error.detail || 'Erreur de requête');
    }
    return response.json();
  }

  // === AUTHENTIFICATION ===
  async register(registrationData) {
    const response = await fetch(`${this.baseURL}/api/providers/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(registrationData)
    });
    return this.handleResponse(response);
  }

  async login(credentials) {
    const response = await fetch(`${this.baseURL}/api/providers/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    const data = await this.handleResponse(response);
    
    if (data.access_token) {
      this.token = data.access_token;
      localStorage.setItem('provider_token', data.access_token);
      localStorage.setItem('provider_id', data.provider_id);
      localStorage.setItem('provider_name', data.business_name);
    }
    
    return data;
  }

  logout() {
    this.token = null;
    localStorage.removeItem('provider_token');
    localStorage.removeItem('provider_id');
    localStorage.removeItem('provider_name');
  }

  // === PROFIL PRESTATAIRE ===
  async getProfile() {
    const response = await fetch(`${this.baseURL}/api/providers/me`, {
      headers: this.getHeaders()
    });
    return this.handleResponse(response);
  }

  async updateProfile(updates) {
    const response = await fetch(`${this.baseURL}/api/providers/me`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(updates)
    });
    return this.handleResponse(response);
  }

  // === DASHBOARD PRESTATAIRE ===
  async getDashboardStats() {
    const response = await fetch(`${this.baseURL}/api/providers/dashboard/stats`, {
      headers: this.getHeaders()
    });
    return this.handleResponse(response);
  }

  // === GESTION DES ACTIVITÉS ===
  async getMyActivities() {
    const response = await fetch(`${this.baseURL}/api/providers/activities`, {
      headers: this.getHeaders()
    });
    return this.handleResponse(response);
  }

  async createActivity(activityData) {
    const response = await fetch(`${this.baseURL}/api/providers/activities`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(activityData)
    });
    return this.handleResponse(response);
  }

  async updateActivity(activityId, updates) {
    const response = await fetch(`${this.baseURL}/api/providers/activities/${activityId}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(updates)
    });
    return this.handleResponse(response);
  }

  async deleteActivity(activityId) {
    const response = await fetch(`${this.baseURL}/api/providers/activities/${activityId}`, {
      method: 'DELETE',
      headers: this.getHeaders()
    });
    return this.handleResponse(response);
  }

  // === GESTION DES RÉSERVATIONS ===
  async getBookings(status = null) {
    const params = status ? new URLSearchParams({ status }) : '';
    const response = await fetch(`${this.baseURL}/api/providers/bookings?${params}`, {
      headers: this.getHeaders()
    });
    return this.handleResponse(response);
  }

  async updateBookingStatus(bookingId, status) {
    const response = await fetch(`${this.baseURL}/api/providers/bookings/${bookingId}/status`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify({ status })
    });
    return this.handleResponse(response);
  }

  // === AUTHENTIFICATION HELPERS ===
  isAuthenticated() {
    return !!this.token;
  }

  getProviderId() {
    return localStorage.getItem('provider_id');
  }

  getProviderName() {
    return localStorage.getItem('provider_name');
  }
}

// Exports
export const adminApi = new AdminApiService();
export const providerApi = new ProviderApiService();
export { AdminApiService, ProviderApiService };