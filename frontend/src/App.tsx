import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import { useWallet } from './hooks/useWallet'
import Money from './components/Money'

export default function App() {
  const { student, logout } = useAuth()
  const { data: wallet } = useWallet()

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-header-inner">
          <div className="brand">Student Wallet</div>
          <nav className="nav">
            <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'active' : ''}>Dashboard</NavLink>
            <NavLink to="/transactions" className={({ isActive }) => isActive ? 'active' : ''}>Transactions</NavLink>
            <NavLink to="/reports" className={({ isActive }) => isActive ? 'active' : ''}>Reports</NavLink>
          </nav>
          <div className="user">
            <div className="user-name">{student?.name}</div>
            <div className="user-balance"><Money value={wallet?.balance} /></div>
            <button className="secondary" onClick={logout}>Log out</button>
          </div>
        </div>
      </header>

      <main className="app-main">
        <Outlet />
      </main>
    </div>
  )
}
