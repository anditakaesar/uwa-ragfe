import { format } from 'date-fns'
import Dashboard from './components/Dashboard'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import LoginPage from './components/Login'
import { ProtectedRoute } from './components/ProtectedRoute'
import { useAuth } from './hooks/useAuth'

const RootRedirect = () => {
  const { token, loading } = useAuth()

  if (loading) {
    return <div>Loading...</div>
  }

  return token ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<RootRedirect />} />

          <Route path="/login" element={<LoginPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
        </Routes>
      </AuthProvider>
      <Footer />
    </BrowserRouter>
  )
}

function Footer() {
  const today = new Date()
  return (
    <>
      <div>Hello From Footer &copy; { format(today, "yyyy") }</div>
    </>
  )
}

export default App
