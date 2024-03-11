// components/Select.tsx

import React from 'react';

interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  title: string;
  options: Option[];
  value: string | string[];
  onChange: (value: string | string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  isMulti?: boolean;
}

const Select: React.FC<SelectProps> = ({
  title,
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  disabled = false,
  isMulti = false,
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (isMulti) {
      const selectedOptions = Array.from(
        event.target.selectedOptions,
        (option) => option.value
      );
      onChange(selectedOptions);
    } else {
      onChange(event.target.value);
    }
  };

  return (
    <select
      title={title}
      value={value}
      onChange={handleChange}
      disabled={disabled}
      multiple={isMulti}
      className="block w-full px-4 py-2 pr-8 leading-tight text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:focus:ring-blue-600 dark:focus:border-blue-600"
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options && options.length > 0 && options?.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default Select;