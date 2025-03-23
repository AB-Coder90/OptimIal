import { motion } from 'framer-motion';

export const Spinner = () => (
  <div className="flex justify-center items-center">
    <motion.div
      className="w-6 h-6 border-2 border-[#1E3A8A] border-t-transparent rounded-full"
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    />
  </div>
);

export const CardSkeleton = () => (
  <div className="w-full p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 animate-pulse">
    <div className="flex items-center space-x-4">
      <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg" />
      <div className="flex-1 space-y-3">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
      </div>
    </div>
  </div>
);

export const TableRowSkeleton = () => (
  <div className="w-full p-4 flex items-center space-x-4 animate-pulse">
    <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded" />
    <div className="flex-1 space-y-2">
      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full" />
      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
    </div>
  </div>
);

export const TextSkeleton = () => (
  <div className="animate-pulse space-y-2">
    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
  </div>
);

interface LoadingOverlayProps {
  message?: string;
}

export const LoadingOverlay = ({ message = 'Chargement...' }: LoadingOverlayProps) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
  >
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 flex flex-col items-center space-y-4">
      <Spinner />
      <p className="text-gray-600 dark:text-gray-300">{message}</p>
    </div>
  </motion.div>
);

interface ProgressBarProps {
  progress: number;
  className?: string;
}

export const ProgressBar = ({ progress, className = '' }: ProgressBarProps) => (
  <div className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 ${className}`}>
    <motion.div
      className="bg-[#1E3A8A] h-full rounded-full"
      initial={{ width: 0 }}
      animate={{ width: `${progress}%` }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    />
  </div>
);

export const PageSkeleton = () => (
  <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
    <div className="animate-pulse space-y-8">
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  </div>
);
