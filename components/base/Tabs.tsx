// components/Tabs.tsx
import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  className?: string;
}

const Tabs: React.FC<TabsProps> = ({ tabs, className = '' }) => {
  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [lineWidth, setLineWidth] = useState(0);
  const [lineLeft, setLineLeft] = useState(0);

  useEffect(() => {
    const activeTabIndex = tabs.findIndex((tab) => tab.id === activeTab);
    const activeTabElement = tabRefs.current[activeTabIndex];
    if (activeTabElement) {
      setLineWidth(activeTabElement.offsetWidth);
      setLineLeft(activeTabElement.offsetLeft);
    }
  }, [activeTab, tabs]);

  return (
    <div className={`${className}`}>
      <div className="relative flex border-b border-gray-300 dark:border-gray-700">
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            ref={(el) => (tabRefs.current[index] = el)}
            className={`px-4 py-2 text-sm font-medium focus:outline-none ${
              activeTab === tab.id
                ? 'text-blue-500 dark:text-blue-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            <div className="flex items-center space-x-2">
              {tab.icon}
              <span>{tab.label}</span>
            </div>
          </button>
        ))}
        <motion.div
          className="absolute bottom-0 left-0 h-0.5 bg-blue-500 dark:bg-blue-400"
          initial={false}
          animate={{
            width: lineWidth,
            left: lineLeft,
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />
      </div>
      <div className="mt-4">
        {tabs.find((tab) => tab.id === activeTab)?.content}
      </div>
    </div>
  );
};

export default Tabs;