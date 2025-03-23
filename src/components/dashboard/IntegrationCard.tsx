import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Mail, CreditCard, Check, Loader } from 'lucide-react';

interface Integration {
  name: 'Google Calendar' | 'Gmail' | 'Stripe';
  status: boolean;
  icon: 'Calendar' | 'Mail' | 'CreditCard';
  lastSync?: string;
}

interface IntegrationCardProps {
  integrations: Integration[];
}

const IntegrationCard = ({ integrations }: IntegrationCardProps) => {
  const [loading, setLoading] = useState<string | null>(null);

  const handleConnect = async (integration: Integration) => {
    if (integration.status) return;
    
    setLoading(integration.name);
    // Simuler une connexion
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLoading(null);
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Calendar':
        return <Calendar className="w-5 h-5" />;
      case 'Mail':
        return <Mail className="w-5 h-5" />;
      case 'CreditCard':
        return <CreditCard className="w-5 h-5" />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Intégrations
        </h3>
      </div>

      <div className="space-y-4">
        {integrations.map((integration) => (
          <motion.div
            key={integration.name}
            whileHover={{ scale: 1.02 }}
            className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="text-gray-500 dark:text-gray-400">
                  {getIcon(integration.icon)}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {integration.name}
                  </p>
                  {integration.lastSync && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Dernière synchro : {integration.lastSync}
                    </p>
                  )}
                </div>
              </div>

              <button
                onClick={() => handleConnect(integration)}
                disabled={loading === integration.name}
                className={`flex items-center px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                  integration.status
                    ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                    : 'bg-[#1E3A8A] text-white hover:bg-[#1E40AF]'
                }`}
              >
                {loading === integration.name ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : integration.status ? (
                  <>
                    <Check className="w-4 h-4 mr-1.5" />
                    Connecté
                  </>
                ) : (
                  'Connecter'
                )}
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default IntegrationCard;
