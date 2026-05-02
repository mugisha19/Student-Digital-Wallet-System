import { useQuery } from '@tanstack/react-query'
import { walletApi } from '../api/wallet'

export const walletQueryKey = ['wallet', 'me'] as const

export function useWallet() {
  return useQuery({
    queryKey: walletQueryKey,
    queryFn: walletApi.me,
    staleTime: 15_000,
  })
}
