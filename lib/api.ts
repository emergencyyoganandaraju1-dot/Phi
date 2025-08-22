import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // 60 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add any auth tokens or headers here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // Server responded with error status
      console.error('API Error:', error.response.data);
      
      // Handle specific error cases
      if (error.response.status === 401) {
        // Unauthorized - could redirect to login
        console.error('Unauthorized access');
      } else if (error.response.status === 429) {
        // Rate limited
        console.error('Rate limited');
      } else if (error.response.status >= 500) {
        // Server error
        console.error('Server error');
      }
    } else if (error.request) {
      // Request made but no response
      console.error('Network error:', error.request);
    } else {
      // Something else happened
      console.error('Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// API endpoints
export const endpoints = {
  chat: {
    search: '/chat/search',
    chat: '/chat/chat',
    regenerate: '/chat/regenerate',
    export: '/chat/export',
  },
  search: {
    web: '/search/web',
    news: '/search/news',
    academic: '/search/academic',
  },
  analytics: {
    usage: '/analytics/usage',
    feedback: '/analytics/feedback',
    popular: '/analytics/popular',
  },
  feedback: {
    submit: '/feedback/submit',
    rate: '/feedback/rate',
  },
};

export default api;