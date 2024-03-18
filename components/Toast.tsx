// components/Toast.tsx
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ToastProps {
  message: string;
  duration?: number;
  onClose: () => void;
  variant?: 'success' | 'error' | 'warning' | 'info';
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
  className?: string;
  icon?: React.ReactNode;
  closeButton?: boolean;
}

const Toast: React.FC<ToastProps> = ({
  message,
  duration = 3000,
  onClose,
  variant = 'info',
  position = 'bottom-right',
  className = '',
  icon,
  closeButton = true,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, duration);

    return () => {
      clearTimeout(timer);
    };
  }, [duration, onClose]);

  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return 'bg-green-500 text-white';
      case 'error':
        return 'bg-red-500 text-white';
      case 'warning':
        return 'bg-yellow-500 text-black';
      case 'info':
      default:
        return 'bg-blue-500 text-white';
    }
  };

  const getPositionStyles = () => {
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
      default:
        return 'bottom-4 right-4';
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.3 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
          className={`fixed z-50 rounded-md shadow-lg ${getVariantStyles()} ${getPositionStyles()} ${className}`}
        >
          <div className="flex items-center px-4 py-3">
            {icon && <div className="mr-3">{icon}</div>}
            <div className="text-sm font-medium">{message}</div>
            {closeButton && (
              <button
                onClick={() => setIsVisible(false)}
                className="ml-auto text-white hover:text-gray-100 focus:outline-none"
              >
                <XIcon />
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const XIcon: React.FC = () => (
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

export default Toast;