// components/EmptyState.tsx
import React from 'react';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  action,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center pt-12 pb-4 ${className}`}>
      {icon && <div className="text-4xl mb-4">{icon}</div>}
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-2">{title}</h2>
      <p className="text-gray-600 dark:text-gray-400 text-center mb-6">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
};

export default EmptyState;