import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FileText, Plus, Download, Trash2, AlertCircle, Loader } from 'lucide-react'

interface Invoice {
  id: string
  number: string
  client: string
  amount: number
  date: string
  status: 'paid' | 'pending' | 'overdue'
}

const Invoices = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [newInvoice, setNewInvoice] = useState<Omit<Invoice, 'id'>>({
    number: '',
    client: '',
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    status: 'pending'
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      setError('')

      // Simuler une requête API
      await new Promise(resolve => setTimeout(resolve, 1500))

      const invoice: Invoice = {
        id: Date.now().toString(),
        ...newInvoice
      }

      setInvoices(prev => [invoice, ...prev])
      setShowForm(false)
      setNewInvoice({
        number: '',
        client: '',
        amount: 0,
        date: new Date().toISOString().split('T')[0],
        status: 'pending'
      })
    } catch (err) {
      setError("Une erreur est survenue lors de l'ajout de la facture")
    } finally {
      setLoading(false)
    }
  }

  const deleteInvoice = (id: string) => {
    setInvoices(prev => prev.filter(invoice => invoice.id !== id))
  }

  const getStatusColor = (status: Invoice['status']) => {
    switch (status) {
      case 'paid':
        return 'bg-green-500'
      case 'pending':
        return 'bg-yellow-500'
      case 'overdue':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-poppins font-bold text-primary mb-2">
            Factures
          </h1>
          <p className="text-sm text-gray-600">
            Gérez vos factures et suivez les paiements
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

        <div className="space-y-6">
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-medium text-gray-900">
                  Liste des factures
                </h2>
                <p className="text-sm text-gray-500">
                  {invoices.length} facture{invoices.length !== 1 ? 's' : ''}
                </p>
              </div>

              <motion.button
                onClick={() => setShowForm(!showForm)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn-primary flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Nouvelle facture
              </motion.button>
            </div>

            <AnimatePresence>
              {showForm && (
                <motion.form
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  onSubmit={handleSubmit}
                  className="mb-8 overflow-hidden"
                >
                  <div className="space-y-4 border rounded-lg p-4 bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="number" className="label">
                          Numéro de facture
                        </label>
                        <input
                          id="number"
                          type="text"
                          value={newInvoice.number}
                          onChange={e =>
                            setNewInvoice(prev => ({
                              ...prev,
                              number: e.target.value
                            }))
                          }
                          className="input"
                          placeholder="FAC-001"
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="client" className="label">
                          Client
                        </label>
                        <input
                          id="client"
                          type="text"
                          value={newInvoice.client}
                          onChange={e =>
                            setNewInvoice(prev => ({
                              ...prev,
                              client: e.target.value
                            }))
                          }
                          className="input"
                          placeholder="Nom du client"
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="amount" className="label">
                          Montant
                        </label>
                        <input
                          id="amount"
                          type="number"
                          min="0"
                          step="0.01"
                          value={newInvoice.amount}
                          onChange={e =>
                            setNewInvoice(prev => ({
                              ...prev,
                              amount: parseFloat(e.target.value)
                            }))
                          }
                          className="input"
                          placeholder="0.00"
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="date" className="label">
                          Date
                        </label>
                        <input
                          id="date"
                          type="date"
                          value={newInvoice.date}
                          onChange={e =>
                            setNewInvoice(prev => ({
                              ...prev,
                              date: e.target.value
                            }))
                          }
                          className="input"
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="status" className="label">
                          Statut
                        </label>
                        <select
                          id="status"
                          value={newInvoice.status}
                          onChange={e =>
                            setNewInvoice(prev => ({
                              ...prev,
                              status: e.target.value as Invoice['status']
                            }))
                          }
                          className="input"
                          required
                        >
                          <option value="pending">En attente</option>
                          <option value="paid">Payée</option>
                          <option value="overdue">En retard</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex justify-end gap-4">
                      <button
                        type="button"
                        onClick={() => setShowForm(false)}
                        className="btn-secondary"
                      >
                        Annuler
                      </button>
                      <motion.button
                        type="submit"
                        disabled={loading}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="btn-primary"
                      >
                        {loading ? (
                          <Loader className="w-5 h-5 animate-spin" />
                        ) : (
                          'Créer la facture'
                        )}
                      </motion.button>
                    </div>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>

            {invoices.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Aucune facture pour le moment</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">
                        Numéro
                      </th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">
                        Client
                      </th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">
                        Date
                      </th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">
                        Montant
                      </th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">
                        Statut
                      </th>
                      <th className="py-3 px-4 text-right text-sm font-medium text-gray-500">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <AnimatePresence>
                      {invoices.map(invoice => (
                        <motion.tr
                          key={invoice.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="hover:bg-gray-50"
                        >
                          <td className="py-4 px-4 text-sm text-gray-900">
                            {invoice.number}
                          </td>
                          <td className="py-4 px-4 text-sm text-gray-900">
                            {invoice.client}
                          </td>
                          <td className="py-4 px-4 text-sm text-gray-500">
                            {formatDate(invoice.date)}
                          </td>
                          <td className="py-4 px-4 text-sm font-medium text-gray-900">
                            {formatAmount(invoice.amount)}
                          </td>
                          <td className="py-4 px-4">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white ${getStatusColor(
                                invoice.status
                              )}`}
                            >
                              {invoice.status === 'paid'
                                ? 'Payée'
                                : invoice.status === 'pending'
                                ? 'En attente'
                                : 'En retard'}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center justify-end gap-2">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="text-gray-400 hover:text-primary transition-colors"
                              >
                                <Download className="w-5 h-5" />
                              </motion.button>
                              <motion.button
                                onClick={() => deleteInvoice(invoice.id)}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="text-gray-400 hover:text-red-500 transition-colors"
                              >
                                <Trash2 className="w-5 h-5" />
                              </motion.button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Invoices
