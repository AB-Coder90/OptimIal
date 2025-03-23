require('dotenv').config();
const mongoose = require('mongoose');

const uri = process.env.MONGODB_URI;
console.log('Tentative de connexion à MongoDB Atlas...');
console.log('URI:', uri.replace(/:[^:@]+@/, ':****@')); // Masque le mot de passe

mongoose.connect(uri, {
  serverSelectionTimeoutMS: 5000 // Timeout après 5 secondes
})
  .then(() => {
    console.log('✅ Connexion réussie à MongoDB Atlas !');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Erreur de connexion :', error.message);
    if (error.name === 'MongoServerError') {
      console.error('Détails de l\'erreur MongoDB:', {
        code: error.code,
        codeName: error.codeName,
        errmsg: error.errmsg
      });
    }
    process.exit(1);
  });
