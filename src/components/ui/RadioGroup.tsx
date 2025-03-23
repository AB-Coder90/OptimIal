import { forwardRef, InputHTMLAttributes } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface RadioOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

type Size = 'sm' | 'md' | 'lg';

type RadioGroupProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange' | 'value'> & {
  options: RadioOption[];
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  orientation?: 'horizontal' | 'vertical';
  size?: Size;
};

const sizes: Record<Size, string> = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6'
};

const labelSizes: Record<Size, string> = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg'
};

const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(
  ({ 
    options, 
    value, 
    onChange, 
    error, 
    orientation = 'vertical', 
    size = 'md',
    className, 
    ...props 
  }, ref) => {
    const handleChange = (optionValue: string) => {
      if (!props.disabled) {
        onChange?.(optionValue);
      }
    };

    return (
      <div
        ref={ref}
        className={cn(
          'w-full',
          orientation === 'horizontal' ? 'flex flex-wrap gap-6' : 'flex flex-col gap-3',
          className
        )}
        {...props}
      >
        {options.map((option) => (
          <motion.label
            key={option.value}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              'flex items-start gap-3 cursor-pointer select-none',
              (option.disabled || props.disabled) && 'opacity-50 cursor-not-allowed'
            )}
          >
            <div className="relative flex items-center">
              <input
                type="radio"
                checked={value === option.value}
                onChange={() => handleChange(option.value)}
                disabled={option.disabled || props.disabled}
                className={cn(
                  'form-radio border-2 border-gray-300 dark:border-gray-600',
                  'text-[#1E3A8A] focus:ring-[#1E3A8A]',
                  'transition-colors duration-200',
                  sizes[size as Size]
                )}
              />
            </div>
            <div className="flex flex-col">
              <span className={cn(
                'font-medium text-gray-900 dark:text-white',
                labelSizes[size as Size]
              )}>
                {option.label}
              </span>
              {option.description && (
                <span className={cn(
                  'text-gray-500 dark:text-gray-400',
                  size === 'sm' ? 'text-xs' : 'text-sm'
                )}>
                  {option.description}
                </span>
              )}
            </div>
          </motion.label>
        ))}
        {error && (
          <div className="mt-1 text-sm text-red-500 dark:text-red-400">
            {error}
          </div>
        )}
      </div>
    );
  }
);

RadioGroup.displayName = 'RadioGroup';

export default RadioGroup;
