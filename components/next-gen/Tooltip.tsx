'use client'
import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface TooltipProps {
  content?: string;
  children: React.ReactElement;
  placement?: 'top' | 'right' | 'bottom' | 'left';
  className?: string;
  delay?: number;
  trigger?: 'hover' | 'click';
  enabled?: boolean;
}

const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  placement = 'top',
  className = '',
  delay = 0,
  trigger = 'hover',
  enabled = true,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  if (!enabled || !content) {
    return children;
  }

  const positionClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
  };

  const handleMouseEnter = () => {
    setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
  };

  const handleClick = () => {
    setIsVisible(!isVisible);
  };

  const events = 
    trigger === 'hover' 
      ? { 
          onMouseEnter: handleMouseEnter, 
          onMouseLeave: handleMouseLeave 
        } 
      : { 
          onClick: handleClick 
        };

  return (
    <div className="relative inline-block" {...events}>
      {children}
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2 }}
          className={`absolute z-50 px-2 py-1 text-sm text-white bg-gray-800 dark:bg-gray-700 rounded shadow ${positionClasses[placement]} ${className}`}
        >
          {content}
        </motion.div>
      )}
    </div>
  );
};

export default Tooltip;