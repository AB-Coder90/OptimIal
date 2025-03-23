const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    // Vérifier si le header Authorization est présent
    if (!req.headers.authorization) {
      return res.status(401).json({ message: 'Token non fourni' });
    }

    // Récupérer le token du header Authorization
    const token = req.headers.authorization.split(' ')[1];
    
    // Vérifier le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Ajouter les informations de l'utilisateur à la requête
    req.user = decoded;
    
    next();
  } catch (error) {
    res.status(401).json({ message: 'Non autorisé' });
  }
};
