'use client';
import React, { useState } from 'react';
import { Transition } from '@headlessui/react';

interface AccordionItem {
  title: string;
  content: React.ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  className?: string;
  allowMultiple?: boolean;
  headerClassName?: string;
  contentClassName?: string;
}

const Accordion: React.FC<AccordionProps> = ({
  items,
  className = '',
  allowMultiple = false,
  headerClassName = '',
  contentClassName = '',
}) => {
  const [activeIndexes, setActiveIndexes] = useState<number[]>([]);

  const toggleAccordion = (index: number) => {
    if (allowMultiple) {
      setActiveIndexes((prevIndexes) => {
        if (prevIndexes.includes(index)) {
          return prevIndexes.filter((i) => i !== index);
        } else {
          return [...prevIndexes, index];
        }
      });
    } else {
      setActiveIndexes((prevIndexes) => (prevIndexes.includes(index) ? [] : [index]));
    }
  };

  return (
    <div className={`divide-y divide-gray-300 dark:divide-gray-500 ${className}`}>
      {items.map((item, index) => (
        <div key={index}>
          <button
            onClick={() => toggleAccordion(index)}
            className={`flex justify-between w-full px-4 py-2 text-left text-gray-800 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700 focus:outline-none ${headerClassName}`}
            aria-expanded={activeIndexes.includes(index)}
            aria-controls={`accordion-content-${index}`}
          >
            <span className="text-sm font-medium">{item.title}</span>
            <svg
              className={`w-5 h-5 transition-transform transform ${
                activeIndexes.includes(index) ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <Transition
            show={activeIndexes.includes(index)}
            enter="transition-all duration-300 ease-in-out"
            enterFrom="opacity-0 max-h-0"
            enterTo="opacity-100 max-h-screen"
            leave="transition-all duration-300 ease-in-out"
            leaveFrom="opacity-100 max-h-screen"
            leaveTo="opacity-0 max-h-0"
          >
            <div
              id={`accordion-content-${index}`}
              className={`px-4 py-2 overflow-hidden ${contentClassName}`}
            >
              {item.content}
            </div>
          </Transition>
        </div>
      ))}
    </div>
  );
};

export default Accordion;