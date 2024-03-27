import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';
  size?: 'sm' | 'md' | 'lg';
  pill?: boolean;
  icon?: React.ReactNode;
  color?: string;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  pill = false,
  icon,
  color,
  className = '',
}) => {
  const variantClasses = {
    primary: 'bg-blue-500 dark:bg-blue-600 text-white',
    secondary: 'bg-gray-500 dark:bg-gray-600 text-white',
    success: 'bg-green-500 dark:bg-green-600 text-white',
    danger: 'bg-red-500 dark:bg-red-600 text-white',
    warning: 'bg-yellow-500 dark:bg-yellow-600 text-black dark:text-white',
    info: 'bg-blue-400 dark:bg-blue-500 text-white',
  };

  const sizeClasses = {
    sm: 'px-1.5 py-0.5 text-xs',
    md: 'px-2 py-0.5 text-sm',
    lg: 'px-2.5 py-1 text-base',
  };

  const pillClass = pill ? 'rounded-full' : 'rounded';

  return (
    <span
      className={`inline-flex items-center ${sizeClasses[size]} ${pillClass} font-medium ${
        color ? `bg-${color}-500 dark:bg-${color}-600 text-white` : variantClasses[variant]
      } ${className}`}
    >
      {icon && <span className="mr-1">{icon}</span>}
      {children}
    </span>
  );
};

export default Badge;