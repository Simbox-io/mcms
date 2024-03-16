// components/Accordion.tsx
'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AccordionItemProps {
  id: string;
  title: string;
  children: React.ReactNode;
}

interface AccordionProps {
  children: React.ReactElement<AccordionItemProps>[];
  className?: string;
  style?: React.CSSProperties;
  defaultActiveId?: string;
  allowMultiple?: boolean;
  onChange?: (activeIds: string[]) => void;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ children }) => <>{children}</>;

const Accordion: React.FC<AccordionProps> = ({
  children,
  className = '',
  style,
  defaultActiveId,
  allowMultiple = false,
  onChange,
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
    if (onChange) {
      onChange(updatedActiveIds);
    }
  };

  return (
    <div className={`accordion ${className}`} style={style}>
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) {
          return null;
        }
        const { id, title } = child.props;
        return (
          <div key={id} className="accordion-item">
            <button
              className={`accordion-header ${activeIds.includes(id) ? 'active' : ''}`}
              onClick={() => handleItemClick(id)}
            >
              <span className="accordion-title">{title}</span>
              <span className="accordion-icon">{activeIds.includes(id) ? '-' : '+'}</span>
            </button>
            <AnimatePresence>
              {activeIds.includes(id) && (
                <motion.div
                  className="accordion-content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {child}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};

export { AccordionItem } 
export default Accordion;