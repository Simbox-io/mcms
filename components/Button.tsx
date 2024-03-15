  // components/Button.tsx
import React from 'react';
import Spinner from './Spinner';

interface ButtonProps {
  children?: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'danger' | 'dropdown' | 'outline-primary' | 'outline-secondary' | 'outline-danger';
  size?: 'small' | 'medium' | 'large' | 'dropdown';
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  isLoading?: boolean;
  loadingText?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  type = 'button',
  variant = 'primary',
  size = 'medium',
  onClick,
  disabled = false,
  className = '',
  isLoading = false,
  loadingText = 'Loading...',
}) => {
  const getVariantClasses = () => {
    let defaultClasses = '';
    let customClasses = '';
    switch (variant) {
      case 'primary':
        defaultClasses = 'bg-blue-500 dark:bg-blue-600 text-white hover:bg-blue-700 dark:hover:bg-blue-600 focus:ring-blue-500 dark:focus:ring-blue-600';
        customClasses = className.split(' ').reduce((acc, cls) => {
          const type = cls.split('-')[0];
          if (defaultClasses.includes(type)) {
            return acc.replace(new RegExp(`${type}-\\w+`), cls);
          }
          return acc + ' ' + cls;
        }, defaultClasses);
        return customClasses;
      case 'secondary':
        defaultClasses =  'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500 focus:ring-gray-400 dark:focus:ring-gray-500';
        customClasses = className.split(' ').reduce((acc, cls) => {
          const type = cls.split('-')[0];
          if (defaultClasses.includes(type)) {
            return acc.replace(new RegExp(`${type}-\\w+`), cls);
          }
          return acc + ' ' + cls;
        }, defaultClasses);
        return customClasses;
      case 'danger':
        defaultClasses =  'bg-red-600 dark:bg-red-500 text-white hover:bg-red-700 dark:hover:bg-red-600 focus:ring-red-500 dark:focus:ring-red-600';
        customClasses = className.split(' ').reduce((acc, cls) => {
          const type = cls.split('-')[0];
          if (defaultClasses.includes(type)) {
            return acc.replace(new RegExp(`${type}-\\w+`), cls);
          }
          return acc + ' ' + cls;
        }, defaultClasses);
        return customClasses;
      case 'dropdown':
        defaultClasses =  'inline-flex justify-center w-full rounded-md px-4 py-2 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 dark:focus:ring-blue-600';
        customClasses = className.split(' ').reduce((acc, cls) => {
          const type = cls.split('-')[0];
          if (defaultClasses.includes(type)) {
            return acc.replace(new RegExp(`${type}-\\w+`), cls);
          }
          return acc + ' ' + cls;
        }, defaultClasses);
        return customClasses;
      case 'outline-primary':
        defaultClasses = 'bg-transparent border border-blue-600 dark:border-blue-500 text-blue-600 dark:text-blue-500 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-500 dark:hover:text-white focus:ring-blue-500 dark:focus:ring-blue-600';
        customClasses = className.split(' ').reduce((acc, cls) => {
          const type = cls.split('-')[0];
          if (defaultClasses.includes(type)) {
            return acc.replace(new RegExp(`${type}-\\w+`), cls);
          }
          return acc + ' ' + cls;
        }, defaultClasses);
        return customClasses;
      case 'outline-secondary':
        defaultClasses = 'bg-transparent border border-gray-500 dark:border-gray-400 text-gray-500 dark:text-gray-400 hover:bg-gray-500 hover:text-white dark:hover:bg-gray-400 dark:hover:text-white focus:ring-gray-400 dark:focus:ring-gray-500';
        customClasses = className.split(' ').reduce((acc, cls) => {
          const type = cls.split('-')[0];
          if (defaultClasses.includes(type)) {
            return acc.replace(new RegExp(`${type}-\\w+`), cls);
          }
          return acc + ' ' + cls;
        }, defaultClasses);
        return customClasses;
      case 'outline-danger':
        defaultClasses = 'bg-transparent border border-red-600 dark:border-red-500 text-red-600 dark:text-red-500 hover:bg-red-600 hover:text-white dark:hover:bg-red-500 dark:hover:text-white focus:ring-red-500 dark:focus:ring-red-600';
        customClasses = className.split(' ').reduce((acc, cls) => {
          const type = cls.split('-')[0];
          if (defaultClasses.includes(type)) {
            return acc.replace(new RegExp(`${type}-\\w+`), cls);
          }
          return acc + ' ' + cls;
        }, defaultClasses);
        return customClasses;
      default:
        return '';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'px-2 py-1 text-sm';
      case 'medium':
        return 'px-4 py-2 text-base';
      case 'large':
        return 'px-6 py-3 text-lg';
      case 'dropdown':
        return 'py-2 text-base';
      default:
        return '';
    }
  };

  const buttonClasses = `rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${getVariantClasses()} ${getSizeClasses()} ${
    disabled || isLoading ? 'opacity-50 cursor-not-allowed' : ''
  } ${className}`;

  return (
    <button type={type} onClick={onClick} disabled={disabled || isLoading} className={buttonClasses}>
      {isLoading ? (
        <>
          <Spinner size="small" className="mr-2" />
          {loadingText}
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;