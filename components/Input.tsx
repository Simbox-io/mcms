// components/Input.tsx
import React from 'react';

interface InputProps {
  label?: string;
  type?: string;
  name: string;
  value: string | string[];
  id: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  className?: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  autoComplete?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  type = 'text',
  name,
  value,
  id,
  onChange,
  className = '',
  required = false,
  placeholder = '',
  error = '',
  disabled = false,
  autoComplete = 'off',
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    if (Array.isArray(value)) {
      const newArray = newValue.split(',');
      onChange({ ...event, target: { ...event.target, value: newArray.join(',') } });
    } else {
      onChange(event);
    }
  };

  return (
    <div className="mb-4">
      <label
        htmlFor={name}
        className={`block text-sm font-medium mb-1 ${
          error ? 'text-red-500 dark:text-red-400' : 'text-gray-700 dark:text-gray-300'
        }`}
      >
        {label}
      </label>
      <input
        type={type}
        id={id}
        name={name}
        value={Array.isArray(value) ? value.join(',') : value}
        onChange={handleChange}
        required={required}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete={autoComplete}
        className={`w-full px-3 py-2 border rounded-md shadow-sm bg-gray-200 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-gray-100 dark:focus:ring-blue-600 dark:focus:border-blue-600 ${
          error
            ? 'border-red-500 dark:border-red-400'
            : 'border-gray-300 dark:border-gray-700'
        } ${className}`}
      />
      {error && <p className="mt-1 text-sm text-red-500 dark:text-red-400">{error}</p>}
    </div>
  );
};

export default Input;