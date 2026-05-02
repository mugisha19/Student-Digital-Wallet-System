import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import { transactionsApi } from '../api/transactions'
import { walletQueryKey } from '../hooks/useWallet'
import { transactionsQueryKey } from '../hooks/useTransactions'

export default function DepositForm() {
  const qc = useQueryClient()
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const mutation = useMutation({
    mutationFn: () =>
      transactionsApi.deposit({
        amount: Number(amount),
        description: description.trim() || undefined,
      }),
    onSuccess: (txn) => {
      setSuccess(`Deposited successfully. New balance: ${txn.balanceAfter}`)
      setAmount('')
      setDescription('')
      qc.invalidateQueries({ queryKey: walletQueryKey })
      qc.invalidateQueries({ queryKey: transactionsQueryKey })
    },
    onError: (err) => {
      const axiosErr = err as AxiosError<{ message?: string }>
      setError(axiosErr.response?.data?.message ?? 'Could not deposit. Please try again.')
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
        <label htmlFor="deposit-amount">Amount</label>
        <input
          id="deposit-amount"
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
        <label htmlFor="deposit-desc">Description (optional)</label>
        <input
          id="deposit-desc"
          maxLength={256}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? 'Depositing…' : 'Deposit'}
      </button>
    </form>
  )
}
