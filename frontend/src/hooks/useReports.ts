import { useQuery } from '@tanstack/react-query'
import { reportsApi } from '../api/reports'

export function useTotals() {
  return useQuery({
    queryKey: ['reports', 'totals'],
    queryFn: reportsApi.totals,
    staleTime: 30_000,
  })
}

export function useDaily(from?: string, to?: string) {
  return useQuery({
    queryKey: ['reports', 'daily', from ?? '', to ?? ''],
    queryFn: () => reportsApi.daily(from, to),
    staleTime: 30_000,
  })
}
