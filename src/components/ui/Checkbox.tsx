import { forwardRef, InputHTMLAttributes } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  description?: string;
  error?: string;
  indeterminate?: boolean;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, description, error, indeterminate, ...props }, ref) => {
    return (
      <div className="flex items-start">
        <div className="flex items-center h-5">
          <motion.div
            whileTap={{ scale: 0.9 }}
            className="relative"
          >
            <input
              type="checkbox"
              ref={ref}
              className="sr-only"
              {...props}
            />
            <motion.div
              initial={false}
              animate={{
                borderColor: props.checked || indeterminate
                  ? '#1E3A8A'
                  : error
                  ? '#EF4444'
                  : '#D1D5DB',
                backgroundColor: props.checked || indeterminate
                  ? '#1E3A8A'
                  : 'transparent'
              }}
              className={cn(
                'w-4 h-4 rounded',
                'border-2',
                'flex items-center justify-center',
                'transition-colors duration-200',
                props.disabled && 'opacity-50 cursor-not-allowed',
                error && !props.checked && 'border-red-500',
                'dark:border-gray-600',
                className
              )}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: props.checked || indeterminate ? 1 : 0 }}
                transition={{ duration: 0.2 }}
              >
                {indeterminate ? (
                  <div className="w-2 h-0.5 bg-white rounded-full" />
                ) : (
                  <Check className="w-3 h-3 text-white" />
                )}
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        {(label || description) && (
          <div className="ml-3">
            {label && (
              <label
                htmlFor={props.id}
                className={cn(
                  'text-sm font-medium text-gray-700 dark:text-gray-200',
                  props.disabled && 'opacity-50 cursor-not-allowed'
                )}
              >
                {label}
              </label>
            )}
            {description && (
              <p className={cn(
                'text-xs text-gray-500 dark:text-gray-400',
                props.disabled && 'opacity-50'
              )}>
                {description}
              </p>
            )}
          </div>
        )}

        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-1 text-sm text-red-500"
          >
            {error}
          </motion.p>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;
