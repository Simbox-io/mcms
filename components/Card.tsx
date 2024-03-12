// components/Card.tsx
import React from 'react';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  headerClassName?: string;
  bodyClassName?: string;
  footerClassName?: string;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
  title,
  children,
  className = '',
  headerClassName = '',
  bodyClassName = '',
  footerClassName = '',
  onClick,
}) => {
  return (
    <div
      className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {title && (
        <div className={`px-6 py-4 border-b border-gray-200 dark:border-gray-700 ${headerClassName}`}>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{title}</h3>
        </div>
      )}
      <div className={`px-6 py-4 ${bodyClassName}`}>{children}</div>
      {footerClassName && <div className={`px-6 py-4 border-t border-gray-200 dark:border-gray-700 ${footerClassName}`}></div>}
    </div>
  );
};

export default Card;