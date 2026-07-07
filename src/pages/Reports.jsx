import { useMemo, useState } from 'react'
import { FileDown, Home, Inbox, CalendarClock, Handshake, TrendingUp, ScrollText, FileText, Download } from 'lucide-react'
import { useData } from '../context/DataContext'
import { useSupabaseCollection } from '../hooks/useSupabaseCollection'
import { getAudit, logAudit } from '../lib/audit'
import { downloadCsv, printReport, stamp } from '../lib/exportCsv'

const cr = (n) => (Number(n) >= 10000000 ? `₹${(n / 10000000).toFixed(2)} Cr` : `₹${Math.round(Number(n) / 100000)} L`)

export default function Reports() {
  const { properties } = useData()
  const { rows: leads } = useSupabaseCollection('leads', [], { localKey: 'os_leads', orderBy: 'created_at', ascending: false })
  const { rows: meetings } = useSupabaseCollection('meetings', [], { localKey: 'os_meetings', orderBy: 'id' })
  const { rows: deals } = useSupabaseCollection('deals', [], { localKey: 'os_deals', ascending: false })
  const { rows: investments } = useSupabaseCollection('investments', [], { localKey: 'os_investments', ascending: false })
  const audit = useMemo(() => getAudit(), [])
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')

  // date filter for time-stamped sets
  const inRange = (d) => { if (!d) return true; const x = String(d).slice(0, 10); return (!from || x >= from) && (!to || x <= to) }
  const leadsF = leads.filter(l => inRange(l.created_at))
  const meetingsF = meetings.filter(m => inRange(m.meet_date))

  const exportOne = (key, label, rows, columns) => {
    if (!rows.length) return
    downloadCsv(`propertyinsta-${key}-${stamp()}.csv`, rows, columns)
    logAudit('Exported report', `${rows.length} ${label} (CSV)`)
  }

  const datasets = [
    { key: 'properties', label: 'Properties', icon: Home, rows: properties, columns: ['id', 'title', 'location', 'price', { key: 'beds', label: 'beds' }, 'baths', 'sqft', 'type', 'builder', 'possessionStatus', 'status', 'featured', 'hot'] },
    { key: 'enquiries', label: 'Enquiries', icon: Inbox, rows: leadsF, columns: ['ref', 'intent', 'status', 'name', 'phone', 'email', 'property_title', 'visit_date', 'visit_time', 'created_at'] },
    { key: 'meetings', label: 'Meetings', icon: CalendarClock, rows: meetingsF, columns: ['name', 'phone', 'property', 'meet_date', 'meet_time', 'type', 'status', 'agent'] },
    { key: 'transactions', label: 'Transactions', icon: Handshake, rows: deals, columns: ['deal_code', 'property', 'buyer', 'value', 'stage', 'agent', 'deal_date'] },
    { key: 'investments', label: 'Investments', icon: TrendingUp, rows: investments, columns: ['name', 'type', 'location', 'total', 'min_invest', 'yield', 'appreciation', 'funded', 'investors', 'tenure', 'status'] },
    { key: 'audit', label: 'Audit log', icon: ScrollText, rows: audit, columns: ['ts', 'actor', 'action', 'target'] },
  ]

  const generatePdf = () => {
    const byCorridor = {}
    properties.forEach(p => { const c = (p.location || '').split(',').pop()?.trim() || 'Other'; byCorridor[c] = (byCorridor[c] || 0) + 1 })
    const top = Object.entries(byCorridor).sort((a, b) => b[1] - a[1]).slice(0, 6)
    const newLeads = leads.filter(l => (l.status || 'New') === 'New').length
    const pipeline = deals.reduce((s, d) => s + (Number(d.value) || 0), 0)
    const aum = investments.reduce((s, i) => s + (Number(i.total) || 0), 0)
    const html = `
      <h1>PropertyInsta — Business Report</h1>
      <div class="sub">${from || 'all time'} → ${to || 'today'}</div>
      <div class="grid">
        <div class="stat"><div class="n">${properties.length}</div><div class="l">Listings</div></div>
        <div class="stat"><div class="n">${leads.length}</div><div class="l">Enquiries (${newLeads} new)</div></div>
        <div class="stat"><div class="n">${meetings.length}</div><div class="l">Meetings</div></div>
        <div class="stat"><div class="n">${deals.length}</div><div class="l">Deals</div></div>
      </div>
      <div class="grid"><div class="stat"><div class="n">${cr(pipeline)}</div><div class="l">Deal pipeline</div></div>
        <div class="stat"><div class="n">${cr(aum)}</div><div class="l">Investments AUM</div></div></div>
      <h2>Inventory by area</h2>
      <table><tr><th>Area</th><th>Listings</th></tr>${top.map(([k, v]) => `<tr><td>${k}</td><td>${v}</td></tr>`).join('')}</table>
      <h2>Recent enquiries</h2>
      <table><tr><th>Name</th><th>Intent</th><th>Property</th><th>Status</th></tr>${leads.slice(0, 10).map(l => `<tr><td>${l.name || '-'}</td><td>${l.intent || '-'}</td><td>${l.property_title || '-'}</td><td>${l.status || 'New'}</td></tr>`).join('')}</table>`
    printReport('PropertyInsta Business Report', html)
    logAudit('Generated report', 'Business summary (PDF)')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><FileDown className="w-6 h-6 text-primary-600" /> Reports &amp; Export</h1>
          <p className="text-gray-500 mt-1">Download your data as CSV, or a printable PDF summary</p>
        </div>
        <button onClick={generatePdf} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-primary-600 rounded-lg hover:bg-primary-700"><FileText className="w-4 h-4" /> PDF summary</button>
      </div>

      {/* Date filter (applies to Enquiries & Meetings) */}
      <div className="flex items-center gap-3 flex-wrap bg-white border border-gray-100 rounded-xl p-3">
        <span className="text-sm font-medium text-gray-600">Date range</span>
        <input type="date" value={from} onChange={e => setFrom(e.target.value)} className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg" />
        <span className="text-gray-400">→</span>
        <input type="date" value={to} onChange={e => setTo(e.target.value)} className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg" />
        {(from || to) && <button onClick={() => { setFrom(''); setTo('') }} className="text-xs text-primary-600 hover:underline">clear</button>}
        <span className="text-xs text-gray-400 ml-auto">Applies to Enquiries &amp; Meetings exports</span>
      </div>

      {/* Export cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {datasets.map(d => (
          <div key={d.key} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center shrink-0"><d.icon className="w-5 h-5" /></div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-gray-900">{d.label}</div>
              <div className="text-xs text-gray-500">{d.rows.length} row{d.rows.length === 1 ? '' : 's'}</div>
            </div>
            <button onClick={() => exportOne(d.key, d.label, d.rows, d.columns)} disabled={!d.rows.length}
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-white bg-gray-900 rounded-lg hover:bg-gray-700 disabled:opacity-40">
              <Download className="w-4 h-4" /> CSV
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
