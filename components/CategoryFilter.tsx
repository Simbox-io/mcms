'use client'
import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface CategoryFilterProps {
  options: { label: string; icon?: React.ReactNode }[];
  onSelect: (category: string) => void;
  className?: string;
  label?: string;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  options,
  onSelect,
  className = '',
  label = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    onSelect(category);
    setIsOpen(false);
    setSearchTerm('');
  };

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`relative inline-block text-left ${className}`}>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
        {label}
      </label>
      <div>
        <button
          type="button"
          className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-blue-500"
          id="category-menu"
          aria-haspopup="true"
          aria-expanded={isOpen}
          onClick={() => setIsOpen(!isOpen)}
        >
          {selectedCategory ? (
            <div className="flex items-center">
              {options.find((option) => option.label === selectedCategory)?.icon}
              <span className="ml-2">{selectedCategory}</span>
            </div>
          ) : (
            <span className="text-gray-500 dark:text-gray-400">Select a category</span>
          )}
          <svg
            className="-mr-1 ml-2 h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
      {isOpen && (
        <motion.div
          className="origin-top-right absolute right-0 mt-2 w-72 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="category-menu"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          <div className="p-2">
            <input
              type="text"
              placeholder="Search categories"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 placeholder:text-gray-300 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="py-1" role="none">
            {filteredOptions.map((option) => (
              <button
                key={option.label}
                className={`flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 ${
                  selectedCategory === option.label
                    ? 'bg-gray-100 dark:bg-gray-700'
                    : ''
                }`}
                role="menuitem"
                onClick={() => handleCategorySelect(option.label)}
              >
                {option.icon}
                <span className="ml-2">{option.label}</span>
              </button>
            ))}
            {filteredOptions.length === 0 && (
              <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                No categories found
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default CategoryFilter;