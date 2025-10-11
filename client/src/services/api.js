/**
 * Servizio API Axios
 * Istanza axios configurata con interceptor per la gestione di richieste/risposte
 */

import axios from 'axios';
import { API_BASE_URL, STORAGE_KEYS } from '../constants';
import { parseError, isAuthError } from '../utils/errors/errorHandler';

/**
 * Crea un'istanza axios con configurazione predefinita
 */
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000, // 15 secondi
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Interceptor Richieste
 * Aggiunge il token di autenticazione alle richieste
 */
api.interceptors.request.use(
  (config) => {
    // Ottieni il token dal localStorage
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);

    // Aggiungi il token agli header se esiste
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Logga la richiesta in sviluppo
    if (import.meta.env.DEV) {
      console.log('🚀 API Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        data: config.data,
        params: config.params,
      });
    }

    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

/**
 * Interceptor Risposte
 * Gestisce risposte ed errori globalmente
 */
api.interceptors.response.use(
  (response) => {
    // Logga la risposta in sviluppo
    if (import.meta.env.DEV) {
      console.log('✅ API Response:', {
        url: response.config.url,
        status: response.status,
        data: response.data,
      });
    }

    return response;
  },
  (error) => {
    // Analizza l'errore
    const parsedError = parseError(error);

    // Logga l'errore in sviluppo
    if (import.meta.env.DEV) {
      console.error('❌ API Error:', {
        url: error.config?.url,
        method: error.config?.method,
        statusCode: parsedError.statusCode,
        message: parsedError.message,
        errorCode: parsedError.errorCode,
      });
    }

    // Handle authentication errors
    if (isAuthError(error)) {
      // Clear token and user data
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);

      // Redirect to login if not already there
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

/**
 * Helper function to make GET requests
 * @param {string} url - Endpoint URL
 * @param {Object} config - Axios config
 * @returns {Promise}
 */
export const get = (url, config = {}) => {
  return api.get(url, config);
};

/**
 * Helper function to make POST requests
 * @param {string} url - Endpoint URL
 * @param {Object} data - Request body
 * @param {Object} config - Axios config
 * @returns {Promise}
 */
export const post = (url, data, config = {}) => {
  return api.post(url, data, config);
};

/**
 * Helper function to make PUT requests
 * @param {string} url - Endpoint URL
 * @param {Object} data - Request body
 * @param {Object} config - Axios config
 * @returns {Promise}
 */
export const put = (url, data, config = {}) => {
  return api.put(url, data, config);
};

/**
 * Helper function to make PATCH requests
 * @param {string} url - Endpoint URL
 * @param {Object} data - Request body
 * @param {Object} config - Axios config
 * @returns {Promise}
 */
export const patch = (url, data, config = {}) => {
  return api.patch(url, data, config);
};

/**
 * Helper function to make DELETE requests
 * @param {string} url - Endpoint URL
 * @param {Object} config - Axios config
 * @returns {Promise}
 */
export const del = (url, config = {}) => {
  return api.delete(url, config);
};

/**
 * Set authentication token
 * @param {string} token - JWT token
 */
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
};

/**
 * Remove authentication token
 */
export const removeAuthToken = () => {
  localStorage.removeItem(STORAGE_KEYS.TOKEN);
  delete api.defaults.headers.common['Authorization'];
};

/**
 * Get current authentication token
 * @returns {string|null}
 */
export const getAuthToken = () => {
  return localStorage.getItem(STORAGE_KEYS.TOKEN);
};

/**
 * Check if user is authenticated
 * @returns {boolean}
 */
export const isAuthenticated = () => {
  const token = getAuthToken();
  return !!token;
};

export default api;
