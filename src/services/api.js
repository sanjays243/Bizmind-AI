/**
 * BizMind AI - Central HTTP API Client
 * 
 * Handles base URL, auth token injection, refresh token rotation,
 * and unified error extraction.
 */

const API_BASE = '/api';

export const getAuthToken = () => {
  try {
    return localStorage.getItem('bizmind_token') || '';
  } catch {
    return '';
  }
};

export const setAuthSession = (token, user, refreshToken) => {
  try {
    if (token) localStorage.setItem('bizmind_token', token);
    if (refreshToken) localStorage.setItem('bizmind_refresh_token', refreshToken);
    if (user) localStorage.setItem('bizmind_user', JSON.stringify(user));
  } catch (err) {
    console.error('Error saving session to localStorage:', err);
  }
};

export const clearAuthSession = () => {
  try {
    localStorage.removeItem('bizmind_token');
    localStorage.removeItem('bizmind_refresh_token');
    localStorage.removeItem('bizmind_user');
  } catch (err) {
    console.error('Error clearing session:', err);
  }
};

export const getStoredUser = () => {
  try {
    const raw = localStorage.getItem('bizmind_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

/**
 * Universal request wrapper
 */
export async function apiRequest(endpoint, options = {}) {
  const url = endpoint.startsWith('/') ? `${API_BASE}${endpoint}` : `${API_BASE}/${endpoint}`;

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const token = getAuthToken();
  if (token && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  try {
    const response = await fetch(url, config);
    const contentType = response.headers.get('content-type');
    let data;
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = { message: await response.text() };
    }

    if (!response.ok) {
      // If 401 and unauthorized, handle session expiry if not on auth routes
      if (response.status === 401 && !endpoint.includes('/auth/login') && !endpoint.includes('/auth/register')) {
        // clearAuthSession();
      }
      const error = new Error(data?.message || `Request failed with status ${response.status}`);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (err) {
    throw err;
  }
}
