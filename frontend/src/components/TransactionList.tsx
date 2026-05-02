import { ServiceCategory, TransactionType } from '../api/types'
import type { Transaction } from '../api/types'
import Money from './Money'

const typeLabel: Record<number, string> = {
  [TransactionType.Deposit]: 'Deposit',
  [TransactionType.Payment]: 'Payment',
  [TransactionType.TransferOut]: 'Transfer out',
  [TransactionType.TransferIn]: 'Transfer in',
}

const typeClass: Record<number, string> = {
  [TransactionType.Deposit]: 'pos',
  [TransactionType.Payment]: 'neg',
  [TransactionType.TransferOut]: 'neg',
  [TransactionType.TransferIn]: 'pos',
}

const categoryLabel: Record<number, string> = {
  [ServiceCategory.Cafeteria]: 'Cafeteria',
  [ServiceCategory.Printing]: 'Printing',
  [ServiceCategory.Transport]: 'Transport',
}

function descriptionFor(t: Transaction): string {
  if (t.type === TransactionType.Payment && t.serviceCategory != null) {
    const cat = categoryLabel[t.serviceCategory] ?? 'Service'
    return t.description ? `${cat} — ${t.description}` : cat
  }
  if (t.type === TransactionType.TransferOut && t.counterpartyStudentNumber) {
    return t.description ? `To ${t.counterpartyStudentNumber} — ${t.description}` : `To ${t.counterpartyStudentNumber}`
  }
  if (t.type === TransactionType.TransferIn && t.counterpartyStudentNumber) {
    return t.description ? `From ${t.counterpartyStudentNumber} — ${t.description}` : `From ${t.counterpartyStudentNumber}`
  }
  return t.description ?? ''
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleString(undefined, {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}

type Props = {
  transactions: Transaction[] | undefined
  isLoading?: boolean
}

export default function TransactionList({ transactions, isLoading }: Props) {
  if (isLoading) return <div className="muted">Loading…</div>
  if (!transactions || transactions.length === 0) {
    return <div className="muted empty-state">No transactions yet.</div>
  }

  return (
    <ul className="txn-list">
      {transactions.map((t) => {
        const positive = typeClass[t.type] === 'pos'
        return (
          <li key={t.id} className="txn-row">
            <div className="txn-main">
              <div className="txn-type">{typeLabel[t.type] ?? `Type ${t.type}`}</div>
              <div className="txn-desc muted">{descriptionFor(t)}</div>
            </div>
            <div className="txn-meta">
              <div className={`txn-amount ${positive ? 'pos' : 'neg'}`}>
                {positive ? '+' : '−'}<Money value={t.amount} />
              </div>
              <div className="txn-time muted">{formatDate(t.createdAt)}</div>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
