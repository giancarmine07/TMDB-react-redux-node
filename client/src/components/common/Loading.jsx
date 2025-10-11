/**
 * Componente Loading riutilizzabile
 *
 * @param {Object} props - Proprietà del componente
 * @param {string} props.size - Dimensione dello spinner (sm, md, lg, xl)
 * @param {string} props.text - Testo da visualizzare sotto lo spinner
 * @param {boolean} props.fullScreen - Se mostrare il loading a schermo intero
 */
const Loading = ({ size = 'md', text = 'Loading...', fullScreen = false }) => {
  // Stili per diverse dimensioni dello spinner
  const sizeStyles = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  };

  // Componente spinner con animazione
  const LoadingSpinner = () => (
    <div className="flex flex-col items-center justify-center gap-3">
      <div
        className={`${sizeStyles[size]} border-4 border-gray-200 dark:border-dark-700 border-t-primary-600 dark:border-t-primary-500 rounded-full animate-spin`}
      ></div>
      {text && (
        <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
          {text}
        </p>
      )}
    </div>
  );

  // Modalità schermo intero con sfondo sfocato
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 dark:bg-dark-950/80 backdrop-blur-sm flex items-center justify-center z-50">
        <LoadingSpinner />
      </div>
    );
  }

  // Modalità normale
  return (
    <div className="flex items-center justify-center p-8">
      <LoadingSpinner />
    </div>
  );
};

export default Loading;
