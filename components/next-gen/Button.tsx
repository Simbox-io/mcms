'use client';

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
}) => {
  const baseClasses =
    'rounded-md font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';

  const variantClasses = {
    primary:
      'bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800',
    secondary:
      'bg-gray-100 text-gray-800 hover:bg-gray-200 focus:ring-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 dark:focus:ring-gray-500',
    outline:
      'border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-blue-500 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800 dark:focus:ring-blue-500',
    text: 'text-blue-500 hover:bg-blue-50 focus:ring-blue-500 dark:text-blue-400 dark:hover:bg-gray-800',
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

  const buttonContent = (
    <>
      {loading && (
        <motion.span
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="mr-2 inline-block"
        >
          ⌛
        </motion.span>
      )}
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </>
  );

  const buttonElement = (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${
        disabled ? disabledClasses : ''
      } ${loading ? loadingClasses : ''} ${fullWidth ? fullWidthClasses : ''} ${className}`}
    >
      {buttonContent}
    </button>
  );

  const linkElement = (
    <a
      href={href}
      target={target}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${
        disabled ? disabledClasses : ''
      } ${fullWidth ? fullWidthClasses : ''} ${className}`}
    >
      {buttonContent}
    </a>
  );

  const buttonOrLink = href ? linkElement : buttonElement;

  if (tooltipContent) {
    return (
      <Tooltip content={tooltipContent} position={tooltipPlacement}>
        {buttonOrLink}
      </Tooltip>
    );
  }

  return buttonOrLink;
};

export default Button;
