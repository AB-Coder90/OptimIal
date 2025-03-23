import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, ChevronRight } from 'lucide-react';
import AIInvoiceAssistant from './AIInvoiceAssistant';

interface Invoice {
  id: string;
  client: {
    name: string;
    email?: string;
    address?: string;
  };
  items: {
    description: string;
    quantity: number;
    unitPrice: number;
  }[];
  totalHT: number;
  tva: number;
  totalTTC: number;
  date?: string;
  paymentTerms?: string;
  notes?: string;
}

interface InvoiceCardProps {
  data: Invoice[];
}

const InvoiceCard = ({ data }: InvoiceCardProps) => {
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  // Calcul des statistiques à partir des factures
  const stats = {
    unpaidInvoices: data.length,
    pendingQuotes: 0, // À implémenter avec le statut des documents
    totalUnpaid: data.reduce((sum, invoice) => sum + invoice.totalTTC, 0)
  };

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Statistiques */}
        <div className="space-y-6">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Factures impayées
            </p>
            <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
              {stats.unpaidInvoices}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Devis en attente
            </p>
            <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
              {stats.pendingQuotes}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Total impayé
            </p>
            <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
              {stats.totalUnpaid}€
            </p>
          </div>
        </div>

        {/* Liste des factures */}
        <div className="col-span-2">
          <div className="space-y-4">
            {data.map((invoice) => (
              <motion.button
                key={invoice.id}
                onClick={() => setSelectedInvoice(invoice)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full rounded-lg bg-gray-50 p-4 text-left transition-colors hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="rounded-lg bg-[#1E3A8A]/10 p-2 dark:bg-[#1E3A8A]/20">
                      <FileText className="h-5 w-5 text-[#1E3A8A]" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {invoice.client.name}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {invoice.totalTTC}€
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {selectedInvoice && (
        <AIInvoiceAssistant
          invoice={selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
        />
      )}
    </div>
  );
};

export default InvoiceCard;
