import { motion } from 'framer-motion';
import { FileText, Download, Check, Clock } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';

interface InvoiceCardProps {
  invoiceNumber: string;
  clientName: string;
  amount: number;
  dueDate: Date;
  status: 'paid' | 'pending' | 'overdue';
  onDownload?: () => void;
  onMarkAsPaid?: () => void;
}

const InvoiceCard = ({
  invoiceNumber,
  clientName,
  amount,
  dueDate,
  status,
  onDownload,
  onMarkAsPaid,
}: InvoiceCardProps) => {
  const getStatusColor = () => {
    switch (status) {
      case 'paid':
        return 'bg-green-500/20 text-green-600 dark:text-green-400';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400';
      case 'overdue':
        return 'bg-red-500/20 text-red-600 dark:text-red-400';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'paid':
        return 'Payée';
      case 'pending':
        return 'En attente';
      case 'overdue':
        return 'En retard';
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4">
          <div className="p-2 bg-[#1E3A8A]/10 rounded-lg">
            <FileText className="w-6 h-6 text-[#1E3A8A]" />
          </div>
          
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-base font-medium text-gray-900 dark:text-white">
                {invoiceNumber}
              </h3>
              <span className={\`px-2 py-1 text-xs rounded-full \${getStatusColor()}\`}>
                {getStatusText()}
              </span>
            </div>
            
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
              {clientName}
            </p>
            
            <div className="mt-2 flex items-center space-x-4">
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {formatCurrency(amount)}
              </p>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <Clock className="w-4 h-4 mr-1" />
                Échéance : {formatDate(dueDate)}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={onDownload}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <Download className="w-5 h-5" />
          </motion.button>
          
          {status !== 'paid' && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={onMarkAsPaid}
              className="p-2 text-green-500 hover:text-green-600 dark:text-green-400 dark:hover:text-green-500"
            >
              <Check className="w-5 h-5" />
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default InvoiceCard;
