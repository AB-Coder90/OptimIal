import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Calendar, CreditCard, Moon, Bell, Check, Loader, Settings as SettingsIcon, Globe, Shield, User } from 'lucide-react'
import AISettings from '../components/settings/AISettings';

interface Integration {
  id: string
  name: string
  icon: React.ReactNode
  connected: boolean
  description: string
}

const Settings = () => {
  const [loading, setLoading] = useState(false)
  const [darkMode, setDarkMode] = useState(true)

  const integrations: Integration[] = [
    {
      id: 'gmail',
      name: 'Gmail',
      icon: <Mail className="w-5 h-5" />,
      connected: true,
      description: 'Synchronisation des emails et réponses automatiques'
    },
    {
      id: 'calendar',
      name: 'Google Calendar',
      icon: <Calendar className="w-5 h-5" />,
      connected: false,
      description: 'Gestion automatique du planning et des rendez-vous'
    },
    {
      id: 'stripe',
      name: 'Stripe',
      icon: <CreditCard className="w-5 h-5" />,
      connected: true,
      description: 'Traitement des paiements et factures'
    }
  ]

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle('dark')
  }

  const handleConnect = () => {
    setLoading(true)
    // Simuler une connexion
    setTimeout(() => {
      setLoading(false)
    }, 1500)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto p-6"
    >
      <div className="flex items-center mb-8">
        <SettingsIcon className="w-8 h-8 text-primary mr-3" />
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Paramètres</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Menu latéral */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <nav className="space-y-1">
              <a
                href="#profile"
                className="flex items-center px-4 py-3 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700"
              >
                <User className="w-5 h-5 mr-3" />
                Profil
              </a>
              <a
                href="#integrations"
                className="flex items-center px-4 py-3 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <Globe className="w-5 h-5 mr-3" />
                Intégrations
              </a>
              <a
                href="#notifications"
                className="flex items-center px-4 py-3 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <Bell className="w-5 h-5 mr-3" />
                Notifications
              </a>
              <a
                href="#security"
                className="flex items-center px-4 py-3 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <Shield className="w-5 h-5 mr-3" />
                Sécurité
              </a>
              <a
                href="#ai"
                className="flex items-center px-4 py-3 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Configuration IA
              </a>
            </nav>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section Profil */}
          <section id="profile" className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Profil
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nom complet
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email professionnel
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="john@entreprise.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Entreprise
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Nom de l'entreprise"
                />
              </div>
            </div>
          </section>

          {/* Section Intégrations */}
          <section id="integrations" className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Intégrations
            </h2>
            <div className="space-y-6">
              {integrations.map((integration) => (
                <div
                  key={integration.id}
                  className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                >
                  <div className="flex items-center">
                    <div className="flex-shrink-0 text-gray-500 dark:text-gray-400">
                      {integration.icon}
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        {integration.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {integration.description}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleConnect}
                    className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                      integration.connected
                        ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                        : 'bg-primary hover:bg-secondary text-white'
                    }`}
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader className="animate-spin w-5 h-5" />
                    ) : integration.connected ? (
                      <>
                        <Check className="w-5 h-5 mr-2" />
                        Connecté
                      </>
                    ) : (
                      'Connecter'
                    )}
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Section Configuration IA */}
          <section id="ai" className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Configuration IA
            </h2>
            <AISettings />
          </section>

          {/* Section Apparence */}
          <section className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Apparence
            </h2>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Thème sombre
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Basculer entre le mode clair et sombre
                </p>
              </div>
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                {darkMode ? (
                  <Moon className="w-6 h-6" />
                ) : (
                  <Moon className="w-6 h-6" />
                )}
              </button>
            </div>
          </section>

          {/* Section Notifications */}
          <section id="notifications" className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Notifications
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Emails
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Notifications pour les nouveaux emails
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/25 dark:peer-focus:ring-primary/25 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Tâches
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Rappels pour les tâches à effectuer
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/25 dark:peer-focus:ring-primary/25 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>
          </section>
        </div>
      </div>
    </motion.div>
  )
}

export default Settings
