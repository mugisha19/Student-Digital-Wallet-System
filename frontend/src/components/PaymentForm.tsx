import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import { transactionsApi } from '../api/transactions'
import { ServiceCategory } from '../api/types'
import { walletQueryKey } from '../hooks/useWallet'
import { transactionsQueryKey } from '../hooks/useTransactions'

const categories = [
  { value: ServiceCategory.Cafeteria, label: 'Cafeteria' },
  { value: ServiceCategory.Printing, label: 'Printing' },
  { value: ServiceCategory.Transport, label: 'Transport' },
]

export default function PaymentForm() {
  const qc = useQueryClient()
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState<number>(ServiceCategory.Cafeteria)
  const [description, setDescription] = useState('')
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const mutation = useMutation({
    mutationFn: () =>
      transactionsApi.pay({
        amount: Number(amount),
        serviceCategory: category as ServiceCategory,
        description: description.trim() || undefined,
      }),
    onSuccess: (txn) => {
      setSuccess(`Payment recorded. New balance: ${txn.balanceAfter}`)
      setAmount('')
      setDescription('')
      qc.invalidateQueries({ queryKey: walletQueryKey })
      qc.invalidateQueries({ queryKey: transactionsQueryKey })
    },
    onError: (err) => {
      const axiosErr = err as AxiosError<{ message?: string }>
      setError(axiosErr.response?.data?.message ?? 'Payment failed.')
    },
  })

  function submit() {
    setError(null)
    setSuccess(null)
    const n = Number(amount)
    if (!Number.isFinite(n) || n <= 0) {
      setError('Enter a positive amount.')
      return
    }
    mutation.mutate()
  }

  return (
    <form className="op-form" onSubmit={(e) => { e.preventDefault(); submit() }}>
      {error && <div className="alert error">{error}</div>}
      {success && <div className="alert success">{success}</div>}

      <div className="field">
        <label htmlFor="pay-category">Service</label>
        <select
          id="pay-category"
          value={category}
          onChange={(e) => setCategory(Number(e.target.value))}
        >
          {categories.map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
      </div>

      <div className="field">
        <label htmlFor="pay-amount">Amount</label>
        <input
          id="pay-amount"
          type="number"
          inputMode="numeric"
          min="1"
          step="1"
          required
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>

      <div className="field">
        <label htmlFor="pay-desc">Note (optional)</label>
        <input
          id="pay-desc"
          maxLength={256}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? 'Processing…' : 'Pay'}
      </button>
    </form>
  )
}
