/**
 * Auth Service - Handles authentication with Laravel backend
 */
import { createBaseService } from '@/lib/services/base.service';
import { TOKEN_KEY, USER_KEY } from './api.service';
import { showSuccess, showError, handleApiResponse, handleApiError } from './notification.service';

// Create base service for auth operations
const baseAuthService = createBaseService('auth');

/**
 * Authentication service for interacting with Laravel backend auth
 */
const authService = {
  ...baseAuthService,

  /**
   * Login user with phone and password
   * @param {Object} credentials - User credentials (phone, password)
   * @returns {Promise} - Response from API
   */
  async login(credentials) {
    console.log('Auth Service: Login attempt with phone:', credentials.phone);
    
    try {
      // Validate required fields
      if (!credentials.phone || !credentials.password) {
        throw new Error('رقم الهاتف وكلمة المرور مطلوبان');
      }

      // Use base service for login
      console.log('Trying standard login endpoint: /auth/login');
      const response = await baseAuthService.customPost('/auth/login', credentials);
      
      console.log('Login response received:', response);
      
      if (response.token) {
        console.log('Token received, storing in localStorage');
        localStorage.setItem(TOKEN_KEY, response.token);
      } else {
        console.warn('No token received in login response');
      }
      
      if (response.user) {
        console.log('User data received, storing in localStorage');
        localStorage.setItem(USER_KEY, JSON.stringify(response.user));
      } else {
        console.warn('No user data received in login response');
      }
      
      // Show success message if provided in response
      if (response.message) {
        showSuccess(response.message);
      } else {
        showSuccess('تم تسجيل الدخول بنجاح');
      }
      
      return response;
    } catch (error) {
      console.error('Login failed, error:', error);
      
      // Handle specific error cases
      if (error.response?.status === 401) {
        showError('رقم الهاتف أو كلمة المرور غير صحيحة');
      } else if (error.response?.status === 422) {
        const errors = error.response.data.errors;
        if (errors.phone) {
          showError('رقم الهاتف مطلوب');
        } else if (errors.password) {
          showError('كلمة المرور مطلوبة');
        } else {
          showError('البيانات المدخلة غير صحيحة');
        }
      } else {
        showError('حدث خطأ أثناء تسجيل الدخول');
      }
      
      throw error;
    }
  },

  /**
   * Register a new user with phone
   * @param {Object} userData - User registration data (name, phone, password)
   * @returns {Promise} - Response from API
   */
  async register(userData) {
    try {
      const response = await baseAuthService.customPost('/auth/register', userData);
      
      if (response.token) {
        localStorage.setItem(TOKEN_KEY, response.token);
      }
      
      if (response.user) {
        localStorage.setItem(USER_KEY, JSON.stringify(response.user));
      }
      
      // Show success message
      showSuccess(response.message || 'تم إنشاء الحساب بنجاح');
      
      return response;
    } catch (error) {
      handleApiError(error, { errorMessage: 'فشل في إنشاء الحساب' });
      throw error;
    }
  },

  /**
   * Logout user
   * @returns {Promise} - Response from API
   */
  async logout() {
    try {
      // Clear local storage first
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      
      // Try to logout from server (optional)
      try {
        await baseAuthService.customPost('/auth/logout');
      } catch (error) {
        console.warn('Server logout failed, but local logout successful:', error);
      }
      
      showSuccess('تم تسجيل الخروج بنجاح');
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      // Even if server logout fails, clear local data
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      showError('حدث خطأ أثناء تسجيل الخروج');
      throw error;
    }
  },

  /**
   * Get current user
   * @returns {Promise} - Current user data
   */
  async getCurrentUser() {
    try {
      const response = await baseAuthService.customGet('/auth/user');
      
      if (response.user) {
        localStorage.setItem(USER_KEY, JSON.stringify(response.user));
      }
      
      return response.user || response;
    } catch (error) {
      console.error('Error fetching current user:', error);
      // If API fails, try to get from localStorage
      const storedUser = localStorage.getItem(USER_KEY);
      if (storedUser) {
        try {
          return JSON.parse(storedUser);
        } catch (parseError) {
          console.error('Error parsing stored user:', parseError);
        }
      }
      throw error;
    }
  },

  /**
   * Update user profile
   * @param {Object} userData - Updated user data
   * @returns {Promise} - Updated user data
   */
  async updateProfile(userData) {
    try {
      const response = await baseAuthService.customPut('/auth/profile', userData);
      
      // Update stored user data
      localStorage.setItem(USER_KEY, JSON.stringify(response.user || response));
      
      // Show success message
      showSuccess(response.message || 'تم تحديث الملف الشخصي بنجاح');
      
      return response.user || response;
    } catch (error) {
      handleApiError(error, { errorMessage: 'فشل تحديث الملف الشخصي' });
      throw error;
    }
  },

  /**
   * Change user password
   * @param {Object} passwordData - Password change data
   * @returns {Promise} - Response from API
   */
  async changePassword(passwordData) {
    try {
      const response = await baseAuthService.customPost('/auth/change-password', passwordData);
      
      // Show success message
      showSuccess(response.message || 'تم تغيير كلمة المرور بنجاح');
      
      return response;
    } catch (error) {
      handleApiError(error, { errorMessage: 'فشل تغيير كلمة المرور' });
      throw error;
    }
  },

  /**
   * Check if user is authenticated
   * @returns {boolean} - Authentication status
   */
  isAuthenticated() {
    const token = localStorage.getItem(TOKEN_KEY);
    const user = localStorage.getItem(USER_KEY);
    return !!(token && user);
  },

  /**
   * Get stored user data
   * @returns {Object|null} - Stored user data or null
   */
  getStoredUser() {
    try {
      const userData = localStorage.getItem(USER_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error parsing stored user data:', error);
      return null;
    }
  },

  /**
   * Get stored token
   * @returns {string|null} - Stored token or null
   */
  getStoredToken() {
    return localStorage.getItem(TOKEN_KEY);
  },

  /**
   * Clear all auth data
   */
  clearAuthData() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }
};

export default authService;