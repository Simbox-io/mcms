'use client';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface SidebarItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface SidebarProps {
  items: SidebarItem[];
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ items, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const sidebarVariants = {
    open: { x: 0 },
    closed: { x: '-100%' },
  };

  return (
    <div className={`${className}`}>
      <motion.div
        className="fixed inset-0 bg-gray-900 bg-opacity-50 z-40 lg:hidden lg:z-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        onClick={toggleSidebar}
        aria-hidden="true"
      ></motion.div>
      <motion.div
        className="fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800"
        variants={sidebarVariants}
        initial="closed"
        animate={isOpen ? 'open' : 'closed'}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        <div className="flex items-center justify-between mt-8 px-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Menu
          </h2>
          <button
            onClick={toggleSidebar}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none focus:text-gray-600 dark:focus:text-gray-300"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <nav className="mt-10">
          {items.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className="flex items-center py-2 px-6 text-base font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-150 ease-in-out"
              onClick={toggleSidebar}
            >
              <span className="mr-4">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
      </motion.div>
    </div>
  );
};

export default Sidebar;