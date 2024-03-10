// components/FormGroup.tsx

import React from 'react';

interface FormGroupProps {
  label: string;
  children: React.ReactNode;
  helperText?: string;
}

const FormGroup: React.FC<FormGroupProps> = ({ label, children, helperText }) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
      </label>
      {children}
      {helperText && (
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{helperText}</p>
      )}
    </div>
  );
};

export default FormGroup;