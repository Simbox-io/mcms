'use client'
import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  header?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  headerClassName?: string;
  bodyClassName?: string;
  footerClassName?: string;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
  header,
  children,
  footer,
  className = '',
  headerClassName = '',
  bodyClassName = '',
  footerClassName = '',
  collapsible = false,
  defaultCollapsed = false,
  onCollapse,
  onClick
}) => {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  const handleToggleCollapse = () => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
    onCollapse?.(newCollapsedState);
  };

  const handleClick = () => {
    onClick?.();
  }

  return (
    <div onClick={handleClick}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <div className={`rounded-lg overflow-hidden bg-white dark:bg-gray-700 ${className}`}>
          {header && (
            <motion.div
              className={`px-6 py-4 bg-gray-100 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 ${headerClassName}`}
              onClick={collapsible ? handleToggleCollapse : undefined}
              initial={false}
              animate={{ rotateX: isCollapsed ? '-90deg' : '0deg' }}
              transition={{ duration: 0.3 }}
            >
              {header}
              {collapsible && (
                <motion.span
                  className="text-gray-500 dark:text-gray-400 cursor-pointer ml-2"
                  initial={false}
                  animate={{ rotate: isCollapsed ? '0deg' : '180deg' }}
                  transition={{ duration: 0.3 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </motion.span>
              )}
            </motion.div>
          )}
          <motion.div
            className={`p-6 ${bodyClassName}`}
            initial={false}
            animate={{ height: isCollapsed ? '0' : 'auto', opacity: isCollapsed ? 0 : 1 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
          {footer && (
            <motion.div
              className={`px-6 py-4 bg-gray-100 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 ${footerClassName}`}
              initial={false}
              animate={{ height: isCollapsed ? '0' : 'auto', opacity: isCollapsed ? 0 : 1 }}
              transition={{ duration: 0.3 }}
            >
              {footer}
            </motion.div>
          )}
        </div>
      </motion.div >
    </div >
  );
};

export default Card;