// components/Badge.tsx
import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';
  size?: 'small' | 'medium' | 'large';
  shape?: 'rounded' | 'square' | 'circle';
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  shape = 'rounded',
  className = '',
  style,
  onClick,
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-blue-500 text-white';
      case 'secondary':
        return 'bg-gray-500 text-white';
      case 'success':
        return 'bg-green-500 text-white';
      case 'danger':
        return 'bg-red-500 text-white';
      case 'warning':
        return 'bg-yellow-500 text-black';
      case 'info':
        return 'bg-blue-400 text-white';
      default:
        return 'bg-blue-500 text-white';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'px-2 py-0.5 text-xs';
      case 'medium':
        return 'px-3 py-1 text-sm';
      case 'large':
        return 'px-4 py-2 text-base';
      default:
        return 'px-3 py-1 text-sm';
    }
  };

  const getShapeClasses = () => {
    switch (shape) {
      case 'rounded':
        return 'rounded-md';
      case 'square':
        return '';
      case 'circle':
        return 'rounded-full';
      default:
        return 'rounded-md';
    }
  };

  return (
    <span
      className={`inline-flex items-center font-semibold ${getVariantClasses()} ${getSizeClasses()} ${getShapeClasses()} ${className}`}
      style={style}
      onClick={onClick}
    >
      {children}
    </span>
  );
};

export default Badge;