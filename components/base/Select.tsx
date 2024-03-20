'use client'
import React, { useState, useRef, useEffect } from 'react';

interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  className?: string;
  id?: string;
  name?: string;
  required?: boolean;
  variant?: 'default' | 'outlined' | 'filled';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  searchable?: boolean;
  clearable?: boolean;
  onCreate?: (value: string) => void;
}

const Select: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  label,
  placeholder = 'Select an option',
  disabled = false,
  error = '',
  className = '',
  id,
  name,
  required,
  variant = 'default',
  size = 'medium',
  fullWidth = false,
  searchable = false,
  clearable = false,
  onCreate,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const selectRef = useRef<HTMLDivElement>(null);

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (selectedValue: string) => {
    onChange(selectedValue);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleClear = () => {
    onChange('');
    setSearchTerm('');
  };

  const handleCreate = () => {
    if (onCreate) {
      onCreate(searchTerm);
      setIsOpen(false);
      setSearchTerm('');
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const selectedOption = options.find((option) => option.value === value);

  const renderOptions = () => {
    if (filteredOptions.length === 0) {
      return (
        <li className="px-4 py-2 text-gray-500 dark:text-gray-400">
          {onCreate ? (
            <button
              className="text-blue-500 dark:text-blue-400 hover:underline"
              onClick={handleCreate}
            >
              Create &quot;{searchTerm}&quot;
            </button>
          ) : (
            'No options found'
          )}
        </li>
      );
    }

    return filteredOptions.map((option) => (
      <li
        key={option.value}
        className={`px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer ${
          option.value === value ? 'bg-blue-500 text-white dark:bg-blue-600' : 'text-gray-800 dark:text-gray-300'
        }`}
        onClick={() => handleSelect(option.value)}
      >
        {option.label}
      </li>
    ));
  };

  const sizeClasses = {
    small: 'py-1 px-2 text-sm',
    medium: 'py-2 px-4',
    large: 'py-3 px-6 text-lg',
  };

  const variantClasses = {
    default: 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600',
    outlined: 'bg-transparent border border-gray-300 dark:border-gray-600',
    filled: 'bg-gray-100 dark:bg-gray-700 border-none',
  };

  return (
    <div className={`relative ${fullWidth ? 'w-full' : 'w-64'} ${className}`}>
      {label && (
        <label htmlFor={id} className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div
        ref={selectRef}
        className={`flex items-center justify-between rounded-md shadow-sm cursor-pointer ${sizeClasses[size]} ${variantClasses[variant]} ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-blue-500 dark:hover:border-blue-400'
        } ${error ? 'border-red-500 dark:border-red-500' : ''}`}
        onClick={handleToggle}
      >
        <div className="flex-1 truncate">
          {selectedOption ? (
            <span className="text-gray-800 dark:text-gray-300">{selectedOption.label}</span>
          ) : (
            <span className="text-gray-500">{placeholder}</span>
          )}
        </div>
        {clearable && value && (
          <button
            className="mr-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none"
            onClick={handleClear}
          >
            <XIcon className="w-4 h-4" />
          </button>
        )}
        <ChevronDownIcon
          className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
            isOpen ? 'transform rotate-180' : ''
          }`}
        />
      </div>
      {isOpen && (
        <ul
          className={`absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 rounded-md shadow-lg max-h-60 overflow-auto focus:outline-none ${
            fullWidth ? 'w-full' : 'w-64'
          }`}
        >
          {searchable && (
            <li className="px-4 py-2">
              <input
                type="text"
                className="w-full px-2 py-1 text-sm text-gray-800 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </li>
          )}
          {renderOptions()}
        </ul>
      )}
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

const ChevronDownIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path
      fillRule="evenodd"
      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
      clipRule="evenodd"
    />
  </svg>
);

const XIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path
      fillRule="evenodd"
      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
      clipRule="evenodd"
    />
  </svg>
);

export default Select;
