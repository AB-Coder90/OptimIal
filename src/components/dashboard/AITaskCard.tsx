import { motion } from 'framer-motion';
import { Clock, Check, Edit2, Calendar } from 'lucide-react';

interface AITaskCardProps {
  task: {
    title: string;
    suggestedTime: string;
    priority: 'high' | 'medium' | 'low';
  };
  onAccept: () => void;
  onModify: () => void;
  onSchedule: () => void;
}

const AITaskCard = ({ task, onAccept, onModify, onSchedule }: AITaskCardProps) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300';
      case 'medium':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'low':
        return 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
            Tâche recommandée par l'IA
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-3">{task.title}</p>
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
            <Clock className="w-4 h-4 mr-1" />
            <span>Suggéré à {task.suggestedTime}</span>
          </div>
          <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2 mt-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onAccept}
          className="flex items-center justify-center px-3 py-2 bg-[#1E3A8A] text-white rounded-md text-sm font-medium hover:bg-[#1E40AF] transition-colors"
        >
          <Check className="w-4 h-4 mr-2" />
          Accepter
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onModify}
          className="flex items-center justify-center px-3 py-2 bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200 rounded-md text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          <Edit2 className="w-4 h-4 mr-2" />
          Modifier
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onSchedule}
          className="flex items-center justify-center px-3 py-2 bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200 rounded-md text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          <Calendar className="w-4 h-4 mr-2" />
          Planifier
        </motion.button>
      </div>
    </motion.div>
  );
};

export default AITaskCard;
