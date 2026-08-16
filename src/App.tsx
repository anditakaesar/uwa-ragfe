import Dashboard from './features/dashboard/Dashboard'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import LoginPage from './features/auth/Login'
import { ProtectedRoute } from './components/ProtectedRoute'
import { useAuth } from './hooks/useAuth'
import Users from './features/dashboard/Users'
import MainLayout from './layouts/MainLayout'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Footer from './components/Footer'
import './App.scss'
import { Theme } from '@carbon/react'
import ProfilePage from './features/auth/Profile'
import Playground from './features/dashboard/Playground'
import AuditLogs from './features/dashboard/AuditLogs'
import Files, { type MimeType } from './features/dashboard/Files'
import { Chat } from './features/chat/Chat'

const RootRedirect = () => {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return <div>Loading...</div>
  }

  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
}

const queryClient = new QueryClient()

function App() {
  const mimeTypeImages : MimeType[] = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/jpg',
    'image/webp',
    'image/bmp',
    'image/svg+xml',
  ]

  const docMimeTypes : MimeType[] = [
    'text/markdown',
  ]

  return (
    <Theme theme='g90' className='app-theme-wrapper'>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<RootRedirect />} />

              <Route path="/login" element={<LoginPage />} />

              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<MainLayout children={<Dashboard />} />} />
                <Route path="/dashboard/users" element={<MainLayout children={<Users />} />} />
                <Route path="/dashboard/auditlogs" element={<MainLayout children={<AuditLogs />} />} />
                <Route path="/dashboard/playground" element={<MainLayout children={<Playground />} />} />
                <Route path="/dashboard/upload-images" element={<MainLayout children={<Files mimeTypes={mimeTypeImages} title='Image Files Management' />} />} />
                <Route path="/dashboard/upload-documents" element={<MainLayout children={<Files mimeTypes={docMimeTypes} title='Document Files Management' />} />} />
                <Route path="/profile" element={<MainLayout children={<ProfilePage />} />} />
                <Route path="/chat" element={<MainLayout children={<Chat />} />} />
              </Route>
            </Routes>
            <Footer />
          </AuthProvider>
        </QueryClientProvider>
      </BrowserRouter>
    </Theme>
  )
}

export default App
