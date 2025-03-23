const express = require('express');
const router = express.Router();
const { login, logout, register } = require('../controllers/authController');

// Login avec email/mot de passe
router.post('/login', login);

// Déconnexion
router.post('/logout', logout);

// Inscription
router.post('/register', register);

module.exports = router;
