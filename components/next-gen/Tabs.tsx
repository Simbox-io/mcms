'use client'
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Tab {
  label: string;
  content: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
}

interface TabsProps {
  tabs: Tab[];
  className?: string;
  defaultActiveTab?: number;
  onChange?: (index: number) => void;
}

const Tabs: React.FC<TabsProps> = ({ 
  tabs, 
  className = '', 
  defaultActiveTab = 0, 
  onChange 
}) => {
  const [activeTab, setActiveTab] = useState(defaultActiveTab);

  const handleTabChange = (index: number) => {
    setActiveTab(index);
    onChange && onChange(index);
  };

  return (
    <div className={`${className}`}>
      <div className="flex border-b border-gray-300 dark:border-gray-600">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => handleTabChange(index)}
            disabled={tab.disabled}
            className={`group relative min-w-0 flex-1 overflow-hidden bg-white dark:bg-gray-800 dark:hover:bg-gray-700 py-3 px-4 text-sm font-medium text-center hover:bg-gray-50 focus:z-10 
            ${activeTab === index
                ? 'border-blue-500 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }
            ${tab.disabled 
                ? 'cursor-not-allowed opacity-50' 
                : 'cursor-pointer'
              }
            `}
          >
            <div className="flex items-center justify-center">
            {tab.icon && (
              <span className=" mr-2 mt-2 h-5 w-5 text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-400">
                {tab.icon}
              </span>
            )}
            <span>{tab.label}</span>
            </div>
            {activeTab === index && (
              <motion.div 
                className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-500 dark:bg-blue-400"
                layoutId="activeTabIndicator"
              />
            )}
          </button>
        ))}
      </div>
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="mt-6"
        >
          {tabs[activeTab].content}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Tabs;