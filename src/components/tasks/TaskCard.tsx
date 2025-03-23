import { motion } from 'framer-motion';
import { CheckSquare, Clock, Calendar, AlertCircle } from 'lucide-react';

interface TaskCardProps {
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  dueDate: Date;
  isCompleted?: boolean;
  onToggleComplete?: () => void;
  onEdit?: () => void;
}

const TaskCard = ({
  title,
  description,
  priority,
  dueDate,
  isCompleted = false,
  onToggleComplete,
  onEdit,
}: TaskCardProps) => {
  const getPriorityColor = () => {
    switch (priority) {
      case 'high':
        return 'bg-red-500/20 text-red-600 dark:text-red-400';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400';
      case 'low':
        return 'bg-green-500/20 text-green-600 dark:text-green-400';
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className={\`p-4 bg-white dark:bg-gray-800 rounded-lg border \${
        isCompleted
          ? 'border-gray-200 dark:border-gray-700'
          : 'border-[#1E3A8A] dark:border-[#1E3A8A]/50'
      }\`}
    >
      <div className="flex items-start space-x-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={onToggleComplete}
          className={\`mt-1 p-1 rounded \${
            isCompleted
              ? 'bg-[#1E3A8A] text-white'
              : 'border-2 border-[#1E3A8A] text-transparent hover:bg-[#1E3A8A]/10'
          }\`}
        >
          <CheckSquare className="w-4 h-4" />
        </motion.button>
        
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className={\`text-base font-medium \${
              isCompleted
                ? 'text-gray-500 dark:text-gray-400 line-through'
                : 'text-gray-900 dark:text-white'
            }\`}>
              {title}
            </h3>
            <span className={\`px-2 py-1 text-xs rounded-full \${getPriorityColor()}\`}>
              {priority}
            </span>
          </div>
          
          <p className={\`mt-1 text-sm \${
            isCompleted
              ? 'text-gray-400 dark:text-gray-500 line-through'
              : 'text-gray-600 dark:text-gray-300'
          }\`}>
            {description}
          </p>
          
          <div className="mt-3 flex items-center space-x-4">
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <Calendar className="w-4 h-4 mr-1" />
              {new Date(dueDate).toLocaleDateString('fr-FR', {
                day: '2-digit',
                month: 'short',
              })}
            </div>
            {!isCompleted && new Date(dueDate) < new Date() && (
              <div className="flex items-center text-sm text-red-500">
                <AlertCircle className="w-4 h-4 mr-1" />
                En retard
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskCard;
