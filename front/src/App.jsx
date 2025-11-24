import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import Layout from "@/components/Layout"
import Login from "@/pages/Login"
import Register from "@/pages/Register"
import ForgotPassword from "@/pages/ForgotPassword"
import Dashboard from "@/pages/Dashboard"
import Inventory from "@/pages/Inventory"
import Reports from "@/pages/Reports"
import Settings from "@/pages/Settings"

function App() {
  // TODO: Implement proper authentication state management
  // DEVELOPMENT MODE: Authentication is bypassed (set to true) since backend is not ready
  // Change this to false and implement proper auth logic when backend is available
  const isAuthenticated = true // This should come from context/state management

  // Protected Route wrapper
  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />
    }
    return <Layout>{children}</Layout>
  }

  // Auth Route wrapper (allows access to auth pages even when logged in for development)
  const AuthRoute = ({ children }) => {
    // Commented out redirect for development - allows access to login page
    // if (isAuthenticated) {
    //   return <Navigate to="/dashboard" replace />
    // }
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
        <Route
          path="/register"
          element={
            <AuthRoute>
              <Register />
            </AuthRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <AuthRoute>
              <ForgotPassword />
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

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  )
}

export default App
