'use client'
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface AlertProps {
  message: string;
  title?: string;
  variant?: 'success' | 'info' | 'warning' | 'error';
  onClose?: () => void;
  className?: string;
  icon?: React.ReactNode;
  autoDismiss?: boolean;
  autoDismissTimeout?: number;
  toast?: boolean;
}

const Alert: React.FC<AlertProps> = ({
  message,
  title,
  variant = 'info',
  onClose,
  className = '',
  icon,
  autoDismiss = false,
  autoDismissTimeout = 5000,
  toast = false,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (autoDismiss) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, autoDismissTimeout);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [autoDismiss, autoDismissTimeout, onClose]);

  const variantClasses = {
    success: 'bg-green-100 text-green-800 dark:bg-green-200 dark:text-green-900',
    info: 'bg-blue-100 text-blue-800 dark:bg-blue-200 dark:text-blue-900',
    warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-200 dark:text-yellow-900',
    error: 'bg-red-100 text-red-800 dark:bg-red-200 dark:text-red-900',
  };

  const iconClasses = {
    success: 'text-green-400',
    info: 'text-blue-400',
    warning: 'text-yellow-400',
    error: 'text-red-400',
  };

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`${
        toast ? 'fixed top-4 right-4 z-50 shadow-lg' : ''
      } p-4 rounded-md ${variantClasses[variant]} ${className}`}
      role="alert"
    >
      <div className="flex items-center">
        {icon && <div className={`mr-4 ${iconClasses[variant]}`}>{icon}</div>}
        <div>
          {title && <h3 className="text-lg font-semibold mb-1">{title}</h3>}
          <span>{message}</span>
        </div>
        {onClose && (
          <button
            type="button"
            className="ml-auto -mx-1.5 -my-1.5 bg-transparent text-current hover:text-current rounded-lg focus:ring-2 focus:ring-current p-1.5 inline-flex h-8 w-8"
            onClick={onClose}
            aria-label="Close"
          >
            <span className="sr-only">Close</span>
            <svg
              aria-hidden="true"
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default Alert;