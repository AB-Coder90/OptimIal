import { useState, useEffect } from 'react';
import { Bot, X, Plus, FileText, Loader } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { openAIService } from '../../services/openai';

interface DocumentItem {
  description: string;
  quantity: number;
  unitPrice: number;
}

interface Invoice {
  id?: string;
  client: {
    name: string;
    email?: string;
    address?: string;
  };
  items: DocumentItem[];
  totalHT: number;
  tva: number;
  totalTTC: number;
  date?: string;
  paymentTerms?: string;
  notes?: string;
}

interface AIInvoiceAssistantProps {
  invoice?: Invoice;
  onClose: () => void;
  onSave?: (invoice: Invoice) => void;
}

const AI_KEY_STORAGE = 'optimial_ai_key';

const AIInvoiceAssistant = ({ invoice, onClose, onSave }: AIInvoiceAssistantProps) => {
  const [suggestion, setSuggestion] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'analyze' | 'generate'>('analyze');
  const [description, setDescription] = useState('');
  const [documentType, setDocumentType] = useState<'devis' | 'facture'>('devis');
  const [generatedDocument, setGeneratedDocument] = useState<Invoice | null>(null);

  // Désactive le scroll du body quand le modal est ouvert
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const generateSuggestion = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const apiKey = localStorage.getItem(AI_KEY_STORAGE);
      if (!apiKey) {
        throw new Error('Veuillez configurer votre clé API OpenAI dans les paramètres.');
      }

      openAIService.setApiKey(apiKey);
      const prompt = `En tant qu'expert comptable, analyse ce devis et donne des suggestions d'amélioration :
      ${JSON.stringify(invoice, null, 2)}`;

      const aiSuggestion = await openAIService.generateSuggestion(prompt);
      setSuggestion(aiSuggestion);
    } catch (err) {
      console.error('Erreur IA:', err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const generateDocument = async () => {
    if (!description) {
      setError('Veuillez fournir une description pour générer le document.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const apiKey = localStorage.getItem(AI_KEY_STORAGE);
      if (!apiKey) {
        throw new Error('Veuillez configurer votre clé API OpenAI dans les paramètres.');
      }

      openAIService.setApiKey(apiKey);
      const document = await openAIService.generateDocument(documentType, description);
      setGeneratedDocument(document);
    } catch (err) {
      console.error('Erreur IA:', err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSave = () => {
    if (generatedDocument && onSave) {
      onSave(generatedDocument);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleBackdropClick}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto relative"
        >
          {/* En-tête fixe */}
          <div className="sticky top-0 bg-white dark:bg-gray-800 z-10 pb-4 mb-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <span className="bg-[#1E3A8A] text-white p-1.5 rounded-lg mr-2">
                  <Bot className="w-5 h-5" />
                </span>
                Assistant IA - {mode === 'analyze' ? 'Analyse' : 'Génération'}
              </h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setMode(mode === 'analyze' ? 'generate' : 'analyze')}
                  className="text-gray-600 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-200 focus:outline-none p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  {mode === 'analyze' ? <Plus className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                </button>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-500 focus:outline-none p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Contenu scrollable */}
          <div className="space-y-4">
            {mode === 'analyze' ? (
              // Mode Analyse
              invoice ? (
                <>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                      Détails du document
                    </h4>
                    <div className="space-y-2 text-sm">
                      <p className="text-gray-600 dark:text-gray-300">
                        Client: {invoice.client.name}
                      </p>
                      {invoice.client.email && (
                        <p className="text-gray-600 dark:text-gray-300">
                          Email: {invoice.client.email}
                        </p>
                      )}
                      <div className="mt-4">
                        <h5 className="font-medium text-gray-900 dark:text-white mb-2">
                          Items
                        </h5>
                        <div className="space-y-2">
                          {invoice.items.map((item, index) => (
                            <div
                              key={index}
                              className="p-2 bg-white dark:bg-gray-600 rounded"
                            >
                              <p className="font-medium">{item.description}</p>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                Quantité: {item.quantity} × {item.unitPrice}€ = {item.quantity * item.unitPrice}€
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="mt-4 space-y-1">
                        <p className="text-gray-600 dark:text-gray-300">
                          Total HT: {invoice.totalHT}€
                        </p>
                        <p className="text-gray-600 dark:text-gray-300">
                          TVA (20%): {invoice.tva}€
                        </p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          Total TTC: {invoice.totalTTC}€
                        </p>
                      </div>
                    </div>
                  </div>

                  {!suggestion && !loading && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={generateSuggestion}
                      className="w-full py-3 px-4 bg-[#1E3A8A] text-white rounded-lg hover:bg-[#1E40AF] transition-colors flex items-center justify-center space-x-2"
                    >
                      <Bot className="w-5 h-5" />
                      <span>Analyser le document</span>
                    </motion.button>
                  )}

                  {loading && (
                    <div className="flex items-center justify-center py-8">
                      <Loader className="w-6 h-6 text-[#1E3A8A] animate-spin" />
                      <span className="ml-3 text-gray-600 dark:text-gray-400">
                        Analyse en cours...
                      </span>
                    </div>
                  )}

                  {suggestion && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4"
                    >
                      <div className="p-4 bg-[#1E3A8A]/5 dark:bg-[#1E3A8A]/20 rounded-lg border border-[#1E3A8A]/10">
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                          Suggestions d'amélioration
                        </h4>
                        <div className="prose prose-sm dark:prose-invert">
                          {suggestion}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </>
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  Aucun document à analyser
                </div>
              )
            ) : (
              // Mode Génération
              <>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Type de document
                    </label>
                    <div className="flex space-x-4">
                      <button
                        onClick={() => setDocumentType('devis')}
                        className={`flex-1 py-2 px-4 rounded-lg border ${
                          documentType === 'devis'
                            ? 'bg-[#1E3A8A] text-white border-[#1E3A8A]'
                            : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        Devis
                      </button>
                      <button
                        onClick={() => setDocumentType('facture')}
                        className={`flex-1 py-2 px-4 rounded-lg border ${
                          documentType === 'facture'
                            ? 'bg-[#1E3A8A] text-white border-[#1E3A8A]'
                            : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        Facture
                      </button>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Description du projet
                    </label>
                    <textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder={`Décrivez votre projet pour générer un ${documentType}...`}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-[#1E3A8A] focus:border-[#1E3A8A] bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      rows={4}
                    />
                  </div>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-red-50 dark:bg-red-900/50 text-red-700 dark:text-red-200 rounded-lg flex items-center"
                    >
                      <svg
                        className="w-5 h-5 mr-2 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span>{error}</span>
                    </motion.div>
                  )}

                  {!generatedDocument && !loading && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={generateDocument}
                      disabled={!description}
                      className={`w-full py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2 ${
                        description
                          ? 'bg-[#1E3A8A] text-white hover:bg-[#1E40AF]'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      <Plus className="w-5 h-5" />
                      <span>Générer le {documentType}</span>
                    </motion.button>
                  )}

                  {loading && (
                    <div className="flex items-center justify-center py-8">
                      <Loader className="w-6 h-6 text-[#1E3A8A] animate-spin" />
                      <span className="ml-3 text-gray-600 dark:text-gray-400">
                        Génération en cours...
                      </span>
                    </div>
                  )}

                  {generatedDocument && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4"
                    >
                      <div className="p-4 bg-[#1E3A8A]/5 dark:bg-[#1E3A8A]/20 rounded-lg border border-[#1E3A8A]/10">
                        <h4 className="font-medium text-gray-900 dark:text-white mb-4">
                          {documentType === 'devis' ? 'Devis généré' : 'Facture générée'}
                        </h4>
                        
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              Informations client
                            </h5>
                            <div className="bg-white dark:bg-gray-700 p-3 rounded-lg">
                              <p className="text-gray-900 dark:text-white">
                                {generatedDocument.client.name}
                              </p>
                              {generatedDocument.client.email && (
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  {generatedDocument.client.email}
                                </p>
                              )}
                              {generatedDocument.client.address && (
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  {generatedDocument.client.address}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              Items
                            </h5>
                            <div className="space-y-2">
                              {generatedDocument.items.map((item, index) => (
                                <div
                                  key={index}
                                  className="bg-white dark:bg-gray-700 p-3 rounded-lg"
                                >
                                  <p className="text-gray-900 dark:text-white">
                                    {item.description}
                                  </p>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {item.quantity} × {item.unitPrice}€ = {item.quantity * item.unitPrice}€
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="bg-white dark:bg-gray-700 p-3 rounded-lg space-y-1">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Total HT: {generatedDocument.totalHT}€
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              TVA (20%): {generatedDocument.tva}€
                            </p>
                            <p className="font-medium text-gray-900 dark:text-white">
                              Total TTC: {generatedDocument.totalTTC}€
                            </p>
                          </div>

                          {generatedDocument.paymentTerms && (
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              <strong>Conditions de paiement:</strong>{' '}
                              {generatedDocument.paymentTerms}
                            </div>
                          )}

                          {generatedDocument.notes && (
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              <strong>Notes:</strong> {generatedDocument.notes}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex justify-end space-x-3">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            setGeneratedDocument(null);
                            setDescription('');
                          }}
                          className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        >
                          Réinitialiser
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleSave}
                          className="px-4 py-2 bg-[#1E3A8A] text-white rounded-lg hover:bg-[#1E40AF] transition-colors flex items-center space-x-2"
                        >
                          <FileText className="w-4 h-4" />
                          <span>Utiliser ce {documentType}</span>
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </div>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AIInvoiceAssistant;
