/**
 * Servizio Recensioni
 * Chiamate API per le operazioni sulle recensioni dei film
 */

import { get, post, put, del } from './api';
import { API_ENDPOINTS } from '../constants';

/**
 * Ottiene le recensioni dell'utente
 * @param {number} page - Numero di pagina
 * @param {number} limit - Elementi per pagina
 * @returns {Promise}
 */
export const getUserReviews = async (page = 1, limit = 20) => {
  const response = await get(API_ENDPOINTS.REVIEWS.GET_USER_REVIEWS, {
    params: { page, limit },
  });
  return response.data;
};

/**
 * Ottiene le recensioni per un film
 * @param {number} movieId - ID del film
 * @param {number} page - Numero di pagina
 * @param {number} limit - Elementi per pagina
 * @returns {Promise}
 */
export const getMovieReviews = async (movieId, page = 1, limit = 20) => {
  const response = await get(API_ENDPOINTS.REVIEWS.GET_MOVIE_REVIEWS(movieId), {
    params: { page, limit },
  });
  return response.data;
};

/**
 * Ottiene una recensione per ID
 * @param {number} reviewId - ID della recensione
 * @returns {Promise}
 */
export const getReviewById = async (reviewId) => {
  const response = await get(`/reviews/${reviewId}`);
  return response.data;
};

/**
 * Crea una nuova recensione
 * @param {Object} reviewData - Dati della recensione
 * @param {number} reviewData.movieId - ID del film
 * @param {string} reviewData.movieTitle - Titolo del film
 * @param {number} reviewData.rating - Valutazione (1-5)
 * @param {string} reviewData.comment - Commento della recensione
 * @returns {Promise}
 */
export const createReview = async ({ movieId, movieTitle, rating, comment }) => {
  const response = await post(API_ENDPOINTS.REVIEWS.CREATE, {
    movieId,
    movieTitle,
    rating,
    comment,
  });
  return response.data;
};

/**
 * Aggiorna una recensione
 * @param {number} reviewId - ID della recensione
 * @param {number} rating - Nuova valutazione
 * @param {string} comment - Nuovo commento
 * @returns {Promise}
 */
export const updateReview = async (reviewId, rating, comment) => {
  const response = await put(API_ENDPOINTS.REVIEWS.UPDATE(reviewId), {
    rating,
    comment,
  });
  return response.data;
};

/**
 * Elimina una recensione
 * @param {number} reviewId - ID della recensione
 * @returns {Promise}
 */
export const deleteReview = async (reviewId) => {
  const response = await del(API_ENDPOINTS.REVIEWS.DELETE(reviewId));
  return response.data;
};
