// components/Textarea.tsx
import React from 'react';

interface TextareaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  className?: string;
  labelClassName?: string;
  label?: string;
  error?: string;
  required?: boolean;
  id?: string;
}

const Textarea: React.FC<TextareaProps> = ({
  value,
  onChange,
  placeholder = '',
  rows = 3,
  className = '',
  labelClassName = '',
  label = '',
  error = '',
  required = false,
  id,
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(event.target.value);
  };

  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label className={`block text-sm font-medium mb-1 ${labelClassName}`}>
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <textarea
        id={id}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        rows={rows}
        className={`w-full px-3 py-2 text-gray-700 dark:text-gray-100 dark:bg-gray-800 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
        required={required}
      ></textarea>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default Textarea;