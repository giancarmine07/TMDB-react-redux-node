import clsx from 'clsx';

/**
 * Componente Card riutilizzabile
 *
 * @param {Object} props - Proprietà del componente
 * @param {React.ReactNode} props.children - Contenuto della card
 * @param {string} props.className - Classi CSS aggiuntive
 * @param {string} props.padding - Dimensione del padding (none, sm, md, lg, xl)
 * @param {boolean} props.hover - Se abilitare l'effetto hover
 * @param {Function} props.onClick - Funzione chiamata al click
 */
const Card = ({
  children,
  className = '',
  padding = 'md',
  hover = false,
  onClick,
  ...props
}) => {
  // Stili di padding per diverse dimensioni
  const paddingStyles = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
    xl: 'p-8',
  };

  return (
    <div
      className={clsx(
        'bg-white dark:bg-dark-800 rounded-xl shadow-card transition-all duration-200',
        hover && 'hover:shadow-card-hover cursor-pointer',
        paddingStyles[padding],
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
