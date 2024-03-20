import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  size?: 'small' | 'medium' | 'large';
  shape?: 'rounded' | 'pill';
  className?: string;
  style?: React.CSSProperties;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  onClick?: () => void;
}

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'medium',
  shape = 'rounded',
  className = '',
  style,
  icon,
  iconPosition = 'left',
  onClick,
}) => {
  const variantClasses = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-blue-100 text-blue-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
  };

  const sizeClasses = {
    small: 'px-2 py-0.5 text-xs',
    medium: 'px-3 py-1 text-sm',
    large: 'px-4 py-2 text-base',
  };

  const shapeClasses = {
    rounded: 'rounded-md',
    pill: 'rounded-full',
  };

  return (
    <span
      className={`inline-flex items-center font-medium ${variantClasses[variant]} ${sizeClasses[size]} ${shapeClasses[shape]} ${className}`}
      style={style}
      onClick={onClick}
    >
      {icon && iconPosition === 'left' && <span className="mr-1">{icon}</span>}
      {children}
      {icon && iconPosition === 'right' && <span className="ml-1">{icon}</span>}
    </span>
  );
};

export default Badge;