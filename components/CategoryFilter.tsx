// components/CategoryFilter.tsx
import React, { useState } from 'react';

interface CategoryFilterProps {
    options: string[];
    onSelect: (category: string) => void;
    className?: string;
    defaultText?: string;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
                                                           options,
                                                           onSelect,
                                                           className = '',
                                                           defaultText = 'Category',
                                                       }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('');

    const handleCategorySelect = (category: string) => {
        setSelectedCategory(category);
        onSelect(category);
        setIsOpen(false);
    };

    return (
        <div className={`relative inline-block text-left ${className}`}>
            <div>
                <button
                    type="button"
                    className="inline-flex justify-center w-full rounded-md shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-400"
                    id="category-menu"
                    aria-haspopup="true"
                    aria-expanded={isOpen}
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {selectedCategory || defaultText}
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
                <div
                    className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="category-menu"
                >
                    <div className="py-1 dark:bg-gray-700 rounded" role="none">
                        {options?.map((option) => (
                            <button
                                key={option}
                                className={`${
                                    selectedCategory === option ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-gray-100' : 'text-gray-700 dark:text-gray-300'
                                } block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-900`}
                                role="menuitem"
                                onClick={() => handleCategorySelect(option)}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CategoryFilter;