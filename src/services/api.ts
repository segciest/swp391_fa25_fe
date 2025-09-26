// API configuration and helper functions
const API_BASE_URL = typeof window !== 'undefined' 
  ? (window as any).location?.origin?.includes('localhost:3000') 
    ? 'http://localhost:8080' 
    : 'http://localhost:8080'
  : 'http://localhost:8080';

export class ApiService {
  private static baseURL = API_BASE_URL;

  static async get(endpoint: string, options?: RequestInit) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  static async post(endpoint: string, data?: any, options?: RequestInit) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  static async put(endpoint: string, data?: any, options?: RequestInit) {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  static async delete(endpoint: string, options?: RequestInit) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }

  private static async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
      // Add auth token if available
      ...(typeof window !== 'undefined' && localStorage.getItem('token') && {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      })
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...defaultHeaders,
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
      
      return await response.text();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }
}

// Auth helpers
export const AuthService = {
  login: (email: string, password: string) => 
    ApiService.post('/api/auth/login', { email, password }),
  
  register: (userData: any) => 
    ApiService.post('/api/auth/register', userData),
  
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  },
  
  getToken: () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  },
  
  isAuthenticated: () => {
    return !!AuthService.getToken();
  }
};