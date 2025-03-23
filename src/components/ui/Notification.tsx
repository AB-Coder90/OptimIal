import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

export type NotificationType = 'success' | 'error' | 'info';

interface NotificationProps {
  type: NotificationType;
  message: string;
  isOpen: boolean;
  onClose: () => void;
  duration?: number;
}

const Notification = ({
  type,
  message,
  isOpen,
  onClose,
  duration = 5000,
}: NotificationProps) => {
  useEffect(() => {
    if (isOpen && duration) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [isOpen, duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'info':
        return <AlertCircle className="w-5 h-5 text-[#3B82F6]" />;
      default:
        return null;
    }
  };

  const getBorderColor = () => {
    switch (type) {
      case 'success':
        return 'border-green-500';
      case 'error':
        return 'border-red-500';
      case 'info':
        return 'border-[#3B82F6]';
      default:
        return 'border-gray-300';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-4 right-4 z-50"
        >
          <div
            className={`flex items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg border-l-4 ${getBorderColor()}`}
          >
            <div className="flex items-center space-x-3">
              {getIcon()}
              <p className="text-sm text-gray-700 dark:text-gray-200">{message}</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="ml-6 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
            >
              <X className="w-4 h-4" />
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Notification;
