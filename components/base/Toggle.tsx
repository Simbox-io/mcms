import React from 'react';

interface ToggleProps {
  label: string;
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
  className?: string;
}

const Toggle: React.FC<ToggleProps> = ({
  label,
  checked,
  onChange,
  disabled = false,
  className = '',
}) => {
  return (
    <div className={`flex items-center ${className}`}>
      <label className="flex items-center cursor-pointer">
        <div className="relative">
          <input
            type="checkbox"
            className="hidden"
            checked={checked}
            onChange={onChange}
            disabled={disabled}
          />
          <div
            className={`toggle-bg w-10 h-6 bg-gray-200 rounded-full shadow-inner transition-colors duration-300 ease-in-out ${
              checked ? 'bg-blue-500' : ''
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          ></div>
          <div
            className={`toggle-dot absolute w-4 h-4 bg-white rounded-full shadow inset-y-0 left-0 transition-transform duration-300 ease-in-out transform ${
              checked ? 'translate-x-full' : ''
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          ></div>
        </div>
        <div className="ml-3 text-gray-700 dark:text-gray-300 font-medium">{label}</div>
      </label>
    </div>
  );
};

export default Toggle;