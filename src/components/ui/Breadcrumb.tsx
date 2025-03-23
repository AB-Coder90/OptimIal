import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: ReactNode;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  separator?: ReactNode;
  showHome?: boolean;
  maxItems?: number;
  className?: string;
}

const Breadcrumb = ({
  items,
  separator,
  showHome = true,
  maxItems = 0,
  className
}: BreadcrumbProps) => {
  let displayedItems = [...items];

  // Handle maxItems truncation
  if (maxItems > 0 && items.length > maxItems) {
    const keepAtStart = Math.ceil(maxItems / 2);
    const keepAtEnd = Math.floor(maxItems / 2);
    displayedItems = [
      ...items.slice(0, keepAtStart),
      { label: '...' },
      ...items.slice(items.length - keepAtEnd)
    ];
  }

  const defaultSeparator = (
    <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-500" />
  );

  const BreadcrumbLink = ({ item, isLast }: { item: BreadcrumbItem; isLast: boolean }) => {
    const content = (
      <div className="flex items-center">
        {item.icon && (
          <span className="mr-2">
            {item.icon}
          </span>
        )}
        <span
          className={cn(
            'text-sm',
            isLast
              ? 'font-medium text-gray-900 dark:text-white'
              : 'text-gray-500 dark:text-gray-400'
          )}
        >
          {item.label}
        </span>
      </div>
    );

    if (item.href && !isLast) {
      return (
        <motion.a
          href={item.href}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={cn(
            'hover:text-[#1E3A8A] dark:hover:text-[#3B82F6]',
            'transition-colors duration-200'
          )}
        >
          {content}
        </motion.a>
      );
    }

    return content;
  };

  return (
    <nav
      className={cn(
        'flex items-center space-x-2',
        className
      )}
      aria-label="Breadcrumb"
    >
      {showHome && (
        <>
          <motion.a
            href="/"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={cn(
              'p-1 rounded-lg',
              'text-gray-400 hover:text-[#1E3A8A]',
              'dark:text-gray-500 dark:hover:text-[#3B82F6]',
              'transition-colors duration-200'
            )}
          >
            <Home className="w-5 h-5" />
          </motion.a>
          <span className="flex items-center">
            {separator || defaultSeparator}
          </span>
        </>
      )}

      {displayedItems.map((item, index) => (
        <div
          key={index}
          className="flex items-center"
        >
          <BreadcrumbLink
            item={item}
            isLast={index === displayedItems.length - 1}
          />
          {index < displayedItems.length - 1 && (
            <span className="ml-2 flex items-center">
              {separator || defaultSeparator}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
};

export const BreadcrumbWithDropdown = ({
  items,
  dropdownItems,
  trigger,
  className
}: {
  items: BreadcrumbItem[];
  dropdownItems: BreadcrumbItem[];
  trigger?: ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn('flex items-center', className)}>
      <Breadcrumb items={items} />
      {dropdownItems.length > 0 && (
        <div className="ml-4">
          {trigger || (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                'px-3 py-1 text-sm rounded-lg',
                'bg-gray-100 dark:bg-gray-800',
                'text-gray-600 dark:text-gray-300',
                'hover:bg-gray-200 dark:hover:bg-gray-700',
                'focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:ring-offset-2'
              )}
            >
              Plus d'options
            </motion.button>
          )}
        </div>
      )}
    </div>
  );
};

export default Breadcrumb;
