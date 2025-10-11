import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { closeModal, selectModal } from '../../store/slices/uiSlice';
import clsx from 'clsx';

/**
 * Componente Modal riutilizzabile
 *
 * @param {Object} props - Proprietà del componente
 * @param {boolean} props.isOpen - Se il modale è aperto (controllo esterno)
 * @param {Function} props.onClose - Funzione chiamata alla chiusura (controllo esterno)
 * @param {string} props.title - Titolo del modale
 * @param {React.ReactNode} props.children - Contenuto del modale
 * @param {string} props.size - Dimensione del modale (sm, md, lg, xl, full)
 * @param {boolean} props.showCloseButton - Se mostrare il pulsante di chiusura
 */
const Modal = ({
  isOpen: controlledIsOpen,
  onClose: controlledOnClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
}) => {
  const dispatch = useDispatch();
  const reduxModal = useSelector(selectModal);

  // Usa lo stato controllato o lo stato Redux
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : reduxModal.isOpen;
  const handleClose = controlledOnClose || (() => dispatch(closeModal()));

  // Chiudi con il tasto Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, handleClose]);

  // Previeni lo scroll del body quando il modale è aperto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Stili per diverse dimensioni
  const sizeStyles = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-7xl',
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Sfondo oscurato */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      ></div>

      {/* Modale */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className={clsx(
            'relative w-full bg-white dark:bg-dark-800 rounded-xl shadow-2xl transform transition-all animate-scale-in',
            sizeStyles[size]
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Intestazione */}
          {(title || showCloseButton) && (
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-dark-700">
              {title && (
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {title}
                </h3>
              )}
              {showCloseButton && (
                <button
                  onClick={handleClose}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
          )}

          {/* Contenuto */}
          <div className="px-6 py-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
