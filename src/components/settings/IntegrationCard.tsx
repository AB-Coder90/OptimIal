import { motion } from 'framer-motion';
import { Check, X, ExternalLink } from 'lucide-react';

interface IntegrationCardProps {
  name: string;
  description: string;
  icon: string;
  status: 'connected' | 'disconnected';
  lastSync?: Date;
  onConnect: () => void;
  onDisconnect: () => void;
}

const IntegrationCard = ({
  name,
  description,
  icon,
  status,
  lastSync,
  onConnect,
  onDisconnect,
}: IntegrationCardProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-700 p-2 flex items-center justify-center">
            <img src={icon} alt={name} className="w-8 h-8" />
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
              {name}
              <ExternalLink className="w-4 h-4 ml-2 text-gray-400" />
            </h3>
            
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {description}
            </p>
            
            {status === 'connected' && lastSync && (
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Dernière synchronisation : {new Date(lastSync).toLocaleDateString('fr-FR', {
                  day: '2-digit',
                  month: 'long',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            )}
          </div>
        </div>

        <div>
          {status === 'connected' ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onDisconnect}
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <X className="w-4 h-4 mr-2" />
              Déconnecter
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onConnect}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-[#1E3A8A] hover:bg-[#1E3A8A]/90"
            >
              <Check className="w-4 h-4 mr-2" />
              Connecter
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default IntegrationCard;
