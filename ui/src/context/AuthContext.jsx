import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

const TOKEN_KEY = 'sp_token';
const USER_KEY  = 'sp_user';

export function AuthProvider({ children }) {
  const [token, setToken]   = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user,  setUser]    = useState(() => {
    try { return JSON.parse(localStorage.getItem(USER_KEY)); } catch { return null; }
  });

  // Inject / remove Authorization header whenever token changes
  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
  }, [token]);

  const login = useCallback(async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { accessToken, user: u } = res.data.data;
    localStorage.setItem(TOKEN_KEY, accessToken);
    localStorage.setItem(USER_KEY, JSON.stringify(u));
    setToken(accessToken);
    setUser(u);
    api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    return u;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
    delete api.defaults.headers.common['Authorization'];
    toast.success('Logged out');
  }, []);

  const isAdmin      = user?.role === 'ADMIN';
  const isLabAnalyst = user?.role === 'LAB_ANALYST';
  const isClient     = user?.role === 'CLIENT';
  const isLoggedIn   = !!token && !!user;

  const value = useMemo(() => ({
    token, user, isLoggedIn, isAdmin, isLabAnalyst, isClient,
    login, logout,
  }), [token, user, isLoggedIn, isAdmin, isLabAnalyst, isClient, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
