import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import AuthForm from './AuthForm';

interface AuthFormProps {
  mode: 'login' | 'register';
  onSubmit: (data: { email: string; password: string; name?: string }) => void;
  isLoading?: boolean;
}

const AuthFormComponent = ({ mode, onSubmit, isLoading }: AuthFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const form = e.currentTarget;
    const email = (form.elements.namedItem('email') as HTMLInputElement)?.value || '';
    const password = (form.elements.namedItem('password') as HTMLInputElement)?.value || '';
    const name = mode === 'register' ? (form.elements.namedItem('name') as HTMLInputElement)?.value || '' : undefined;
    
    onSubmit({ email, password, name });
  };

  return (
    <AuthForm onSubmit={handleSubmit} isLoading={isLoading}>
      {mode === 'register' && (
        <div>
          <label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Nom
          </label>
          <div className="mt-1">
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-gray-900 placeholder-gray-400 hover:border-gray-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500 dark:hover:border-gray-600 dark:focus:border-secondary dark:focus:ring-secondary/20"
              placeholder="Votre nom"
              required={mode === 'register'}
            />
          </div>
        </div>
      )}

      <div>
        <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Email
        </label>
        <div className="mt-1 relative">
          <input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="block w-full rounded-lg border border-gray-200 bg-white pl-10 pr-3 py-2 text-gray-900 placeholder-gray-400 hover:border-gray-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500 dark:hover:border-gray-600 dark:focus:border-secondary dark:focus:ring-secondary/20"
            placeholder="votre@email.com"
            required
          />
          <Mail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      <div>
        <label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Mot de passe
        </label>
        <div className="mt-1 relative">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="block w-full rounded-lg border border-gray-200 bg-white pl-10 pr-12 py-2 text-gray-900 placeholder-gray-400 hover:border-gray-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500 dark:hover:border-gray-600 dark:focus:border-secondary dark:focus:ring-secondary/20"
            placeholder="••••••••"
            required
          />
          <Lock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      <motion.button
        type="submit"
        disabled={isLoading}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className="mt-6 relative w-full rounded-lg bg-primary px-4 py-2 text-white transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50 dark:bg-secondary dark:hover:bg-secondary/90 dark:focus:ring-secondary/20"
      >
        {mode === 'login' ? 'Se connecter' : 'S\'inscrire'}
      </motion.button>
    </AuthForm>
  );
};

export default AuthFormComponent;
