import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import type { AxiosError } from 'axios'
import { useAuth } from '../context/AuthContext'

type LocationState = { from?: string } | null

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as LocationState)?.from ?? '/dashboard'

  const [studentNumber, setStudentNumber] = useState('')
  const [pin, setPin] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [warning, setWarning] = useState<string | null>(null)

  async function submit() {
    setError(null)
    setWarning(null)
    setSubmitting(true)
    try {
      await login(studentNumber.trim(), pin)
      navigate(from, { replace: true })
    } catch (err) {
      const axiosErr = err as AxiosError<{ message?: string; attemptsRemaining?: number }>
      const status = axiosErr.response?.status
      const data = axiosErr.response?.data
      if (status === 401 && typeof data?.attemptsRemaining === 'number') {
        setError(`Invalid PIN. ${data.attemptsRemaining} attempt${data.attemptsRemaining === 1 ? '' : 's'} remaining.`)
      } else if (status === 423) {
        setError(data?.message ?? 'Account locked due to too many failed attempts.')
      } else if (status === 404) {
        setError('Student not found.')
      } else if (status === 400) {
        setError('Please enter a valid Student ID and PIN.')
      } else {
        setError('Something went wrong. Please try again.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="card auth-card">
        <h1>Student Digital Wallet</h1>
        <p className="muted">Sign in with your Student ID and PIN.</p>

        {error && <div className="alert error">{error}</div>}
        {warning && <div className="alert warning">{warning}</div>}

        <form onSubmit={(e) => { e.preventDefault(); void submit() }}>
          <div className="field">
            <label htmlFor="studentNumber">Student ID</label>
            <input
              id="studentNumber"
              autoComplete="username"
              required
              value={studentNumber}
              onChange={(e) => setStudentNumber(e.target.value)}
              maxLength={32}
            />
          </div>

          <div className="field">
            <label htmlFor="pin">PIN</label>
            <input
              id="pin"
              type="password"
              inputMode="numeric"
              autoComplete="current-password"
              required
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              minLength={4}
              maxLength={8}
            />
          </div>

          <button type="submit" disabled={submitting} className="full">
            {submitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="auth-foot">
          New here? <Link to="/register">Create an account</Link>
        </p>
      </div>
    </div>
  )
}
