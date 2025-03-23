import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number;
  max?: number;
  showValue?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'success' | 'warning' | 'error';
  animated?: boolean;
  className?: string;
}

const ProgressBar = ({
  value,
  max = 100,
  showValue = false,
  size = 'md',
  color = 'primary',
  animated = true,
  className
}: ProgressBarProps) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const sizes = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  };

  const colors = {
    primary: 'bg-[#1E3A8A]',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-500'
  };

  return (
    <div className={cn('w-full', className)}>
      <div className="flex items-center justify-between mb-1">
        {showValue && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm font-medium text-gray-700 dark:text-gray-200"
          >
            {percentage.toFixed(0)}%
          </motion.span>
        )}
      </div>

      <div
        className={cn(
          'w-full rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden',
          sizes[size]
        )}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{
            duration: animated ? 0.6 : 0,
            ease: 'easeInOut'
          }}
          className={cn(
            'h-full rounded-full',
            colors[color],
            animated && 'transition-all duration-300 ease-in-out'
          )}
        >
          {animated && (
            <div className="absolute inset-0 overflow-hidden">
              <motion.div
                animate={{
                  x: ['0%', '100%'],
                  opacity: [0.1, 0.2, 0.1]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'linear'
                }}
                className="w-full h-full bg-white/20 transform -skew-x-12"
              />
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

interface CircularProgressProps extends Omit<ProgressBarProps, 'size'> {
  size?: number;
  strokeWidth?: number;
}

export const CircularProgress = ({
  value,
  max = 100,
  showValue = false,
  size = 40,
  strokeWidth = 4,
  color = 'primary',
  animated = true,
  className
}: CircularProgressProps) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  const colors = {
    primary: 'stroke-[#1E3A8A]',
    success: 'stroke-green-500',
    warning: 'stroke-yellow-500',
    error: 'stroke-red-500'
  };

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg
        className="transform -rotate-90"
        width={size}
        height={size}
      >
        {/* Background circle */}
        <circle
          className="stroke-gray-200 dark:stroke-gray-700 fill-none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <motion.circle
          className={cn(
            'fill-none',
            colors[color]
          )}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{
            duration: animated ? 0.6 : 0,
            ease: 'easeInOut'
          }}
        />
      </svg>
      {showValue && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute text-xs font-medium text-gray-700 dark:text-gray-200"
        >
          {percentage.toFixed(0)}%
        </motion.span>
      )}
    </div>
  );
};

export default ProgressBar;
