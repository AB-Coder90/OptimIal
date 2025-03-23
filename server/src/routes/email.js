const express = require('express');
const router = express.Router();
const emailService = require('../services/emailService');
const { getAuthUrl, getTokens, setCredentials } = require('../config/gmail');
const auth = require('../middleware/auth');

// Route pour obtenir l'URL d'autorisation Gmail
router.get('/auth/gmail/url', auth, (req, res) => {
  try {
    const url = getAuthUrl();
    res.json({ url });
  } catch (error) {
    console.error('Erreur lors de la génération de l\'URL d\'autorisation:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Callback pour l'autorisation Gmail
router.get('/auth/gmail/callback', auth, async (req, res) => {
  try {
    const { code } = req.query;
    const tokens = await getTokens(code);
    
    // Stocker les tokens dans la base de données pour l'utilisateur
    // TODO: Implémenter la sauvegarde des tokens

    setCredentials(tokens);
    res.redirect('/dashboard');
  } catch (error) {
    console.error('Erreur lors de l\'authentification Gmail:', error);
    res.redirect('/dashboard?error=gmail_auth_failed');
  }
});

// Récupérer les emails non lus
router.get('/emails/unread', auth, async (req, res) => {
  try {
    const emails = await emailService.getUnreadEmails();
    res.json(emails);
  } catch (error) {
    console.error('Erreur lors de la récupération des emails:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Analyser un email spécifique
router.get('/emails/:id/analyze', auth, async (req, res) => {
  try {
    const analysis = await emailService.analyzeEmail(req.params.id);
    res.json(analysis);
  } catch (error) {
    console.error('Erreur lors de l\'analyse de l\'email:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Marquer un email comme lu
router.post('/emails/:id/read', auth, async (req, res) => {
  try {
    await emailService.markAsRead(req.params.id);
    res.json({ message: 'Email marqué comme lu' });
  } catch (error) {
    console.error('Erreur lors du marquage de l\'email:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Envoyer une réponse à un email
router.post('/emails/send', auth, async (req, res) => {
  try {
    const { to, subject, content } = req.body;
    await emailService.sendResponse(to, subject, content);
    res.json({ message: 'Réponse envoyée avec succès' });
  } catch (error) {
    console.error('Erreur lors de l\'envoi de la réponse:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;
