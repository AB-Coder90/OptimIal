import { createTheme } from '@mui/material/styles'
import { ThemeProvider, CssBaseline } from '@mui/material'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import DashboardLayout from './layouts/DashboardLayout'
import { AuthProvider, useAuth } from './context/AuthContext'

// Pages
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Register from './pages/Register'
import Tasks from './pages/Tasks'
import Emails from './pages/Emails'
import Invoices from './pages/Invoices'
import Settings from './pages/Settings'

const theme = createTheme({
  palette: {
    primary: {
      main: '#1E3A8A',
      light: '#2563EB',
      dark: '#1E40AF',
    },
    secondary: {
      main: '#FF4081',
      light: '#FF80AB',
      dark: '#F50057',
    },
    background: {
      default: '#F5F5F5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        },
      },
    },
  },
})

// Composant pour protéger les routes
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" />
}

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            {/* Route publique */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Routes protégées */}
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Routes>
                      <Route path="/" element={<Navigate to="/dashboard" />} />
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/tasks" element={<Tasks />} />
                      <Route path="/emails" element={<Emails />} />
                      <Route path="/invoices" element={<Invoices />} />
                      <Route path="/settings" element={<Settings />} />
                    </Routes>
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  )
}

export default App
