// components/Pagination.tsx
import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
  pageNeighbors?: number;
  previousLabel?: React.ReactNode;
  nextLabel?: React.ReactNode;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className = '',
  pageNeighbors = 1,
  previousLabel = <ChevronLeftIcon />,
  nextLabel = <ChevronRightIcon />,
}) => {
  const getPageNumbers = () => {
    const pageNumbers = [];

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - pageNeighbors && i <= currentPage + pageNeighbors)
      ) {
        pageNumbers.push(i);
      } else if (
        i === currentPage - pageNeighbors - 1 ||
        i === currentPage + pageNeighbors + 1
      ) {
        pageNumbers.push('...');
      }
    }

    return pageNumbers;
  };

  return (
    <nav className={`flex justify-center ${className}`} aria-label="Pagination">
      <ul className="inline-flex items-center -space-x-px">
        <li>
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`${
              currentPage === 1
                ? 'cursor-not-allowed opacity-50'
                : 'hover:bg-gray-50 dark:hover:bg-gray-800'
            } block py-2 px-3 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400`}
          >
            <span className="sr-only">Previous</span>
            {previousLabel}
          </button>
        </li>
        {getPageNumbers().map((pageNumber, index) => (
          <li key={index}>
            {pageNumber === '...' ? (
              <span className="py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400">
                ...
              </span>
            ) : (
              <button
                onClick={() => onPageChange(Number(pageNumber))}
                className={`${
                  pageNumber === currentPage
                    ? 'text-blue-600 bg-blue-50 border-blue-300 dark:border-gray-700 dark:bg-gray-700 dark:text-white'
                    : 'text-gray-500 bg-white border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                } py-2 px-3 leading-tight border`}
              >
                {pageNumber}
              </button>
            )}
          </li>
        ))}
        <li>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`${
              currentPage === totalPages
                ? 'cursor-not-allowed opacity-50'
                : 'hover:bg-gray-50 dark:hover:bg-gray-800'
            } block py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400`}
          >
            <span className="sr-only">Next</span>
            {nextLabel}
          </button>
        </li>
      </ul>
    </nav>
  );
};

const ChevronLeftIcon: React.FC = () => (
  <svg
    className="w-5 h-5"
    fill="currentColor"
    viewBox="0 0 20 20"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
      clipRule="evenodd"
    />
  </svg>
);

const ChevronRightIcon: React.FC = () => (
  <svg
    className="w-5 h-5"
    fill="currentColor"
    viewBox="0 0 20 20"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
      clipRule="evenodd"
    />
  </svg>
);

export default Pagination;