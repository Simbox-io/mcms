'use client'
import React, { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/solid';

interface TableColumn<T> {
  header: string;
  accessor: keyof T;
  sortable?: boolean;
}

interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  className?: string;
  rowClassName?: string;
  sortBy?: keyof T;
  sortOrder?: 'asc' | 'desc';
  onSort?: (accessor: keyof T) => void;
  renderRowActions?: (row: T) => React.ReactNode;
  onRowClick?: (row: T) => void;
  onHover?: (row: T | null) => void;
}

const Table = <T,>({
  columns,
  data,
  className = '',
  rowClassName = '',
  sortBy,
  sortOrder,
  onSort,
  renderRowActions,
  onRowClick,
  onHover,
}: TableProps<T>) => {
  const [hoveredRow, setHoveredRow] = useState<T | null>(null);

  const handleSort = (accessor: keyof T) => {
    if (onSort) {
      onSort(accessor);
    }
  };

  const handleRowClick = (row: T) => {
    if (onRowClick) {
      onRowClick(row);
    }
  };

  const handleRowHover = (row: T | null) => {
    setHoveredRow(row);
    if (onHover) {
      onHover(row);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className={`min-w-full divide-y divide-gray-300 dark:divide-gray-700 ${className}`}>
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                scope="col"
                className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                  column.sortable
                    ? 'cursor-pointer select-none text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                    : 'text-gray-500 dark:text-gray-400'
                }`}
                onClick={() => column.sortable && handleSort(column.accessor)}
              >
                <div className="flex items-center space-x-1">
                  <span>{column.header}</span>
                  {column.sortable && (
                    <span className="relative flex items-center">
                      {sortBy === column.accessor && sortOrder === 'asc' && (
                        <ChevronUpIcon className="h-4 w-4" />
                      )}
                      {sortBy === column.accessor && sortOrder === 'desc' && (
                        <ChevronDownIcon className="h-4 w-4" />
                      )}
                    </span>
                  )}
                </div>
              </th>
            ))}
            {renderRowActions && <th scope="col" className="relative px-6 py-3" />}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-300 dark:bg-gray-900 dark:divide-gray-700">
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={`${rowClassName} ${
                hoveredRow === row ? 'bg-gray-50 dark:bg-gray-800' : ''
              } cursor-pointer`}
              onClick={() => handleRowClick(row)}
              onMouseEnter={() => handleRowHover(row)}
              onMouseLeave={() => handleRowHover(null)}
            >
              {columns.map((column, columnIndex) => (
                <td
                  key={columnIndex}
                  className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100"
                >
                  {row[column.accessor] as React.ReactNode}
                </td>
              ))}
              {renderRowActions && (
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {renderRowActions(row)}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;