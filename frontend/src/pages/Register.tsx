import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import type { AxiosError } from 'axios'
import { authApi } from '../api/auth'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [studentNumber, setStudentNumber] = useState('')
  const [name, setName] = useState('')
  const [pin, setPin] = useState('')
  const [confirmPin, setConfirmPin] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function submit() {
    setError(null)
    if (pin !== confirmPin) {
      setError('PINs do not match.')
      return
    }
    setSubmitting(true)
    try {
      await authApi.register(studentNumber.trim(), name.trim(), pin)
      await login(studentNumber.trim(), pin)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      const axiosErr = err as AxiosError<{ message?: string }>
      const status = axiosErr.response?.status
      if (status === 409) {
        setError(axiosErr.response?.data?.message ?? 'Student ID already in use.')
      } else if (status === 400) {
        setError('Please check your entries and try again.')
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
        <h1>Create your wallet</h1>
        <p className="muted">Pick a Student ID, name, and 4–8 digit PIN.</p>

        {error && <div className="alert error">{error}</div>}

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
            <label htmlFor="name">Full name</label>
            <input
              id="name"
              autoComplete="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={100}
            />
          </div>

          <div className="field">
            <label htmlFor="pin">PIN</label>
            <input
              id="pin"
              type="password"
              inputMode="numeric"
              autoComplete="new-password"
              required
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              minLength={4}
              maxLength={8}
            />
          </div>

          <div className="field">
            <label htmlFor="confirmPin">Confirm PIN</label>
            <input
              id="confirmPin"
              type="password"
              inputMode="numeric"
              autoComplete="new-password"
              required
              value={confirmPin}
              onChange={(e) => setConfirmPin(e.target.value)}
              minLength={4}
              maxLength={8}
            />
          </div>

          <button type="submit" disabled={submitting} className="full">
            {submitting ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="auth-foot">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
