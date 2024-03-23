'use client'
import React, { useState } from 'react';

interface AvatarProps {
  src?: string;
  alt: string;
  size?: 'small' | 'medium' | 'large';
  className?: string;
  borderColor?: string;
  borderWidth?: number;
  status?: 'online' | 'offline' | 'busy';
  shape?: 'circle' | 'square' | 'rounded';
  fallback?: React.ReactNode;
}

const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  size = 'medium',
  className = '',
  borderColor = 'gray-300',
  borderWidth = 2,
  status,
  shape = 'circle',
  fallback,
}) => {
  const [imageError, setImageError] = useState(false);

  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12',
    large: 'w-16 h-16',
  };

  const shapeClasses = {
    circle: 'rounded-full',
    square: 'rounded-none',
    rounded: 'rounded-lg',
  };

  const statusClasses = {
    online: 'bg-green-500',
    offline: 'bg-gray-500',
    busy: 'bg-red-500',
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className="relative inline-block">
      {!imageError && src ? (
        <img
          src={src}
          alt={alt}
          className={`${sizeClasses[size]} ${shapeClasses[shape]} ${className}`}
          style={{ borderColor: `#${borderColor}`, borderWidth }}
          onError={handleImageError}
        />
      ) : (
        <div
          className={`${sizeClasses[size]} ${shapeClasses[shape]} ${className} bg-gray-100 flex items-center justify-center text-gray-500`}
          style={{ borderColor: `#${borderColor}`, borderWidth }}
        >
          {fallback || <span>{alt.charAt(0)}</span>}
        </div>
      )}
      {status && (
        <span
          className={`absolute bottom-0 right-0 block h-3 w-3 rounded-full ring-2 ring-white ${statusClasses[status]}`}
        />
      )}
    </div>
  );
};

export default Avatar;