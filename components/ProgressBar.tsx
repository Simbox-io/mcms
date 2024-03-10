// components/ProgressBar.tsx

import React from 'react';

interface ProgressBarProps {
  progress: number;
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress, className = '' }) => {
  const getProgressWidth = () => {
    return `${progress}%`;
  };

  return (
    <div className={`w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 ${className}`}>
      <div
        className="bg-blue-600 h-2.5 rounded-full dark:bg-blue-500"
        style={{ width: getProgressWidth() }}
      ></div>
    </div>
  );
};

export default ProgressBar;