import { motion } from 'framer-motion';
import { Sparkles, ThumbsUp, ThumbsDown, ArrowRight } from 'lucide-react';

interface AISuggestionCardProps {
  type: 'task' | 'email' | 'schedule';
  title: string;
  suggestion: string;
  confidence: number;
  onAccept: () => void;
  onReject: () => void;
  onMore?: () => void;
}

const AISuggestionCard = ({
  type,
  title,
  suggestion,
  confidence,
  onAccept,
  onReject,
  onMore,
}: AISuggestionCardProps) => {
  const getTypeColor = () => {
    switch (type) {
      case 'task':
        return 'bg-purple-500/20 text-purple-600 dark:text-purple-400';
      case 'email':
        return 'bg-blue-500/20 text-blue-600 dark:text-blue-400';
      case 'schedule':
        return 'bg-green-500/20 text-green-600 dark:text-green-400';
      default:
        return 'bg-gray-500/20 text-gray-600 dark:text-gray-400';
    }
  };

  const getTypeText = () => {
    switch (type) {
      case 'task':
        return 'Suggestion de tâche';
      case 'email':
        return 'Réponse email';
      case 'schedule':
        return 'Optimisation agenda';
      default:
        return 'Suggestion';
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
    >
      <div className="flex items-start space-x-4">
        <div className="p-2 bg-[#1E3A8A]/10 rounded-lg">
          <Sparkles className="w-6 h-6 text-[#1E3A8A]" />
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between">
            <span className={`px-2 py-1 text-xs rounded-full ${getTypeColor()}`}>
              {getTypeText()}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Confiance: {Math.round(confidence * 100)}%
            </span>
          </div>

          <h3 className="mt-2 text-base font-medium text-gray-900 dark:text-white">
            {title}
          </h3>

          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            {suggestion}
          </p>

          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={onAccept}
                className="p-2 text-green-500 hover:bg-green-500/10 rounded-full"
              >
                <ThumbsUp className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={onReject}
                className="p-2 text-red-500 hover:bg-red-500/10 rounded-full"
              >
                <ThumbsDown className="w-5 h-5" />
              </motion.button>
            </div>

            {onMore && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onMore}
                className="flex items-center text-sm text-[#1E3A8A] hover:text-[#1E3A8A]/90"
              >
                Voir plus
                <ArrowRight className="w-4 h-4 ml-1" />
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AISuggestionCard;
