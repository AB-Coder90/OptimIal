import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
  ChartPieIcon,
  DocumentTextIcon,
  CurrencyEuroIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ElementType;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className={`p-6 rounded-xl shadow-lg ${color} text-white`}
  >
    <div className="flex items-center">
      <div className="p-3 rounded-full bg-white bg-opacity-20">
        <Icon className="h-6 w-6" />
      </div>
      <div className="ml-4">
        <p className="text-sm font-medium opacity-80">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  </motion.div>
);

const Dashboard = () => {
  const { user } = useAuth();

  const stats = [
    {
      title: 'Projets actifs',
      value: '12',
      icon: ChartPieIcon,
      color: 'bg-blue-600',
    },
    {
      title: 'Documents',
      value: '48',
      icon: DocumentTextIcon,
      color: 'bg-indigo-600',
    },
    {
      title: 'Budget total',
      value: '86.4K€',
      icon: CurrencyEuroIcon,
      color: 'bg-purple-600',
    },
    {
      title: 'Collaborateurs',
      value: '24',
      icon: UserGroupIcon,
      color: 'bg-pink-600',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* En-tête avec profil */}
      <div className="mb-8 bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-start space-x-6">
          <div className="relative">
            <div className="h-32 w-32 rounded-xl overflow-hidden ring-4 ring-blue-600">
              <img
                src={`https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=1E3A8A&color=fff&size=128`}
                alt={user?.name || 'User avatar'}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-2 -right-2 h-6 w-6 rounded-full bg-green-400 border-4 border-white"></div>
          </div>
          
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{user?.name}</h1>
                <p className="text-gray-500">{user?.email}</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Éditer le profil
              </motion.button>
            </div>
            
            <div className="mt-4 flex items-center space-x-4">
              <div className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-green-400"></div>
                <span className="ml-2 text-sm text-gray-600">En ligne</span>
              </div>
              <div className="text-sm text-gray-600">
                Dernière connexion: {new Date().toLocaleDateString('fr-FR', { 
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Section Activité Récente */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Activité Récente</h2>
        <div className="space-y-4">
          {[1, 2, 3].map((_, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <DocumentTextIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-900">
                  Nouveau document ajouté
                </p>
                <p className="text-sm text-gray-500">
                  Il y a {index + 1} heure{index > 0 ? 's' : ''}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
