'use client'
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
  disabled?: boolean;
  icon?: React.ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  defaultActiveId?: string;
  onItemClick?: (itemId: string) => void;
  allowMultiple?: boolean;
  className?: string;
  style?: React.CSSProperties;
  itemClassName?: string;
  titleClassName?: string;
  contentClassName?: string;
  iconClassName?: string;
  activeTitleClassName?: string;
  activeContentClassName?: string;
}

const Accordion: React.FC<AccordionProps> = ({
  items,
  defaultActiveId,
  onItemClick,
  allowMultiple = false,
  className = '',
  style,
  itemClassName = '',
  titleClassName = '',
  contentClassName = '',
  iconClassName = '',
  activeTitleClassName = '',
  activeContentClassName = '',
}) => {
  const [activeIds, setActiveIds] = useState<string[]>(defaultActiveId ? [defaultActiveId] : []);

  const handleItemClick = (itemId: string) => {
    let updatedActiveIds: string[];
    if (allowMultiple) {
      updatedActiveIds = activeIds.includes(itemId)
        ? activeIds.filter((id) => id !== itemId)
        : [...activeIds, itemId];
    } else {
      updatedActiveIds = activeIds.includes(itemId) ? [] : [itemId];
    }
    setActiveIds(updatedActiveIds);
    onItemClick && onItemClick(itemId);
  };

  return (
    <div className={`accordion ${className}`} style={style}>
      {items.map((item) => (
        <motion.div
          key={item.id}
          className={`accordion-item ${itemClassName} ${
            activeIds.includes(item.id) ? 'accordion-item-active' : ''
          } ${item.disabled ? 'accordion-item-disabled' : ''}`}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className={`accordion-title ${titleClassName} ${
              activeIds.includes(item.id) ? activeTitleClassName : ''
            }`}
            onClick={() => !item.disabled && handleItemClick(item.id)}
            whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}
            whileTap={{ scale: 0.98 }}
          >
            {item.icon && <span className={`accordion-icon ${iconClassName}`}>{item.icon}</span>}
            <span className="accordion-title-text">{item.title}</span>
            <motion.span
              className="accordion-arrow"
              initial={{ rotate: 0 }}
              animate={{ rotate: activeIds.includes(item.id) ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDownIcon />
            </motion.span>
          </motion.div>
          <AnimatePresence>
            {activeIds.includes(item.id) && (
              <motion.div
                className={`accordion-content ${contentClassName} ${activeContentClassName}`}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                {item.content}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
};

const ChevronDownIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" height={16} width={16}>
    <path
      fillRule="evenodd"
      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
      clipRule="evenodd"
    />
  </svg>
);

export default Accordion;