import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  className,
  size = 'md'
}: PaginationProps) => {
  const sizes = {
    sm: 'h-8 w-8 text-sm',
    md: 'h-10 w-10',
    lg: 'h-12 w-12 text-lg'
  };

  const range = (start: number, end: number) => {
    const length = end - start + 1;
    return Array.from({ length }, (_, idx) => idx + start);
  };

  const getPageNumbers = () => {
    const totalNumbers = siblingCount * 2 + 3;
    const totalBlocks = totalNumbers + 2;

    if (totalPages <= totalBlocks) {
      return range(1, totalPages);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 1;

    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * siblingCount;
      const leftRange = range(1, leftItemCount);
      return [...leftRange, -1, totalPages];
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2 * siblingCount;
      const rightRange = range(totalPages - rightItemCount + 1, totalPages);
      return [1, -1, ...rightRange];
    }

    const middleRange = range(leftSiblingIndex, rightSiblingIndex);
    return [1, -1, ...middleRange, -1, totalPages];
  };

  const pages = getPageNumbers();

  const PageButton = ({ page }: { page: number }) => (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => onPageChange(page)}
      className={cn(
        'flex items-center justify-center rounded-lg',
        'transition-colors duration-200',
        'focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:ring-offset-2',
        page === currentPage
          ? 'bg-[#1E3A8A] text-white'
          : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700',
        sizes[size]
      )}
    >
      {page}
    </motion.button>
  );

  const NavigationButton = ({
    onClick,
    disabled,
    children
  }: {
    onClick: () => void;
    disabled: boolean;
    children: React.ReactNode;
  }) => (
    <motion.button
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'flex items-center justify-center rounded-lg',
        'transition-colors duration-200',
        'focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:ring-offset-2',
        disabled
          ? 'opacity-50 cursor-not-allowed'
          : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700',
        sizes[size]
      )}
    >
      {children}
    </motion.button>
  );

  return (
    <nav
      className={cn('flex items-center justify-center space-x-2', className)}
      aria-label="Pagination"
    >
      <NavigationButton
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="w-5 h-5" />
      </NavigationButton>

      <div className="flex items-center space-x-2">
        {pages.map((page, index) =>
          page === -1 ? (
            <MoreHorizontal
              key={index}
              className="w-5 h-5 text-gray-400 dark:text-gray-600"
            />
          ) : (
            <PageButton key={index} page={page} />
          )
        )}
      </div>

      <NavigationButton
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <ChevronRight className="w-5 h-5" />
      </NavigationButton>
    </nav>
  );
};

export default Pagination;
