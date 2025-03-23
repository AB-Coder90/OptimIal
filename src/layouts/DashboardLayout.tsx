import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Mail, 
  CheckSquare, 
  FileText, 
  Settings,
  LogOut,
  Menu
} from 'lucide-react';

interface DashboardLayoutProps {
  children: ReactNode;
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Tâches', href: '/tasks', icon: CheckSquare },
  { name: 'Emails', href: '/emails', icon: Mail },
  { name: 'Factures', href: '/invoices', icon: FileText },
  { name: 'Paramètres', href: '/settings', icon: Settings },
];

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header avec navigation horizontale */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-[#1E3A8A] dark:text-white">OptimIAL</h1>
            </div>

            {/* Navigation principale */}
            <nav className="hidden md:flex space-x-4">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                const Icon = item.icon;
                return (
                  <motion.button
                    key={item.name}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate(item.href)}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ease-in-out ${
                      isActive
                        ? 'bg-[#1E3A8A] text-white'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.name}
                  </motion.button>
                );
              })}
            </nav>

            {/* Menu mobile */}
            <div className="md:hidden">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700"
              >
                <Menu className="w-6 h-6" />
              </motion.button>
            </div>

            {/* Bouton de déconnexion */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {/* TODO: Implement logout */}}
              className="hidden md:flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Déconnexion
            </motion.button>
          </div>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
};

export default DashboardLayout;
