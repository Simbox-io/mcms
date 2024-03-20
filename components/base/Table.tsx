import React from 'react';
import EmptyState from './EmptyState';

interface TableColumn<T> {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
  sortable?: boolean;
  className?: string;
  width?: string;
}

interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
  sortColumn?: keyof T;
  sortDirection?: 'asc' | 'desc';
  onSort?: (column: keyof T) => void;
  className?: string;
  rowClassName?: string;
  headerClassName?: string;
  cellClassName?: string;
  pagination?: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  };
  loading?: boolean;
  loadingText?: string;
  emptyText?: string;
}

const Table = <T,>({
  columns,
  data,
  onRowClick,
  sortColumn,
  sortDirection,
  onSort,
  className = '',
  rowClassName = '',
  headerClassName = '',
  cellClassName = '',
  pagination,
  loading = false,
  loadingText = 'Loading...',
  emptyText = 'No data available',
}: TableProps<T>) => {
  const handleSort = (column: keyof T) => {
    if (onSort) {
      onSort(column);
    }
  };

  const renderCell = (row: T, accessor: TableColumn<T>['accessor']) => {
    if (typeof accessor === 'function') {
      return accessor(row);
    }
    return row[accessor as keyof T];
  };

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="min-w-full divide-y divide-gray-200">
        {columns &&(
        <thead className={`bg-gray-50 ${headerClassName}`}>
          <tr>
            {columns.map((column) => (
              <th
                key={column.header}
                className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                  column.sortable ? 'cursor-pointer select-none' : ''
                } ${column.className}`}
                style={{ width: column.width }}
                onClick={() => column.sortable && handleSort(column.accessor as keyof T)}
              >
                {column.header}
                {column.sortable && (
                  <span className="ml-2 inline-block">
                    {sortColumn === column.accessor ? (
                      sortDirection === 'asc' ? (
                        <ChevronUpIcon className="w-4 h-4" />
                      ) : (
                        <ChevronDownIcon className="w-4 h-4" />
                      )
                    ) : (
                      <ChevronUpDownIcon className="w-4 h-4" />
                    )}
                  </span>
                )}
              </th>
            ))}
          </tr>
        </thead>)}
        <tbody className="bg-white divide-y divide-gray-200">
          {loading ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-4 text-center">
                {loadingText}
              </td>
            </tr>
          ) : !data || data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-4 text-center">
                {emptyText}
              </td>
            </tr>
          ) : (
            data.length > 0 && data?.map((row, index) => (
              <tr
                key={index}
                className={`${rowClassName} ${
                  onRowClick ? 'cursor-pointer hover:bg-gray-100' : ''
                }`}
                onClick={() => onRowClick && onRowClick(row)}
              >
                {columns.map((column) => (
                  <td
                    key={column.header}
                    className={`px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 ${cellClassName}`}
                  >
                    {renderCell(row, column.accessor)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
      {pagination && (
        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-gray-700">
            Page {pagination.currentPage} of {pagination.totalPages}
          </div>
          <div>
            <button
              className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={pagination.currentPage === 1}
              onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
            >
              Previous
            </button>
            <button
              className="ml-2 px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={pagination.currentPage === pagination.totalPages}
              onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const ChevronUpIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
  </svg>
);

const ChevronDownIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

const ChevronUpDownIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
    />
  </svg>
);

export default Table;