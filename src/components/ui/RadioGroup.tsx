import { forwardRef, InputHTMLAttributes } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface RadioOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

interface RadioGroupProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  options: RadioOption[];
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  orientation?: 'horizontal' | 'vertical';
}

const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(
  ({ options, value, onChange, error, orientation = 'vertical', className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          orientation === 'horizontal' ? 'flex space-x-6' : 'space-y-3',
          className
        )}
      >
        {options.map((option) => (
          <motion.div
            key={option.value}
            whileTap={!option.disabled ? { scale: 0.98 } : undefined}
            className={cn(
              'relative flex items-start',
              option.disabled && 'opacity-50 cursor-not-allowed'
            )}
          >
            <div className="flex items-center h-5">
              <input
                type="radio"
                id={option.value}
                value={option.value}
                checked={value === option.value}
                onChange={(e) => onChange?.(e.target.value)}
                disabled={option.disabled || props.disabled}
                className="sr-only"
                {...props}
              />
              <motion.div
                initial={false}
                animate={{
                  borderColor: value === option.value
                    ? '#1E3A8A'
                    : error
                    ? '#EF4444'
                    : '#D1D5DB',
                  backgroundColor: 'transparent'
                }}
                className={cn(
                  'w-4 h-4 rounded-full',
                  'border-2',
                  'flex items-center justify-center',
                  'transition-colors duration-200',
                  'dark:border-gray-600'
                )}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: value === option.value ? 1 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="w-2 h-2 rounded-full bg-[#1E3A8A]"
                />
              </motion.div>
            </div>

            <div className="ml-3">
              <label
                htmlFor={option.value}
                className={cn(
                  'text-sm font-medium text-gray-700 dark:text-gray-200',
                  (option.disabled || props.disabled) && 'cursor-not-allowed'
                )}
              >
                {option.label}
              </label>
              {option.description && (
                <p className={cn(
                  'text-xs text-gray-500 dark:text-gray-400',
                  (option.disabled || props.disabled) && 'opacity-50'
                )}>
                  {option.description}
                </p>
              )}
            </div>
          </motion.div>
        ))}

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

RadioGroup.displayName = 'RadioGroup';

export default RadioGroup;
