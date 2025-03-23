import { useState, useMemo } from 'react';
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

const DataGrid = <T extends Record<string, any>>({
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
  const [selectedRows, setSelectedRows] = useState<T[]>([]);
  const [sortConfig, setSortConfig] = useState<{ field: keyof T; direction: 'asc' | 'desc' } | null>(null);
  const [filters, setFilters] = useState<Record<keyof T, any>>({} as Record<keyof T, any>);
  const [currentPage, setCurrentPage] = useState(1);

  // Filtrage
  const filteredData = useMemo(() => {
    return data.filter(row => {
      return Object.entries(filters).every(([field, value]) => {
        if (!value) return true;
        const fieldValue = row[field];
        if (typeof fieldValue === 'string') {
          return fieldValue.toLowerCase().includes(value.toLowerCase());
        }
        return fieldValue === value;
      });
    });
  }, [data, filters]);

  // Tri
  const sortedData = useMemo(() => {
    if (!sortConfig) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.field];
      const bValue = b[sortConfig.field];

      if (aValue === bValue) return 0;
      
      const direction = sortConfig.direction === 'asc' ? 1 : -1;
      return aValue > bValue ? direction : -direction;
    });
  }, [filteredData, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(sortedData.length / pageSize);
  const paginatedData = pagination
    ? sortedData.slice((currentPage - 1) * pageSize, currentPage * pageSize)
    : sortedData;

  const handleSort = (field: keyof T) => {
    setSortConfig(current => {
      if (current?.field === field) {
        if (current.direction === 'asc') {
          return { field, direction: 'desc' };
        }
        return null;
      }
      return { field, direction: 'asc' };
    });
  };

  const handleSelectAll = (checked: boolean) => {
    const newSelectedRows = checked ? [...paginatedData] : [];
    setSelectedRows(newSelectedRows);
    onSelectionChange?.(newSelectedRows);
  };

  const handleSelectRow = (row: T) => {
    const newSelectedRows = selectedRows.includes(row)
      ? selectedRows.filter(r => r !== row)
      : [...selectedRows, row];
    setSelectedRows(newSelectedRows);
    onSelectionChange?.(newSelectedRows);
  };

  const handleRowClick = (row: T) => {
    if (onRowClick) {
      onRowClick(row);
    }
  };

  return (
    <div className={cn('w-full overflow-x-auto', className)}>
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            {selectable && (
              <th className="px-6 py-3 w-4">
                <input
                  type="checkbox"
                  checked={selectedRows.length === paginatedData.length}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="rounded border-gray-300 dark:border-gray-600"
                />
              </th>
            )}
            {columns.map((column) => (
              <th
                key={String(column.field)}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                style={{ width: column.width }}
              >
                <div className="flex items-center space-x-2">
                  <span>{column.header}</span>
                  {column.sortable && (
                    <button
                      onClick={() => handleSort(column.field)}
                      className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    >
                      {sortConfig?.field === column.field ? (
                        sortConfig.direction === 'asc' ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )
                      ) : (
                        <ArrowUpDown className="w-4 h-4" />
                      )}
                    </button>
                  )}
                </div>
                {column.filterable && (
                  <div className="mt-2">
                    {column.renderFilter ? (
                      column.renderFilter(
                        filters[column.field as string],
                        (value) => setFilters(prev => ({ ...prev, [column.field]: value }))
                      )
                    ) : (
                      <input
                        type="text"
                        value={filters[column.field as string] || ''}
                        onChange={(e) => setFilters(prev => ({
                          ...prev,
                          [column.field]: e.target.value
                        }))}
                        className="w-full px-2 py-1 text-sm rounded border border-gray-300 dark:border-gray-600"
                        placeholder={`Filtrer par ${column.header.toLowerCase()}`}
                      />
                    )}
                  </div>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          {loading ? (
            <tr>
              <td
                colSpan={selectable ? columns.length + 1 : columns.length}
                className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400"
              >
                Chargement...
              </td>
            </tr>
          ) : paginatedData.length === 0 ? (
            <tr>
              <td
                colSpan={selectable ? columns.length + 1 : columns.length}
                className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            paginatedData.map((row, rowIndex) => (
              <motion.tr
                key={rowIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: rowIndex * 0.05 }}
                onClick={() => handleRowClick(row)}
                className={cn(
                  'hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer',
                  rowClassName
                )}
              >
                {selectable && (
                  <td className="px-6 py-4 whitespace-nowrap w-4">
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(row)}
                      onChange={() => handleSelectRow(row)}
                      onClick={(e) => e.stopPropagation()}
                      className="rounded border-gray-300 dark:border-gray-600"
                    />
                  </td>
                )}
                {columns.map((column) => (
                  <td
                    key={String(column.field)}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100"
                  >
                    {column.renderCell ? column.renderCell(row) : row[column.field]}
                  </td>
                ))}
              </motion.tr>
            ))
          )}
        </tbody>
      </table>

      {pagination && totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-3 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Page {currentPage} sur {totalPages}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(page => Math.max(1, page - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setCurrentPage(page => Math.min(totalPages, page + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50"
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
