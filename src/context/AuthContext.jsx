import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/auth.service';
import { clearAuthSession } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => authService.getStoredUser());
  const [loading, setLoading] = useState(true);

  // Validate session on mount
  useEffect(() => {
    let isMounted = true;

    const verifySession = async () => {
      const token = localStorage.getItem('bizmind_token');
      if (!token) {
        if (isMounted) {
          setCurrentUser(null);
          setLoading(false);
        }
        return;
      }

      try {
        const data = await authService.getCurrentUser();
        if (isMounted && data?.user) {
          setCurrentUser(data.user);
        }
      } catch (err) {
        console.warn('Session verification notice:', err.message);
        // If token expired, clear local storage
        if (err.status === 401) {
          clearAuthSession();
          if (isMounted) setCurrentUser(null);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    verifySession();
    return () => { isMounted = false; };
  }, []);

  const login = async (email, password) => {
    const data = await authService.login({ email, password });
    if (data?.user) {
      setCurrentUser(data.user);
    }
    return data;
  };

  const register = async (userData) => {
    const data = await authService.register(userData);
    if (data?.user) {
      setCurrentUser(data.user);
    }
    return data;
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      setCurrentUser(null);
    }
  };

  const refreshUser = async () => {
    try {
      const data = await authService.getCurrentUser();
      if (data?.user) setCurrentUser(data.user);
      return data?.user;
    } catch {
      return null;
    }
  };

  const value = {
    currentUser,
    isAuthenticated: Boolean(currentUser),
    isAdmin: currentUser?.role === 'admin',
    isUser: currentUser?.role === 'user',
    loading,
    login,
    register,
    logout,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
