import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CardProps {
  title?: string;
  subtitle?: string;
  icon?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  onClick?: () => void;
  className?: string;
  isLoading?: boolean;
  noPadding?: boolean;
}

const Card = ({
  title,
  subtitle,
  icon,
  children,
  footer,
  onClick,
  className,
  isLoading,
  noPadding = false
}: CardProps) => {
  if (isLoading) {
    return (
      <div className="w-full rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="animate-pulse space-y-4 p-6">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
          </div>
        </div>
      </div>
    );
  }

  const CardWrapper = onClick ? motion.button : motion.div;

  return (
    <CardWrapper
      whileHover={onClick ? { scale: 1.01 } : {}}
      whileTap={onClick ? { scale: 0.99 } : {}}
      onClick={onClick}
      className={cn(
        'w-full rounded-lg border border-gray-200 dark:border-gray-700',
        'bg-white dark:bg-gray-800',
        'overflow-hidden',
        onClick && 'cursor-pointer',
        className
      )}
    >
      {(title || subtitle || icon) && (
        <div className={cn('border-b border-gray-200 dark:border-gray-700',
          noPadding ? 'px-0' : 'px-6',
          'py-4'
        )}>
          <div className="flex items-center space-x-3">
            {icon && (
              <div className="flex-shrink-0 text-gray-400 dark:text-gray-500">
                {icon}
              </div>
            )}
            <div>
              {title && (
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      <div className={cn(noPadding ? 'p-0' : 'p-6')}>{children}</div>

      {footer && (
        <div className={cn(
          'border-t border-gray-200 dark:border-gray-700',
          noPadding ? 'px-0' : 'px-6',
          'py-4'
        )}>
          {footer}
        </div>
      )}
    </CardWrapper>
  );
};

export default Card;
