import { useState, useRef, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface DropdownItem {
  label: string;
  value: string;
  icon?: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

interface DropdownProps {
  trigger: ReactNode;
  items: DropdownItem[];
  align?: 'left' | 'right';
  width?: number;
  className?: string;
}

const Dropdown = ({
  trigger,
  items,
  align = 'left',
  width = 200,
  className
}: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <motion.div
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn('cursor-pointer', className)}
      >
        {trigger}
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            style={{
              width,
              [align === 'right' ? 'right' : 'left']: 0
            }}
            className="absolute z-50 mt-2 py-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
          >
            {items.map((item) => (
              <motion.button
                key={item.value}
                whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}
                onClick={() => {
                  if (!item.disabled && item.onClick) {
                    item.onClick();
                    setIsOpen(false);
                  }
                }}
                className={cn(
                  'flex items-center w-full px-4 py-2 text-sm text-left',
                  item.disabled
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700',
                )}
                disabled={item.disabled}
              >
                {item.icon && <span className="mr-2">{item.icon}</span>}
                {item.label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dropdown;
