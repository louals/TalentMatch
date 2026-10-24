import React from "react";

interface Column<T> {
  header: string;
  accessor: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
    columns: {
      header: string;
      accessor: (item: T) => React.ReactNode;
    }[];
    data: T[];
    emptyMessage: string | React.ReactNode; // Update this line
  }

export const DataTable = <T,>({ columns, data, emptyMessage }: DataTableProps<T>) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          {data.length > 0 ? (
            data.map((item, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                {columns.map((column, colIndex) => (
                  <td
                    key={colIndex}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200"
                  >
                    {column.accessor(item)}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};