import React from 'react';

interface CardProps {
  header?: React.ReactNode;
  footer?: React.ReactNode;
  image?: string;
  imageAlt?: string;
  className?: string;
  headerClassName?: string;
  footerClassName?: string;
  imageClassName?: string;
  onClick?: () => void;
  children?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({
  header,
  footer,
  image,
  imageAlt = '',
  className = '',
  headerClassName = '',
  footerClassName = '',
  imageClassName = '',
  onClick,
  children,
}) => {
  return (
    <div
      className={`bg-white text-gray-800 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md overflow-hidden ${className}`}
      onClick={onClick}
    >
      {image && (
        <div className={`relative text-gray-800 dark:text-gray-100 ${imageClassName}`}>
          <img src={image} alt={imageAlt} className="w-full h-auto text-gray-800" />
        </div>
      )}
      {header && (
        <div className={`px-4 py-3 border-b text-gray-800 dark:text-gray-100 border-gray-200 dark:border-gray-700 ${headerClassName}`}>
          {header}
        </div>
      )}
      <div className="p-4 text-gray-800 dark:text-gray-100">{children}</div>
      {footer && (
        <div className={`px-4 py-3 bg-gray-100 text-gray-800 dark:text-gray-100 dark:bg-gray-700 ${footerClassName}`}>
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;