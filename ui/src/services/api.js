import axios from 'axios';

const TOKEN_KEY   = 'sp_token';
const REFRESH_KEY = 'sp_refresh_token';
const USER_KEY    = 'sp_user';

// In dev: proxied via Vite → http://localhost:8080/api/v1
// In prod: /api/v1 served by Spring Boot on same origin (or set VITE_API_BASE_URL to full URL)
const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api/v1';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ── Request interceptor — attach latest access token ─────────────────────
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) config.headers['Authorization'] = `Bearer ${token}`;
  return config;
});

// ── Response interceptor — silent token refresh on 401 ───────────────────
let isRefreshing = false;
let refreshQueue = [];  // pending requests waiting for new token

const processQueue = (error, token = null) => {
  refreshQueue.forEach((prom) => (error ? prom.reject(error) : prom.resolve(token)));
  refreshQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    // Only attempt refresh on 401, not on the refresh/login endpoints themselves
    if (
      error.response?.status === 401 &&
      !original._retry &&
      !original.url?.includes('/auth/refresh') &&
      !original.url?.includes('/auth/login')
    ) {
      const refreshToken = localStorage.getItem(REFRESH_KEY);
      if (!refreshToken) {
        // No refresh token — clear session and reject
        _clearSession();
        return Promise.reject(new Error('Session expired. Please log in again.'));
      }

      if (isRefreshing) {
        // Queue other 401 requests while a refresh is in progress
        return new Promise((resolve, reject) => {
          refreshQueue.push({ resolve, reject });
        }).then((token) => {
          original.headers['Authorization'] = `Bearer ${token}`;
          return api(original);
        });
      }

      original._retry = true;
      isRefreshing = true;

      try {
        const res = await axios.post('/api/v1/auth/refresh', { refreshToken });
        const { accessToken, refreshToken: newRefresh } = res.data.data;

        localStorage.setItem(TOKEN_KEY, accessToken);
        if (newRefresh) localStorage.setItem(REFRESH_KEY, newRefresh);

        api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        original.headers['Authorization'] = `Bearer ${accessToken}`;

        processQueue(null, accessToken);
        return api(original);
      } catch (refreshError) {
        processQueue(refreshError, null);
        _clearSession();
        return Promise.reject(new Error('Session expired. Please log in again.'));
      } finally {
        isRefreshing = false;
      }
    }

    const message =
      error.response?.data?.message ||
      error.message ||
      'Something went wrong. Please try again.';
    return Promise.reject(new Error(message));
  }
);

function _clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem(USER_KEY);
  delete api.defaults.headers.common['Authorization'];
  // Redirect to login without full page reload side-effects
  if (window.location.pathname !== '/login') {
    window.location.href = '/login';
  }
}

export default api;


