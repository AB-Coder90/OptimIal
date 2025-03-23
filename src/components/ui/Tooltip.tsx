import { useState, useRef, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  position?: 'top' | 'right' | 'bottom' | 'left';
  delay?: number;
  className?: string;
}

const Tooltip = ({
  content,
  children,
  position = 'top',
  delay = 200,
  className
}: TooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const showTooltip = () => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  const getPosition = () => {
    switch (position) {
      case 'top':
        return {
          initial: { opacity: 0, y: 10 },
          animate: { opacity: 1, y: 0 },
          className: 'bottom-full left-1/2 -translate-x-1/2 mb-2'
        };
      case 'right':
        return {
          initial: { opacity: 0, x: -10 },
          animate: { opacity: 1, x: 0 },
          className: 'left-full top-1/2 -translate-y-1/2 ml-2'
        };
      case 'bottom':
        return {
          initial: { opacity: 0, y: -10 },
          animate: { opacity: 1, y: 0 },
          className: 'top-full left-1/2 -translate-x-1/2 mt-2'
        };
      case 'left':
        return {
          initial: { opacity: 0, x: 10 },
          animate: { opacity: 1, x: 0 },
          className: 'right-full top-1/2 -translate-y-1/2 mr-2'
        };
    }
  };

  const positionConfig = getPosition();

  return (
    <div
      className="relative inline-block"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={positionConfig.initial}
            animate={positionConfig.animate}
            exit={positionConfig.initial}
            transition={{ duration: 0.2 }}
            className={cn(
              'absolute z-50 px-2 py-1',
              'bg-gray-900 dark:bg-gray-700',
              'text-white text-sm rounded-lg',
              'whitespace-nowrap',
              positionConfig.className,
              className
            )}
          >
            {content}
            <div
              className={cn(
                'absolute w-2 h-2 bg-gray-900 dark:bg-gray-700 transform rotate-45',
                position === 'top' && 'bottom-[-4px] left-1/2 -translate-x-1/2',
                position === 'right' && 'left-[-4px] top-1/2 -translate-y-1/2',
                position === 'bottom' && 'top-[-4px] left-1/2 -translate-x-1/2',
                position === 'left' && 'right-[-4px] top-1/2 -translate-y-1/2'
              )}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Tooltip;
