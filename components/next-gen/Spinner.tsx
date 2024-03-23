'use client'
import React from 'react';
import { motion } from 'framer-motion';

interface SpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning';
  className?: string;
  label?: string;
  duration?: number;
}

const Spinner: React.FC<SpinnerProps> = ({
  size = 'medium',
  color = 'primary',
  className = '',
  label = 'Loading...',
  duration = 1.5,
}) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
  };

  const colorClasses = {
    primary: 'border-blue-500 dark:border-blue-400',
    secondary: 'border-gray-500 dark:border-gray-400',
    success: 'border-green-500 dark:border-green-400',
    danger: 'border-red-500 dark:border-red-400',
    warning: 'border-yellow-500 dark:border-yellow-400',
  };

  return (
    <div className={`inline-flex flex-col items-center space-y-2 ${className}`}>
      <motion.div
        className={`inline-block rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] ${sizeClasses[size]} ${colorClasses[color]}`}
        animate={{ rotate: 360 }}
        transition={{ duration, repeat: Infinity, ease: 'linear' }}
        role="status"
      >
        <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
          {label}
        </span>
      </motion.div>
      {label && <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</span>}
    </div>
  );
};

export default Spinner;