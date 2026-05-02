import { useState } from 'react'
import { useTransactionHistory } from '../hooks/useTransactions'
import { useAuth } from '../context/AuthContext'
import { TransactionType, ServiceCategory } from '../api/types'
import TransactionList from '../components/TransactionList'
import DepositForm from '../components/DepositForm'
import PaymentForm from '../components/PaymentForm'
import TransferForm from '../components/TransferForm'
import { downloadCsv, todayStamp } from '../utils/csv'

type Tab = 'deposit' | 'pay' | 'transfer'

const typeName: Record<number, string> = {
  [TransactionType.Deposit]: 'Deposit',
  [TransactionType.Payment]: 'Payment',
  [TransactionType.TransferOut]: 'TransferOut',
  [TransactionType.TransferIn]: 'TransferIn',
}
const categoryName: Record<number, string> = {
  [ServiceCategory.Cafeteria]: 'Cafeteria',
  [ServiceCategory.Printing]: 'Printing',
  [ServiceCategory.Transport]: 'Transport',
}

export default function Transactions() {
  const { student } = useAuth()
  const { data, isLoading, isError } = useTransactionHistory()
  const [tab, setTab] = useState<Tab>('deposit')

  function exportHistory() {
    if (!data || data.length === 0) return
    downloadCsv(
      `wallet-history-${student?.studentNumber ?? 'student'}-${todayStamp()}.csv`,
      ['Date', 'Type', 'Amount (RWF)', 'Balance after (RWF)', 'Service', 'Counterparty', 'Description'],
      data.map((t) => [
        t.createdAt,
        typeName[t.type] ?? String(t.type),
        t.amount,
        t.balanceAfter,
        t.serviceCategory != null ? (categoryName[t.serviceCategory] ?? '') : '',
        t.counterpartyStudentNumber ?? '',
        t.description ?? '',
      ]),
    )
  }

  return (
    <div className="page">
      <h1>Transactions</h1>

      <div className="card op-card">
        <div className="op-tabs">
          <button
            type="button"
            className={`op-tab ${tab === 'deposit' ? 'active' : ''}`}
            onClick={() => setTab('deposit')}
          >Deposit</button>
          <button
            type="button"
            className={`op-tab ${tab === 'pay' ? 'active' : ''}`}
            onClick={() => setTab('pay')}
          >Pay for service</button>
          <button
            type="button"
            className={`op-tab ${tab === 'transfer' ? 'active' : ''}`}
            onClick={() => setTab('transfer')}
          >Transfer</button>
        </div>
        <div className="op-body">
          {tab === 'deposit' && <DepositForm />}
          {tab === 'pay' && <PaymentForm />}
          {tab === 'transfer' && <TransferForm />}
        </div>
      </div>

      <div className="section-head">
        <h2>History</h2>
        <button
          className="secondary"
          onClick={exportHistory}
          disabled={!data || data.length === 0}
        >Export CSV</button>
      </div>

      <div className="card">
        {isError && <div className="alert error">Couldn't load history.</div>}
        <TransactionList transactions={data} isLoading={isLoading} />
      </div>
    </div>
  )
}
