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
    className="w-full h-full text-gray-400"
    fill="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      d="M12 2C6.477 2 2 6.477 2 12c0 5.522 4.477 10 10 10s10-4.478 10-10c0-5.523-4.477-10-10-10zm0 18a8 8 0 100-16 8 8 0 000 16zm-4.293-9.707a1 1 0 011.414 0L11 12.586l1.879-1.879a1 1 0 111.414 1.414L12.414 14l1.879 1.879a1 1 0 01-1.414 1.414L11 15.414l-1.879 1.879a1 1 0 01-1.414-1.414L9.586 14l-1.879-1.879a1 1 0 010-1.414z"
      clipRule="evenodd"
    />
  </svg>
);

export default Avatar;