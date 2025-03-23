import { useState } from 'react';
import { Bot, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { openAIService } from '../../services/openai';

interface AIEmailResponseProps {
  email: {
    from: string;
    subject: string;
    preview: string;
  };
  onClose: () => void;
}

const AIEmailResponse = ({ email, onClose }: AIEmailResponseProps) => {
  const [suggestion, setSuggestion] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const generateResponse = async () => {
    setLoading(true);
    try {
      const apiKey = localStorage.getItem('openai_api_key');
      if (!apiKey) {
        throw new Error('Clé API OpenAI non trouvée');
      }

      openAIService.setApiKey(apiKey);

      const prompt = `En tant qu'assistant professionnel, génère une réponse à cet email :
        De: ${email.from}
        Objet: ${email.subject}
        Message: ${email.preview}
        
        La réponse doit être :
        1. Professionnelle et courtoise
        2. Claire et concise
        3. En français
        4. Adaptée au contexte du message
        
        Réponds directement avec le texte de la réponse, sans autre formatage.`;

      const response = await openAIService.generateResponse(prompt);
      setSuggestion(response);
    } catch (error) {
      setSuggestion("Une erreur s'est produite lors de la génération de la réponse.");
      console.error('Erreur lors de la génération de la réponse:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Bot className="w-5 h-5 text-[#1E3A8A] mr-2" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Assistant IA - Réponse email
              </h3>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
              Email original
            </h4>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <p className="text-sm text-gray-900 dark:text-white mb-1">
                De: {email.from}
              </p>
              <p className="text-sm text-gray-900 dark:text-white mb-2">
                Objet: {email.subject}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {email.preview}
              </p>
            </div>
          </div>

          {!suggestion && !loading && (
            <button
              onClick={generateResponse}
              className="w-full flex items-center justify-center px-4 py-2 bg-[#1E3A8A] text-white rounded-lg text-sm font-medium hover:bg-[#1E40AF] transition-colors"
            >
              <Bot className="w-4 h-4 mr-2" />
              Générer une réponse
            </button>
          )}

          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1E3A8A] mx-auto"></div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                Génération de la réponse...
              </p>
            </div>
          )}

          {suggestion && !loading && (
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                Suggestion de réponse
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-line">
                {suggestion}
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default AIEmailResponse;
