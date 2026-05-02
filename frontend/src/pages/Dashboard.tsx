import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useWallet } from '../hooks/useWallet'
import Money from '../components/Money'

export default function Dashboard() {
  const { student } = useAuth()
  const { data: wallet, isLoading, isError } = useWallet()

  return (
    <div className="page">
      <h1>Welcome back, {student?.name}</h1>

      {isError && <div className="alert error">Couldn't load your wallet. Please retry.</div>}

      <div className="card balance-card">
        <div className="muted">Current balance</div>
        <div className="balance-amount">
          {isLoading ? '…' : <Money value={wallet?.balance} />}
        </div>
        <div className="balance-meta">
          Wallet #{wallet?.walletId ?? '—'}
        </div>
      </div>

      <section className="profile-grid">
        <div className="card">
          <div className="muted">Student ID</div>
          <div className="profile-value">{student?.studentNumber}</div>
        </div>
        <div className="card">
          <div className="muted">Name</div>
          <div className="profile-value">{student?.name}</div>
        </div>
      </section>

      <section className="quick-actions">
        <Link to="/transactions" className="action-link">Deposit</Link>
        <Link to="/transactions" className="action-link">Pay for service</Link>
        <Link to="/transactions" className="action-link">Transfer</Link>
        <Link to="/reports" className="action-link secondary-link">View reports</Link>
      </section>
    </div>
  )
}
