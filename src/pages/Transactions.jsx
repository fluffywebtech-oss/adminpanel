import { useState } from 'react'
import { Handshake, Plus, Edit2, Trash2, X, ChevronRight, AlertTriangle, IndianRupee } from 'lucide-react'
import { useSupabaseCollection } from '../hooks/useSupabaseCollection'
import { formatPriceIndian } from '../data/mockData'

const STAGES = ['Interested', 'Offer', 'Negotiation', 'Agreement', 'Registered']
const STAGE_STYLE = ['bg-gray-100 text-gray-600', 'bg-blue-50 text-blue-700', 'bg-amber-50 text-amber-700', 'bg-purple-50 text-purple-700', 'bg-green-50 text-green-700']

const INIT_DEALS = [
  { id: 1, deal_code: 'DL-2026-001', property: 'DLF Privana South – 4 BHK', buyer: 'Arjun Sharma', value: 75000000, stage: 2, agent: 'Rajiv Malhotra', deal_date: '2026-06-10' },
  { id: 2, deal_code: 'DL-2026-002', property: 'Godrej Aristocrat – 3 BHK', buyer: 'Priya Nair', value: 32000000, stage: 4, agent: 'Priya Sharma', deal_date: '2026-06-05' },
  { id: 3, deal_code: 'DL-2026-003', property: 'Emaar Urban Ascent – 3 BHK', buyer: 'Rohit Verma', value: 52500000, stage: 1, agent: 'Vikram Gupta', deal_date: '2026-06-12' },
]

const EMPTY = { deal_code: '', property: '', buyer: '', value: '', stage: 0, agent: '', deal_date: new Date().toISOString().split('T')[0] }

export default function Transactions() {
  const { rows: deals, add, update, remove } = useSupabaseCollection('deals', INIT_DEALS, { localKey: 'os_deals', ascending: false })
  const [showModal, setShowModal] = useState(false)
  const [showDelete, setShowDelete] = useState(null)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY)

  const pipelineValue = deals.reduce((s, d) => s + (Number(d.value) || 0), 0)
  const registered = deals.filter(d => d.stage === 4).length

  const openAdd = () => { setEditing(null); setForm(EMPTY); setShowModal(true) }
  const openEdit = (d) => { setEditing(d.id); setForm({ ...EMPTY, ...d, value: d.value }); setShowModal(true) }
  const advance = (d) => { if (d.stage < 4) update(d.id, { stage: d.stage + 1 }) }

  const handleSave = () => {
    if (!form.property) return
    const payload = { ...form, value: Number(form.value) || 0, stage: Number(form.stage) }
    if (editing) update(editing, payload); else add(payload)
    setShowModal(false)
  }
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><Handshake className="w-6 h-6 text-primary-600" /> Transactions</h1>
          <p className="text-gray-500 mt-1">Deal room — offers, negotiations & registrations</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-primary-600 rounded-lg hover:bg-primary-700"><Plus className="w-4 h-4" /> New Deal</button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Stat n={deals.length} label="Active deals" />
        <Stat n={formatPriceIndian(pipelineValue)} label="Pipeline value" color="text-primary-600" />
        <Stat n={registered} label="Registered" color="text-green-600" />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="hidden md:grid grid-cols-[1.1fr_1.6fr_1fr_1fr_1.2fr_0.9fr] gap-3 px-4 py-3 bg-gray-50 text-xs font-bold uppercase tracking-wide text-gray-500">
          <span>Deal</span><span>Property</span><span>Buyer</span><span>Value</span><span>Stage</span><span className="text-right">Actions</span>
        </div>
        {deals.map(d => (
          <div key={d.id} className="grid grid-cols-2 md:grid-cols-[1.1fr_1.6fr_1fr_1fr_1.2fr_0.9fr] gap-3 px-4 py-3 border-t border-gray-100 items-center text-sm">
            <span className="font-mono text-xs font-semibold text-gray-500">{d.deal_code || '—'}</span>
            <span className="font-medium text-gray-900 truncate">{d.property}</span>
            <span className="text-gray-600">{d.buyer || '—'}</span>
            <span className="font-bold text-gray-900">{formatPriceIndian(d.value)}</span>
            <span><span className={`text-xs font-bold px-2 py-1 rounded-full ${STAGE_STYLE[d.stage]}`}>{STAGES[d.stage]}</span></span>
            <div className="flex justify-end gap-1">
              {d.stage < 4 && <button onClick={() => advance(d)} className="p-1.5 rounded-md hover:bg-gray-100 text-green-600" title="Advance stage"><ChevronRight className="w-4 h-4" /></button>}
              <button onClick={() => openEdit(d)} className="p-1.5 rounded-md hover:bg-gray-100 text-blue-500"><Edit2 className="w-4 h-4" /></button>
              <button onClick={() => setShowDelete(d)} className="p-1.5 rounded-md hover:bg-gray-100 text-red-500"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
        {deals.length === 0 && <div className="px-4 py-12 text-center text-gray-400">No deals yet.</div>}
      </div>

      {showModal && (
        <Modal title={editing ? 'Edit Deal' : 'New Deal'} onClose={() => setShowModal(false)} onSave={handleSave} saveLabel={editing ? 'Save' : 'Add deal'}>
          <Field className="sm:col-span-2" label="Property *"><input value={form.property} onChange={e => set('property', e.target.value)} className={inp} /></Field>
          <Field label="Deal code"><input value={form.deal_code} onChange={e => set('deal_code', e.target.value)} className={inp} /></Field>
          <Field label="Buyer"><input value={form.buyer} onChange={e => set('buyer', e.target.value)} className={inp} /></Field>
          <Field label="Value (₹)"><input type="number" value={form.value} onChange={e => set('value', e.target.value)} className={inp} /></Field>
          <Field label="Agent"><input value={form.agent} onChange={e => set('agent', e.target.value)} className={inp} /></Field>
          <Field label="Stage"><select value={form.stage} onChange={e => set('stage', e.target.value)} className={inp}>{STAGES.map((s, i) => <option key={s} value={i}>{s}</option>)}</select></Field>
          <Field label="Date"><input type="date" value={form.deal_date} onChange={e => set('deal_date', e.target.value)} className={inp} /></Field>
        </Modal>
      )}
      {showDelete && <Confirm title="Delete deal?" sub={showDelete.property} onCancel={() => setShowDelete(null)} onConfirm={() => { remove(showDelete.id); setShowDelete(null) }} />}
    </div>
  )
}

function Stat({ n, label, color = 'text-gray-900' }) {
  return <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm"><div className={`text-2xl font-extrabold ${color}`}>{n}</div><div className="text-sm text-gray-500">{label}</div></div>
}
const inp = 'w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200'
function Field({ label, children, className = '' }) {
  return <div className={className}><label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>{children}</div>
}
export function Modal({ title, children, onClose, onSave, saveLabel }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl w-full max-w-xl max-h-[90vh] overflow-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-gray-100 sticky top-0 bg-white"><h3 className="font-bold text-gray-900">{title}</h3><button onClick={onClose} className="p-1 rounded-md hover:bg-gray-100"><X className="w-5 h-5" /></button></div>
        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">{children}</div>
        <div className="flex justify-end gap-2 p-4 border-t border-gray-100"><button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button><button onClick={onSave} className="px-4 py-2 text-sm font-semibold text-white bg-primary-600 rounded-lg hover:bg-primary-700">{saveLabel}</button></div>
      </div>
    </div>
  )
}
export function Confirm({ title, sub, onCancel, onConfirm }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={onCancel}>
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6 text-center" onClick={e => e.stopPropagation()}>
        <AlertTriangle className="w-10 h-10 text-red-500 mx-auto mb-3" />
        <h3 className="font-bold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-500 mt-1">“{sub}” will be removed.</p>
        <div className="flex gap-2 mt-5"><button onClick={onCancel} className="flex-1 px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button><button onClick={onConfirm} className="flex-1 px-4 py-2 text-sm font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600">Delete</button></div>
      </div>
    </div>
  )
}
