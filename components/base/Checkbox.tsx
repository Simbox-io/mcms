import React from 'react';

interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
  disabled?: boolean;
}

const Checkbox: React.FC<CheckboxProps> = ({
  label,
  checked,
  onChange,
  className = '',
  disabled = false,
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.checked);
  };

  return (
    <label className={`inline-flex items-center ${className}`}>
      <input
        type="checkbox"
        className={`form-checkbox h-5 w-5 text-blue-600 transition duration-150 ease-in-out ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
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

export default Checkbox;