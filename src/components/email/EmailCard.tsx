import { motion } from 'framer-motion';
import { Mail, Star, Clock, MoreVertical } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface EmailCardProps {
  subject: string;
  sender: string;
  preview: string;
  date: Date;
  isImportant?: boolean;
  isUnread?: boolean;
  onToggleImportant?: () => void;
  onSelect?: () => void;
}

const EmailCard = ({
  subject,
  sender,
  preview,
  date,
  isImportant = false,
  isUnread = false,
  onToggleImportant,
  onSelect,
}: EmailCardProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className={`p-4 bg-white dark:bg-gray-800 rounded-lg border ${
        isUnread
          ? 'border-[#3B82F6] dark:border-[#3B82F6]/50'
          : 'border-gray-200 dark:border-gray-700'
      } cursor-pointer`}
      onClick={onSelect}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-full ${
            isUnread ? 'bg-[#3B82F6]/10' : 'bg-gray-100 dark:bg-gray-700'
          }`}>
            <Mail className={`w-4 h-4 ${
              isUnread ? 'text-[#3B82F6]' : 'text-gray-500 dark:text-gray-400'
            }`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <p className={`text-sm font-medium truncate ${
                isUnread ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-300'
              }`}>
                {sender}
              </p>
              <div className="flex items-center space-x-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleImportant?.();
                  }}
                  className={`p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 ${
                    isImportant ? 'text-yellow-500' : 'text-gray-400'
                  }`}
                >
                  <Star className="w-4 h-4" />
                </button>
              </div>
            </div>
            <h3 className={`mt-1 text-base truncate ${
              isUnread ? 'font-medium text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-300'
            }`}>
              {subject}
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 truncate">
              {preview}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <Clock className="w-4 h-4 mr-1" />
            <span>{formatDate(date)}</span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <MoreVertical className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default EmailCard;
