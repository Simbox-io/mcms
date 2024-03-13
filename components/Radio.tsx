// components/Radio.tsx
import React from 'react';

interface RadioProps {
  label: string;
  value: string;
  checked: boolean;
  onChange: (value: string) => void;
  className?: string;
  disabled?: boolean;
}

const Radio: React.FC<RadioProps> = ({
  label,
  value,
  checked,
  onChange,
  className = '',
  disabled = false,
}) => {
  const handleChange = () => {
    onChange(value);
  };

  return (
    <label className={`inline-flex items-center ${className}`}>
      <input
        type="radio"
        className={`form-radio h-5 w-5 text-blue-600 transition duration-150 ease-in-out ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        value={value}
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
      />
      <span className={`ml-2 text-gray-700 dark:text-gray-300 ${disabled ? 'opacity-50' : ''}`}>
        {label}
      </span>
    </label>
  );
};

export default Radio;