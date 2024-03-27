import React from 'react';

interface TextareaProps {
  id?: string;
  name: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  rows?: number;
  className?: string;
  style?: React.CSSProperties;
  error?: string;
  disabled?: boolean;
}

const Textarea: React.FC<TextareaProps> = ({
  id,
  name,
  value,
  onChange,
  placeholder = '',
  rows = 3,
  className = '',
  style,
  error = '',
  disabled = false,
}) => {
  return (
    <textarea
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      disabled={disabled}
      className={`w-full px-3 py-2 placeholder-gray-400 border ${
        error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
      } rounded-md focus:outline-none focus:ring-2 ${
        disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
      } dark:bg-gray-800 dark:border-gray-600 dark:focus:ring-blue-500 dark:focus:border-blue-500 ${className}`}
      style={style}
    ></textarea>
  );
};

export default Textarea;