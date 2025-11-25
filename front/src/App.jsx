import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import Layout from "@/components/Layout"
import Login from "@/pages/Login"
import Dashboard from "@/pages/Dashboard"
import Inventory from "@/pages/Inventory"
import Reports from "@/pages/Reports"
import Settings from "@/pages/Settings"
import UserManagement from "@/pages/UserManagement"
import { useAuth } from "@/contexts/AuthContext"

function App() {
  const { isAuthenticated, loading } = useAuth()

  // Protected Route wrapper
  const ProtectedRoute = ({ children }) => {
    if (loading) {
      return <div className="min-h-screen flex items-center justify-center">Chargement...</div>
    }
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />
    }
    return <Layout>{children}</Layout>
  }

  // Auth Route wrapper (redirect to dashboard if already logged in)
  const AuthRoute = ({ children }) => {
    if (loading) {
      return <div className="min-h-screen flex items-center justify-center">Chargement...</div>
    }
    if (isAuthenticated) {
      return <Navigate to="/dashboard" replace />
    }
    return children
  }

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route
          path="/login"
          element={
            <AuthRoute>
              <Login />
            </AuthRoute>
          }
        />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/inventory"
          element={
            <ProtectedRoute>
              <Inventory />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <Reports />
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />

        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <UserManagement />
            </ProtectedRoute>
          }
        />

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  )
}

export default App
