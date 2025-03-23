import { useState } from 'react';
import { openAIService } from '../../services/openai';
import { Loader, Calendar, Mail, CheckSquare } from 'lucide-react';

interface AITaskSuggestionProps {
  tasks: any[];
  emails: any[];
  calendar: any[];
  onClose?: () => void;
}

const AITaskSuggestion = ({ tasks, emails, calendar, onClose }: AITaskSuggestionProps) => {
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<{
    title: string;
    priority: 'high' | 'medium' | 'low';
    suggestedTime: string;
    reason: string;
  } | null>(null);
  const [error, setError] = useState('');

  const generateSuggestion = async () => {
    try {
      setLoading(true);
      setError('');
      
      const apiKey = localStorage.getItem('optimial_ai_key');
      if (!apiKey) {
        throw new Error('Veuillez configurer votre clé API OpenAI dans les paramètres.');
      }

      openAIService.setApiKey(apiKey);
      const aiSuggestion = await openAIService.suggestPriorityTask({ tasks, emails, calendar });
      setSuggestion(aiSuggestion);
    } catch (err) {
      console.error('Erreur IA:', err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'low':
        return 'text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400';
      default:
        return 'text-gray-600 bg-gray-50 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Suggestion de tâche prioritaire
        </h3>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
            <div className="flex items-center text-gray-600 dark:text-gray-400 mb-2">
              <CheckSquare className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">Tâches</span>
            </div>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {tasks.length}
            </span>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
            <div className="flex items-center text-gray-600 dark:text-gray-400 mb-2">
              <Mail className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">Emails</span>
            </div>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {emails.length}
            </span>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
            <div className="flex items-center text-gray-600 dark:text-gray-400 mb-2">
              <Calendar className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">Événements</span>
            </div>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {calendar.length}
            </span>
          </div>
        </div>

        {!suggestion && !loading && (
          <button
            onClick={generateSuggestion}
            className="w-full py-2 px-4 bg-[#1E3A8A] text-white rounded hover:bg-[#1E40AF] transition-colors"
          >
            Analyser et suggérer
          </button>
        )}

        {loading && (
          <div className="flex items-center justify-center py-4">
            <Loader className="w-6 h-6 text-[#1E3A8A] animate-spin" />
            <span className="ml-2 text-gray-600 dark:text-gray-400">
              Analyse en cours...
            </span>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 text-red-700 rounded">
            {error}
          </div>
        )}

        {suggestion && (
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded">
              <div className="mb-3">
                <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                  {suggestion.title}
                </h4>
                <div className="flex items-center mt-2">
                  <span className={`text-sm px-2 py-1 rounded ${getPriorityColor(suggestion.priority)}`}>
                    {suggestion.priority === 'high' ? 'Haute' : suggestion.priority === 'medium' ? 'Moyenne' : 'Basse'}
                  </span>
                  <span className="ml-3 text-sm text-gray-500 dark:text-gray-400">
                    Suggéré pour {suggestion.suggestedTime}
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {suggestion.reason}
              </p>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={generateSuggestion}
                className="py-2 px-4 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
              >
                Nouvelle suggestion
              </button>
              <button
                onClick={onClose}
                className="py-2 px-4 bg-[#1E3A8A] text-white rounded hover:bg-[#1E40AF] transition-colors"
              >
                Créer la tâche
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AITaskSuggestion;
