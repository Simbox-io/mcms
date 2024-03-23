'use client'
import React from 'react';
import { motion } from 'framer-motion';

interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  indeterminate?: boolean;
}

const Checkbox: React.FC<CheckboxProps> = ({
  label,
  checked,
  onChange,
  disabled = false,
  className = '',
  indeterminate = false,
}) => {
  const baseClasses =
    'form-checkbox h-5 w-5 rounded border-gray-300 text-blue-500 transition duration-150 ease-in-out focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:focus:ring-offset-gray-800';
  const disabledClasses = 'opacity-50 cursor-not-allowed';
  const indeterminateClasses =
    'form-checkbox h-5 w-5 rounded border-gray-300 text-blue-500 transition duration-150 ease-in-out focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 indeterminate dark:border-gray-600 dark:bg-gray-700 dark:focus:ring-offset-gray-800';

  return (
    <label className={`inline-flex items-center ${className}`}>
      <motion.input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        className={`${baseClasses} ${disabled ? disabledClasses : ''} ${
          indeterminate ? indeterminateClasses : ''
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      />
      <motion.span
        className={`ml-2 text-gray-700 dark:text-gray-400 ${
          disabled ? disabledClasses : ''
        }`}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2 }}
      >
        {label}
      </motion.span>
    </label>
  );
};

export default Checkbox;