import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChipProps {
  label: string;
  icon?: ReactNode;
  onDelete?: () => void;
  onClick?: () => void;
  variant?: 'default' | 'outlined' | 'filled';
  color?: 'primary' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
}

const Chip = ({
  label,
  icon,
  onDelete,
  onClick,
  variant = 'default',
  color = 'primary',
  size = 'md',
  disabled = false,
  className
}: ChipProps) => {
  const colors = {
    primary: {
      default: 'bg-[#1E3A8A]/10 text-[#1E3A8A]',
      outlined: 'border-[#1E3A8A] text-[#1E3A8A]',
      filled: 'bg-[#1E3A8A] text-white'
    },
    success: {
      default: 'bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-300',
      outlined: 'border-green-500 text-green-700 dark:border-green-400 dark:text-green-300',
      filled: 'bg-green-500 text-white'
    },
    warning: {
      default: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800/20 dark:text-yellow-300',
      outlined: 'border-yellow-500 text-yellow-700 dark:border-yellow-400 dark:text-yellow-300',
      filled: 'bg-yellow-500 text-white'
    },
    error: {
      default: 'bg-red-100 text-red-800 dark:bg-red-800/20 dark:text-red-300',
      outlined: 'border-red-500 text-red-700 dark:border-red-400 dark:text-red-300',
      filled: 'bg-red-500 text-white'
    },
    info: {
      default: 'bg-blue-100 text-blue-800 dark:bg-blue-800/20 dark:text-blue-300',
      outlined: 'border-blue-500 text-blue-700 dark:border-blue-400 dark:text-blue-300',
      filled: 'bg-blue-500 text-white'
    }
  };

  const sizes = {
    sm: 'text-xs px-2 py-0.5 rounded',
    md: 'text-sm px-3 py-1 rounded-lg',
    lg: 'text-base px-4 py-2 rounded-lg'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  return (
    <motion.div
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      className={cn(
        'inline-flex items-center gap-1.5',
        'font-medium',
        'transition-colors duration-200',
        variant === 'outlined' && 'border',
        colors[color][variant],
        sizes[size],
        onClick && !disabled && 'cursor-pointer',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      onClick={() => !disabled && onClick?.()}
    >
      {icon && (
        <span className={iconSizes[size]}>
          {icon}
        </span>
      )}
      
      {label}

      {onDelete && !disabled && (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className={cn(
            'ml-1 p-0.5 rounded-full',
            'hover:bg-black/10 dark:hover:bg-white/10',
            'focus:outline-none focus:ring-2 focus:ring-offset-1',
            variant === 'filled' ? 'focus:ring-white' : `focus:ring-${color}-500`
          )}
        >
          <X className={iconSizes[size]} />
        </motion.button>
      )}
    </motion.div>
  );
};

export const ChipGroup = ({
  children,
  spacing = 'normal',
  className
}: {
  children: ReactNode;
  spacing?: 'tight' | 'normal' | 'loose';
  className?: string;
}) => {
  const spacingClasses = {
    tight: 'gap-1',
    normal: 'gap-2',
    loose: 'gap-4'
  };

  return (
    <div className={cn('flex flex-wrap', spacingClasses[spacing], className)}>
      {children}
    </div>
  );
};

export default Chip;
