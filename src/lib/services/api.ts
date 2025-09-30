import axios from 'axios';
import config from '../../config/api';
const apiClient = axios.create({
  baseURL:config.apiUrl,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true // Important for Laravel Sanctum
});

// You can add interceptors for handling tokens or errors globally
apiClient.interceptors.request.use(config => {
  // Example: get token from local storage or a state management store
  // Check if we're in the browser environment
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// It's a good practice to fetch the CSRF cookie from sanctum first
export const getCsrfToken = async () => {
  try {
    await apiClient.get('/sanctum/csrf-cookie');
  } catch (error) {
    console.error('Error fetching CSRF token:', error);
  }
};

export default apiClient; 