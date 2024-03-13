// components/ProgressBar.tsx
import React from 'react';

interface ProgressBarProps {
  progress: number;
  className?: string;
  labelClassName?: string;
  barClassName?: string;
  label?: string;
  showPercentage?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  className = '',
  labelClassName = '',
  barClassName = '',
  label = '',
  showPercentage = false,
}) => {
  const getProgressWidth = () => {
    return `${progress}%`;
  };

  return (
    <div className={`flex items-center ${className}`}>
      {label && <span className={`mr-4 ${labelClassName}`}>{label}</span>}
      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
        <div
          className={`bg-blue-600 h-2.5 rounded-full dark:bg-blue-500 ${barClassName}`}
          style={{ width: getProgressWidth() }}
        ></div>
      </div>
      {showPercentage && (
        <span className={`ml-4 ${labelClassName}`}>{`${progress}%`}</span>
      )}
    </div>
  );
};

export default ProgressBar;