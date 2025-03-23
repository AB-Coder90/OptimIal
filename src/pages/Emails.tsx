import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Star, Trash2, AlertCircle, Loader, Send } from 'lucide-react'

interface Email {
  id: string
  from: string
  subject: string
  content: string
  date: string
  isStarred: boolean
  isRead: boolean
}

const Emails = () => {
  const [emails, setEmails] = useState<Email[]>([
    {
      id: '1',
      from: 'client@entreprise.com',
      subject: 'Demande de devis',
      content: 'Bonjour, je souhaiterais obtenir un devis pour...',
      date: '2025-03-21T10:30:00',
      isStarred: false,
      isRead: false
    },
    {
      id: '2',
      from: 'manager@entreprise.com',
      subject: 'Réunion de suivi',
      content: 'La réunion de suivi aura lieu demain à...',
      date: '2025-03-21T09:15:00',
      isStarred: false,
      isRead: true
    },
    {
      id: '3',
      from: 'tech@entreprise.com',
      subject: 'Documentation technique',
      content: 'Veuillez trouver ci-joint la documentation...',
      date: '2025-03-20T16:45:00',
      isStarred: true,
      isRead: true
    }
  ])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null)
  const [replyContent, setReplyContent] = useState('')
  const [generatingResponse, setGeneratingResponse] = useState(false)

  const handleGenerateResponse = async () => {
    try {
      setGeneratingResponse(true)
      setError('')

      // Simuler une requête API
      await new Promise(resolve => setTimeout(resolve, 2000))

      setReplyContent(
        "Merci pour votre message. Je l'ai bien reçu et je vais l'étudier avec attention. Je reviendrai vers vous dans les plus brefs délais.\n\nCordialement"
      )
    } catch (err) {
      setError('Une erreur est survenue lors de la génération de la réponse')
    } finally {
      setGeneratingResponse(false)
    }
  }

  const handleSendReply = async () => {
    try {
      setLoading(true)
      setError('')

      // Simuler une requête API
      await new Promise(resolve => setTimeout(resolve, 1500))

      setSelectedEmail(null)
      setReplyContent('')
    } catch (err) {
      setError("Une erreur est survenue lors de l'envoi de la réponse")
    } finally {
      setLoading(false)
    }
  }

  const toggleStar = (emailId: string) => {
    setEmails(prev =>
      prev.map(email =>
        email.id === emailId ? { ...email, isStarred: !email.isStarred } : email
      )
    )
  }

  const deleteEmail = (emailId: string) => {
    setEmails(prev => prev.filter(email => email.id !== emailId))
    if (selectedEmail?.id === emailId) {
      setSelectedEmail(null)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="min-h-screen bg-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-poppins font-bold text-primary mb-2">
            Emails
          </h1>
          <p className="text-sm text-gray-600">
            Gérez vos emails professionnels
          </p>
        </div>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 flex items-center"
            >
              <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-gray-900">Boîte de réception</h2>
                <span className="text-sm text-gray-500">{emails.length} messages</span>
              </div>

              {emails.length === 0 ? (
                <div className="text-center py-12">
                  <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Votre boîte de réception est vide</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <AnimatePresence>
                    {emails.map(email => (
                      <motion.div
                        key={email.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        onClick={() => setSelectedEmail(email)}
                        className={`p-4 rounded-lg cursor-pointer transition-colors ${
                          selectedEmail?.id === email.id
                            ? 'bg-primary/5'
                            : 'hover:bg-gray-50'
                        } ${!email.isRead ? 'font-medium' : ''}`}
                      >
                        <div className="flex items-start gap-4">
                          <button
                            onClick={e => {
                              e.stopPropagation()
                              toggleStar(email.id)
                            }}
                            className={`text-gray-400 hover:text-yellow-400 transition-colors ${
                              email.isStarred ? 'text-yellow-400' : ''
                            }`}
                          >
                            <Star className="w-5 h-5" />
                          </button>

                          <div className="flex-grow min-w-0">
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {email.from}
                              </p>
                              <span className="text-xs text-gray-500 whitespace-nowrap">
                                {formatDate(email.date)}
                              </span>
                            </div>
                            <p className="text-sm text-gray-900 truncate">
                              {email.subject}
                            </p>
                            <p className="text-sm text-gray-500 truncate">
                              {email.content}
                            </p>
                          </div>

                          <button
                            onClick={e => {
                              e.stopPropagation()
                              deleteEmail(email.id)
                            }}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>

          <div>
            {selectedEmail ? (
              <div className="card space-y-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">
                      {selectedEmail.subject}
                    </h3>
                    <p className="text-sm text-gray-600">
                      De : {selectedEmail.from}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatDate(selectedEmail.date)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleStar(selectedEmail.id)}
                      className={`text-gray-400 hover:text-yellow-400 transition-colors ${
                        selectedEmail.isStarred ? 'text-yellow-400' : ''
                      }`}
                    >
                      <Star className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => deleteEmail(selectedEmail.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="prose prose-sm max-w-none">
                  <p className="whitespace-pre-wrap">{selectedEmail.content}</p>
                </div>

                <div className="border-t pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-medium text-gray-900">
                      Répondre
                    </h4>
                    <button
                      onClick={handleGenerateResponse}
                      disabled={generatingResponse}
                      className="btn-secondary text-sm"
                    >
                      {generatingResponse ? (
                        <Loader className="w-4 h-4 animate-spin" />
                      ) : (
                        'Générer une réponse'
                      )}
                    </button>
                  </div>

                  <div className="space-y-4">
                    <textarea
                      value={replyContent}
                      onChange={e => setReplyContent(e.target.value)}
                      placeholder="Écrivez votre réponse..."
                      className="input min-h-[200px] resize-y"
                    />

                    <div className="flex justify-end">
                      <motion.button
                        onClick={handleSendReply}
                        disabled={loading || !replyContent.trim()}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="btn-primary flex items-center gap-2"
                      >
                        {loading ? (
                          <Loader className="w-5 h-5 animate-spin" />
                        ) : (
                          <>
                            <Send className="w-5 h-5" />
                            Envoyer
                          </>
                        )}
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="card">
                <div className="text-center py-12">
                  <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">
                    Sélectionnez un email pour le consulter
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Emails
