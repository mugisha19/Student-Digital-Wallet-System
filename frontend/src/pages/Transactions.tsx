import { useState } from 'react'
import { useTransactionHistory } from '../hooks/useTransactions'
import TransactionList from '../components/TransactionList'
import DepositForm from '../components/DepositForm'

type Tab = 'deposit' | 'pay' | 'transfer'

export default function Transactions() {
  const { data, isLoading, isError } = useTransactionHistory()
  const [tab, setTab] = useState<Tab>('deposit')

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
          {tab === 'pay' && <div className="muted">Payment form coming next.</div>}
          {tab === 'transfer' && <div className="muted">Transfer form coming next.</div>}
        </div>
      </div>

      <h2>History</h2>
      <div className="card">
        {isError && <div className="alert error">Couldn't load history.</div>}
        <TransactionList transactions={data} isLoading={isLoading} />
      </div>
    </div>
  )
}
