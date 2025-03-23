import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Toggle = ({
  checked,
  onChange,
  label,
  disabled = false,
  size = 'md',
  className
}: ToggleProps) => {
  const sizes = {
    sm: {
      toggle: 'w-8 h-4',
      circle: 'w-3 h-3',
      translate: 'translate-x-4',
      label: 'text-sm'
    },
    md: {
      toggle: 'w-11 h-6',
      circle: 'w-5 h-5',
      translate: 'translate-x-5',
      label: 'text-base'
    },
    lg: {
      toggle: 'w-14 h-8',
      circle: 'w-7 h-7',
      translate: 'translate-x-6',
      label: 'text-lg'
    }
  };

  return (
    <label className={cn('flex items-center', className)}>
      <motion.button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => !disabled && onChange(!checked)}
        className={cn(
          'relative inline-flex flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent',
          'transition-colors duration-200 ease-in-out',
          'focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:ring-offset-2',
          checked ? 'bg-[#1E3A8A]' : 'bg-gray-200 dark:bg-gray-700',
          disabled && 'opacity-50 cursor-not-allowed',
          sizes[size].toggle
        )}
      >
        <motion.span
          animate={{
            x: checked ? sizes[size].translate : 0
          }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className={cn(
            'pointer-events-none inline-block transform rounded-full bg-white shadow ring-0',
            'transition duration-200 ease-in-out',
            'translate-x-0',
            sizes[size].circle
          )}
        />
      </motion.button>
      {label && (
        <span
          className={cn(
            'ml-3 text-gray-700 dark:text-gray-200',
            disabled && 'opacity-50',
            sizes[size].label
          )}
        >
          {label}
        </span>
      )}
    </label>
  );
};

export default Toggle;
