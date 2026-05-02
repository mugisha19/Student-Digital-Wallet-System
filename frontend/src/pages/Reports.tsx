import { useTotals, useDaily } from '../hooks/useReports'
import { useAuth } from '../context/AuthContext'
import Money from '../components/Money'
import { downloadCsv, todayStamp } from '../utils/csv'

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
  })
}

export default function Reports() {
  const { student } = useAuth()
  const totals = useTotals()
  const daily = useDaily()

  const t = totals.data
  const net = t ? t.totalDeposits + t.totalTransfersIn - t.totalPayments - t.totalTransfersOut : 0

  const studentTag = student?.studentNumber ?? 'student'

  function exportTotals() {
    if (!t) return
    downloadCsv(
      `wallet-totals-${studentTag}-${todayStamp()}.csv`,
      ['Metric', 'Amount (RWF)'],
      [
        ['Deposits', t.totalDeposits],
        ['Payments', t.totalPayments],
        ['Transfers in', t.totalTransfersIn],
        ['Transfers out', t.totalTransfersOut],
        ['Net', net],
      ],
    )
  }

  function exportDaily() {
    if (!daily.data || daily.data.length === 0) return
    downloadCsv(
      `wallet-daily-${studentTag}-${todayStamp()}.csv`,
      ['Date', 'Deposits (RWF)', 'Payments (RWF)', 'Transfers in (RWF)', 'Transfers out (RWF)'],
      daily.data.map((d) => [d.date, d.deposits, d.payments, d.transfersIn, d.transfersOut]),
    )
  }

  return (
    <div className="page">
      <h1>Reports</h1>

      {totals.isError && <div className="alert error">Couldn't load totals.</div>}

      <div className="section-head">
        <h2>Totals</h2>
        <button className="secondary" onClick={exportTotals} disabled={!t}>Export CSV</button>
      </div>

      <section className="totals-grid">
        <div className="card stat">
          <div className="muted">Deposits</div>
          <div className="stat-value pos"><Money value={t?.totalDeposits ?? 0} /></div>
        </div>
        <div className="card stat">
          <div className="muted">Payments</div>
          <div className="stat-value neg"><Money value={t?.totalPayments ?? 0} /></div>
        </div>
        <div className="card stat">
          <div className="muted">Transfers in</div>
          <div className="stat-value pos"><Money value={t?.totalTransfersIn ?? 0} /></div>
        </div>
        <div className="card stat">
          <div className="muted">Transfers out</div>
          <div className="stat-value neg"><Money value={t?.totalTransfersOut ?? 0} /></div>
        </div>
        <div className="card stat span-all">
          <div className="muted">Net (deposits + in − payments − out)</div>
          <div className={`stat-value ${net >= 0 ? 'pos' : 'neg'}`}><Money value={net} /></div>
        </div>
      </section>

      <div className="section-head">
        <h2>Daily summary</h2>
        <button
          className="secondary"
          onClick={exportDaily}
          disabled={!daily.data || daily.data.length === 0}
        >Export CSV</button>
      </div>

      <div className="card">
        {daily.isLoading && <div className="muted">Loading…</div>}
        {daily.isError && <div className="alert error">Couldn't load daily summary.</div>}
        {daily.data && daily.data.length === 0 && (
          <div className="muted empty-state">No activity yet.</div>
        )}
        {daily.data && daily.data.length > 0 && (
          <div className="daily-table-wrap">
            <table className="daily-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Deposits</th>
                  <th>Payments</th>
                  <th>Transfers in</th>
                  <th>Transfers out</th>
                </tr>
              </thead>
              <tbody>
                {daily.data.map((d) => (
                  <tr key={d.date}>
                    <td>{formatDate(d.date)}</td>
                    <td className="num pos"><Money value={d.deposits} /></td>
                    <td className="num neg"><Money value={d.payments} /></td>
                    <td className="num pos"><Money value={d.transfersIn} /></td>
                    <td className="num neg"><Money value={d.transfersOut} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
