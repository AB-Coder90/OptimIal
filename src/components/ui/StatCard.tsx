import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: LucideIcon;
}

const StatCard = ({ title, value, change, trend, icon: Icon }: StatCardProps) => {
  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-green-500';
      case 'down':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="p-2 bg-[#1E3A8A]/10 rounded-lg">
            <Icon className="w-6 h-6 text-[#1E3A8A]" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {title}
            </h3>
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">
              {value}
            </p>
          </div>
        </div>
        <div className={getTrendColor()}>
          {change}
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;
