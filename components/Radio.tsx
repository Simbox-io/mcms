// components/Radio.tsx

import React from 'react';

interface RadioProps {
  label: string;
  value: string;
  checked: boolean;
  onChange: (value: string) => void;
}

const Radio: React.FC<RadioProps> = ({ label, value, checked, onChange }) => {
  const handleChange = () => {
    onChange(value);
  };

  return (
    <label className="inline-flex items-center">
      <input
        type="radio"
        className="form-radio h-5 w-5 text-blue-600 transition duration-150 ease-in-out"
        value={value}
        checked={checked}
        onChange={handleChange}
      />
      <span className="ml-2 text-gray-700 dark:text-gray-300">{label}</span>
    </label>
  );
};

export default Radio;