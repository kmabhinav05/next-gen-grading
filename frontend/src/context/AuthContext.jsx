import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../api/auth';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Synchronously initialize cached profile to eliminate blank/flicker on refresh
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('user_profile');
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  });

  const [loading, setLoading] = useState(() => {
    const token = localStorage.getItem('access_token');
    const stored = localStorage.getItem('user_profile');
    return !!token && !stored;
  });

  const fetchProfile = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setUser(null);
      localStorage.removeItem('user_profile');
      setLoading(false);
      return;
    }
    try {
      const data = await authService.getCurrentUser();
      setUser(data);
      localStorage.setItem('user_profile', JSON.stringify(data));
    } catch (err) {
      console.error('Failed to restore user session:', err);
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user_profile');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const login = async (username, password) => {
    try {
      const data = await authService.login({ username, password });
      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);
      localStorage.setItem('user_profile', JSON.stringify(data.user));
      setUser(data.user);
      toast.success(`Welcome back, ${data.user.full_name || data.user.username}!`);
      return data.user;
    } catch (err) {
      const msg = err.response?.data?.detail || 'Invalid username or password';
      toast.error(msg);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_profile');
    setUser(null);
    toast.success('Signed out successfully');
  };

  const value = {
    user,
    role: user?.role,
    isAuthenticated: !!user,
    loading,
    login,
    logout,
    refreshUser: fetchProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
