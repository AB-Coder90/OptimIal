import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Mail, 
  CheckSquare, 
  FileText, 
  Settings,
  LogOut
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
      <div className="flex h-screen">
        {/* Sidebar */}
        <motion.aside 
          initial={{ x: -200 }}
          animate={{ x: 0 }}
          className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700"
        >
          <div className="h-full px-3 py-4 flex flex-col justify-between">
            <div>
              <div className="mb-8 px-3">
                <h1 className="text-2xl font-bold text-[#1E3A8A] dark:text-white">OptimIAL</h1>
              </div>
              <nav className="space-y-1">
                {navigation.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <motion.button
                      key={item.name}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => navigate(item.href)}
                      className={\`flex items-center w-full px-3 py-2 rounded-lg \${
                        isActive
                          ? 'bg-[#1E3A8A] text-white'
                          : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }\`}
                    >
                      <item.icon className="w-5 h-5 mr-3" />
                      {item.name}
                    </motion.button>
                  );
                })}
              </nav>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {/* TODO: Implement logout */}}
              className="flex items-center w-full px-3 py-2 mt-auto text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Déconnexion
            </motion.button>
          </div>
        </motion.aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
