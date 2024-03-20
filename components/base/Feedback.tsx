import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Button from './Button';
import { motion, AnimatePresence } from 'framer-motion';

type FeedbackType = 'modal' | 'toast' | 'alert';

interface FeedbackProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message: string;
  type?: FeedbackType;
  variant?: 'info' | 'success' | 'warning' | 'error';
  duration?: number;
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
  showCloseButton?: boolean;
  className?: string;
  overlayClassName?: string;
  contentClassName?: string;
  titleClassName?: string;
  messageClassName?: string;
  closeButtonClassName?: string;
}

const Feedback: React.FC<FeedbackProps> = ({
  isOpen,
  onClose,
  title,
  message,
  type = 'modal',
  variant = 'info',
  duration = 3000,
  position = 'top-right',
  showCloseButton = true,
  className = '',
  overlayClassName = '',
  contentClassName = '',
  titleClassName = '',
  messageClassName = '',
  closeButtonClassName = '',
}) => {
  const feedbackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (type === 'toast' && isOpen) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [type, isOpen, onClose, duration]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'info':
        return 'bg-blue-100 text-blue-800';
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const getPositionClasses = () => {
    switch (position) {
      case 'top-left':
        return 'top-4 left-4';
      case 'top-center':
        return 'top-4 left-1/2 transform -translate-x-1/2';
      case 'top-right':
        return 'top-4 right-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'bottom-center':
        return 'bottom-4 left-1/2 transform -translate-x-1/2';
      case 'bottom-right':
        return 'bottom-4 right-4';
      default:
        return 'top-4 right-4';
    }
  };

  if (!isOpen) {
    return null;
  }

  const renderFeedback = () => {
    switch (type) {
      case 'modal':
        return (
          <div
            className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 ${overlayClassName}`}
            onClick={handleOverlayClick}
          >
            <motion.div
              ref={feedbackRef}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className={`bg-white rounded-lg shadow-lg w-full max-w-md ${contentClassName}`}
            >
              {title && (
                <div className={`px-6 py-4 border-b ${titleClassName}`}>
                  <h2 className="text-xl font-semibold">{title}</h2>
                </div>
              )}
              <div className={`p-6 ${messageClassName}`}>{message}</div>
              {showCloseButton && (
                <div className="px-6 py-4 bg-gray-100 text-right">
                  <Button onClick={onClose} className={closeButtonClassName}>
                    Close
                  </Button>
                </div>
              )}
            </motion.div>
          </div>
        );
      case 'toast':
        return (
          <AnimatePresence>
            {isOpen && (
              <motion.div
                ref={feedbackRef}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
                className={`fixed z-50 rounded-lg shadow-lg ${getVariantClasses()} ${getPositionClasses()} ${className}`}
              >
                <div className="flex items-center p-4">
                  <div className={messageClassName}>{message}</div>
                  {showCloseButton && (
                    <button
                      className={`ml-4 text-${variant}-500 hover:text-${variant}-600 focus:outline-none ${closeButtonClassName}`}
                      onClick={onClose}
                    >
                      <CloseIcon />
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        );
      case 'alert':
        return (
          <div
            ref={feedbackRef}
            className={`p-4 rounded-lg ${getVariantClasses()} ${className}`}
            role="alert"
          >
            <div className="flex items-center">
              <div className={messageClassName}>{message}</div>
              {showCloseButton && (
                <button
                  className={`ml-4 text-${variant}-500 hover:text-${variant}-600 focus:outline-none ${closeButtonClassName}`}
                  onClick={onClose}
                >
                  <CloseIcon />
                </button>
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return createPortal(renderFeedback(), document.body);
};

const CloseIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
      clipRule="evenodd"
    />
  </svg>
);

export default Feedback;