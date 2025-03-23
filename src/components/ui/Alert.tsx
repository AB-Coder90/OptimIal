import { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle, XCircle, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AlertProps {
  type?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  children: ReactNode;
  onClose?: () => void;
  className?: string;
  withIcon?: boolean;
}

const Alert = ({
  type = 'info',
  title,
  children,
  onClose,
  className,
  withIcon = true
}: AlertProps) => {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5" />;
      case 'error':
        return <XCircle className="w-5 h-5" />;
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  const getStyles = () => {
    switch (type) {
      case 'success':
        return {
          wrapper: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
          icon: 'text-green-500 dark:text-green-400',
          title: 'text-green-800 dark:text-green-300',
          content: 'text-green-700 dark:text-green-200'
        };
      case 'warning':
        return {
          wrapper: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
          icon: 'text-yellow-500 dark:text-yellow-400',
          title: 'text-yellow-800 dark:text-yellow-300',
          content: 'text-yellow-700 dark:text-yellow-200'
        };
      case 'error':
        return {
          wrapper: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
          icon: 'text-red-500 dark:text-red-400',
          title: 'text-red-800 dark:text-red-300',
          content: 'text-red-700 dark:text-red-200'
        };
      default:
        return {
          wrapper: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
          icon: 'text-blue-500 dark:text-blue-400',
          title: 'text-blue-800 dark:text-blue-300',
          content: 'text-blue-700 dark:text-blue-200'
        };
    }
  };

  const styles = getStyles();

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className={cn(
          'relative rounded-lg border p-4',
          styles.wrapper,
          className
        )}
      >
        <div className="flex">
          {withIcon && (
            <div className={cn('flex-shrink-0', styles.icon)}>
              {getIcon()}
            </div>
          )}
          <div className={cn('flex-1', withIcon && 'ml-3')}>
            {title && (
              <h3 className={cn('text-sm font-medium', styles.title)}>
                {title}
              </h3>
            )}
            <div className={cn('text-sm mt-1', styles.content)}>{children}</div>
          </div>
          {onClose && (
            <div className="flex-shrink-0 ml-3">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className={cn(
                  'inline-flex rounded-md p-1.5',
                  'hover:bg-white dark:hover:bg-gray-800',
                  'focus:outline-none focus:ring-2 focus:ring-offset-2',
                  styles.content
                )}
              >
                <span className="sr-only">Fermer</span>
                <X className="w-4 h-4" />
              </motion.button>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Alert;
