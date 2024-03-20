'use client'
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PopoverProps {
  trigger: React.ReactNode;
  content: React.ReactNode;
  placement?: 'top' | 'right' | 'bottom' | 'left';
  offset?: number;
  onOpen?: () => void;
  onClose?: () => void;
  className?: string;
  triggerClassName?: string;
  contentClassName?: string;
  arrowClassName?: string;
}

const Popover: React.FC<PopoverProps> = ({
  trigger,
  content,
  placement = 'bottom',
  offset = 8,
  onOpen,
  onClose,
  className = '',
  triggerClassName = '',
  contentClassName = '',
  arrowClassName = '',
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
    if (onOpen) {
      onOpen();
    }
  };

  const closePopover = () => {
    setIsOpen(false);
    if (onClose) {
      onClose();
    }
  };

  const togglePopover = () => {
    if (isOpen) {
      closePopover();
    } else {
      openPopover();
    }
  };

  const getPopoverPosition = () => {
    if (popoverRef.current && triggerRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const popoverRect = popoverRef.current.getBoundingClientRect();

      switch (placement) {
        case 'top':
          return {
            top: triggerRect.top - popoverRect.height - offset,
            left: triggerRect.left + (triggerRect.width - popoverRect.width) / 2,
          };
        case 'right':
          return {
            top: triggerRect.top + (triggerRect.height - popoverRect.height) / 2,
            left: triggerRect.right + offset,
          };
        case 'bottom':
          return {
            top: triggerRect.bottom + offset,
            left: triggerRect.left + (triggerRect.width - popoverRect.width) / 2,
          };
        case 'left':
          return {
            top: triggerRect.top + (triggerRect.height - popoverRect.height) / 2,
            left: triggerRect.left - popoverRect.width - offset,
          };
        default:
          return {};
      }
    }

    return {};
  };

  return (
    <div className={`popover ${className}`}>
      <div ref={triggerRef} className={`popover-trigger ${triggerClassName}`} onClick={togglePopover}>
        {trigger}
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={popoverRef}
            className={`popover-content ${contentClassName}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            style={getPopoverPosition()}
          >
            {content}
            <div className={`popover-arrow ${arrowClassName}`} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Popover;