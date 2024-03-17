// components/FormGroup.tsx
import React from 'react';

interface FormGroupProps {
  label?: string;
  children: React.ReactNode;
  htmlFor?: string;
  className?: string;
  error?: string;
  description?: string;
}

const FormGroup: React.FC<FormGroupProps> = ({
  label,
  children,
  htmlFor,
  className = '',
  error,
  description,
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
      </label>
      {children}
      {description && <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{description}</p>}
      {error && <p className="mt-1 text-sm text-red-600 dark:text-red-500">{error}</p>}
    </div>
  );
};

export default FormGroup;