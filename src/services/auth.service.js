import { apiRequest, setAuthSession, clearAuthSession, getStoredUser } from './api';

export const authService = {
  // Register a new standard user (server always assigns role: "user")
  async register({ firstName, lastName, email, password, phone, businessName, industry }) {
    const res = await apiRequest('/v1/auth/register', {
      method: 'POST',
      body: { firstName, lastName, email, password, phone, businessName, industry },
    });

    if (res.data?.accessToken && res.data?.user) {
      setAuthSession(res.data.accessToken, res.data.user, res.data.refreshToken);
    }
    return res.data;
  },

  // Login (returns role: "user" | "admin")
  async login({ email, password }) {
    const res = await apiRequest('/v1/auth/login', {
      method: 'POST',
      body: { email, password },
    });

    if (res.data?.accessToken && res.data?.user) {
      setAuthSession(res.data.accessToken, res.data.user, res.data.refreshToken);
    }
    return res.data;
  },

  // Fetch current user from DB to verify role and status
  async getCurrentUser() {
    const res = await apiRequest('/v1/auth/me');
    if (res.data?.user) {
      const currentToken = localStorage.getItem('bizmind_token');
      setAuthSession(currentToken, res.data.user);
    }
    return res.data;
  },

  // Logout
  async logout() {
    try {
      await apiRequest('/v1/auth/logout', { method: 'POST' });
    } catch (err) {
      // Continue client cleanup even if server is unreachable
    } finally {
      clearAuthSession();
    }
  },

  getStoredUser,
};
