import { useMemo, useState } from 'react'
import { Inbox, Phone, MessageCircle, Trash2, RefreshCw, Calendar, Mail, Home, Search } from 'lucide-react'
import { useSupabaseCollection } from '../hooks/useSupabaseCollection'

// Website enquiries captured by the consumer site's lead funnel (shared `leads` table).
const INTENT = {
  contact:  { icon: '💬', label: 'Enquiry',    badge: 'bg-blue-50 text-blue-700' },
  visit:    { icon: '📅', label: 'Site Visit', badge: 'bg-amber-50 text-amber-700' },
  callback: { icon: '📞', label: 'Callback',   badge: 'bg-indigo-50 text-indigo-700' },
}
const STATUSES = ['New', 'Contacted', 'Visit Booked', 'Closed']
const STATUS_STYLE = {
  New: 'bg-teal-50 text-teal-700 border-teal-200',
  Contacted: 'bg-blue-50 text-blue-700 border-blue-200',
  'Visit Booked': 'bg-amber-50 text-amber-700 border-amber-200',
  Closed: 'bg-gray-100 text-gray-500 border-gray-200',
}

const digits = (p = '') => { const d = String(p).replace(/\D/g, ''); return d.length === 10 ? '91' + d : d }
const waLink = (phone, name, title) =>
  `https://wa.me/${digits(phone)}?text=${encodeURIComponent(`Hi ${name || ''}, regarding your enquiry for "${title || 'the property'}" on PropertyInsta — `)}`
const timeAgo = (iso) => {
  if (!iso) return ''
  const m = Math.floor((Date.now() - new Date(iso).getTime()) / 60000)
  if (m < 1) return 'just now'; if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60); if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

export default function Enquiries() {
  const { rows, update, remove, loading, dbReady } = useSupabaseCollection('leads', [], {
    localKey: 'os_leads', orderBy: 'created_at', ascending: false,
  })
  const [statusFilter, setStatusFilter] = useState('all')
  const [search, setSearch] = useState('')

  const stats = useMemo(() => ({
    total: rows.length,
    fresh: rows.filter(r => (r.status || 'New') === 'New').length,
    visits: rows.filter(r => r.intent === 'visit').length,
  }), [rows])

  const filtered = rows.filter(r => {
    if (statusFilter !== 'all' && (r.status || 'New') !== statusFilter) return false
    if (search) {
      const q = search.toLowerCase()
      if (!`${r.name} ${r.phone} ${r.property_title} ${r.ref}`.toLowerCase().includes(q)) return false
    }
    return true
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Inbox className="w-6 h-6 text-primary-600" /> Website Enquiries
          </h1>
          <p className="text-gray-500 mt-1">
            Leads captured live from the consumer site’s Contact / Site Visit / Callback funnel.
            {!dbReady && <span className="ml-1 text-amber-600">· offline (run leads_table.sql to sync)</span>}
          </p>
        </div>
        <button onClick={() => window.location.reload()} className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <div className="text-2xl font-extrabold text-gray-900">{stats.total}</div>
          <div className="text-sm text-gray-500">Total enquiries</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <div className="text-2xl font-extrabold text-teal-600">{stats.fresh}</div>
          <div className="text-sm text-gray-500">New / untouched</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <div className="text-2xl font-extrabold text-amber-600">{stats.visits}</div>
          <div className="text-sm text-gray-500">Site-visit requests</div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search name, phone, property, ref…"
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200"
          />
        </div>
        <div className="flex gap-1.5">
          {['all', ...STATUSES].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-full border ${statusFilter === s ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-gray-500 border-gray-200 hover:text-gray-800'}`}>
              {s === 'all' ? `All (${rows.length})` : s}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="text-center py-16 text-gray-400">Loading…</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400 bg-white rounded-xl border border-dashed border-gray-200">
          <Inbox className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p className="font-medium text-gray-600">No enquiries{statusFilter !== 'all' ? ` with status “${statusFilter}”` : ' yet'}.</p>
          <p className="text-sm mt-1">They appear here the moment a visitor contacts an agent, books a visit, or requests a callback.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(r => {
            const meta = INTENT[r.intent] || INTENT.contact
            const status = r.status || 'New'
            return (
              <div key={r.ref || r.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${meta.badge}`}>{meta.icon} {meta.label}</span>
                    {r.ref && <span className="text-xs font-mono font-semibold text-gray-400">{r.ref}</span>}
                    <span className="text-xs text-gray-400 ml-auto">{timeAgo(r.created_at)}</span>
                  </div>
                  <h3 className="text-base font-bold text-gray-900">{r.name || 'Unnamed'}</h3>
                  {r.property_title && <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-0.5"><Home className="w-3.5 h-3.5" /> {r.property_title}</p>}
                  <div className="flex items-center gap-4 mt-1.5 text-sm text-gray-700 flex-wrap">
                    <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-gray-400" /> {r.phone || '—'}</span>
                    {r.email && <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-gray-400" /> {r.email}</span>}
                    {r.intent === 'visit' && r.visit_date && <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-gray-400" /> {r.visit_date} {r.visit_time}</span>}
                  </div>
                  {r.message && <p className="text-sm text-gray-500 italic mt-2">“{r.message}”</p>}
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <select
                    value={status}
                    onChange={e => update(r.id, { status: e.target.value })}
                    className={`text-xs font-bold px-2.5 py-1.5 rounded-lg border cursor-pointer ${STATUS_STYLE[status]}`}>
                    {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <div className="flex gap-1.5">
                    {r.phone && (
                      <a href={waLink(r.phone, r.name, r.property_title)} target="_blank" rel="noopener noreferrer"
                        className="w-9 h-9 flex items-center justify-center rounded-lg bg-green-500 text-white hover:bg-green-600" title="WhatsApp">
                        <MessageCircle className="w-4 h-4" />
                      </a>
                    )}
                    {r.phone && (
                      <a href={`tel:+${digits(r.phone)}`} className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50" title="Call">
                        <Phone className="w-4 h-4" />
                      </a>
                    )}
                    <button onClick={() => { if (window.confirm(`Delete enquiry ${r.ref || ''}?`)) remove(r.id) }}
                      className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-red-500 hover:bg-red-50" title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
