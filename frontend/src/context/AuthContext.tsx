import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { tokenStore } from '../api/client'
import { authApi } from '../api/auth'
import type { LoginResponse, StudentProfile } from '../api/types'

const STUDENT_KEY = 'studentwallet.student'

type AuthState = {
  student: StudentProfile | null
  ready: boolean
  login: (studentNumber: string, pin: string) => Promise<LoginResponse>
  logout: () => void
  setStudent: (s: StudentProfile) => void
}

const AuthCtx = createContext<AuthState | null>(null)

function loadStudent(): StudentProfile | null {
  const raw = localStorage.getItem(STUDENT_KEY)
  if (!raw) return null
  try { return JSON.parse(raw) as StudentProfile } catch { return null }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [student, setStudentState] = useState<StudentProfile | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (tokenStore.get()) {
      setStudentState(loadStudent())
    }
    setReady(true)
  }, [])

  const setStudent = useCallback((s: StudentProfile) => {
    localStorage.setItem(STUDENT_KEY, JSON.stringify(s))
    setStudentState(s)
  }, [])

  const login = useCallback(async (studentNumber: string, pin: string) => {
    const res = await authApi.login(studentNumber, pin)
    tokenStore.set(res.token)
    localStorage.setItem(STUDENT_KEY, JSON.stringify(res.student))
    setStudentState(res.student)
    return res
  }, [])

  const logout = useCallback(() => {
    tokenStore.clear()
    localStorage.removeItem(STUDENT_KEY)
    setStudentState(null)
  }, [])

  const value = useMemo<AuthState>(
    () => ({ student, ready, login, logout, setStudent }),
    [student, ready, login, logout, setStudent],
  )

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthCtx)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
