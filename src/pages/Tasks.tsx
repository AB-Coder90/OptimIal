import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Check, Trash2, AlertCircle, Loader } from 'lucide-react'

interface Task {
  id: string
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
  completed: boolean
}

interface NewTask {
  title: string
  description: string
  priority: Task['priority']
}

const Tasks = () => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [newTask, setNewTask] = useState<NewTask>({
    title: '',
    description: '',
    priority: 'medium'
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      setError('')

      // Simuler une requête API
      await new Promise(resolve => setTimeout(resolve, 1000))

      const task: Task = {
        id: Date.now().toString(),
        title: newTask.title,
        description: newTask.description,
        priority: newTask.priority,
        completed: false
      }

      setTasks(prev => [task, ...prev])
      setNewTask({ title: '', description: '', priority: 'medium' })
    } catch (err) {
      setError("Une erreur est survenue lors de l'ajout de la tâche")
    } finally {
      setLoading(false)
    }
  }

  const toggleTask = (id: string) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    )
  }

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id))
  }

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500'
      case 'medium':
        return 'bg-yellow-500'
      case 'low':
        return 'bg-green-500'
      default:
        return 'bg-gray-500'
    }
  }

  return (
    <div className="min-h-screen bg-light p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-poppins font-bold text-primary mb-2">
            Tâches
          </h1>
          <p className="text-sm text-gray-600">
            Gérez vos tâches et suivez leur progression
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

        <div className="card mb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="label">
                Titre
              </label>
              <input
                id="title"
                type="text"
                value={newTask.title}
                onChange={e => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                className="input"
                placeholder="Nouvelle tâche"
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="label">
                Description
              </label>
              <textarea
                id="description"
                value={newTask.description}
                onChange={e => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                className="input min-h-[100px] resize-y"
                placeholder="Description de la tâche"
              />
            </div>

            <div>
              <label htmlFor="priority" className="label">
                Priorité
              </label>
              <select
                id="priority"
                value={newTask.priority}
                onChange={e => setNewTask(prev => ({ ...prev, priority: e.target.value as Task['priority'] }))}
                className="input"
              >
                <option value="low">Basse</option>
                <option value="medium">Moyenne</option>
                <option value="high">Haute</option>
              </select>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  Ajouter la tâche
                </>
              )}
            </motion.button>
          </form>
        </div>

        <div className="space-y-4">
          <AnimatePresence>
            {tasks.map(task => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                className="card"
              >
                <div className="flex items-start gap-4">
                  <button
                    onClick={() => toggleTask(task.id)}
                    className={`mt-1 w-5 h-5 rounded-full border-2 flex-shrink-0 transition-colors ${
                      task.completed
                        ? 'bg-primary border-primary'
                        : 'border-gray-300 hover:border-primary'
                    }`}
                  >
                    {task.completed && (
                      <Check className="w-full h-full text-white p-0.5" />
                    )}
                  </button>

                  <div className="flex-grow">
                    <div className="flex items-center gap-2 mb-2">
                      <h3
                        className={`font-medium ${
                          task.completed ? 'text-gray-400 line-through' : 'text-gray-900'
                        }`}
                      >
                        {task.title}
                      </h3>
                      <span
                        className={`px-2 py-1 text-xs font-medium text-white rounded-full ${getPriorityColor(
                          task.priority
                        )}`}
                      >
                        {task.priority}
                      </span>
                    </div>
                    {task.description && (
                      <p
                        className={`text-sm ${
                          task.completed ? 'text-gray-400' : 'text-gray-600'
                        }`}
                      >
                        {task.description}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => deleteTask(task.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {tasks.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <p>Aucune tâche pour le moment</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Tasks
