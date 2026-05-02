import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function RequireAuth() {
  const { student, ready } = useAuth()
  const location = useLocation()

  if (!ready) return <div style={{ padding: '2rem' }}>Loading…</div>

  if (!student) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return <Outlet />
}
