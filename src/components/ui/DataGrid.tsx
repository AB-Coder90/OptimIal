import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp, ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Column<T> {
  field: keyof T;
  header: string;
  width?: number | string;
  sortable?: boolean;
  filterable?: boolean;
  renderCell?: (row: T) => React.ReactNode;
  renderFilter?: (value: any, onChange: (value: any) => void) => React.ReactNode;
}

interface DataGridProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  selectable?: boolean;
  onSelectionChange?: (selectedRows: T[]) => void;
  onRowClick?: (row: T) => void;
  pagination?: boolean;
  pageSize?: number;
  className?: string;
  rowClassName?: string;
  emptyMessage?: string;
}

const DataGrid = <T extends { id?: string | number }>({
  columns,
  data,
  loading = false,
  selectable = false,
  onSelectionChange,
  onRowClick,
  pagination = true,
  pageSize = 10,
  className,
  rowClassName,
  emptyMessage = 'Aucune donnée'
}: DataGridProps<T>) => {
  const [sortField, setSortField] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedRows, setSelectedRows] = useState<T[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<Record<string, any>>({});

  const handleSort = (field: keyof T) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleSelectAll = (checked: boolean) => {
    const newSelection = checked ? filteredData : [];
    setSelectedRows(newSelection);
    onSelectionChange?.(newSelection);
  };

  const handleSelectRow = (row: T, checked: boolean) => {
    const newSelection = checked
      ? [...selectedRows, row]
      : selectedRows.filter(r => r !== row);
    setSelectedRows(newSelection);
    onSelectionChange?.(newSelection);
  };

  const filteredData = useMemo(() => {
    return data.filter(row => {
      return Object.entries(filters).every(([field, value]) => {
        if (!value) return true;
        const cellValue = String(row[field as keyof T]).toLowerCase();
        return cellValue.includes(String(value).toLowerCase());
      });
    });
  }, [data, filters]);

  const sortedData = useMemo(() => {
    if (!sortField) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (aValue === bValue) return 0;
      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      const comparison = String(aValue).localeCompare(String(bValue));
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [filteredData, sortField, sortDirection]);

  const paginatedData = useMemo(() => {
    if (!pagination) return sortedData;
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize, pagination]);

  const totalPages = Math.ceil(sortedData.length / pageSize);

  const LoadingSkeleton = () => (
    <div className="animate-pulse">
      {Array.from({ length: pageSize }).map((_, index) => (
        <div
          key={index}
          className="h-12 bg-gray-100 dark:bg-gray-800 rounded-lg mb-2"
        />
      ))}
    </div>
  );

  return (
    <div className={cn('w-full', className)}>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800">
              {selectable && (
                <th className="p-4">
                  <input
                    type="checkbox"
                    checked={selectedRows.length === filteredData.length}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-gray-300 dark:border-gray-600"
                  />
                </th>
              )}
              {columns.map((column, index) => (
                <th
                  key={index}
                  style={{ width: column.width }}
                  className={cn(
                    'p-4 text-left font-medium text-gray-600 dark:text-gray-300',
                    column.sortable && 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700'
                  )}
                  onClick={() => column.sortable && handleSort(column.field)}
                >
                  <div className="flex items-center space-x-2">
                    <span>{column.header}</span>
                    {column.sortable && (
                      <div className="flex flex-col">
                        {sortField === column.field ? (
                          sortDirection === 'asc' ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )
                        ) : (
                          <ArrowUpDown className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                    )}
                  </div>
                  {column.filterable && (
                    <div className="mt-2">
                      {column.renderFilter ? (
                        column.renderFilter(
                          filters[column.field],
                          (value) => setFilters(prev => ({ ...prev, [column.field]: value }))
                        )
                      ) : (
                        <input
                          type="text"
                          value={filters[column.field] || ''}
                          onChange={(e) => setFilters(prev => ({
                            ...prev,
                            [column.field]: e.target.value
                          }))}
                          className="w-full px-2 py-1 text-sm rounded border border-gray-300 dark:border-gray-600"
                          placeholder="Filtrer..."
                        />
                      )}
                    </div>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  className="p-4"
                >
                  <LoadingSkeleton />
                </td>
              </tr>
            ) : paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  className="p-4 text-center text-gray-500 dark:text-gray-400"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginatedData.map((row, rowIndex) => (
                <motion.tr
                  key={row.id || rowIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: rowIndex * 0.05 }}
                  className={cn(
                    'border-b border-gray-200 dark:border-gray-700',
                    'hover:bg-gray-50 dark:hover:bg-gray-800',
                    onRowClick && 'cursor-pointer',
                    rowClassName
                  )}
                  onClick={() => onRowClick?.(row)}
                >
                  {selectable && (
                    <td className="p-4">
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(row)}
                        onChange={(e) => handleSelectRow(row, e.target.checked)}
                        onClick={(e) => e.stopPropagation()}
                        className="rounded border-gray-300 dark:border-gray-600"
                      />
                    </td>
                  )}
                  {columns.map((column, colIndex) => (
                    <td
                      key={colIndex}
                      className="p-4 text-gray-900 dark:text-white"
                    >
                      {column.renderCell
                        ? column.renderCell(row)
                        : String(row[column.field])
                      }
                    </td>
                  ))}
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pagination && totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 px-4">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {`${(currentPage - 1) * pageSize + 1} - ${Math.min(currentPage * pageSize, sortedData.length)} sur ${sortedData.length}`}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className={cn(
                'p-2 rounded-lg',
                'hover:bg-gray-100 dark:hover:bg-gray-700',
                'disabled:opacity-50 disabled:cursor-not-allowed'
              )}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={cn(
                    'px-3 py-1 rounded-lg text-sm',
                    page === currentPage
                      ? 'bg-[#1E3A8A] text-white'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  )}
                >
                  {page}
                </button>
              ))}
            </div>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className={cn(
                'p-2 rounded-lg',
                'hover:bg-gray-100 dark:hover:bg-gray-700',
                'disabled:opacity-50 disabled:cursor-not-allowed'
              )}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataGrid;
