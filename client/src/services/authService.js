/**
 * Servizio Autenticazione
 * Chiamate API per l'autenticazione (registrazione, login, ottenere utente corrente)
 */

import { post, get } from './api';
import { API_ENDPOINTS } from '../constants';

/**
 * Registra un nuovo utente
 * @param {Object} credentials - Credenziali utente
 * @param {string} credentials.username - Nome utente
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
 * Effettua il login dell'utente
 * @param {Object} credentials - Credenziali utente
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
 * Ottiene l'utente autenticato corrente
 * @returns {Promise}
 */
export const getCurrentUser = async () => {
  const response = await get(API_ENDPOINTS.AUTH.ME);
  return response.data;
};

/**
 * Effettua il logout dell'utente (lato client)
 * Rimuove il token e i dati utente dal localStorage
 */
export const logout = () => {
  localStorage.removeItem('movies_explorer_token');
  localStorage.removeItem('movies_explorer_user');
};
