import axios from 'axios';

const API_URL = 'http://localhost:5001/api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
}

export interface AuthResponse {
  token: string;
  user: User;
}

class AuthService {
  private static instance: AuthService;
  private token: string | null = null;
  private user: User | null = null;

  private constructor() {
    // Récupérer le token du localStorage au démarrage
    this.token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        this.user = JSON.parse(userStr);
      } catch (e) {
        console.error('Erreur lors de la lecture des données utilisateur:', e);
      }
    }
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async login(credentials: LoginCredentials): Promise<boolean> {
    console.log('Tentative de connexion avec:', { email: credentials.email });
    
    try {
      console.log('Envoi de la requête à:', `${API_URL}/auth/login`);
      const response = await axios.post<AuthResponse>(`${API_URL}/auth/login`, credentials);
      console.log('Réponse reçue:', response.data);
      
      this.token = response.data.token;
      this.user = response.data.user;
      
      // Sauvegarder dans le localStorage
      localStorage.setItem('token', this.token);
      localStorage.setItem('user', JSON.stringify(this.user));
      
      console.log('Connexion réussie, utilisateur:', this.user);
      return true;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Erreur de connexion:', {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message
        });
      } else {
        console.error('Erreur inattendue:', error);
      }
      this.logout();
      return false;
    }
  }

  logout(): void {
    this.token = null;
    this.user = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  isAdmin(): boolean {
    return this.user?.role === 'admin';
  }

  getToken(): string | null {
    return this.token;
  }

  getUser(): User | null {
    return this.user;
  }

  // Pour les requêtes authentifiées
  getAuthHeader() {
    return this.token ? { Authorization: `Bearer ${this.token}` } : {};
  }
}

export default AuthService.getInstance();
