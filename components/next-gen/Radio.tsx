'use client'
import React from 'react';
import { motion } from 'framer-motion';

interface RadioProps {
  label: string;
  value: string;
  checked: boolean;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
  description?: string;
}

const Radio: React.FC<RadioProps> = ({
  label,
  value,
  checked,
  onChange,
  disabled = false,
  className = '',
  description = '',
}) => {
  const baseClasses =
    'form-radio h-5 w-5 text-blue-500 transition duration-150 ease-in-out focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:text-blue-400 dark:focus:ring-blue-400 dark:focus:ring-offset-gray-800';
  const disabledClasses = 'opacity-50 cursor-not-allowed';

  return (
    <label className={`inline-flex items-center ${className}`}>
      <input
        type="radio"
        value={value}
        checked={checked}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`${baseClasses} ${disabled ? disabledClasses : ''}`}
      />
      <div className="ml-2">
        <motion.span
          className="text-gray-700 dark:text-gray-200"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {label}
        </motion.span>
        {description && (
          <motion.p
            className="mt-1 text-sm text-gray-500 dark:text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.2 }}
          >
            {description}
          </motion.p>
        )}
      </div>
    </label>
  );
};

export default Radio;