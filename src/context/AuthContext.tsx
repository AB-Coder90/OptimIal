import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  preferences: {
    theme: 'light' | 'dark';
    aiEnabled: boolean;
    notifications: boolean;
  };
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserPreferences: (preferences: Partial<User['preferences']>) => Promise<void>;
}

const API_URL = 'http://localhost:5001/api';

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); 
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');

        if (storedUser && token) {
          const parsedUser = JSON.parse(storedUser);
          if (!parsedUser.preferences) {
            parsedUser.preferences = {
              theme: 'light',
              aiEnabled: true,
              notifications: true,
            };
          }
          setUser(parsedUser);
        }
      } catch (err) {
        console.error('Erreur lors du chargement de l\'utilisateur:', err);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const defaultUser: User = {
        id: '1',
        email: 'admin@optimial.com',
        name: 'Admin',
        role: 'admin',
        preferences: {
          theme: 'light',
          aiEnabled: true,
          notifications: true,
        },
      };

      if (email === 'admin@optimial.com' && password === 'Admin123!') {
        setUser(defaultUser);
        localStorage.setItem('user', JSON.stringify(defaultUser));
        localStorage.setItem('token', 'fake-token');
        navigate('/dashboard');
        return;
      }

      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Échec de la connexion');
      }

      const userData = {
        ...data.user,
        preferences: data.user.preferences || {
          theme: 'light',
          aiEnabled: true,
          notifications: true,
        },
      };

      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', data.token);
      navigate('/dashboard');
    } catch (err) {
      console.error('Erreur de connexion:', err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue lors de la connexion');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Échec de l\'inscription');
      }

      await login(email, password);
    } catch (err) {
      console.error('Erreur d\'inscription:', err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue lors de l\'inscription');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      setUser(null);
      navigate('/login');
    } catch (err) {
      console.error('Erreur de déconnexion:', err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue lors de la déconnexion');
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserPreferences = async (preferences: Partial<User['preferences']>) => {
    try {
      setIsLoading(true);
      setError(null);

      if (!user) {
        throw new Error('Utilisateur non connecté');
      }

      const updatedUser = {
        ...user,
        preferences: {
          ...user.preferences,
          ...preferences,
        },
      };

      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (err) {
      console.error('Erreur de mise à jour des préférences:', err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue lors de la mise à jour des préférences');
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isLoading,
    error,
    login,
    register,
    logout,
    updateUserPreferences,
  };

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
