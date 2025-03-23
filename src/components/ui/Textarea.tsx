import { forwardRef, TextareaHTMLAttributes } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  isLoading?: boolean;
  resizable?: boolean;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, isLoading, resizable = true, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={props.id}
            className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <motion.textarea
            ref={ref}
            whileFocus={{ scale: 1.01 }}
            className={cn(
              'block w-full rounded-lg',
              'border border-gray-300 dark:border-gray-600',
              'bg-white dark:bg-gray-800',
              'text-gray-900 dark:text-white',
              'placeholder:text-gray-400 dark:placeholder:text-gray-500',
              'focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              !resizable && 'resize-none',
              'min-h-[80px] p-3',
              error && 'border-red-500 focus:ring-red-500',
              className
            )}
            disabled={isLoading}
            {...props}
          />

          {isLoading && (
            <div className="absolute bottom-3 right-3 pointer-events-none">
              <motion.div
                className="w-4 h-4 border-2 border-[#1E3A8A] border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            </div>
          )}
        </div>

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

Textarea.displayName = 'Textarea';

export default Textarea;
