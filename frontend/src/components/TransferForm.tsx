import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import { transactionsApi } from '../api/transactions'
import { walletQueryKey } from '../hooks/useWallet'
import { transactionsQueryKey } from '../hooks/useTransactions'

export default function TransferForm() {
  const qc = useQueryClient()
  const [receiver, setReceiver] = useState('')
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const mutation = useMutation({
    mutationFn: () =>
      transactionsApi.transfer({
        receiverStudentNumber: receiver.trim(),
        amount: Number(amount),
        description: description.trim() || undefined,
      }),
    onSuccess: (txn) => {
      setSuccess(`Sent to ${txn.counterpartyStudentNumber}. New balance: ${txn.balanceAfter}`)
      setReceiver('')
      setAmount('')
      setDescription('')
      qc.invalidateQueries({ queryKey: walletQueryKey })
      qc.invalidateQueries({ queryKey: transactionsQueryKey })
    },
    onError: (err) => {
      const axiosErr = err as AxiosError<{ message?: string }>
      const status = axiosErr.response?.status
      if (status === 404) {
        setError(axiosErr.response?.data?.message ?? 'Receiver not found.')
      } else {
        setError(axiosErr.response?.data?.message ?? 'Transfer failed.')
      }
    },
  })

  function submit() {
    setError(null)
    setSuccess(null)
    if (!receiver.trim()) {
      setError('Enter the receiver Student ID.')
      return
    }
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
        <label htmlFor="xfer-receiver">Receiver Student ID</label>
        <input
          id="xfer-receiver"
          required
          maxLength={32}
          value={receiver}
          onChange={(e) => setReceiver(e.target.value)}
        />
      </div>

      <div className="field">
        <label htmlFor="xfer-amount">Amount</label>
        <input
          id="xfer-amount"
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
        <label htmlFor="xfer-desc">Note (optional)</label>
        <input
          id="xfer-desc"
          maxLength={256}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? 'Sending…' : 'Send transfer'}
      </button>
    </form>
  )
}
