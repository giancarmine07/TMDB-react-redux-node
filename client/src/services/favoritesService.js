/**
 * Servizio Preferiti
 * Chiamate API per le operazioni sui film preferiti
 */

import { get, post, del } from './api';
import { API_ENDPOINTS } from '../constants';

/**
 * Ottiene tutti i preferiti per l'utente autenticato
 * @param {number} page - Numero di pagina
 * @param {number} limit - Elementi per pagina
 * @returns {Promise}
 */
export const getFavorites = async (page = 1, limit = 20) => {
  const response = await get(API_ENDPOINTS.FAVORITES.GET_ALL, {
    params: { page, limit },
  });
  return response.data;
};

/**
 * Aggiunge un film ai preferiti
 * @param {Object} movieData - Dati del film da TMDB
 * @returns {Promise}
 */
export const addFavorite = async (movieData) => {
  const response = await post(API_ENDPOINTS.FAVORITES.ADD, {
    id: movieData.id,
    title: movieData.title,
    poster_path: movieData.poster_path,
    overview: movieData.overview,
    release_date: movieData.release_date,
    vote_average: movieData.vote_average,
  });
  return response.data;
};

/**
 * Rimuove un film dai preferiti
 * @param {number} movieId - ID del film
 * @returns {Promise}
 */
export const removeFavorite = async (movieId) => {
  const response = await del(API_ENDPOINTS.FAVORITES.REMOVE(movieId));
  return response.data;
};

/**
 * Controlla se un film è nei preferiti
 * @param {number} movieId - ID del film
 * @returns {Promise}
 */
export const checkFavorite = async (movieId) => {
  const response = await get(API_ENDPOINTS.FAVORITES.CHECK(movieId));
  return response.data;
};

/**
 * Ottiene un preferito per ID del film
 * @param {number} movieId - ID del film
 * @returns {Promise}
 */
export const getFavoriteByMovieId = async (movieId) => {
  const response = await get(`/favorites/movie/${movieId}`);
  return response.data;
};
