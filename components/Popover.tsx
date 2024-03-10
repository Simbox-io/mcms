// components/Popover.tsx
'use client'
import React, { useState } from 'react';

interface PopoverProps {
  trigger: React.ReactNode;
  content: React.ReactNode;
  placement?: 'top' | 'right' | 'bottom' | 'left';
  className?: string;
}

const Popover: React.FC<PopoverProps> = ({
  trigger,
  content,
  placement = 'bottom',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const togglePopover = () => {
    setIsOpen(!isOpen);
  };

  const getPlacementClasses = () => {
    switch (placement) {
      case 'top':
        return 'bottom-full left-1/2 transform -translate-x-1/2 mb-2';
      case 'right':
        return 'left-full top-1/2 transform -translate-y-1/2 ml-2';
      case 'bottom':
        return 'top-full left-1/2 transform -translate-x-1/2 mt-2';
      case 'left':
        return 'right-full top-1/2 transform -translate-y-1/2 mr-2';
      default:
        return 'top-full left-1/2 transform -translate-x-1/2 mt-2';
    }
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <div onClick={togglePopover}>{trigger}</div>
      {isOpen && (
        <div
          className={`absolute z-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg ${getPlacementClasses()}`}
        >
          {content}
        </div>
      )}
    </div>
  );
};

export default Popover;