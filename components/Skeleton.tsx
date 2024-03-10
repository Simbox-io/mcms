// components/Skeleton.tsx

import React from 'react';

interface SkeletonProps {
  variant?: 'text' | 'rectangular' | 'circular';
  width?: string;
  height?: string;
  className?: string;
}

const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'text',
  width = '100%',
  height = '1rem',
  className = '',
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'text':
        return 'rounded';
      case 'rectangular':
        return 'rounded';
      case 'circular':
        return 'rounded-full';
      default:
        return 'rounded';
    }
  };

  return (
    <div
      className={`bg-gray-200 dark:bg-gray-700 animate-pulse ${getVariantClasses()} ${className}`}
      style={{ width, height }}
    ></div>
  );
};

export default Skeleton;