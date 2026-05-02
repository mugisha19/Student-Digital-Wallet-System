import { useAuth } from '../context/AuthContext'

export default function PlaceholderDashboard() {
  const { student, logout } = useAuth()
  return (
    <div style={{ padding: '2rem', maxWidth: 720, margin: '0 auto' }}>
      <h1>Welcome, {student?.name}</h1>
      <p>Student #: {student?.studentNumber}</p>
      <p>Wallet ID: {student?.walletId}</p>
      <p>Real wallet UI coming in the next commit.</p>
      <button onClick={logout} className="secondary">Log out</button>
    </div>
  )
}
