import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
  pageClassName?: string;
  activePageClassName?: string;
  previousClassName?: string;
  nextClassName?: string;
  previousLabel?: React.ReactNode;
  nextLabel?: React.ReactNode;
  renderPageLink?: (page: number, className: string, children: React.ReactNode) => React.ReactNode;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className = '',
  pageClassName = '',
  activePageClassName = '',
  previousClassName = '',
  nextClassName = '',
  previousLabel = 'Previous',
  nextLabel = 'Next',
  renderPageLink = (page, className, children) => (
    <button className={className} onClick={() => onPageChange(page)}>
      {children}
    </button>
  ),
}) => {
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className={`flex items-center ${className}`}>
      {renderPageLink(
        currentPage - 1,
        `mr-2 px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 ${previousClassName}`,
        previousLabel
      )}
      {pageNumbers.map((page) =>
        renderPageLink(
          page,
          `mx-1 px-4 py-2 rounded-md border border-gray-300 ${
            page === currentPage
              ? `bg-blue-500 text-white ${activePageClassName}`
              : `bg-white text-gray-700 hover:bg-gray-50 ${pageClassName}`
          }`,
          page
        )
      )}
      {renderPageLink(
        currentPage + 1,
        `ml-2 px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 ${nextClassName}`,
        nextLabel
      )}
    </div>
  );
};

export default Pagination;