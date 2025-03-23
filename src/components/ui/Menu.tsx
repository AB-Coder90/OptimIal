import { ReactNode, useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MenuItem {
  label: string;
  icon?: ReactNode;
  onClick?: () => void;
  href?: string;
  disabled?: boolean;
  items?: MenuItem[];
}

interface MenuProps {
  items: MenuItem[];
  trigger: ReactNode;
  align?: 'left' | 'right';
  className?: string;
}

const Menu = ({
  items,
  trigger,
  align = 'left',
  className
}: MenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const MenuItem = ({ item, depth = 0 }: { item: MenuItem; depth?: number }) => {
    const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);

    const handleClick = () => {
      if (item.items) {
        setIsSubMenuOpen(!isSubMenuOpen);
      } else if (item.onClick) {
        item.onClick();
        setIsOpen(false);
      }
    };

    const content = (
      <motion.div
        whileHover={!item.disabled ? { backgroundColor: 'rgba(0, 0, 0, 0.05)' } : {}}
        className={cn(
          'flex items-center justify-between px-4 py-2',
          'text-sm text-gray-700 dark:text-gray-200',
          'hover:bg-gray-100 dark:hover:bg-gray-700',
          item.disabled && 'opacity-50 cursor-not-allowed',
          depth > 0 && 'pl-8'
        )}
        onClick={!item.disabled ? handleClick : undefined}
      >
        <div className="flex items-center space-x-2">
          {item.icon && <span className="w-5 h-5">{item.icon}</span>}
          <span>{item.label}</span>
        </div>
        {item.items && (
          <ChevronRight
            className={cn(
              'w-4 h-4 transition-transform',
              isSubMenuOpen && 'transform rotate-90'
            )}
          />
        )}
      </motion.div>
    );

    return (
      <>
        {item.href ? (
          <a
            href={item.href}
            className={item.disabled ? 'pointer-events-none' : ''}
          >
            {content}
          </a>
        ) : (
          content
        )}
        {item.items && isSubMenuOpen && (
          <div className="pl-4">
            {item.items.map((subItem, index) => (
              <MenuItem key={index} item={subItem} depth={depth + 1} />
            ))}
          </div>
        )}
      </>
    );
  };

  return (
    <div className="relative inline-block" ref={menuRef}>
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className="cursor-pointer"
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
            className={cn(
              'absolute z-50 mt-2',
              'min-w-[200px]',
              'bg-white dark:bg-gray-800',
              'rounded-lg shadow-lg',
              'border border-gray-200 dark:border-gray-700',
              'overflow-hidden',
              align === 'left' ? 'left-0' : 'right-0',
              className
            )}
          >
            {items.map((item, index) => (
              <MenuItem key={index} item={item} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Menu;
