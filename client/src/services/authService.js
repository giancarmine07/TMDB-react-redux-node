/**
 * Auth Service
 * API calls for authentication (register, login, get current user)
 */

import { post, get } from './api';
import { API_ENDPOINTS } from '../constants';

/**
 * Register new user
 * @param {Object} credentials - User credentials
 * @param {string} credentials.username - Username
 * @param {string} credentials.email - Email
 * @param {string} credentials.password - Password
 * @returns {Promise}
 */
export const register = async ({ username, email, password }) => {
  const response = await post(API_ENDPOINTS.AUTH.REGISTER, {
    username,
    email,
    password,
  });
  return response.data;
};

/**
 * Login user
 * @param {Object} credentials - User credentials
 * @param {string} credentials.email - Email
 * @param {string} credentials.password - Password
 * @returns {Promise}
 */
export const login = async ({ email, password }) => {
  const response = await post(API_ENDPOINTS.AUTH.LOGIN, {
    email,
    password,
  });
  return response.data;
};

/**
 * Get current authenticated user
 * @returns {Promise}
 */
export const getCurrentUser = async () => {
  const response = await get(API_ENDPOINTS.AUTH.ME);
  return response.data;
};

/**
 * Logout user (client-side)
 * Clears token and user data from localStorage
 */
export const logout = () => {
  localStorage.removeItem('movies_explorer_token');
  localStorage.removeItem('movies_explorer_user');
};
