import OpenAI from 'openai';

const AI_KEY_STORAGE = 'optimial_ai_key';

interface DocumentItem {
  description: string;
  quantity: number;
  unitPrice: number;
}

interface GeneratedDocument {
  client: {
    name: string;
    email?: string;
    address?: string;
  };
  items: DocumentItem[];
  totalHT: number;
  tva: number;
  totalTTC: number;
  date: string;
  paymentTerms?: string;
  notes?: string;
}

class OpenAIService {
  private static instance: OpenAIService;
  private client: OpenAI | null = null;

  private constructor() {
    // Essaie de récupérer la clé API du localStorage au démarrage
    const storedKey = localStorage.getItem(AI_KEY_STORAGE);
    if (storedKey) {
      this.setApiKey(storedKey);
    }
  }

  public static getInstance(): OpenAIService {
    if (!OpenAIService.instance) {
      OpenAIService.instance = new OpenAIService();
    }
    return OpenAIService.instance;
  }

  public setApiKey(apiKey: string) {
    this.initClient(apiKey);
    // Stocke la clé API dans le localStorage
    localStorage.setItem(AI_KEY_STORAGE, apiKey);
  }

  private initClient(apiKey: string) {
    this.client = new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: true
    });
  }

  private getClient(): OpenAI {
    // Vérifie d'abord le localStorage
    const storedKey = localStorage.getItem(AI_KEY_STORAGE);
    if (!storedKey && !this.client) {
      throw new Error('OpenAI API key not found');
    }

    if (!this.client) {
      if (storedKey) {
        this.initClient(storedKey);
      } else {
        throw new Error('OpenAI client not initialized');
      }
    }
    
    if (!this.client) {
      throw new Error('Failed to initialize OpenAI client');
    }

    return this.client;
  }

  public async generateResponse(prompt: string): Promise<string> {
    const client = this.getClient();

    try {
      const completion = await client.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'gpt-4-turbo-preview',
      });

      return completion.choices[0].message.content || '';
    } catch (error) {
      console.error('OpenAI API Error:', error);
      throw error;
    }
  }

  public async generateEmailResponse(email: {
    from: string;
    subject: string;
    content: string;
  }): Promise<string> {
    const prompt = `En tant qu'assistant professionnel, génère une réponse à cet email :
      De: ${email.from}
      Objet: ${email.subject}
      Message: ${email.content}
      
      La réponse doit être :
      1. Professionnelle et courtoise
      2. Claire et concise
      3. En français
      4. Adaptée au contexte du message
      
      Réponds directement avec le texte de la réponse, sans autre formatage.`;

    return this.generateResponse(prompt);
  }

  public async analyzeTasks(tasks: Array<{
    title: string;
    description?: string;
    dueDate?: string;
    priority?: string;
  }>): Promise<string> {
    const prompt = `En tant qu'assistant professionnel, analyse ces tâches :
      ${tasks
        .map(
          (task) => `
        Titre: ${task.title}
        Description: ${task.description || 'Non spécifiée'}
        Date limite: ${task.dueDate || 'Non spécifiée'}
        Priorité actuelle: ${task.priority || 'Non spécifiée'}
      `
        )
        .join('\n')}
      
      Propose une priorisation et des suggestions d'organisation en tenant compte :
      1. De l'urgence des tâches
      2. De leur importance
      3. Des dépendances potentielles
      4. De l'effort requis
      
      Réponds en français de manière structurée et concise.`;

    return this.generateResponse(prompt);
  }

  async suggestPriorityTask(context: {
    tasks: any[];
    emails: {
      from: string;
      subject: string;
      content: string;
    }[];
    calendar: any[];
  }): Promise<{
    title: string;
    priority: 'high' | 'medium' | 'low';
    suggestedTime: string;
    reason: string;
  }> {
    try {
      const client = this.getClient();
      const prompt = `En tant qu'assistant IA, analyse ces données et suggère la tâche prioritaire :
      - Tâches en cours : ${JSON.stringify(context.tasks)}
      - Emails récents : ${JSON.stringify(context.emails)}
      - Événements calendrier : ${JSON.stringify(context.calendar)}
      
      Réponds uniquement au format JSON avec :
      {
        "title": "description courte de la tâche",
        "priority": "high/medium/low",
        "suggestedTime": "HH:mm",
        "reason": "raison courte de la priorité"
      }`;

      const completion = await client.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'gpt-4-turbo-preview',
        response_format: { type: 'json_object' }
      });

      const response = completion.choices[0].message.content;
      if (!response) {
        throw new Error('Réponse vide de l\'API');
      }

      return JSON.parse(response);
    } catch (error: any) {
      console.error('Erreur OpenAI:', error);
      
      if (error.status === 401) {
        throw new Error('Clé API invalide. Veuillez vérifier votre clé dans les paramètres.');
      } else if (error.status === 429) {
        throw new Error('Limite d\'utilisation de l\'API atteinte. Veuillez réessayer plus tard.');
      } else if (error.message.includes('API key')) {
        throw new Error('Problème avec la clé API. Veuillez la vérifier dans les paramètres.');
      }
      
      throw new Error('Erreur lors de la suggestion de tâche. Veuillez réessayer.');
    }
  }

  async analyzeEmail(email: {
    from: string;
    subject: string;
    content: string;
  }): Promise<{
    priority: 'high' | 'medium' | 'low';
    category: string;
    suggestedAction: string;
  }> {
    try {
      const client = this.getClient();
      const prompt = `Analyse cet email et catégorise-le :
      De: ${email.from}
      Objet: ${email.subject}
      Contenu: ${email.content}
      
      Réponds uniquement au format JSON avec :
      {
        "priority": "high/medium/low",
        "category": "catégorie de l'email",
        "suggestedAction": "action recommandée"
      }`;

      const completion = await client.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'gpt-4-turbo-preview',
        response_format: { type: 'json_object' }
      });

      const response = completion.choices[0].message.content;
      if (!response) {
        throw new Error('Réponse vide de l\'API');
      }

      return JSON.parse(response);
    } catch (error: any) {
      console.error('Erreur OpenAI:', error);
      
      if (error.status === 401) {
        throw new Error('Clé API invalide. Veuillez vérifier votre clé dans les paramètres.');
      } else if (error.status === 429) {
        throw new Error('Limite d\'utilisation de l\'API atteinte. Veuillez réessayer plus tard.');
      } else if (error.message.includes('API key')) {
        throw new Error('Problème avec la clé API. Veuillez la vérifier dans les paramètres.');
      }
      
      throw new Error('Erreur lors de l\'analyse de l\'email. Veuillez réessayer.');
    }
  }

  async generateDailySummary(data: {
    completedTasks: any[];
    newEmails: {
      from: string;
      subject: string;
      content: string;
    }[];
    upcomingTasks: any[];
    invoices: any[];
  }): Promise<{
    highlights: string[];
    priorities: string[];
    suggestions: string[];
  }> {
    try {
      const client = this.getClient();
      const prompt = `Génère un résumé quotidien basé sur ces données :
      - Tâches terminées : ${JSON.stringify(data.completedTasks)}
      - Nouveaux emails : ${JSON.stringify(data.newEmails)}
      - Tâches à venir : ${JSON.stringify(data.upcomingTasks)}
      - Factures : ${JSON.stringify(data.invoices)}
      
      Réponds uniquement au format JSON avec :
      {
        "highlights": ["points importants de la journée"],
        "priorities": ["priorités pour demain"],
        "suggestions": ["suggestions d'amélioration"]
      }`;

      const completion = await client.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'gpt-4-turbo-preview',
        response_format: { type: 'json_object' }
      });

      const response = completion.choices[0].message.content;
      if (!response) {
        throw new Error('Réponse vide de l\'API');
      }

      return JSON.parse(response);
    } catch (error: any) {
      console.error('Erreur OpenAI:', error);
      
      if (error.status === 401) {
        throw new Error('Clé API invalide. Veuillez vérifier votre clé dans les paramètres.');
      } else if (error.status === 429) {
        throw new Error('Limite d\'utilisation de l\'API atteinte. Veuillez réessayer plus tard.');
      } else if (error.message.includes('API key')) {
        throw new Error('Problème avec la clé API. Veuillez la vérifier dans les paramètres.');
      }
      
      throw new Error('Erreur lors de la génération du résumé. Veuillez réessayer.');
    }
  }

  async generateInvoice(description: string): Promise<{
    client: string;
    items: {
      description: string;
      quantity: number;
      unitPrice: number;
    }[];
  }> {
    if (!(await this.getClient())) {
      throw new Error('OpenAI client not initialized');
    }

    const prompt = `En tant qu'expert comptable, génère un devis détaillé pour la demande suivante : "${description}". 
    Le devis doit inclure :
    - Une liste d'items pertinents avec descriptions
    - Des quantités et prix unitaires réalistes
    - Un montant total cohérent
    Format JSON attendu :
    {
      "client": "Nom du client",
      "items": [
        {
          "description": "Description de l'item",
          "quantity": nombre,
          "unitPrice": nombre
        }
      ]
    }`;

    const response = await this.getClient().chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "Tu es un expert comptable spécialisé dans la création de devis professionnels."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7
    });

    const result = response.choices[0]?.message?.content;
    if (!result) {
      throw new Error('Pas de réponse de l\'IA');
    }

    return JSON.parse(result);
  }

  public async generateDocument(documentType: 'devis' | 'facture', description: string): Promise<GeneratedDocument> {
    const client = this.getClient();

    const currentDate = new Date().toLocaleDateString('fr-FR');
    
    const prompt = `En tant qu'expert comptable, génère ${documentType === 'devis' ? 'un devis' : 'une facture'} détaillé(e) pour la demande suivante : "${description}".
    Le document doit inclure :
    - Informations client
    - Liste d'items avec descriptions détaillées
    - Quantités et prix unitaires réalistes
    - Calculs TVA (20%) et totaux
    ${documentType === 'devis' ? '- Conditions de paiement proposées' : '- Échéance de paiement'}
    
    Format JSON attendu :
    {
      "client": {
        "name": "Nom du client",
        "email": "email@client.com",
        "address": "Adresse complète"
      },
      "items": [
        {
          "description": "Description détaillée",
          "quantity": nombre,
          "unitPrice": nombre
        }
      ],
      "totalHT": nombre,
      "tva": nombre,
      "totalTTC": nombre,
      "date": "${currentDate}",
      "paymentTerms": "Conditions de paiement",
      "notes": "Notes ou mentions légales"
    }`;

    const response = await client.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `Tu es un expert comptable spécialisé dans la création de ${documentType}s professionnels. Tu doit fournir des informations réalistes et détaillées.`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7
    });

    const result = response.choices[0]?.message?.content;
    if (!result) {
      throw new Error('Pas de réponse de l\'IA');
    }

    const document = JSON.parse(result) as GeneratedDocument;
    
    // Recalcul des totaux pour s'assurer de la cohérence
    const totalHT = document.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    const tva = totalHT * 0.2;
    const totalTTC = totalHT + tva;

    return {
      ...document,
      totalHT: Math.round(totalHT * 100) / 100,
      tva: Math.round(tva * 100) / 100,
      totalTTC: Math.round(totalTTC * 100) / 100
    };
  }

  public async generateSuggestion(prompt: string): Promise<string> {
    const client = this.getClient();

    const response = await client.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7
    });

    const result = response.choices[0]?.message?.content;
    if (!result) {
      throw new Error('Pas de réponse de l\'IA');
    }

    return result;
  }
}

export const openAIService = OpenAIService.getInstance();
