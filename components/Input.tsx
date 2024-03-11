// components/Input.tsx

import React from 'react';

interface InputProps {
  label: string;
  type?: string;
  name: string;
  value: string;
  id: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  className?: string;
  placeholder?: string;
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
}) => {
  return (
    <div className="mb-4">
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
      >
        {label}
      </label>
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className={"w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-gray-100 dark:focus:ring-blue-600 dark:focus:border-blue-600" + {className}}
      />
    </div>
  );
};

export default Input;