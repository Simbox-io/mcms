// components/Tooltip.tsx
'use client'
import React, { useState } from 'react';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: 'top' | 'right' | 'bottom' | 'left';
  className?: string;
}

const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top',
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const handleMouseEnter = () => {
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
  };

  const getPositionClasses = () => {
    switch (position) {
      case 'top':
        return 'bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2';
      case 'right':
        return 'left-full top-1/2 transform -translate-y-1/2 translate-x-2';
      case 'bottom':
        return 'top-full left-1/2 transform -translate-x-1/2 translate-y-2';
      case 'left':
        return 'right-full top-1/2 transform -translate-y-1/2 -translate-x-2';
      default:
        return 'bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2';
    }
  };

  return (
    <div
      className={`relative inline-block ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {isVisible && (
        <div
          className={`absolute z-10 px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm opacity-0 transition-opacity duration-300 ${getPositionClasses()}`}
        >
          {content}
          <div
            className={`absolute w-0 h-0 ${
              position === 'top'
                ? 'border-t-8 border-t-gray-900 border-l-8 border-l-transparent border-r-8 border-r-transparent -bottom-2 left-1/2 transform -translate-x-1/2'
                : position === 'right'
                ? 'border-r-8 border-r-gray-900 border-t-8 border-t-transparent border-b-8 border-b-transparent -left-2 top-1/2 transform -translate-y-1/2'
                : position === 'bottom'
                ? 'border-b-8 border-b-gray-900 border-l-8 border-l-transparent border-r-8 border-r-transparent -top-2 left-1/2 transform -translate-x-1/2'
                : 'border-l-8 border-l-gray-900 border-t-8 border-t-transparent border-b-8 border-b-transparent -right-2 top-1/2 transform -translate-y-1/2'
            }`}
          ></div>
        </div>
      )}
    </div>
  );
};

export default Tooltip;