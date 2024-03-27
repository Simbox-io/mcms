'use client'
import React, { useState } from 'react';
import { EyeIcon, EyeOffIcon } from '@heroicons/react/solid';

type InputType = 'text' | 'number' | 'email' | 'password';

interface InputProps {
  type?: InputType;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  label?: string;
  error?: string;
  required?: boolean;
}

const Input: React.FC<InputProps> = ({
  type = 'text',
  value,
  onChange,
  placeholder = '',
  disabled = false,
  className = '',
  label = '',
  error = '',
  required = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const baseClasses =
    'block w-full px-4 py-2 mt-2 text-gray-700 dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-600 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent';
  const disabledClasses = 'opacity-50 cursor-not-allowed';
  const errorClasses = 'border-red-500 dark:border-red-600 focus:ring-red-500 dark:focus:ring-red-600';

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const inputType = type === 'password' && showPassword ? 'text' : type;

  return (
    <div className="relative">
      {label && (
        <label htmlFor={label} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <input
        type={inputType}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={`${baseClasses} ${disabled ? disabledClasses : ''} ${error ? errorClasses : ''} ${className}`}
        id={label}
        required={required}
      />
      {type === 'password' && (
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute mt-7 inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-500 focus:outline-none"
        >
          {showPassword ? (
            <EyeOffIcon className="w-5 h-5" />
          ) : (
            <EyeIcon className="w-5 h-5" />
          )}
        </button>
      )}
      {error && <p className="mt-1 text-sm text-red-500 dark:text-red-400">{error}</p>}
    </div>
  );
};

export default Input;