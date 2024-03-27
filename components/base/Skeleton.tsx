import React from 'react';

interface SkeletonProps {
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  className?: string;
  style?: React.CSSProperties;
  animation?: 'pulse' | 'wave';
  count?: number;
  duration?: number;
  circle?: boolean;
}

const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'text',
  width = '100%',
  height = '1rem',
  className = '',
  style,
  animation = 'pulse',
  count = 1,
  duration = 1.5,
  circle = false,
}) => {
  const renderSkeletons = () => {
    const skeletons = [];
    for (let i = 0; i < count; i++) {
      skeletons.push(
        <div
          key={i}
          className={`skeleton ${variant} ${animation} ${className}`}
          style={{
            width: variant === 'circular' || circle ? height : width,
            height,
            borderRadius: variant === 'circular' || circle ? '50%' : '4px',
            animationDuration: `${duration}s`,
            ...style,
          }}
        ></div>
      );
    }
    return skeletons;
  };

  return <>{renderSkeletons()}</>;
};

export default Skeleton;