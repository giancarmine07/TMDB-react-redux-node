import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserReviews, deleteReview, selectUserReviews, selectReviewsLoading } from '../store/slices/reviewsSlice';
import { showToast } from '../store/slices/uiSlice';
import Loading from '../components/common/Loading';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

/**
 * Pagina Recensioni Utente
 * Mostra tutte le recensioni scritte dall'utente autenticato
 */
const ReviewsPage = () => {
  const dispatch = useDispatch();
  const reviews = useSelector(selectUserReviews);
  const loading = useSelector(selectReviewsLoading);

  // Carica le recensioni dell'utente al montaggio del componente
  useEffect(() => {
    dispatch(fetchUserReviews({}));
  }, [dispatch]);

  // Gestisce l'eliminazione di una recensione
  const handleDelete = (reviewId) => {
    if (confirm('Are you sure you want to delete this review?')) {
      dispatch(deleteReview(reviewId));
      dispatch(showToast({ message: 'Review deleted', type: 'success' }));
    }
  };

  if (loading) {
    return <Loading size="lg" text="Loading reviews..." />;
  }

  return (
    <div className="container-custom py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">My Reviews</h1>

      {/* Lista vuota */}
      {reviews.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">No reviews yet</p>
        </div>
      ) : (
        /* Lista recensioni */
        <div className="space-y-4">
          {reviews.map((review) => (
            <Card key={review.id}>
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{review.movie_title}</h3>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-4 h-4 ${i < review.rating ? 'text-yellow-500' : 'text-gray-300 dark:text-gray-600'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-3">{review.comment}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(review.created_at).toLocaleDateString()}
                </span>
                <Button size="sm" variant="danger" onClick={() => handleDelete(review.id)}>
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewsPage;
