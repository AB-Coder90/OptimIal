import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

interface BadgeProps extends Omit<HTMLMotionProps<'span'>, 'children'> {
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md' | 'lg';
  withDot?: boolean;
  children: React.ReactNode;
}

const Badge = ({
  className,
  variant = 'default',
  size = 'md',
  withDot = false,
  children,
  ...props
}: BadgeProps) => {
  const variants = {
    default: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    primary: 'bg-[#1E3A8A] text-white',
    success: 'bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100',
    warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-100',
    error: 'bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-100',
    info: 'bg-blue-100 text-blue-800 dark:bg-blue-700 dark:text-blue-100'
  };

  const sizes = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5'
  };

  const dotColors = {
    default: 'bg-gray-500 dark:bg-gray-400',
    primary: 'bg-white',
    success: 'bg-green-500 dark:bg-green-300',
    warning: 'bg-yellow-500 dark:bg-yellow-300',
    error: 'bg-red-500 dark:bg-red-300',
    info: 'bg-blue-500 dark:bg-blue-300'
  };

  return (
    <motion.span
      whileHover={{ scale: 1.05 }}
      className={cn(
        'inline-flex items-center font-medium rounded-full',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {withDot && (
        <span
          className={cn(
            'w-1.5 h-1.5 rounded-full mr-1.5',
            dotColors[variant]
          )}
        />
      )}
      {children}
    </motion.span>
  );
};

export default Badge;
