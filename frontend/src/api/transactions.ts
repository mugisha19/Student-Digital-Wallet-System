import { api } from './client'
import type { ServiceCategory, Transaction } from './types'

export type DepositInput = { amount: number; description?: string }
export type PaymentInput = { amount: number; serviceCategory: ServiceCategory; description?: string }
export type TransferInput = { receiverStudentNumber: string; amount: number; description?: string }

export const transactionsApi = {
  history: (skip = 0, take = 50) =>
    api.get<Transaction[]>('/transactions', { params: { skip, take } }).then((r) => r.data),

  deposit: (input: DepositInput) =>
    api.post<Transaction>('/transactions/deposit', input).then((r) => r.data),

  pay: (input: PaymentInput) =>
    api.post<Transaction>('/transactions/pay', input).then((r) => r.data),

  transfer: (input: TransferInput) =>
    api.post<Transaction>('/transactions/transfer', input).then((r) => r.data),
}
