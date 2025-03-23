import { ReactNode, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AccordionItem {
  id: string;
  title: string;
  content: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
}

interface AccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
  defaultExpanded?: string[];
  className?: string;
  variant?: 'default' | 'bordered' | 'separated';
}

const Accordion = ({
  items,
  allowMultiple = false,
  defaultExpanded = [],
  className,
  variant = 'default'
}: AccordionProps) => {
  const [expandedItems, setExpandedItems] = useState<string[]>(defaultExpanded);

  const toggleItem = (itemId: string) => {
    if (allowMultiple) {
      setExpandedItems((prev) =>
        prev.includes(itemId)
          ? prev.filter((id) => id !== itemId)
          : [...prev, itemId]
      );
    } else {
      setExpandedItems((prev) =>
        prev.includes(itemId) ? [] : [itemId]
      );
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'bordered':
        return 'border border-gray-200 dark:border-gray-700 rounded-lg divide-y divide-gray-200 dark:divide-gray-700';
      case 'separated':
        return 'space-y-2';
      default:
        return 'divide-y divide-gray-200 dark:divide-gray-700';
    }
  };

  return (
    <div
      className={cn(
        'w-full',
        getVariantStyles(),
        className
      )}
    >
      {items.map((item) => (
        <div
          key={item.id}
          className={cn(
            variant === 'separated' && 'border border-gray-200 dark:border-gray-700 rounded-lg'
          )}
        >
          <motion.button
            whileHover={!item.disabled ? { backgroundColor: 'rgba(0, 0, 0, 0.02)' } : {}}
            onClick={() => !item.disabled && toggleItem(item.id)}
            className={cn(
              'flex items-center justify-between w-full',
              'px-4 py-3 text-left',
              'text-gray-900 dark:text-white',
              item.disabled && 'opacity-50 cursor-not-allowed',
              variant === 'separated' && 'rounded-lg'
            )}
          >
            <div className="flex items-center space-x-3">
              {item.icon && (
                <span className="flex-shrink-0 text-gray-400 dark:text-gray-500">
                  {item.icon}
                </span>
              )}
              <span className="font-medium">{item.title}</span>
            </div>
            <motion.div
              animate={{ rotate: expandedItems.includes(item.id) ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="w-5 h-5 text-gray-400 dark:text-gray-500" />
            </motion.div>
          </motion.button>

          <AnimatePresence initial={false}>
            {expandedItems.includes(item.id) && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className={cn(
                  'px-4 py-3',
                  'text-gray-700 dark:text-gray-200',
                  variant === 'separated' && 'border-t border-gray-200 dark:border-gray-700'
                )}>
                  {item.content}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
};

export default Accordion;
