'use client'
import React from 'react';
import { motion } from 'framer-motion';
import Tooltip from './Tooltip';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'text' | 'link' | 'danger';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  className?: string;
  icon?: React.ReactNode;
  tooltipContent?: string;
  tooltipPlacement?: 'top' | 'right' | 'bottom' | 'left';
  href?: string;
  target?: '_blank' | '_self' | '_parent' | '_top';
  type?: 'button' | 'submit' | 'reset';
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
  className = '',
  icon,
  tooltipContent,
  tooltipPlacement = 'top',
  href,
  target = '_self',
  type = 'button',
}) => {
  const baseClasses =
    'rounded-md font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  const variantClasses = {
    primary:
      'bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800',
    secondary:
      'bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 dark:focus:ring-gray-500',
    outline:
      'border border-gray-300 text-gray-700 hover:bg-gray-100 focus:ring-blue-500 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800 dark:focus:ring-blue-500',
    text: 'text-blue-500 hover:bg-blue-100 focus:ring-blue-500 dark:text-blue-400 dark:hover:bg-gray-800',
    danger:
      'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800',
    link: 'text-blue-500 hover:underline focus:ring-blue-500 dark:text-blue-400',
  };
  const sizeClasses = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2 text-base',
    large: 'px-6 py-3 text-lg',
  };
  const disabledClasses = 'opacity-50 cursor-not-allowed';
  const loadingClasses = 'cursor-wait';
  const fullWidthClasses = 'w-full';

  const finalClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${
    disabled || loading ? disabledClasses : ''
  } ${loading ? loadingClasses : ''} ${fullWidth ? fullWidthClasses : ''} ${className}`;

  if (href && !disabled) {
    return (
      <Tooltip content={tooltipContent} placement={tooltipPlacement} enabled={!!tooltipContent}>
        <a href={href} target={target} className={finalClasses}>
          <div className="flex items-center justify-center">
            {icon && <span className="mr-2">{icon}</span>}
            {children}
          </div>
        </a>
      </Tooltip>
    );
  }

  const buttonElement = (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={finalClasses}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center"
      >
        {loading ? (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
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
        ) : (
          icon && <span className="mr-2">{icon}</span>
        )}
        {children}
      </motion.div>
    </button>
  );

  return (
    <Tooltip content={tooltipContent} placement={tooltipPlacement} enabled={!!tooltipContent}>
      {buttonElement}
    </Tooltip>
  );
};

export default Button;