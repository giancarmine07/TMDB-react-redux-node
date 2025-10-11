import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  fetchPopularMovies,
  fetchTrendingMovies,
  searchMovies,
  clearSearchResults,
  selectPopularMovies,
  selectPopularLoading,
  selectTrendingMovies,
  selectTrendingLoading,
  selectSearchResults,
  selectSearchQuery,
  selectSearchLoading,
} from '../store/slices/moviesSlice';
import {
  addFavorite,
  removeFavorite,
  selectFavoritesList,
  fetchFavorites
} from '../store/slices/favoritesSlice';
import { selectIsAuthenticated } from '../store/slices/authSlice';
import { showToast } from '../store/slices/uiSlice';
import Loading from '../components/common/Loading';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { TMDB_IMAGE_BASE_URL, IMAGE_SIZES } from '../constants';

const MovieCard = ({ movie, isFavorite, onFavoriteToggle, onClick }) => {
  const posterUrl = movie.poster_path
    ? `${TMDB_IMAGE_BASE_URL}${IMAGE_SIZES.POSTER.MEDIUM}${movie.poster_path}`
    : '/placeholder-movie.jpg';

  return (
    <Card
      className="group relative overflow-hidden cursor-pointer"
      padding="none"
      hover
      onClick={onClick}
    >
      <div className="aspect-[2/3] overflow-hidden">
        <img
          src={posterUrl}
          alt={movie.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          loading="lazy"
        />
      </div>
      <div className="p-3">
        <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 mb-1">
          {movie.title}
        </h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {movie.vote_average?.toFixed(1) || 'N/A'}
            </span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onFavoriteToggle();
            }}
            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
          >
            <svg
              className={`w-5 h-5 ${
                isFavorite
                  ? 'text-red-500 fill-current'
                  : 'text-gray-400 dark:text-gray-500'
              }`}
              fill={isFavorite ? 'currentColor' : 'none'}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {movie.release_date?.split('-')[0] || 'TBA'}
        </p>
      </div>
    </Card>
  );
};

const HomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const popularMovies = useSelector(selectPopularMovies);
  const popularLoading = useSelector(selectPopularLoading);
  const trendingMovies = useSelector(selectTrendingMovies);
  const trendingLoading = useSelector(selectTrendingLoading);
  const searchResults = useSelector(selectSearchResults);
  const searchQuery = useSelector(selectSearchQuery);
  const searchLoading = useSelector(selectSearchLoading);
  const favoritesList = useSelector(selectFavoritesList);

  const [searchInput, setSearchInput] = useState('');
  const [activeTab, setActiveTab] = useState('popular');

  useEffect(() => {
    dispatch(fetchPopularMovies());
    dispatch(fetchTrendingMovies());
    if (isAuthenticated) {
      dispatch(fetchFavorites({}));
    }
  }, [dispatch, isAuthenticated]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      dispatch(searchMovies({ query: searchInput.trim() }));
      setActiveTab('search');
    }
  };

  const handleClearSearch = () => {
    setSearchInput('');
    dispatch(clearSearchResults());
    setActiveTab('popular');
  };

  const handleMovieClick = (movieId) => {
    navigate(`/movies/${movieId}`);
  };

  const handleFavoriteToggle = (movie) => {
    if (!isAuthenticated) {
      dispatch(
        showToast({
          message: 'Please login to add favorites',
          type: 'warning',
        })
      );
      navigate('/login');
      return;
    }

    const isFav = favoritesList.some(fav => fav.movie_id === movie.id);
    if (isFav) {
      dispatch(removeFavorite(movie.id));
      dispatch(
        showToast({
          message: 'Removed from favorites',
          type: 'success',
        })
      );
    } else {
      dispatch(addFavorite(movie));
      dispatch(
        showToast({
          message: 'Added to favorites',
          type: 'success',
        })
      );
    }
  };

  const displayMovies = () => {
    if (activeTab === 'search' && searchQuery) {
      return { movies: searchResults, loading: searchLoading };
    }
    if (activeTab === 'trending') {
      return { movies: trendingMovies, loading: trendingLoading };
    }
    return { movies: popularMovies, loading: popularLoading };
  };

  const { movies, loading } = displayMovies();

  const isMovieFavorite = (movieId) => {
    return favoritesList.some(fav => fav.movie_id === movieId);
  };

  return (
    <div className="container-custom py-8">
      {/* Hero Section */}
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          Discover Amazing Movies
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
          Explore thousands of movies, save your favorites, and share your reviews with the community.
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <form onSubmit={handleSearch} className="max-w-2xl">
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Search for movies..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              icon={
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              }
              iconPosition="left"
            />
            <Button type="submit" disabled={!searchInput.trim()}>
              Search
            </Button>
            {searchQuery && (
              <Button type="button" variant="ghost" onClick={handleClearSearch}>
                Clear
              </Button>
            )}
          </div>
        </form>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-4 border-b border-gray-200 dark:border-dark-700">
        <button
          onClick={() => setActiveTab('popular')}
          className={`pb-3 px-1 font-medium transition-colors border-b-2 ${
            activeTab === 'popular'
              ? 'border-primary-600 text-primary-600 dark:text-primary-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
        >
          Popular
        </button>
        <button
          onClick={() => setActiveTab('trending')}
          className={`pb-3 px-1 font-medium transition-colors border-b-2 ${
            activeTab === 'trending'
              ? 'border-primary-600 text-primary-600 dark:text-primary-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
        >
          Trending
        </button>
        {searchQuery && (
          <button
            onClick={() => setActiveTab('search')}
            className={`pb-3 px-1 font-medium transition-colors border-b-2 ${
              activeTab === 'search'
                ? 'border-primary-600 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Search Results ({searchResults.length})
          </button>
        )}
      </div>

      {/* Movies Grid */}
      {loading ? (
        <Loading size="lg" text="Loading movies..." />
      ) : movies.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              isFavorite={isMovieFavorite(movie.id)}
              onFavoriteToggle={() => handleFavoriteToggle(movie)}
              onClick={() => handleMovieClick(movie.id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <svg
            className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
            />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No movies found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Try adjusting your search or browse other categories
          </p>
        </div>
      )}
    </div>
  );
};

export default HomePage;
