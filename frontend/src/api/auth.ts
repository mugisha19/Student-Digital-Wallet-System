import { api } from './client'
import type { LoginResponse, StudentProfile } from './types'

export const authApi = {
  login: (studentNumber: string, pin: string) =>
    api.post<LoginResponse>('/auth/login', { studentNumber, pin }).then((r) => r.data),

  register: (studentNumber: string, name: string, pin: string) =>
    api.post<StudentProfile>('/auth/register', { studentNumber, name, pin }).then((r) => r.data),
}
