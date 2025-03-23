import { useState } from 'react';
import { openAIService } from '../../services/openai';

const AITest = () => {
  const [apiKey, setApiKey] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Configure l'API key
      openAIService.setApiKey(apiKey);

      // Teste la génération d'une réponse simple
      const testPrompt = 'Génère une courte réponse de test en français.';
      const result = await openAIService.generateResponse(testPrompt);
      setResponse(result);
    } catch (error) {
      console.error('Erreur lors du test:', error);
      setResponse('Une erreur est survenue lors du test.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
        Test de l'API OpenAI
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Clé API OpenAI
          </label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#1E3A8A] hover:bg-[#1E40AF] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1E3A8A] disabled:opacity-50"
        >
          {loading ? 'Test en cours...' : 'Tester l\'API'}
        </button>
      </form>
      {response && (
        <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-md text-sm">
          <h3 className="font-medium mb-2">Réponse :</h3>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
};

export default AITest;
