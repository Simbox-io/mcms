import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/solid';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
  siblingCount?: number;
  boundaryCount?: number;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className = '',
  siblingCount = 1,
  boundaryCount = 1,
}) => {
  const getPageNumbers = () => {
    const pageNumbers = [];

    // Calculate the range of page numbers to display
    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    // Add boundary pages (first and last)
    if (boundaryCount > 0) {
      if (leftSiblingIndex > boundaryCount + 2) {
        for (let i = 1; i <= boundaryCount; i++) {
          pageNumbers.push(i);
        }
        if (leftSiblingIndex > boundaryCount + 3) {
          pageNumbers.push(-1); // Ellipsis
        }
      }
      if (rightSiblingIndex < totalPages - boundaryCount - 1) {
        if (rightSiblingIndex < totalPages - boundaryCount - 2) {
          pageNumbers.push(-1); // Ellipsis
        }
        for (let i = totalPages - boundaryCount + 1; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      }
    }

    // Add sibling pages
    for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };

  const pageNumbers = getPageNumbers();

  return (
    <nav className={`inline-flex items-center rounded-md shadow-sm ${className}`} aria-label="Pagination">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
      >
        <ChevronLeftIcon className="w-5 h-5" aria-hidden="true" />
      </button>
      {pageNumbers.map((number, index) =>
        number === -1 ? (
          <span
            key={index}
            className="inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400"
          >
            ...
          </span>
        ) : (
          <button
            key={number}
            onClick={() => onPageChange(number)}
            className={`inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium focus:z-10 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
              currentPage === number
                ? 'bg-blue-50 border-blue-500 text-blue-600 dark:bg-blue-900 dark:text-blue-200'
                : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
            }`}
          >
            {number}
          </button>
        )
      )}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
      >
        <ChevronRightIcon className="w-5 h-5" aria-hidden="true" />
      </button>
    </nav>
  );
};

export default Pagination;