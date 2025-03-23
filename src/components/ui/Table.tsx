import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Column {
  key: string;
  header: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
  render?: (value: any, row: any) => ReactNode;
}

interface TableProps {
  columns: Column[];
  data: any[];
  isLoading?: boolean;
  emptyState?: ReactNode;
  onRowClick?: (row: any) => void;
  className?: string;
}

const Table = ({
  columns,
  data,
  isLoading,
  emptyState,
  onRowClick,
  className
}: TableProps) => {
  const getAlignment = (align?: 'left' | 'center' | 'right') => {
    switch (align) {
      case 'center':
        return 'text-center';
      case 'right':
        return 'text-right';
      default:
        return 'text-left';
    }
  };

  if (isLoading) {
    return (
      <div className="w-full space-y-4">
        {[...Array(3)].map((_, index) => (
          <div
            key={index}
            className="w-full h-16 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="w-full py-12 flex items-center justify-center">
        {emptyState || (
          <p className="text-gray-500 dark:text-gray-400">Aucune donnée disponible</p>
        )}
      </div>
    );
  }

  return (
    <div className={cn('w-full overflow-x-auto', className)}>
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-700">
            {columns.map((column) => (
              <th
                key={column.key}
                className={cn(
                  'px-4 py-3 text-sm font-medium text-gray-500 dark:text-gray-400',
                  getAlignment(column.align)
                )}
                style={{ width: column.width }}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <motion.tr
              key={rowIndex}
              whileHover={onRowClick ? { backgroundColor: 'rgba(0, 0, 0, 0.02)' } : {}}
              onClick={() => onRowClick?.(row)}
              className={cn(
                'border-b border-gray-200 dark:border-gray-700',
                onRowClick && 'cursor-pointer'
              )}
            >
              {columns.map((column) => (
                <td
                  key={column.key}
                  className={cn(
                    'px-4 py-3 text-sm text-gray-700 dark:text-gray-200',
                    getAlignment(column.align)
                  )}
                >
                  {column.render
                    ? column.render(row[column.key], row)
                    : row[column.key]}
                </td>
              ))}
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
