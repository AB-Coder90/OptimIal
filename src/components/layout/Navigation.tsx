import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HomeIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Profil', href: '/profile', icon: UserCircleIcon },
  { name: 'Paramètres', href: '/settings', icon: Cog6ToothIcon },
];

const Navigation = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await logout();
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center cursor-pointer"
              onClick={() => navigate('/dashboard')}
            >
              <img
                className="h-10 w-auto"
                src="/logo.svg"
                alt="OptimIAL Logo"
              />
              <span className="ml-2 text-xl font-bold text-gray-900">
                OptimIAL
              </span>
            </motion.div>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 flex justify-center space-x-8">
            {navigation.map((item) => (
              <motion.button
                key={item.name}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(item.href)}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-2 transition-colors duration-200"
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </motion.button>
            ))}
          </div>

          {/* User Menu & Logout */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="relative group">
                <img
                  className="h-8 w-8 rounded-full ring-2 ring-blue-600 transition-transform duration-200 transform group-hover:scale-110"
                  src={`https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=1E3A8A&color=fff`}
                  alt={user?.name || 'User avatar'}
                />
                <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-400 border-2 border-white"></div>
              </div>
              <span className="text-sm font-medium text-gray-700">
                {user?.name}
              </span>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              disabled={isLoading}
              className="flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors duration-200"
            >
              <ArrowLeftOnRectangleIcon className="h-5 w-5" />
              <span>Déconnexion</span>
            </motion.button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
