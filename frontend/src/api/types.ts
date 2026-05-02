export type StudentProfile = {
  id: number
  studentNumber: string
  name: string
  walletId: number
}

export type LoginResponse = {
  token: string
  expiresAt: string
  student: StudentProfile
}

export type Wallet = {
  walletId: number
  studentId: number
  studentNumber: string
  name: string
  balance: number
}

export const TransactionType = {
  Deposit: 1,
  Payment: 2,
  TransferOut: 3,
  TransferIn: 4,
} as const
export type TransactionType = (typeof TransactionType)[keyof typeof TransactionType]

export const ServiceCategory = {
  Cafeteria: 1,
  Printing: 2,
  Transport: 3,
} as const
export type ServiceCategory = (typeof ServiceCategory)[keyof typeof ServiceCategory]

export type Transaction = {
  id: number
  type: TransactionType
  amount: number
  balanceAfter: number
  serviceCategory: ServiceCategory | null
  counterpartyStudentNumber: string | null
  description: string | null
  createdAt: string
}

export type DailySummary = {
  date: string
  deposits: number
  payments: number
  transfersIn: number
  transfersOut: number
}

export type Totals = {
  totalDeposits: number
  totalPayments: number
  totalTransfersIn: number
  totalTransfersOut: number
}
