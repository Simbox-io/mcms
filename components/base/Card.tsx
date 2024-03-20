import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  header?: React.ReactNode;
  content?: React.ReactNode;
  footer?: React.ReactNode;
  image?: string;
  imageAlt?: string;
  effects?: boolean;
  className?: string;
  contentClassName?: string;
  headerClassName?: string;
  footerClassName?: string;
  imageClassName?: string;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
  header,
  content,
  footer,
  image,
  imageAlt = '',
  effects = true,
  className = '',
  contentClassName = '',
  headerClassName = '',
  footerClassName = '',
  imageClassName = '',
  onClick,
}) => {
  return (
    <>
    {effects ? (
    <motion.div
      className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md overflow-hidden ${className}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
    >
      {image && (
        <div className={`relative ${imageClassName}`}>
          <img src={image} alt={imageAlt} className="w-full h-auto" />
        </div>
      )}
      {header && (
        <div className={`px-4 py-3 border-b border-gray-200 dark:border-gray-700 ${headerClassName}`}>
          {header}
        </div>
      )}
      {content && (
        <div className={`p-4 ${contentClassName}`}>
          {content}
        </div>
      )}
      {footer && (
        <div className={`px-4 py-3 bg-gray-100 dark:bg-gray-700 ${footerClassName}`}>
          {footer}
        </div>
      )}
    </motion.div>) : (
      <>
       {image && (
        <div className={`relative ${imageClassName}`}>
          <img src={image} alt={imageAlt} className="w-full h-auto" />
        </div>
      )}
      {header && (
        <div className={`px-4 py-3 border-b border-gray-200 dark:border-gray-700 ${headerClassName}`}>
          {header}
        </div>
      )}
      {content && (
        <div className={`p-4 ${contentClassName}`}>
          {content}
        </div>
      )}
      {footer && (
        <div className={`px-4 py-3 bg-gray-100 dark:bg-gray-700 ${footerClassName}`}>
          {footer}
        </div>
      )}
    </>
  )}
  </>
)};

export default Card;