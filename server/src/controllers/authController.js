const bcrypt = require('bcryptjs');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Créer le compte admin par défaut
const createDefaultAdmin = async () => {
  try {
    const adminEmail = 'admin@optimial.com';
    const adminPassword = 'Admin123!';
    
    // Vérifier si l'admin existe déjà
    const existingAdmin = await User.findOne({ email: adminEmail });
    
    if (!existingAdmin) {
      // Créer l'admin (le mot de passe sera hashé automatiquement par le middleware)
      await User.create({
        email: adminEmail,
        password: adminPassword,
        name: 'Administrateur',
        role: 'admin',
        preferences: {
          theme: 'light',
          aiEnabled: true,
          notifications: true
        }
      });
      
      console.log('✅ Compte administrateur créé avec succès');
    }
  } catch (error) {
    console.error('❌ Erreur lors de la création du compte admin:', error);
  }
};

// Connexion
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('👤 Tentative de connexion pour:', email);

    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ email });
    if (!user) {
      console.log('❌ Utilisateur non trouvé:', email);
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    // Vérifier le mot de passe
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log('❌ Mot de passe incorrect pour:', email);
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    // Créer le token JWT
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('✅ Connexion réussie pour:', email);

    // Envoyer la réponse
    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        preferences: user.preferences
      }
    });
  } catch (error) {
    console.error('❌ Erreur de connexion:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Déconnexion
const logout = async (req, res) => {
  try {
    res.json({ message: 'Déconnexion réussie' });
  } catch (error) {
    console.error('❌ Erreur de déconnexion:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Inscription
const register = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé' });
    }

    // Créer le nouvel utilisateur
    const user = await User.create({
      email,
      password,
      name,
      role: 'user',
      preferences: {
        theme: 'light',
        aiEnabled: true,
        notifications: true
      }
    });

    // Créer le token JWT
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Envoyer la réponse
    res.status(201).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        preferences: user.preferences
      }
    });
  } catch (error) {
    console.error('❌ Erreur lors de l\'inscription:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

module.exports = {
  createDefaultAdmin,
  login,
  logout,
  register
};
