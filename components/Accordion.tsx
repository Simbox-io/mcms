// components/Accordion.tsx
'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  className?: string;
  style?: React.CSSProperties;
  defaultActiveId?: string;
  allowMultiple?: boolean;
  onChange?: (activeIds: string[]) => void;
}

const Accordion: React.FC<AccordionProps> = ({
  items,
  className = '',
  style,
  defaultActiveId,
  allowMultiple = false,
  onChange,
}) => {
  const [activeIds, setActiveIds] = useState<string[]>(
    defaultActiveId ? [defaultActiveId] : []
  );

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

    if (onChange) {
      onChange(updatedActiveIds);
    }
  };

  return (
    <div className={`accordion ${className}`} style={style}>
      {items.map((item) => (
        <div key={item.id} className="accordion-item">
          <button
            className={`accordion-header ${
              activeIds.includes(item.id) ? 'active' : ''
            }`}
            onClick={() => handleItemClick(item.id)}
          >
            <span className="accordion-title">{item.title}</span>
            <span className="accordion-icon">
              {activeIds.includes(item.id) ? '-' : '+'}
            </span>
          </button>
          <AnimatePresence>
            {activeIds.includes(item.id) && (
              <motion.div
                className="accordion-content"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {item.content}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
};

export default Accordion;