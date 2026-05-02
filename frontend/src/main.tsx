import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './context/AuthContext'
import RequireAuth from './routes/RequireAuth'
import App from './App.tsx'
import PlaceholderDashboard from './pages/PlaceholderDashboard'
import './index.css'
import './App.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 30_000,
    },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<div style={{ padding: '2rem' }}>Login page coming soon.</div>} />
            <Route path="/register" element={<div style={{ padding: '2rem' }}>Register page coming soon.</div>} />
            <Route element={<RequireAuth />}>
              <Route path="/" element={<App />}>
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<PlaceholderDashboard />} />
              </Route>
            </Route>
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
)
