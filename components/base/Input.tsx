import React from 'react';

interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'color';
  name: string;
  id: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  error?: string;
  hint?: string;
  className?: string;
  labelClassName?: string;
  inputClassName?: string;
  errorClassName?: string;
  hintClassName?: string;
  fullWidth?: boolean;
  required?: boolean;
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
  min?: number;
  max?: number;
  step?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
}

const Input: React.FC<InputProps> = ({
  type = 'text',
  name,
  id,
  value,
  onChange,
  label,
  placeholder,
  disabled = false,
  readOnly = false,
  error,
  hint,
  className = '',
  labelClassName = '',
  inputClassName = '',
  errorClassName = '',
  hintClassName = '',
  fullWidth = false,
  required = false,
  startAdornment,
  endAdornment,
  min,
  max,
  step,
  minLength,
  maxLength,
  pattern,
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event);
  };

  return (
    <div className={`mb-4 ${fullWidth ? 'w-full' : ''} ${className}`}>
      {label && (
        <label
          htmlFor={name}
          className={`block mb-1 font-medium ${
            error ? 'text-red-500' : 'text-gray-700'
          } ${labelClassName}`}
        >
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        {startAdornment && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {startAdornment}
          </div>
        )}
        <input
          type={type}
          id={id}
          name={name}
          value={value}
          onChange={handleChange}
          className={`block w-full px-3 py-2 border ${
            error ? 'border-red-500' : 'border-gray-300'
          } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
            disabled ? 'bg-gray-100 cursor-not-allowed' : ''
          } ${readOnly ? 'bg-gray-100' : ''} ${
            startAdornment ? 'pl-10' : ''
          } ${endAdornment ? 'pr-10' : ''} ${inputClassName}`}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          min={min}
          max={max}
          step={step}
          minLength={minLength}
          maxLength={maxLength}
          pattern={pattern}
        />
        {endAdornment && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            {endAdornment}
          </div>
        )}
      </div>
      {error && <p className={`mt-1 text-sm text-red-500 ${errorClassName}`}>{error}</p>}
      {hint && <p className={`mt-1 text-sm text-gray-500 ${hintClassName}`}>{hint}</p>}
    </div>
  );
};

export default Input;