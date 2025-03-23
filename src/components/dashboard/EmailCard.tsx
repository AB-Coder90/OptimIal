import { useState } from 'react';
import { Mail, Clock, AlertCircle, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import AIEmailResponse from './AIEmailResponse';

interface Email {
  id: string;
  from: string;
  subject: string;
  preview: string;
  content: string;
  receivedAt: string;
  isUrgent?: boolean;
}

interface EmailCardProps {
  emails: Email[];
}

const EmailCard = ({ emails }: EmailCardProps) => {
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);

  const handleAutoReply = (email: Email) => {
    setSelectedEmail(email);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Mail className="w-5 h-5 text-[#1E3A8A] mr-2" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Emails récents
          </h3>
        </div>
      </div>

      <div className="space-y-4">
        {emails.map((email) => (
          <motion.div
            key={email.id}
            whileHover={{ scale: 1.02 }}
            className="relative p-4 bg-gray-50 dark:bg-gray-700 rounded-lg group"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {email.from}
                  </p>
                  {email.isUrgent && (
                    <div className="ml-2 flex items-center">
                      <AlertCircle className="w-4 h-4 text-red-500" />
                      <span className="ml-1 text-xs text-red-500">Urgent</span>
                    </div>
                  )}
                </div>
                <h4 className="mt-1 text-sm font-medium text-gray-800 dark:text-gray-200">
                  {email.subject}
                </h4>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                  {email.preview}
                </p>
                <div className="mt-2 flex items-center text-xs text-gray-500 dark:text-gray-400">
                  <Clock className="w-3 h-3 mr-1" />
                  <span>{email.receivedAt}</span>
                </div>
              </div>
            </div>

            {/* Bouton IA */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation();
                handleAutoReply(email);
              }}
              className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-1 px-3 py-1.5 bg-[#1E3A8A] text-white rounded-lg hover:bg-[#1E40AF]"
            >
              <Sparkles className="w-4 h-4" />
              <span className="text-sm">IA</span>
            </motion.button>
          </motion.div>
        ))}
      </div>

      {/* Modal de réponse IA */}
      {selectedEmail && (
        <AIEmailResponse
          email={{
            from: selectedEmail.from,
            subject: selectedEmail.subject,
            content: selectedEmail.content
          }}
          onClose={() => setSelectedEmail(null)}
        />
      )}
    </div>
  );
};

export default EmailCard;
