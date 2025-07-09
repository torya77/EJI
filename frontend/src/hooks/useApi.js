import { useState, useEffect } from 'react';
import ApiService from '../services/api';

export const useEvents = (filters = {}) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const data = await ApiService.getEvents(filters);
        setEvents(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching events:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [JSON.stringify(filters)]);

  return { events, loading, error, refetch: () => fetchEvents() };
};

export const useRestaurants = (filters = {}) => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        const data = await ApiService.getRestaurants(filters);
        setRestaurants(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching restaurants:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, [JSON.stringify(filters)]);

  return { restaurants, loading, error, refetch: () => fetchRestaurants() };
};

export const useProducts = (filters = {}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await ApiService.getProducts(filters);
        setProducts(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [JSON.stringify(filters)]);

  return { products, loading, error, refetch: () => fetchProducts() };
};

export const usePosts = (filters = {}) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const data = await ApiService.getPosts(filters);
        setPosts(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching posts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [JSON.stringify(filters)]);

  const createPost = async (postData) => {
    try {
      const newPost = await ApiService.createPost(postData);
      setPosts(prev => [newPost, ...prev]);
      return newPost;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const likePost = async (postId) => {
    try {
      await ApiService.likePost(postId);
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { ...post, likes: post.likes + 1 }
          : post
      ));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const unlikePost = async (postId) => {
    try {
      await ApiService.unlikePost(postId);
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { ...post, likes: Math.max(0, post.likes - 1) }
          : post
      ));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return { 
    posts, 
    loading, 
    error, 
    createPost, 
    likePost, 
    unlikePost,
    refetch: () => fetchPosts() 
  };
};

export const useTranslation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const translateText = async (text, sourceLang = 'auto', targetLang = 'fr') => {
    try {
      setLoading(true);
      setError(null);
      const result = await ApiService.translateText(text, sourceLang, targetLang);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const translateImage = async (imageBase64, targetLang = 'fr') => {
    try {
      setLoading(true);
      setError(null);
      const result = await ApiService.translateImage(imageBase64, targetLang);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { 
    translateText, 
    translateImage, 
    loading, 
    error 
  };
};