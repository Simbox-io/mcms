// components/Avatar.tsx
import React from 'react';

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: 'small' | 'medium' | 'large';
  shape?: 'circle' | 'square';
  className?: string;
  style?: React.CSSProperties;
  initials?: string;
  initialsClassName?: string;
  onClick?: () => void;
}

const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = '',
  size = 'medium',
  shape = 'circle',
  className = '',
  style,
  initials,
  initialsClassName = '',
  onClick,
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'w-8 h-8 text-sm';
      case 'medium':
        return 'w-12 h-12 text-base';
      case 'large':
        return 'w-16 h-16 text-xl';
      default:
        return 'w-12 h-12 text-base';
    }
  };

  const getShapeClasses = () => {
    return shape === 'circle' ? 'rounded-full' : 'rounded';
  };

  const renderAvatar = () => {
    if (src) {
      return (
        <img
          src={src}
          alt={alt}
          className={`${getSizeClasses()} ${getShapeClasses()} object-cover ${className}`}
          style={style}
          onClick={onClick}
        />
      );
    } else if (initials) {
      return (
        <div
          className={`${getSizeClasses()} ${getShapeClasses()} flex items-center justify-center bg-gray-200 text-gray-600 font-semibold ${initialsClassName}`}
          style={style}
          onClick={onClick}
        >
          {initials}
        </div>
      );
    } else {
      return (
        <div
          className={`${getSizeClasses()} ${getShapeClasses()} flex items-center justify-center bg-gray-200 text-gray-600 ${className}`}
          style={style}
          onClick={onClick}
        >
          <UserIcon className="w-2/3 h-2/3" />
        </div>
      );
    }
  };

  return renderAvatar();
};

const UserIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`${className}`}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zm-4 7a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
);

export default Avatar;