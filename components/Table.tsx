// components/Table.tsx

import React from 'react';

type ColumnAccessor<T> = (keyof T & string) | ((row: T) => React.ReactNode);

interface TableColumn<T> {
  header: string;
  accessor: ColumnAccessor<T>;
}

interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  className?: string;
}

const Table = <T,>({ columns, data, className = '' }: TableProps<T>) => {
  const getNestedValue = (obj: any, path: string) => {
    const keys = path.split('.');
    return keys.reduce((acc, key) => acc && acc[key], obj);
  };

  const renderCell = (row: T, accessor: ColumnAccessor<T>) => {
    if (typeof accessor === 'function') {
      return accessor(row);
    }
    return String(getNestedValue(row, accessor));
  };

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            {columns.map((column) => (
              <th
                key={column.header}
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {data.map((row, index) => (
            <tr key={index} className="hover:bg-gray-100 dark:hover:bg-gray-700">
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

export default Table;