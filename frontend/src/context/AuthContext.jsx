import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Configure axios to send cookies
  axios.defaults.withCredentials = true;
  const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    withCredentials: true,
  });

  // Access token stored in memory
  let accessToken = null;

  // Add request interceptor to attach token
  api.interceptors.request.use((config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  });

  // Add response interceptor to handle token refresh
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url.includes('/auth/login') && !originalRequest.url.includes('/auth/register')) {
        originalRequest._retry = true;
        try {
          const res = await axios.post('http://localhost:5000/api/auth/refresh', {}, { withCredentials: true });
          accessToken = res.data.accessToken;
          api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          setUser(null);
          return Promise.reject(refreshError);
        }
      }
      return Promise.reject(error);
    }
  );

  // Load user on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Try to refresh token first
        const res = await axios.post('http://localhost:5000/api/auth/refresh', {}, { withCredentials: true });
        accessToken = res.data.accessToken;
        setUser(res.data.user);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      setError(null);
      const res = await api.post('/auth/login', { email, password });
      accessToken = res.data.accessToken;
      setUser(res.data.user);
      return res.data.user;
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
      return null;
    }
  };

  const register = async (name, email, password, role) => {
    try {
      setError(null);
      const res = await api.post('/auth/register', { name, email, password, role });
      accessToken = res.data.accessToken;
      setUser(res.data.user);
      return res.data.user;
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
      return null;
    }
  };

  const logout = async () => {
    try {
      await api.get('/auth/logout');
      accessToken = null;
      setUser(null);
    } catch (err) {
      console.error('Logout error', err);
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    api
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
