import React from 'react';

interface FormControlProps {
  label?: string;
  htmlFor?: string;
  error?: string;
  description?: string;
  className?: string;
  children: React.ReactNode;
}

const FormControl: React.FC<FormControlProps> = ({
  label,
  htmlFor,
  error,
  description,
  className = '',
  children,
}) => {
  return (
    <div className={`form-control ${className}`}>
      {label && (
        <label htmlFor={htmlFor} className="block font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      {children}
      {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default FormControl;