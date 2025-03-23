import { Fragment, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: ReactNode;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  homeHref?: string;
  className?: string;
  separator?: ReactNode;
}

const Breadcrumbs = ({
  items,
  homeHref = '/',
  className,
  separator = <ChevronRight className="w-4 h-4" />
}: BreadcrumbsProps) => {
  return (
    <nav className={cn('flex', className)} aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {/* Home */}
        <li>
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href={homeHref}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <Home className="w-5 h-5" />
            <span className="sr-only">Accueil</span>
          </motion.a>
        </li>

        {items.map((item, index) => (
          <Fragment key={index}>
            {/* Separator */}
            <li className="text-gray-400 dark:text-gray-600 flex items-center">
              {separator}
            </li>

            {/* Item */}
            <li>
              {item.href ? (
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href={item.href}
                  className={cn(
                    'flex items-center text-sm',
                    index === items.length - 1
                      ? 'text-gray-700 dark:text-gray-200 font-medium'
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                  )}
                >
                  {item.icon && (
                    <span className="mr-2">{item.icon}</span>
                  )}
                  {item.label}
                </motion.a>
              ) : (
                <span
                  className={cn(
                    'flex items-center text-sm',
                    'text-gray-700 dark:text-gray-200',
                    index === items.length - 1 && 'font-medium'
                  )}
                >
                  {item.icon && (
                    <span className="mr-2">{item.icon}</span>
                  )}
                  {item.label}
                </span>
              )}
            </li>
          </Fragment>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
