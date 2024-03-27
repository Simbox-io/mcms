import React from 'react';

interface RadioProps {
  label: string;
  value: string;
  checked: boolean;
  onChange: (value: string) => void;
  className?: string;
  disabled?: boolean;
  id?: string;
  name?: string;
  required?: boolean;
}

const Radio: React.FC<RadioProps> = ({
  label,
  value,
  checked,
  onChange,
  className = '',
  disabled = false,
  id,
  name,
  required,
}) => {
  const handleChange = () => {
    onChange(value);
  };

  return (
    <label className={`inline-flex items-center ${className}`}>
      <input
        type="radio"
        id={id}
        name={name}
        value={value}
        checked={checked}
        onChange={handleChange}
        className={`form-radio h-4 w-4 text-blue-600 transition duration-150 ease-in-out ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        disabled={disabled}
        required={required}
      />
      <span
        className={`ml-2 text-sm font-medium ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {label}
      </span>
    </label>
  );
};

export default Radio;