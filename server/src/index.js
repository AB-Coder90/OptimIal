const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const emailRoutes = require('./routes/email');
const { createDefaultAdmin } = require('./controllers/authController');

dotenv.config();

const app = express();

// Configuration CORS détaillée
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:62595'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Middleware pour parser le JSON
app.use(express.json());

// Middleware pour logger les requêtes
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/email', emailRoutes);

// Connexion à MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connecté à MongoDB Atlas');
    // Créer le compte admin par défaut
    await createDefaultAdmin();
  } catch (err) {
    console.error('❌ Erreur de connexion à MongoDB:', err);
    process.exit(1);
  }
};

// Port
const PORT = process.env.PORT || 5001;

// Démarrer le serveur une fois connecté à la base de données
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur le port ${PORT}`);
  });
});
