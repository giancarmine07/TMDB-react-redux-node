import { useSelector } from 'react-redux';
import { selectUser } from '../store/slices/authSlice';
import Card from '../components/common/Card';

/**
 * Pagina Profilo Utente
 * Mostra le informazioni dell'utente autenticato
 */
const ProfilePage = () => {
  const user = useSelector(selectUser);

  return (
    <div className="container-custom py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Profile</h1>
      <Card>
        {/* Avatar e informazioni utente */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 rounded-full bg-primary-600 dark:bg-primary-500 flex items-center justify-center text-white text-3xl font-bold">
            {user?.username?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">{user?.username}</h2>
            <p className="text-gray-600 dark:text-gray-400">{user?.email}</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ProfilePage;
