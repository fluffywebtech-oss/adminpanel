import { useMemo, useState } from 'react'
import { CalendarClock, Plus, Edit2, Trash2, Phone, MessageCircle, MapPin, Video, Building2, Dot } from 'lucide-react'
import { useSupabaseCollection } from '../hooks/useSupabaseCollection'
import { Modal, Confirm } from './Transactions'

const today = () => new Date().toISOString().slice(0, 10)
const plus = (d) => new Date(Date.now() + d * 86400000).toISOString().slice(0, 10)

const TYPES = ['Site Visit', 'Video Tour', 'In-Office', 'Call']
const TYPE_ICON = { 'Site Visit': MapPin, 'Video Tour': Video, 'In-Office': Building2, Call: Phone }
const STATUSES = ['Scheduled', 'Confirmed', 'Completed', 'Cancelled']
const STATUS_STYLE = {
  Scheduled: 'bg-blue-50 text-blue-700 border-blue-200',
  Confirmed: 'bg-teal-50 text-teal-700 border-teal-200',
  Completed: 'bg-gray-100 text-gray-500 border-gray-200',
  Cancelled: 'bg-red-50 text-red-600 border-red-200',
}
// Map a site-visit enquiry's lead status <-> meeting status
const LEAD_TO_MEET = { New: 'Scheduled', Contacted: 'Confirmed', 'Visit Booked': 'Confirmed', Closed: 'Completed' }
const MEET_TO_LEAD = { Scheduled: 'New', Confirmed: 'Visit Booked', Completed: 'Closed', Cancelled: 'Closed' }

const INIT_MEETINGS = [
  { id: 1, name: 'Arjun Sharma', phone: '9876543210', property: 'DLF Privana North – 4 BHK', meet_date: today(), meet_time: '11:30', type: 'Site Visit', status: 'Confirmed', agent: 'Rajiv Malhotra', notes: 'Wants higher floors, Aravalli view' },
  { id: 2, name: 'Priya Nair', phone: '9811223344', property: 'Godrej Aristocrat – 3 BHK', meet_date: today(), meet_time: '16:00', type: 'Video Tour', status: 'Scheduled', agent: 'Priya Sharma', notes: '' },
  { id: 3, name: 'Rohit Verma', phone: '9845012345', property: 'Emaar Urban Ascent – 3 BHK', meet_date: plus(1), meet_time: '10:00', type: 'Site Visit', status: 'Scheduled', agent: 'Vikram Gupta', notes: 'First visit' },
  { id: 4, name: 'Sunita Kapoor', phone: '9810111111', property: 'Elan The Statement – 4 BHK', meet_date: plus(3), meet_time: '14:30', type: 'In-Office', status: 'Confirmed', agent: 'Rohit Mehra', notes: 'Token amount discussion' },
  { id: 5, name: 'Karan Mehta', phone: '9810555555', property: 'Sobha Aranya – 3 BHK', meet_date: plus(-1), meet_time: '12:00', type: 'Site Visit', status: 'Completed', agent: 'Deepak Rao', notes: 'Visited — deciding' },
]

const digits = (p = '') => { const d = String(p).replace(/\D/g, ''); return d.length === 10 ? '91' + d : d }
const fmtTime = (t) => { if (!t) return ''; const [h, m] = t.split(':').map(Number); const ap = h >= 12 ? 'PM' : 'AM'; return `${((h + 11) % 12) + 1}:${String(m).padStart(2, '0')} ${ap}` }
const fmtDate = (d) => new Date(d + 'T00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })

// Is a meeting "live now"? (within its hour today)
function isLive(m) {
  if (m.meet_date !== today() || !m.meet_time) return false
  const start = new Date(`${m.meet_date}T${m.meet_time}`)
  const now = new Date()
  return now >= new Date(start.getTime() - 10 * 60000) && now <= new Date(start.getTime() + 60 * 60000)
}

const EMPTY = { name: '', phone: '', property: '', meet_date: today(), meet_time: '11:00', type: 'Site Visit', status: 'Scheduled', agent: '', notes: '' }

export default function Meetings() {
  const { rows: meetings, add, update, remove } = useSupabaseCollection('meetings', INIT_MEETINGS, { localKey: 'os_meetings', orderBy: 'id' })
  const { rows: leads, update: updateLead } = useSupabaseCollection('leads', [], { localKey: 'os_leads', orderBy: 'created_at', ascending: false })
  const [showModal, setShowModal] = useState(false)
  const [showDelete, setShowDelete] = useState(null)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY)

  // Site-visit enquiries → derived meetings
  const derived = useMemo(() => leads
    .filter(l => l.intent === 'visit' && l.visit_date)
    .map(l => ({
      id: 'lead-' + (l.ref || l.id), _leadId: l.id, source: 'enquiry',
      name: l.name, phone: l.phone, property: l.property_title,
      meet_date: l.visit_date, meet_time: l.visit_time || '10:00',
      type: 'Site Visit', status: LEAD_TO_MEET[l.status || 'New'] || 'Scheduled',
      agent: l.agent_name, notes: l.message,
    })), [leads])

  const all = useMemo(() => [...meetings.map(m => ({ ...m, source: m.source || 'manual' })), ...derived], [meetings, derived])
  const t = today()
  const byTime = (a, b) => (a.meet_date + a.meet_time).localeCompare(b.meet_date + b.meet_time)
  const todays = all.filter(m => m.meet_date === t).sort(byTime)
  const upcoming = all.filter(m => m.meet_date > t).sort(byTime)
  const past = all.filter(m => m.meet_date < t).sort((a, b) => byTime(b, a)).slice(0, 8)

  const setStatus = (m, status) => {
    if (m.source === 'enquiry') updateLead(m._leadId, { status: MEET_TO_LEAD[status] || 'New' })
    else update(m.id, { status })
  }
  const openAdd = () => { setEditing(null); setForm(EMPTY); setShowModal(true) }
  const openEdit = (m) => { setEditing(m.id); setForm({ ...EMPTY, ...m }); setShowModal(true) }
  const save = () => { if (!form.name || !form.meet_date) return; editing ? update(editing, form) : add(form); setShowModal(false) }
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><CalendarClock className="w-6 h-6 text-primary-600" /> Meetings</h1>
          <p className="text-gray-500 mt-1">Site visits, tours & appointments — including site-visit enquiries</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-primary-600 rounded-lg hover:bg-primary-700"><Plus className="w-4 h-4" /> New Meeting</button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Stat n={todays.length} label="Today" color="text-primary-600" />
        <Stat n={upcoming.length} label="Upcoming" color="text-teal-600" />
        <Stat n={todays.filter(isLive).length} label="Live now" color="text-green-600" />
      </div>

      <Section title="🟢 Ongoing — Today" empty="No meetings scheduled today." items={todays} live {...{ setStatus, openEdit, setShowDelete }} />
      <Section title="📅 Upcoming" empty="Nothing on the calendar yet." items={upcoming} {...{ setStatus, openEdit, setShowDelete }} />
      {past.length > 0 && <Section title="✓ Recently completed" items={past} muted {...{ setStatus, openEdit, setShowDelete }} />}

      {showModal && (
        <Modal title={editing ? 'Edit Meeting' : 'New Meeting'} onClose={() => setShowModal(false)} onSave={save} saveLabel={editing ? 'Save' : 'Schedule'}>
          <Field label="Contact name *"><input value={form.name} onChange={e => set('name', e.target.value)} className={inp} /></Field>
          <Field label="Phone"><input value={form.phone} onChange={e => set('phone', e.target.value)} className={inp} /></Field>
          <Field label="Property" cls="sm:col-span-2"><input value={form.property} onChange={e => set('property', e.target.value)} className={inp} /></Field>
          <Field label="Date"><input type="date" value={form.meet_date} onChange={e => set('meet_date', e.target.value)} className={inp} /></Field>
          <Field label="Time"><input type="time" value={form.meet_time} onChange={e => set('meet_time', e.target.value)} className={inp} /></Field>
          <Field label="Type"><select value={form.type} onChange={e => set('type', e.target.value)} className={inp}>{TYPES.map(x => <option key={x}>{x}</option>)}</select></Field>
          <Field label="Status"><select value={form.status} onChange={e => set('status', e.target.value)} className={inp}>{STATUSES.map(x => <option key={x}>{x}</option>)}</select></Field>
          <Field label="Agent"><input value={form.agent} onChange={e => set('agent', e.target.value)} className={inp} /></Field>
          <Field label="Notes" cls="sm:col-span-2"><textarea rows={2} value={form.notes} onChange={e => set('notes', e.target.value)} className={inp} /></Field>
        </Modal>
      )}
      {showDelete && <Confirm title="Delete meeting?" sub={showDelete.name} onCancel={() => setShowDelete(null)} onConfirm={() => { remove(showDelete.id); setShowDelete(null) }} />}
    </div>
  )
}

function Section({ title, items, empty, live, muted, setStatus, openEdit, setShowDelete }) {
  return (
    <div>
      <h2 className="text-sm font-bold text-gray-700 mb-2.5">{title} <span className="text-gray-400 font-medium">· {items.length}</span></h2>
      {items.length === 0 ? (
        <p className="text-sm text-gray-400 bg-white border border-dashed border-gray-200 rounded-xl py-6 text-center">{empty}</p>
      ) : (
        <div className="space-y-2.5">
          {items.map(m => {
            const Icon = TYPE_ICON[m.type] || MapPin
            const liveNow = live && isLive(m)
            return (
              <div key={m.id} className={`bg-white border rounded-xl p-3.5 flex items-center gap-4 ${liveNow ? 'border-green-300 ring-1 ring-green-200' : 'border-gray-100'} ${muted ? 'opacity-80' : ''}`}>
                <div className="text-center shrink-0 w-16">
                  <div className="text-sm font-bold text-gray-900">{fmtTime(m.meet_time)}</div>
                  <div className="text-[11px] text-gray-400">{fmtDate(m.meet_date)}</div>
                </div>
                <div className="w-9 h-9 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center shrink-0"><Icon className="w-4 h-4" /></div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900 truncate">{m.name || 'Unnamed'}</span>
                    {liveNow && <span className="flex items-center text-[11px] font-bold text-green-600"><Dot className="w-4 h-4 -mx-1 animate-pulse" />LIVE</span>}
                    {m.source === 'enquiry' && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-50 text-amber-700">from enquiry</span>}
                  </div>
                  <div className="text-xs text-gray-500 truncate">{m.type}{m.property ? ` · ${m.property}` : ''}{m.agent ? ` · ${m.agent}` : ''}</div>
                </div>
                <select value={m.status} onChange={e => setStatus(m, e.target.value)} className={`text-xs font-bold px-2 py-1.5 rounded-lg border cursor-pointer ${STATUS_STYLE[m.status]}`}>
                  {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <div className="flex gap-1 shrink-0">
                  {m.phone && <a href={`https://wa.me/${digits(m.phone)}`} target="_blank" rel="noopener noreferrer" className="w-8 h-8 flex items-center justify-center rounded-lg bg-green-500 text-white" title="WhatsApp"><MessageCircle className="w-4 h-4" /></a>}
                  {m.phone && <a href={`tel:+${digits(m.phone)}`} className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600" title="Call"><Phone className="w-4 h-4" /></a>}
                  {m.source !== 'enquiry' && <><button onClick={() => openEdit(m)} className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-blue-500" title="Edit"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => setShowDelete(m)} className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-red-500" title="Delete"><Trash2 className="w-4 h-4" /></button></>}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function Stat({ n, label, color = 'text-gray-900' }) {
  return <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm"><div className={`text-2xl font-extrabold ${color}`}>{n}</div><div className="text-sm text-gray-500">{label}</div></div>
}
const inp = 'w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200'
function Field({ label, children, cls = '' }) {
  return <div className={cls}><label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>{children}</div>
}
