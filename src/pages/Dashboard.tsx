import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
  CurrencyEuroIcon,
  DocumentTextIcon,
  EnvelopeIcon,
  CalendarIcon,
  ChartBarIcon,
  ClockIcon,
  BellIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
} from '@heroicons/react/24/outline';
import AITaskSuggestion from '../components/dashboard/AITaskSuggestion';
import AIInvoiceAssistant from '../components/dashboard/AIInvoiceAssistant';
import EmailCard from '../components/dashboard/EmailCard';
import InvoiceCard from '../components/dashboard/InvoiceCard';
import IntegrationCard from '../components/dashboard/IntegrationCard';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ElementType;
  color: string;
  subtitle?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color, subtitle }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className={`p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 ${color}`}
  >
    <div className="flex items-start justify-between">
      <div>
        <h3 className="text-sm font-medium opacity-80">{title}</h3>
        <p className="mt-2 text-2xl font-bold">{value}</p>
        {subtitle && (
          <p className="mt-1 text-sm opacity-75">{subtitle}</p>
        )}
      </div>
      <div className="p-3 rounded-full bg-white bg-opacity-20">
        <Icon className="h-6 w-6" />
      </div>
    </div>
  </motion.div>
);

const mockEmails = [
  {
    id: '1',
    from: 'client@example.com',
    subject: 'Demande de devis',
    preview: 'Bonjour, je souhaiterais obtenir un devis pour...',
    content: 'Bonjour,\n\nJe souhaiterais obtenir un devis pour la création d\'un site web e-commerce. Notre entreprise est spécialisée dans la vente de produits artisanaux et nous souhaitons développer notre présence en ligne.\n\nPouvez-vous me faire une proposition ?\n\nCordialement,\nJean Martin',
    receivedAt: 'Il y a 2 heures',
    isUrgent: true,
  },
  {
    id: '2',
    from: 'fournisseur@example.com',
    subject: 'Confirmation de commande',
    preview: 'Votre commande a bien été prise en compte...',
    content: 'Bonjour,\n\nNous vous confirmons la bonne réception de votre commande n°12345. Elle sera traitée dans les meilleurs délais.\n\nCordialement,\nService Commercial',
    receivedAt: 'Il y a 3 heures',
  },
];

const mockInvoices = [
  {
    id: '1',
    client: {
      name: 'Entreprise ABC',
      email: 'contact@abc.com',
      address: '123 rue des Entreprises, 75000 Paris'
    },
    items: [
      {
        description: 'Développement site web',
        quantity: 1,
        unitPrice: 5000
      },
      {
        description: 'Maintenance mensuelle',
        quantity: 12,
        unitPrice: 200
      }
    ],
    totalHT: 7400,
    tva: 1480,
    totalTTC: 8880,
    date: '2024-01-15',
    paymentTerms: '30 jours',
    notes: 'Paiement par virement bancaire'
  },
  {
    id: '2',
    client: {
      name: 'Société XYZ',
      email: 'contact@xyz.com',
      address: '456 avenue du Commerce, 69000 Lyon'
    },
    items: [
      {
        description: 'Audit sécurité',
        quantity: 1,
        unitPrice: 3000
      }
    ],
    totalHT: 3000,
    tva: 600,
    totalTTC: 3600,
    date: '2024-01-10',
    paymentTerms: '15 jours',
    notes: 'Rapport d\'audit inclus'
  }
];

const mockIntegrations = [
  {
    name: 'Google Calendar' as const,
    status: true,
    icon: 'Calendar' as const,
    lastSync: 'Il y a 5 min',
  },
  {
    name: 'Gmail' as const,
    status: true,
    icon: 'Mail' as const,
    lastSync: 'Il y a 2 min',
  },
  {
    name: 'Stripe' as const,
    status: false,
    icon: 'CreditCard' as const,
  },
];

const Dashboard = () => {
  const { user } = useAuth();
  const [selectedInvoice, setSelectedInvoice] = useState<typeof mockInvoices[0] | null>(null);

  const handleInvoiceClick = () => {
    setSelectedInvoice(mockInvoices[0]);
  };

  const stats = [
    {
      title: 'Chiffre d\'affaires',
      value: '86.4K€',
      subtitle: '+12.5% ce mois',
      icon: CurrencyEuroIcon,
      color: 'bg-gradient-to-br from-[#1E3A8A] to-[#2563EB] text-white',
    },
    {
      title: 'Devis en attente',
      value: '12',
      subtitle: '3 urgents',
      icon: DocumentTextIcon,
      color: 'bg-gradient-to-br from-amber-500 to-orange-600 text-white',
    },
    {
      title: 'Clients actifs',
      value: '48',
      subtitle: '8 nouveaux ce mois',
      icon: UserGroupIcon,
      color: 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white',
    },
    {
      title: 'Taux de conversion',
      value: '68%',
      subtitle: '+5% vs dernier mois',
      icon: ChartBarIcon,
      color: 'bg-gradient-to-br from-purple-500 to-indigo-600 text-white',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* En-tête avec profil */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700"
      >
        <div className="flex items-start space-x-6">
          <div className="relative">
            <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-xl overflow-hidden ring-4 ring-[#1E3A8A]">
              <img
                src={`https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=1E3A8A&color=fff&size=128`}
                alt={user?.name || 'User avatar'}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-2 -right-2 h-6 w-6 rounded-full bg-green-400 border-4 border-white dark:border-gray-800"></div>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white truncate">
                  {user?.name}
                </h1>
                <p className="text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-2 sm:mt-0 px-4 py-2 bg-[#1E3A8A] text-white rounded-lg hover:bg-[#1E40AF] transition-colors duration-200 flex items-center space-x-2"
              >
                <BuildingOfficeIcon className="h-5 w-5" />
                <span>Éditer le profil</span>
              </motion.button>
            </div>
            
            <div className="mt-4 flex items-center space-x-4">
              <div className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-green-400"></div>
                <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">En ligne</span>
              </div>
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <ClockIcon className="h-4 w-4 mr-1" />
                <span>Dernière connexion: {new Date().toLocaleDateString('fr-FR', { 
                  day: 'numeric',
                  month: 'long',
                  hour: '2-digit',
                  minute: '2-digit'
                })}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Grille principale */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tâches IA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center">
              <BellIcon className="h-5 w-5 mr-2 text-[#1E3A8A]" />
              Suggestions IA
            </h2>
          </div>
          <AITaskSuggestion
            tasks={[
              {
                id: "1",
                title: "Relancer le client Acme Corp",
                dueDate: "2024-03-24",
                priority: "high"
              },
              {
                id: "2",
                title: "Préparer la présentation",
                dueDate: "2024-03-25",
                priority: "medium"
              }
            ]}
            emails={mockEmails}
            calendar={[
              {
                id: "1",
                title: "Réunion client",
                start: "2024-03-24T10:00:00",
                end: "2024-03-24T11:00:00"
              }
            ]}
          />
        </motion.div>

        {/* Emails */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center">
              <EnvelopeIcon className="h-5 w-5 mr-2 text-[#1E3A8A]" />
              Emails récents
            </h2>
          </div>
          <EmailCard emails={mockEmails} />
        </motion.div>

        {/* Factures et devis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700 cursor-pointer"
          onClick={handleInvoiceClick}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center">
              <DocumentTextIcon className="h-5 w-5 mr-2 text-[#1E3A8A]" />
              Factures et devis
            </h2>
          </div>
          <InvoiceCard data={mockInvoices} />
        </motion.div>

        {/* Intégrations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center">
              <CalendarIcon className="h-5 w-5 mr-2 text-[#1E3A8A]" />
              Intégrations
            </h2>
          </div>
          <IntegrationCard integrations={mockIntegrations} />
        </motion.div>
      </div>

      {selectedInvoice && (
        <AIInvoiceAssistant
          invoice={selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
        />
      )}
    </div>
  );
};

export default Dashboard;
