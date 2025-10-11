import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMovieDetails, selectSelectedMovie, selectMoviesLoading } from '../store/slices/moviesSlice';
import { addFavorite, removeFavorite, selectIsFavorite } from '../store/slices/favoritesSlice';
import { selectIsAuthenticated } from '../store/slices/authSlice';
import { showToast } from '../store/slices/uiSlice';
import Loading from '../components/common/Loading';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import { TMDB_IMAGE_BASE_URL, IMAGE_SIZES } from '../constants';

const MovieDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const movie = useSelector(selectSelectedMovie);
  const loading = useSelector(selectMoviesLoading);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isFavorite = useSelector(selectIsFavorite(parseInt(id)));

  // Carica i dettagli del film quando l'ID cambia
  useEffect(() => {
    if (id) {
      dispatch(fetchMovieDetails(parseInt(id)));
    }
  }, [dispatch, id]);

  // Gestisce l'aggiunta/rimozione dai preferiti
  const handleFavoriteToggle = () => {
    if (!isAuthenticated) {
      dispatch(showToast({ message: 'Please login to add favorites', type: 'warning' }));
      navigate('/login');
      return;
    }

    if (isFavorite) {
      dispatch(removeFavorite(movie.id));
      dispatch(showToast({ message: 'Removed from favorites', type: 'success' }));
    } else {
      dispatch(addFavorite(movie));
      dispatch(showToast({ message: 'Added to favorites', type: 'success' }));
    }
  };

  if (loading) {
    return <Loading size="lg" text="Loading movie details..." fullScreen />;
  }

  if (!movie) {
    return (
      <div className="container-custom py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Movie not found</h2>
        <Button onClick={() => navigate('/')}>Go Home</Button>
      </div>
    );
  }

  const backdropUrl = movie.backdrop_path
    ? `${TMDB_IMAGE_BASE_URL}${IMAGE_SIZES.BACKDROP.LARGE}${movie.backdrop_path}`
    : null;

  const posterUrl = movie.poster_path
    ? `${TMDB_IMAGE_BASE_URL}${IMAGE_SIZES.POSTER.LARGE}${movie.poster_path}`
    : null;

  return (
    <div>
      {/* Immagine di sfondo */}
      {backdropUrl && (
        <div className="relative h-96 w-full">
          <img
            src={backdropUrl}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-50 dark:from-dark-950 to-transparent"></div>
        </div>
      )}

      {/* Contenuto */}
      <div className="container-custom py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Locandina */}
          <div className="md:col-span-1">
            {posterUrl && (
              <Card padding="none" className="overflow-hidden">
                <img src={posterUrl} alt={movie.title} className="w-full" />
              </Card>
            )}
          </div>

          {/* Dettagli */}
          <div className="md:col-span-2">
            <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">{movie.title}</h1>

            <div className="flex items-center gap-4 mb-6 text-gray-700 dark:text-gray-300">
              <div className="flex items-center gap-1">
                <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="font-semibold">{movie.vote_average?.toFixed(1)}</span>
              </div>
              <span className="text-gray-400">|</span>
              <span>{movie.release_date?.split('-')[0]}</span>
              {movie.runtime && (
                <>
                  <span className="text-gray-400">|</span>
                  <span>{movie.runtime} min</span>
                </>
              )}
            </div>

            <p className="text-lg mb-6 text-gray-700 dark:text-gray-300">
              {movie.overview}
            </p>

            {movie.genres && movie.genres.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">GENRES</h3>
                <div className="flex flex-wrap gap-2">
                  {movie.genres.map((genre) => (
                    <span
                      key={genre.id}
                      className="px-3 py-1 bg-gray-200 dark:bg-dark-700 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <Button
                variant={isFavorite ? "danger" : "primary"}
                onClick={handleFavoriteToggle}
              >
                {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate(`/reviews?movie=${id}`)}
              >
                Write Review
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailPage;
