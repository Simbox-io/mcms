// components/Popover.tsx
'use client';
import React, { useState, useRef, useEffect } from 'react';

interface PopoverProps {
  trigger: React.ReactNode;
  content: React.ReactNode;
  placement?: 'top' | 'right' | 'bottom' | 'left';
  className?: string;
  popoverClassName?: string;
  triggerClassName?: string;
  onOpen?: () => void;
  onClose?: () => void;
}

const Popover: React.FC<PopoverProps> = ({
  trigger,
  content,
  placement = 'bottom',
  className = '',
  popoverClassName = '',
  triggerClassName = '',
  onOpen,
  onClose,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        triggerRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        closePopover();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const openPopover = () => {
    setIsOpen(true);
    onOpen && onOpen();
  };

  const closePopover = () => {
    setIsOpen(false);
    onClose && onClose();
  };

  const togglePopover = () => {
    if (isOpen) {
      closePopover();
    } else {
      openPopover();
    }
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
      <div
        ref={triggerRef}
        className={`inline-block ${triggerClassName}`}
        onClick={togglePopover}
      >
        {trigger}
      </div>
      {isOpen && (
        <div
          ref={popoverRef}
          className={`absolute z-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg ${getPlacementClasses()} ${popoverClassName}`}
        >
          {content}
        </div>
      )}
    </div>
  );
};

export default Popover;