import { api } from './client'
import type { DailySummary, Totals } from './types'

export const reportsApi = {
  totals: () => api.get<Totals>('/reports/totals').then((r) => r.data),

  daily: (from?: string, to?: string) =>
    api
      .get<DailySummary[]>('/reports/daily', { params: { from, to } })
      .then((r) => r.data),
}
