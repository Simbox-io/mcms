import React from 'react';

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: 'small' | 'medium' | 'large';
  shape?: 'circle' | 'rounded' | 'square';
  className?: string;
  style?: React.CSSProperties;
  fallback?: React.ReactNode;
  borderColor?: string;
  borderWidth?: number;
  onClick?: () => void;
}

const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = '',
  size = 'medium',
  shape = 'circle',
  className = '',
  style,
  fallback,
  borderColor = 'gray-300',
  borderWidth = 2,
  onClick,
}) => {
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12',
    large: 'w-16 h-16',
  };

  const shapeClasses = {
    circle: 'rounded-full',
    rounded: 'rounded-md',
    square: '',
  };

  const handleImageError = (event: React.SyntheticEvent<HTMLImageElement>) => {
    event.currentTarget.style.display = 'none';
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center overflow-hidden ${sizeClasses[size]} ${shapeClasses[shape]} ${className}`}
      style={{
        ...style,
        borderWidth: `${borderWidth}px`,
        borderStyle: 'solid',
        borderColor,
        cursor: onClick ? 'pointer' : 'default',
      }}
      onClick={onClick}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          className="absolute w-full h-full object-cover"
          onError={handleImageError}
        />
      ) : (
        fallback || <DefaultAvatar />
      )}
    </div>
  );
};

const DefaultAvatar: React.FC = () => (
<svg
    xmlns="http://www.w3.org/2000/svg"
    className={`w-full h-full text-gray`}
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