import { useTransactionHistory } from '../hooks/useTransactions'
import TransactionList from '../components/TransactionList'

export default function Transactions() {
  const { data, isLoading, isError } = useTransactionHistory()

  return (
    <div className="page">
      <h1>Transactions</h1>

      {isError && <div className="alert error">Couldn't load history.</div>}

      <h2>History</h2>
      <div className="card">
        <TransactionList transactions={data} isLoading={isLoading} />
      </div>
    </div>
  )
}
