import { api } from './client'
import type { Wallet } from './types'

export const walletApi = {
  me: () => api.get<Wallet>('/wallet/me').then((r) => r.data),
}
