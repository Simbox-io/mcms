// components/Checkbox.tsx

import React from 'react';

interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const Checkbox: React.FC<CheckboxProps> = ({ label, checked, onChange }) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.checked);
  };

  return (
    <div className="flex items-center">
      <input
        type="checkbox"
        id={`checkbox-${label}`}
        className="form-checkbox h-5 w-5 text-blue-600 dark:text-blue-500 focus:ring-blue-500 dark:focus:ring-blue-600 border-gray-300 dark:border-gray-700 rounded"
        checked={checked}
        onChange={handleChange}
      />
      <label
        htmlFor={`checkbox-${label}`}
        className="ml-2 block text-sm text-gray-900 dark:text-gray-200"
      >
        {label}
      </label>
    </div>
  );
};

export default Checkbox;