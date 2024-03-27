import React from 'react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  titleClassName?: string;
  descriptionClassName?: string;
  iconClassName?: string;
  actionClassName?: string;
  footerClassName?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  action,
  footer,
  className = '',
  style,
  titleClassName = '',
  descriptionClassName = '',
  iconClassName = '',
  actionClassName = '',
  footerClassName = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center py-12 px-4 ${className}`}
      style={style}
    >
      {icon && <div className={`mb-6 ${iconClassName}`}>{icon}</div>}
      {title && (
        <h2
          className={`text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-2 ${titleClassName}`}
        >
          {title}
        </h2>
      )}
      {description && (
        <p
          className={`text-base text-gray-600 dark:text-gray-400 text-center mb-8 ${descriptionClassName}`}
        >
          {description}
        </p>
      )}
      {action && <div className={`mb-8 ${actionClassName}`}>{action}</div>}
      {footer && <div className={`text-sm text-gray-500 ${footerClassName}`}>{footer}</div>}
    </div>
  );
};

export default EmptyState;