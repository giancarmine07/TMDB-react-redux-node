import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchFavorites, removeFavorite, selectFavoritesList, selectFavoritesLoading } from '../store/slices/favoritesSlice';
import { showToast } from '../store/slices/uiSlice';
import Loading from '../components/common/Loading';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { TMDB_IMAGE_BASE_URL, IMAGE_SIZES } from '../constants';

const FavoritesPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const favorites = useSelector(selectFavoritesList);
  const loading = useSelector(selectFavoritesLoading);

  useEffect(() => {
    dispatch(fetchFavorites({}));
  }, [dispatch]);

  const handleRemove = (movieId) => {
    dispatch(removeFavorite(movieId));
    dispatch(showToast({ message: 'Removed from favorites', type: 'success' }));
  };

  if (loading) {
    return <Loading size="lg" text="Loading favorites..." />;
  }

  return (
    <div className="container-custom py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">My Favorites</h1>

      {favorites.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400 mb-4">No favorites yet</p>
          <Button onClick={() => navigate('/')}>Explore Movies</Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {favorites.map((fav) => (
            <Card key={fav.id} padding="none" hover onClick={() => navigate(`/movies/${fav.movie_id}`)}>
              <img
                src={`${TMDB_IMAGE_BASE_URL}${IMAGE_SIZES.POSTER.MEDIUM}${fav.movie_poster}`}
                alt={fav.movie_title}
                className="w-full aspect-[2/3] object-cover"
              />
              <div className="p-3">
                <h3 className="font-semibold line-clamp-2 text-gray-900 dark:text-white">{fav.movie_title}</h3>
                <Button
                  size="sm"
                  variant="danger"
                  fullWidth
                  className="mt-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(fav.movie_id);
                  }}
                >
                  Remove
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
