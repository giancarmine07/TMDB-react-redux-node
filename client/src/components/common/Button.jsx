import clsx from 'clsx';

/**
 * Componente Button riutilizzabile
 *
 * @param {Object} props - Proprietà del componente
 * @param {React.ReactNode} props.children - Contenuto del bottone
 * @param {string} props.variant - Variante dello stile (primary, secondary, danger, success, ghost, outline)
 * @param {string} props.size - Dimensione del bottone (xs, sm, md, lg, xl)
 * @param {boolean} props.disabled - Se il bottone è disabilitato
 * @param {boolean} props.loading - Se il bottone è in stato di caricamento
 * @param {boolean} props.fullWidth - Se il bottone deve occupare l'intera larghezza
 * @param {string} props.className - Classi CSS aggiuntive
 * @param {string} props.type - Tipo del bottone (button, submit, reset)
 * @param {Function} props.onClick - Funzione chiamata al click
 */
const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  className = '',
  type = 'button',
  onClick,
  ...props
}) => {
  // Stili base comuni a tutte le varianti
  const baseStyles = 'font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 inline-flex items-center justify-center';

  // Varianti di stile del bottone
  const variants = {
    primary: 'bg-primary-600 hover:bg-primary-700 text-white focus:ring-primary-500 dark:bg-primary-500 dark:hover:bg-primary-600',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900 focus:ring-gray-500 dark:bg-dark-700 dark:hover:bg-dark-600 dark:text-white',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 dark:bg-red-500 dark:hover:bg-red-600',
    success: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500 dark:bg-green-500 dark:hover:bg-green-600',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-700 dark:hover:bg-dark-800 dark:text-gray-300 border border-gray-300 dark:border-dark-600',
    outline: 'bg-transparent border-2 border-primary-600 text-primary-600 hover:bg-primary-50 dark:border-primary-500 dark:text-primary-400 dark:hover:bg-primary-900/20',
  };

  // Dimensioni del bottone
  const sizes = {
    xs: 'px-2 py-1 text-xs',
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
    xl: 'px-8 py-4 text-xl',
  };

  return (
    <button
      type={type}
      className={clsx(
        baseStyles,
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        (disabled || loading) && 'cursor-not-allowed opacity-50',
        className
      )}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {/* Spinner di caricamento */}
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}
      {children}
    </button>
  );
};

export default Button;
