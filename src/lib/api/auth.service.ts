import { AuthResponse, LoginCredentials, User } from '@/types/auth';
import { apiRequest, IS_MOCK_MODE, setStoredAuthToken } from './client';
import { MOCK_USERS } from '../mock/mockData';

export const authService = {
  /**
   * Log in user with email & password
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    if (IS_MOCK_MODE) {
      // Simulate network latency
      await new Promise((resolve) => setTimeout(resolve, 600));

      const foundUser =
        MOCK_USERS.find(
          (u) => u.email.toLowerCase() === credentials.email.toLowerCase()
        ) || {
          id: 'user-custom',
          email: credentials.email,
          name: credentials.email.split('@')[0].replace('.', ' ').toUpperCase(),
          role: 'sales_rep' as const,
          dealership: 'Dealer Socket Automation Hub',
        };

      const mockResponse: AuthResponse = {
        user: foundUser,
        token: `mock_jwt_token_${Date.now()}_dealersocket`,
        expiresIn: 3600 * 24,
      };

      setStoredAuthToken(mockResponse.token);
      if (typeof window !== 'undefined') {
        localStorage.setItem(
          'dealersocket_user_data',
          JSON.stringify(mockResponse.user)
        );
      }
      return mockResponse;
    }

    // Live Backend Call
    // Maps to: POST /auth/login -> payload: { email, password }
    const response = await apiRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    setStoredAuthToken(response.token);
    if (typeof window !== 'undefined') {
      localStorage.setItem('dealersocket_user_data', JSON.stringify(response.user));
    }
    return response;
  },

  /**
   * Logout user and clear tokens
   */
  async logout(): Promise<void> {
    if (!IS_MOCK_MODE) {
      try {
        await apiRequest('/auth/logout', { method: 'POST' });
      } catch {
        // Fallback cleanup if backend request fails
      }
    }
    setStoredAuthToken(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('dealersocket_user_data');
    }
  },

  /**
   * Get current authenticated user
   */
  async getCurrentUser(): Promise<User | null> {
    if (typeof window === 'undefined') return null;

    if (IS_MOCK_MODE) {
      const saved = localStorage.getItem('dealersocket_user_data');
      if (saved) {
        try {
          return JSON.parse(saved) as User;
        } catch {
          return MOCK_USERS[0];
        }
      }
      return null;
    }

    // Live Backend Call: GET /auth/me
    try {
      return await apiRequest<User>('/auth/me');
    } catch {
      return null;
    }
  },
};
