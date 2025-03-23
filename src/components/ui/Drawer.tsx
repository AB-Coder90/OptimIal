import { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  position?: 'left' | 'right' | 'top' | 'bottom';
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showCloseButton?: boolean;
  overlay?: boolean;
  className?: string;
}

const Drawer = ({
  isOpen,
  onClose,
  children,
  position = 'right',
  size = 'md',
  showCloseButton = true,
  overlay = true,
  className
}: DrawerProps) => {
  const getSizeClass = () => {
    switch (position) {
      case 'left':
      case 'right':
        switch (size) {
          case 'sm': return 'w-64';
          case 'md': return 'w-80';
          case 'lg': return 'w-96';
          case 'xl': return 'w-[32rem]';
          case 'full': return 'w-screen';
        }
      case 'top':
      case 'bottom':
        switch (size) {
          case 'sm': return 'h-32';
          case 'md': return 'h-48';
          case 'lg': return 'h-64';
          case 'xl': return 'h-96';
          case 'full': return 'h-screen';
        }
    }
  };

  const getPositionClass = () => {
    switch (position) {
      case 'left': return 'left-0 top-0 h-full';
      case 'right': return 'right-0 top-0 h-full';
      case 'top': return 'top-0 left-0 w-full';
      case 'bottom': return 'bottom-0 left-0 w-full';
    }
  };

  const getAnimation = () => {
    switch (position) {
      case 'left':
        return {
          initial: { x: '-100%' },
          animate: { x: 0 },
          exit: { x: '-100%' }
        };
      case 'right':
        return {
          initial: { x: '100%' },
          animate: { x: 0 },
          exit: { x: '100%' }
        };
      case 'top':
        return {
          initial: { y: '-100%' },
          animate: { y: 0 },
          exit: { y: '-100%' }
        };
      case 'bottom':
        return {
          initial: { y: '100%' },
          animate: { y: 0 },
          exit: { y: '100%' }
        };
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          {overlay && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            />
          )}

          {/* Drawer */}
          <motion.div
            {...getAnimation()}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className={cn(
              'fixed z-50',
              'bg-white dark:bg-gray-800',
              'flex flex-col',
              getPositionClass(),
              getSizeClass(),
              className
            )}
          >
            {showCloseButton && (
              <div className="absolute top-4 right-4">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>
            )}

            <div className="flex-1 overflow-y-auto p-6">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Drawer;
