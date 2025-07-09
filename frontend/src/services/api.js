// API service for connecting to backend
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API_BASE = `${BACKEND_URL}/api`;

class ApiService {
  // Events API
  async getEvents(filters = {}) {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== 'all') {
        queryParams.append(key, value);
      }
    });
    
    const response = await fetch(`${API_BASE}/events?${queryParams}`);
    if (!response.ok) throw new Error('Failed to fetch events');
    return response.json();
  }

  async getEvent(id) {
    const response = await fetch(`${API_BASE}/events/${id}`);
    if (!response.ok) throw new Error('Failed to fetch event');
    return response.json();
  }

  async bookEvent(id) {
    const response = await fetch(`${API_BASE}/events/${id}/book`, {
      method: 'POST'
    });
    if (!response.ok) throw new Error('Failed to book event');
    return response.json();
  }

  // Restaurants API
  async getRestaurants(filters = {}) {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== 'all') {
        queryParams.append(key, value);
      }
    });
    
    const response = await fetch(`${API_BASE}/restaurants?${queryParams}`);
    if (!response.ok) throw new Error('Failed to fetch restaurants');
    return response.json();
  }

  async getRestaurant(id) {
    const response = await fetch(`${API_BASE}/restaurants/${id}`);
    if (!response.ok) throw new Error('Failed to fetch restaurant');
    return response.json();
  }

  async reserveTable(id) {
    const response = await fetch(`${API_BASE}/restaurants/${id}/reserve`, {
      method: 'POST'
    });
    if (!response.ok) throw new Error('Failed to reserve table');
    return response.json();
  }

  // Products API
  async getProducts(filters = {}) {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== 'all') {
        queryParams.append(key, value);
      }
    });
    
    const response = await fetch(`${API_BASE}/products?${queryParams}`);
    if (!response.ok) throw new Error('Failed to fetch products');
    return response.json();
  }

  async getProduct(id) {
    const response = await fetch(`${API_BASE}/products/${id}`);
    if (!response.ok) throw new Error('Failed to fetch product');
    return response.json();
  }

  async purchaseProduct(id) {
    const response = await fetch(`${API_BASE}/products/${id}/purchase`, {
      method: 'POST'
    });
    if (!response.ok) throw new Error('Failed to purchase product');
    return response.json();
  }

  // Posts API
  async getPosts(filters = {}) {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        queryParams.append(key, value);
      }
    });
    
    const response = await fetch(`${API_BASE}/posts?${queryParams}`);
    if (!response.ok) throw new Error('Failed to fetch posts');
    return response.json();
  }

  async createPost(postData) {
    const response = await fetch(`${API_BASE}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(postData)
    });
    if (!response.ok) throw new Error('Failed to create post');
    return response.json();
  }

  async likePost(id) {
    const response = await fetch(`${API_BASE}/posts/${id}/like`, {
      method: 'POST'
    });
    if (!response.ok) throw new Error('Failed to like post');
    return response.json();
  }

  async unlikePost(id) {
    const response = await fetch(`${API_BASE}/posts/${id}/unlike`, {
      method: 'POST'
    });
    if (!response.ok) throw new Error('Failed to unlike post');
    return response.json();
  }

  // Translation API
  async translateText(text, sourceLang = 'auto', targetLang = 'fr') {
    const response = await fetch(`${API_BASE}/translate/text`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text,
        source_lang: sourceLang,
        target_lang: targetLang
      })
    });
    if (!response.ok) throw new Error('Failed to translate text');
    return response.json();
  }

  async translateImage(imageBase64, targetLang = 'fr') {
    const response = await fetch(`${API_BASE}/translate/image`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        image_base64: imageBase64,
        target_lang: targetLang
      })
    });
    if (!response.ok) throw new Error('Failed to translate image');
    return response.json();
  }

  async getSupportedLanguages() {
    const response = await fetch(`${API_BASE}/translate/languages`);
    if (!response.ok) throw new Error('Failed to fetch languages');
    return response.json();
  }

  // Users API
  async getUsers(filters = {}) {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        queryParams.append(key, value);
      }
    });
    
    const response = await fetch(`${API_BASE}/users?${queryParams}`);
    if (!response.ok) throw new Error('Failed to fetch users');
    return response.json();
  }

  async getUser(id) {
    const response = await fetch(`${API_BASE}/users/${id}`);
    if (!response.ok) throw new Error('Failed to fetch user');
    return response.json();
  }
}

export default new ApiService();