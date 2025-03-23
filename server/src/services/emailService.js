const { google } = require('googleapis');
const { oauth2Client } = require('../config/gmail');

class EmailService {
  constructor() {
    this.gmail = google.gmail({ version: 'v1', auth: oauth2Client });
  }

  // Récupérer les emails non lus
  async getUnreadEmails() {
    try {
      const response = await this.gmail.users.messages.list({
        userId: 'me',
        q: 'is:unread',
      });

      const emails = [];
      for (const message of response.data.messages || []) {
        const email = await this.gmail.users.messages.get({
          userId: 'me',
          id: message.id,
        });

        const headers = email.data.payload.headers;
        const subject = headers.find(h => h.name === 'Subject')?.value;
        const from = headers.find(h => h.name === 'From')?.value;
        const date = headers.find(h => h.name === 'Date')?.value;

        emails.push({
          id: message.id,
          subject,
          from,
          date,
          snippet: email.data.snippet,
        });
      }

      return emails;
    } catch (error) {
      console.error('Erreur lors de la récupération des emails:', error);
      throw error;
    }
  }

  // Analyser le contenu d'un email
  async analyzeEmail(messageId) {
    try {
      const email = await this.gmail.users.messages.get({
        userId: 'me',
        id: messageId,
        format: 'full',
      });

      // Extraire les informations importantes
      const headers = email.data.payload.headers;
      const subject = headers.find(h => h.name === 'Subject')?.value;
      const from = headers.find(h => h.name === 'From')?.value;
      const date = headers.find(h => h.name === 'Date')?.value;
      const content = this.getEmailContent(email.data.payload);

      return {
        id: messageId,
        subject,
        from,
        date,
        content,
        priority: this.determinePriority(subject, content),
        category: this.categorizeEmail(subject, content),
      };
    } catch (error) {
      console.error('Erreur lors de l\'analyse de l\'email:', error);
      throw error;
    }
  }

  // Envoyer une réponse automatique
  async sendResponse(to, subject, content) {
    try {
      const message = [
        'Content-Type: text/plain; charset="UTF-8"\n',
        'MIME-Version: 1.0\n',
        'Content-Transfer-Encoding: 7bit\n',
        `To: ${to}\n`,
        `Subject: ${subject}\n\n`,
        content,
      ].join('');

      const encodedMessage = Buffer.from(message)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

      await this.gmail.users.messages.send({
        userId: 'me',
        requestBody: {
          raw: encodedMessage,
        },
      });
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la réponse:', error);
      throw error;
    }
  }

  // Marquer un email comme lu
  async markAsRead(messageId) {
    try {
      await this.gmail.users.messages.modify({
        userId: 'me',
        id: messageId,
        requestBody: {
          removeLabelIds: ['UNREAD'],
        },
      });
    } catch (error) {
      console.error('Erreur lors du marquage de l\'email comme lu:', error);
      throw error;
    }
  }

  // Déterminer la priorité d'un email
  determinePriority(subject, content) {
    const urgentKeywords = ['urgent', 'important', 'deadline', 'asap'];
    const text = (subject + ' ' + content).toLowerCase();
    
    if (urgentKeywords.some(keyword => text.includes(keyword))) {
      return 'high';
    }
    
    return 'normal';
  }

  // Catégoriser un email
  categorizeEmail(subject, content) {
    const categories = {
      meeting: ['réunion', 'meeting', 'rendez-vous'],
      task: ['tâche', 'task', 'todo', 'à faire'],
      report: ['rapport', 'report', 'bilan'],
      question: ['question', 'help', 'aide'],
    };

    const text = (subject + ' ' + content).toLowerCase();
    
    for (const [category, keywords] of Object.entries(categories)) {
      if (keywords.some(keyword => text.includes(keyword))) {
        return category;
      }
    }

    return 'other';
  }

  // Extraire le contenu d'un email
  getEmailContent(payload) {
    if (payload.body.data) {
      return Buffer.from(payload.body.data, 'base64').toString();
    }

    if (payload.parts) {
      for (const part of payload.parts) {
        if (part.mimeType === 'text/plain') {
          return Buffer.from(part.body.data, 'base64').toString();
        }
      }
    }

    return '';
  }
}

module.exports = new EmailService();
