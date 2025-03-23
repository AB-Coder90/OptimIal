import { useState, useEffect } from 'react';
import { openAIService } from '../../services/openai';
import { Settings, Key, Save, Check } from 'lucide-react';

const AI_KEY_STORAGE = 'optimial_ai_key';

const AISettings = () => {
  const [apiKey, setApiKey] = useState('');
  const [isConfigured, setIsConfigured] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    // Vérifie si une clé existe déjà
    const storedKey = localStorage.getItem(AI_KEY_STORAGE);
    if (storedKey) {
      setIsConfigured(true);
      try {
        openAIService.setApiKey(storedKey);
      } catch (error) {
        console.error('Erreur lors de la configuration de la clé API:', error);
        setIsConfigured(false);
      }
    }
  }, []);

  const handleSave = () => {
    try {
      // Configure le service OpenAI
      openAIService.setApiKey(apiKey);
      
      // Stocke la clé de manière sécurisée
      localStorage.setItem(AI_KEY_STORAGE, apiKey);
      
      setIsConfigured(true);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      
      // Réinitialise le champ
      setApiKey('');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de la clé API:', error);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Settings className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Configuration IA
          </h3>
        </div>
        {isConfigured && (
          <span className="flex items-center text-sm text-green-600 dark:text-green-400">
            <Check className="w-4 h-4 mr-1" />
            Configuré
          </span>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Clé API OpenAI
          </label>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder={isConfigured ? '••••••••••••••••' : 'Entrez votre clé API OpenAI'}
                className="w-full pl-10 pr-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent"
              />
            </div>
            <button
              onClick={handleSave}
              disabled={!apiKey}
              className="flex items-center px-4 py-2 bg-[#1E3A8A] text-white rounded-md hover:bg-[#1E40AF] transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4 mr-2" />
              Sauvegarder
            </button>
          </div>
        </div>

        {showSuccess && (
          <div className="p-3 bg-green-50 text-green-700 rounded-md text-sm animate-fade-in">
            Configuration sauvegardée avec succès !
          </div>
        )}

        <div className="text-sm text-gray-500 dark:text-gray-400">
          <p>Cette clé sera utilisée pour :</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Générer des réponses automatiques aux emails</li>
            <li>Analyser et prioriser les tâches</li>
            <li>Fournir des résumés quotidiens</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AISettings;
