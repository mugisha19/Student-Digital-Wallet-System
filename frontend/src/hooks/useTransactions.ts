import { useQuery } from '@tanstack/react-query'
import { transactionsApi } from '../api/transactions'

export const transactionsQueryKey = ['transactions', 'history'] as const

export function useTransactionHistory() {
  return useQuery({
    queryKey: transactionsQueryKey,
    queryFn: () => transactionsApi.history(0, 50),
    staleTime: 10_000,
  })
}
