// components/Accordion.tsx
'use client'
import React, { useState } from 'react';

interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  className?: string;
}

const Accordion: React.FC<AccordionProps> = ({ items, className = '' }) => {
  const [activeItem, setActiveItem] = useState('');

  const handleItemClick = (itemId: string) => {
    setActiveItem(activeItem === itemId ? '' : itemId);
  };

  return (
    <div className={`divide-y divide-gray-200 dark:divide-gray-700 ${className}`}>
      {items.map((item) => (
        <div key={item.id} className="py-4">
          <button
            className="flex justify-between items-center w-full text-left"
            onClick={() => handleItemClick(item.id)}
          >
            <span className="text-lg font-medium text-gray-900 dark:text-white">
              {item.title}
            </span>
            <svg
              className={`w-5 h-5 ml-2 transition-transform ${
                activeItem === item.id ? 'transform rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          <div
            className={`mt-2 ${
              activeItem === item.id ? 'block' : 'hidden'
            } transition-all`}
          >
            {item.content}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Accordion;