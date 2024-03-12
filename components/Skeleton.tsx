// components/Skeleton.tsx
import React from 'react';

interface SkeletonProps {
  variant?: 'text' | 'rectangular' | 'circular';
  width?: string;
  height?: string;
  className?: string;
  style?: React.CSSProperties;
  animation?: 'pulse' | 'wave';
}

const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'text',
  width = '100%',
  height = '1rem',
  className = '',
  style,
  animation = 'pulse',
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'text':
        return 'skeleton-text';
      case 'rectangular':
        return 'skeleton-rectangular';
      case 'circular':
        return 'skeleton-circular';
      default:
        return 'skeleton-text';
    }
  };

  const getAnimationClasses = () => {
    switch (animation) {
      case 'pulse':
        return 'skeleton-pulse';
      case 'wave':
        return 'skeleton-wave';
      default:
        return 'skeleton-pulse';
    }
  };

  return (
    <div
      className={`skeleton ${getVariantClasses()} ${getAnimationClasses()} ${className}`}
      style={{ width, height, ...style }}
    ></div>
  );
};

export default Skeleton;