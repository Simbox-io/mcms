// components/Table.tsx
import React from 'react';

type ColumnAccessor<T> = keyof T | ((row: T) => React.ReactNode);

interface TableColumn<T> {
  header: string;
  accessor: ColumnAccessor<T>;
  sortable?: boolean;
  className?: string;
}

interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  className?: string;
  rowClassName?: string;
  onRowClick?: (row: T) => void;
  sortColumn?: keyof T;
  sortDirection?: 'asc' | 'desc';
  onSort?: (column: keyof T) => void;
}

const Table = <T,>({
  columns,
  data,
  className = '',
  rowClassName = '',
  onRowClick,
  sortColumn,
  sortDirection,
  onSort,
}: TableProps<T>) => {
  const renderCell = (row: T, accessor: ColumnAccessor<T>) => {
    if (typeof accessor === 'function') {
      return accessor(row);
    }
    return String(row[accessor]);
  };

  const handleSort = (column: keyof T) => {
    if (onSort) {
      onSort(column);
    }
  };

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            {columns && columns.length > 0 && columns.map((column) => (
              <th
                key={column.header}
                scope="col"
                className={`px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider ${
                  column.sortable ? 'cursor-pointer select-none' : ''
                } ${column.className}`}
                onClick={() => column.sortable && handleSort(column.accessor as keyof T)}
              >
                <div className="flex items-center">
                  {column.header}
                  {column.sortable && (
                    <span className="ml-2">
                      {sortColumn === column.accessor ? (
                        sortDirection === 'asc' ? (
                          <ChevronUpIcon />
                        ) : (
                          <ChevronDownIcon />
                        )
                      ) : (
                        <ChevronUpDownIcon />
                      )}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {data && data.length > 0 && data.map((row, index) => (
            <tr
              key={index}
              className={`${
                onRowClick ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600' : ''
              } ${rowClassName}`}
              onClick={() => onRowClick && onRowClick(row)}
            >
              {columns.map((column) => (
                <td
                  key={column.header}
                  className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white"
                >
                  {renderCell(row, column.accessor)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const ChevronUpIcon: React.FC = () => (
  <svg
    className="w-4 h-4"
    fill="currentColor"
    viewBox="0 0 20 20"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
      clipRule="evenodd"
    />
  </svg>
);

const ChevronDownIcon: React.FC = () => (
  <svg
    className="w-4 h-4"
    fill="currentColor"
    viewBox="0 0 20 20"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
      clipRule="evenodd"
    />
  </svg>
);

const ChevronUpDownIcon: React.FC = () => (
  <svg
    className="w-4 h-4"
    fill="currentColor"
    viewBox="0 0 20 20"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
      clipRule="evenodd"
    />
  </svg>
);

export default Table;