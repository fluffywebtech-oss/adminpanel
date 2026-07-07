import { useState } from 'react'
import { TrendingUp, Plus, Edit2, Trash2, Users, MapPin } from 'lucide-react'
import { useSupabaseCollection } from '../hooks/useSupabaseCollection'
import { formatPriceIndian } from '../data/mockData'
import { Modal, Confirm } from './Transactions'

const TYPES = ['Residential', 'Commercial', 'Land', 'REIT']
const STATUSES = ['Open', 'Filling Fast', 'Funded', 'Closed']
const STATUS_STYLE = {
  Open: 'bg-green-50 text-green-700', 'Filling Fast': 'bg-amber-50 text-amber-700',
  Funded: 'bg-blue-50 text-blue-700', Closed: 'bg-gray-100 text-gray-500',
}

const INIT = [
  { id: 1, name: 'DLF Privana — Fractional', type: 'Residential', location: 'Sector 77, Gurgaon', total: 75000000, min_invest: 1000000, yield: 8.2, appreciation: 14, funded: 68, investors: 42, tenure: '5 yrs', status: 'Open' },
  { id: 2, name: 'Cyber City Grade-A Office', type: 'Commercial', location: 'DLF Cyber City', total: 120000000, min_invest: 500000, yield: 9.5, appreciation: 10, funded: 84, investors: 128, tenure: '7 yrs', status: 'Filling Fast' },
]
const EMPTY = { name: '', type: 'Residential', location: '', total: '', min_invest: '', yield: '', appreciation: '', funded: 0, investors: 0, tenure: '', status: 'Open' }

export default function Investments() {
  const { rows, add, update, remove } = useSupabaseCollection('investments', INIT, { localKey: 'os_investments', ascending: false })
  const [showModal, setShowModal] = useState(false)
  const [showDelete, setShowDelete] = useState(null)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY)

  const aum = rows.reduce((s, r) => s + (Number(r.total) || 0), 0)
  const totalInvestors = rows.reduce((s, r) => s + (Number(r.investors) || 0), 0)

  const openAdd = () => { setEditing(null); setForm(EMPTY); setShowModal(true) }
  const openEdit = (r) => { setEditing(r.id); setForm({ ...EMPTY, ...r }); setShowModal(true) }
  const handleSave = () => {
    if (!form.name) return
    const num = ['total', 'min_invest', 'yield', 'appreciation', 'funded', 'investors']
    const payload = { ...form }; num.forEach(k => payload[k] = Number(form[k]) || 0)
    if (editing) update(editing, payload); else add(payload)
    setShowModal(false)
  }
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><TrendingUp className="w-6 h-6 text-primary-600" /> Investments</h1>
          <p className="text-gray-500 mt-1">Fractional ownership, REITs & yield-focused opportunities</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-primary-600 rounded-lg hover:bg-primary-700"><Plus className="w-4 h-4" /> New Opportunity</button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm"><div className="text-2xl font-extrabold text-gray-900">{rows.length}</div><div className="text-sm text-gray-500">Opportunities</div></div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm"><div className="text-2xl font-extrabold text-primary-600">{formatPriceIndian(aum)}</div><div className="text-sm text-gray-500">Assets under mgmt</div></div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm"><div className="text-2xl font-extrabold text-green-600">{totalInvestors}</div><div className="text-sm text-gray-500">Investors</div></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {rows.map(r => (
          <div key={r.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="font-bold text-gray-900 leading-snug">{r.name}</h3>
                <p className="text-xs text-gray-500 flex items-center gap-1 mt-1"><MapPin className="w-3 h-3" /> {r.location}</p>
              </div>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full shrink-0 ${STATUS_STYLE[r.status] || 'bg-gray-100 text-gray-500'}`}>{r.status}</span>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-4 text-sm">
              <KV label="Total size" v={formatPriceIndian(r.total)} />
              <KV label="Min invest" v={formatPriceIndian(r.min_invest)} />
              <KV label="Gross yield" v={`${r.yield}%`} color="text-green-600" />
              <KV label="Appreciation" v={`${r.appreciation}%`} color="text-blue-600" />
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-xs text-gray-500 mb-1"><span>{r.funded}% funded</span><span className="flex items-center gap-1"><Users className="w-3 h-3" /> {r.investors}</span></div>
              <div className="h-2 rounded-full bg-gray-100 overflow-hidden"><div className="h-full bg-primary-600 rounded-full" style={{ width: `${Math.min(r.funded, 100)}%` }} /></div>
            </div>
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
              <span className="text-xs text-gray-400">{r.type} · {r.tenure}</span>
              <div className="flex gap-1">
                <button onClick={() => openEdit(r)} className="p-1.5 rounded-md hover:bg-gray-100 text-blue-500"><Edit2 className="w-4 h-4" /></button>
                <button onClick={() => setShowDelete(r)} className="p-1.5 rounded-md hover:bg-gray-100 text-red-500"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        ))}
        {rows.length === 0 && <div className="col-span-full text-center py-12 text-gray-400">No opportunities yet.</div>}
      </div>

      {showModal && (
        <Modal title={editing ? 'Edit Opportunity' : 'New Opportunity'} onClose={() => setShowModal(false)} onSave={handleSave} saveLabel={editing ? 'Save' : 'Add'}>
          <Field className="sm:col-span-2" label="Name *"><input value={form.name} onChange={e => set('name', e.target.value)} className={inp} /></Field>
          <Field label="Type"><select value={form.type} onChange={e => set('type', e.target.value)} className={inp}>{TYPES.map(t => <option key={t}>{t}</option>)}</select></Field>
          <Field label="Location"><input value={form.location} onChange={e => set('location', e.target.value)} className={inp} /></Field>
          <Field label="Total size (₹)"><input type="number" value={form.total} onChange={e => set('total', e.target.value)} className={inp} /></Field>
          <Field label="Min invest (₹)"><input type="number" value={form.min_invest} onChange={e => set('min_invest', e.target.value)} className={inp} /></Field>
          <Field label="Gross yield (%)"><input type="number" step="0.1" value={form.yield} onChange={e => set('yield', e.target.value)} className={inp} /></Field>
          <Field label="Appreciation (%)"><input type="number" step="0.1" value={form.appreciation} onChange={e => set('appreciation', e.target.value)} className={inp} /></Field>
          <Field label="Funded (%)"><input type="number" value={form.funded} onChange={e => set('funded', e.target.value)} className={inp} /></Field>
          <Field label="Investors"><input type="number" value={form.investors} onChange={e => set('investors', e.target.value)} className={inp} /></Field>
          <Field label="Tenure"><input value={form.tenure} onChange={e => set('tenure', e.target.value)} placeholder="5 yrs" className={inp} /></Field>
          <Field label="Status"><select value={form.status} onChange={e => set('status', e.target.value)} className={inp}>{STATUSES.map(s => <option key={s}>{s}</option>)}</select></Field>
        </Modal>
      )}
      {showDelete && <Confirm title="Delete opportunity?" sub={showDelete.name} onCancel={() => setShowDelete(null)} onConfirm={() => { remove(showDelete.id); setShowDelete(null) }} />}
    </div>
  )
}

function KV({ label, v, color = 'text-gray-900' }) {
  return <div><div className="text-xs text-gray-400">{label}</div><div className={`font-bold ${color}`}>{v}</div></div>
}
const inp = 'w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200'
function Field({ label, children, className = '' }) {
  return <div className={className}><label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>{children}</div>
}
