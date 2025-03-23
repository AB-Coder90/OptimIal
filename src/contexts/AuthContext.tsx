import React, { createContext, useContext, useState, useEffect } from 'react';
import authService, { User } from '../services/authService';

interface AuthContextType {
  isAuthenticated: boolean;
  isAdmin: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(authService.isAuthenticated());
  const [isAdmin, setIsAdmin] = useState(authService.isAdmin());
  const [user, setUser] = useState<User | null>(authService.getUser());

  useEffect(() => {
    // Vérifier l'authentification au chargement
    setIsAuthenticated(authService.isAuthenticated());
    setIsAdmin(authService.isAdmin());
    setUser(authService.getUser());
  }, []);

  const login = async (email: string, password: string) => {
    const success = await authService.login({ email, password });
    if (success) {
      setIsAuthenticated(true);
      setIsAdmin(authService.isAdmin());
      setUser(authService.getUser());
    }
    return success;
  };

  const logout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setIsAdmin(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isAdmin, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
