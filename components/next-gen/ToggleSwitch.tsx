'use client'
import React from 'react';
import { motion } from 'framer-motion';

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
  size?: 'small' | 'medium' | 'large';
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  checked,
  onChange,
  label = '',
  disabled = false,
  className = '',
  size = 'medium',
}) => {
  const sizeClasses = {
    small: 'h-4 w-8',
    medium: 'h-6 w-11',
    large: 'h-8 w-14',
  };

  const knobSizeClasses = {
    small: 'w-3 h-3',
    medium: 'w-4 h-4',
    large: 'w-6 h-6',
  };

  const baseClasses = `relative inline-flex items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${sizeClasses[size]}`;
  const checkedClasses = 'bg-blue-500 dark:bg-blue-600';
  const uncheckedClasses = 'bg-gray-200 dark:bg-gray-600';
  const disabledClasses = 'opacity-50 cursor-not-allowed';

  return (
    <label className={`inline-flex items-center ${className}`}>
      {label && <span className="mr-3 text-gray-700 dark:text-gray-300">{label}</span>}
      <span
        className={`${baseClasses} ${checked ? checkedClasses : uncheckedClasses} ${
          disabled ? disabledClasses : ''
        }`}
      >
        <motion.span
          className={`inline-block bg-white rounded-full shadow transform ${knobSizeClasses[size]}`}
          animate={{ x: checked ? `calc(100% - ${knobSizeClasses[size].split(' ')[0]})` : 0 }}
          transition={{ type: 'spring', stiffness: 700, damping: 30 }}
        />
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className="absolute opacity-0 w-0 h-0"
        />
      </span>
    </label>
  );
};

export default ToggleSwitch;