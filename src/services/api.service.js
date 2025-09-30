/**
 * API Service - Centralized API client configuration
 */
import axios from 'axios';
import config from '../config/api';

// Constants
const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user';

// Create axios instance with base URL from environment variables
const apiClient = axios.create({
  baseURL: config.apiUrl,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

/**
 * Add JWT token to requests if available
 * This interceptor automatically adds the Authorization header with Bearer token
 * to all requests if the token exists in localStorage
 */
apiClient.interceptors.request.use(
  config => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
      console.log('Adding auth token to request:', config.url);
    } else {
      console.log('No auth token available for request:', config.url);
    }
    return config;
  },
  error => Promise.reject(error)
);

/**
 * Handle response and error in interceptors
 */
apiClient.interceptors.response.use(
  response => {
    // Return successful response
    return response;
  },
  error => {
    console.error('API Error:', error.response ? error.response.status : 'No response', 
                 'URL:', error.config ? error.config.url : 'Unknown URL');
    
    // Handle 401 Unauthorized - but let caller handle redirect
    if (error.response && error.response.status === 401) {
      console.log('401 Unauthorized response received. Clearing auth data.');
      
      // Clear auth data
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      
      // Don't redirect here. Let the calling function or a global handler do it.
      // This makes the service more reusable and avoids hard-coded navigation.
    }
    
    return Promise.reject(error);
  }
);

/**
 * Get CSRF token (dummy implementation since we're using JWT now)
 * @returns {Promise<void>}
 */
export const getCsrfToken = async () => {
  // No need to get CSRF token when using JWT
  return Promise.resolve();
};

// Export token key for reuse in other services
export { TOKEN_KEY, USER_KEY };

// Export the configured axios instance as default
export default apiClient;