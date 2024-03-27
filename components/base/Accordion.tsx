'use client';
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
}

const Accordion: React.FC<AccordionProps> = ({
  items,
  defaultActiveId,
  onItemClick,
  allowMultiple = false,
  className = '',
  style,
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
    <div className={`accordion ${className} bg-white dark:bg-gray-800 rounded-lg shadow-md`} style={style}>
      {items.map((item) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className={`accordion-item ${activeIds.includes(item.id) ? 'active' : ''
            } ${item.disabled ? 'disabled' : ''} border-b border-gray-200 dark:border-gray-600`}
        >
          <motion.div
            className={`accordion-title ${activeIds.includes(item.id) ? 'active' : ''} px-4 py-3 flex items-center justify-between cursor-pointer transition-colors duration-300 ease-in-out hover:bg-gray-100 dark:hover:bg-gray-700`}
            onClick={() => !item.disabled && handleItemClick(item.id)}
            whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}
            whileTap={{ scale: 0.98 }}
          >
            {item.icon && <span className="accordion-icon mr-2">{item.icon}</span>}
            <span className="accordion-title-text text-gray-800 dark:text-white font-semibold">{item.title}</span>
            <motion.span className="accordion-arrow ml-2"
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
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className={`accordion-content ${activeIds.includes(item.id) ? 'active' : ''} px-4 py-3 text-gray-600 dark:text-gray-300`}
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

interface ChevronDownIconProps {
  className?: string;
}

const ChevronDownIcon: React.FC<ChevronDownIconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" height={16} width={16} className={className}>
    <path
      fillRule="evenodd"
      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
      clipRule="evenodd"
    />
  </svg>
);

export default Accordion;