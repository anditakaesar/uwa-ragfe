import { format } from 'date-fns'
import Dashboard from './features/dashboard/Dashboard'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import LoginPage from './features/auth/Login'
import { ProtectedRoute } from './components/ProtectedRoute'
import { useAuth } from './hooks/useAuth'
import Users from './features/dashboard/Users'
import MainLayout from './layouts/MainLayout'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Content } from '@carbon/react'

const RootRedirect = () => {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return <div>Loading...</div>
  }

  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
}

const queryClient = new QueryClient()

function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<RootRedirect />} />

            <Route path="/login" element={<LoginPage />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<MainLayout children={<Dashboard />} />} />
              <Route path="/dashboard/users" element={<Users />} />
            </Route>
          </Routes>
        </AuthProvider>
      </QueryClientProvider>
      <Content>
        <Footer />
      </Content>
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
