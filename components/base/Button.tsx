import React from 'react';
import Spinner from './Spinner';
import DownloadIcon from '../icons/DownloadIcon';
import BellIcon from '../icons/BellIcon';
import BookmarkIcon from '../icons/BookmarkIcon';
import AIIcon from '../icons/AIIcon';
import ShareIcon from '../icons/ShareIcon';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  variant?: 'primary' | 'secondary' | 'tertiary' | 'outline' | 'text' | 'danger';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  loadingText?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  buttonType?: 'download' | 'subscribe' | 'bookmark' | 'ai' | 'share';
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  disabled = false,
  loading = false,
  loadingText = 'Loading...',
  startIcon,
  endIcon,
  className = '',
  type = 'button',
  buttonType,
}) => {
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled && !loading && onClick) {
      onClick(event);
    }
  };

  const getButtonIcon = () => {
    switch (buttonType) {
      case 'download':
        return <DownloadIcon />;
      case 'subscribe':
        return <BellIcon />;
      case 'bookmark':
        return <BookmarkIcon />;
      case 'ai':
        return <AIIcon />;
      case 'share':
        return <ShareIcon />;
      default:
        return null;
    }
  };

  const buttonIcon = getButtonIcon();

  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'px-3 py-1 text-sm';
      case 'medium':
        return 'px-4 py-2 text-base';
      case 'large':
        return 'px-6 py-3 text-lg';
      default:
        return 'px-4 py-2 text-base';
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500';
      case 'secondary':
        return 'bg-gray-500 text-white hover:bg-gray-600 focus:ring-gray-500';
      case 'tertiary':
        return 'bg-green-500 text-white hover:bg-green-600 focus:ring-green-500';
      case 'outline':
        return 'bg-transparent border border-gray-500 text-gray-700 hover:bg-gray-100 focus:ring-gray-500';
      case 'text':
        return 'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500';
      case 'danger':
        return 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500';
      default:
        return 'bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500';
    }
  };

  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${
        fullWidth ? 'w-full' : ''
      } ${getSizeClasses()} ${getVariantClasses()} ${
        disabled || loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-opacity-80'
      } ${className}`}
      onClick={handleClick}
      disabled={disabled || loading}
    >
      {loading ? (
        <>
          <Spinner size={size === 'large' ? 'medium' : 'small'} className="mr-2" />
          {loadingText}
        </>
      ) : (
        <>
          {buttonIcon && <span className="mr-2">{buttonIcon}</span>}
          {startIcon && <span className="mr-2">{startIcon}</span>}
          {children}
          {endIcon && <span className="ml-2">{endIcon}</span>}
        </>
      )}
    </button>
  );
};

export default Button;