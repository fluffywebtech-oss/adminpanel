import { useState } from 'react'
import { HardHat, Plus, Edit2, Trash2, Search, Users, BadgeCheck, Star, MapPin } from 'lucide-react'
import { useSupabaseCollection } from '../hooks/useSupabaseCollection'
import { Modal, Confirm } from './Transactions'
import { usePermissions } from '../hooks/usePermissions'

const PROFESSIONS = ['Civil Contractor', 'Architect', 'Interior Designer', 'Structural Engineer', 'MEP Consultant', 'Landscape Designer', 'Vastu Consultant', 'Turnkey Builder', 'Renovation Contractor']

const SEED = [
  { id: 1, name: 'Rajesh Kumar Constructions', profession: 'Civil Contractor', specialization: 'RCC, structural & turnkey residential builds', experience: '18 yrs', rating: 4.9, projects: 240, location: 'Sector 65, Gurgaon', avatar: 'https://i.pravatar.cc/150?img=12', price: '₹1,650', priceUnit: 'per sq.ft', verified: true, tags: ['RCC', 'Turnkey', 'Residential'] },
  { id: 2, name: 'Ar. Sneha Malhotra', profession: 'Architect', specialization: 'Modern & sustainable residential / commercial design', experience: '12 yrs', rating: 4.8, projects: 95, location: 'DLF Phase 5', avatar: 'https://i.pravatar.cc/150?img=47', price: '₹120', priceUnit: 'per sq.ft', verified: true, tags: ['Modern', 'Sustainable', '3D Design'] },
  { id: 3, name: 'Priya Interiors Studio', profession: 'Interior Designer', specialization: 'Luxury homes, modular kitchens & wardrobes', experience: '10 yrs', rating: 4.9, projects: 130, location: 'Golf Course Road', avatar: 'https://i.pravatar.cc/150?img=45', price: '₹1,500', priceUnit: 'per sq.ft', verified: true, tags: ['Modular Kitchen', 'Wardrobes', 'Luxury'] },
  { id: 4, name: 'Eng. Vikram Singh', profession: 'Structural Engineer', specialization: 'High-rise RCC, steel & PEB structural design', experience: '15 yrs', rating: 4.7, projects: 60, location: 'Sector 49, SPR', avatar: 'https://i.pravatar.cc/150?img=52', price: '₹15', priceUnit: 'per sq.ft', verified: true, tags: ['RCC', 'Steel', 'PEB'] },
  { id: 5, name: 'PowerFlow MEP Consultants', profession: 'MEP Consultant', specialization: 'Electrical, plumbing & HVAC design + execution', experience: '14 yrs', rating: 4.6, projects: 80, location: 'Udyog Vihar', avatar: 'https://i.pravatar.cc/150?img=33', price: '₹40', priceUnit: 'per sq.ft', verified: true, tags: ['HVAC', 'Electrical', 'Plumbing'] },
  { id: 6, name: 'GreenScape Landscape Studio', profession: 'Landscape Designer', specialization: 'Gardens, terraces & vertical greens', experience: '9 yrs', rating: 4.8, projects: 70, location: 'New Gurgaon', avatar: 'https://i.pravatar.cc/150?img=23', price: '₹250', priceUnit: 'per sq.ft', verified: true, tags: ['Terrace Garden', 'Vertical Green', 'Irrigation'] },
  { id: 7, name: 'Acharya R. Sharma', profession: 'Vastu Consultant', specialization: 'Residential & commercial Vastu analysis', experience: '20 yrs', rating: 4.9, projects: 500, location: 'Gurgaon', avatar: 'https://i.pravatar.cc/150?img=68', price: '₹11,000', priceUnit: 'per consult', verified: true, tags: ['Vastu', 'Residential', 'Commercial'] },
  { id: 8, name: 'BuildRight Turnkey', profession: 'Turnkey Builder', specialization: 'End-to-end construction, design to handover', experience: '16 yrs', rating: 4.8, projects: 110, location: 'Sohna Road', avatar: 'https://i.pravatar.cc/150?img=60', price: '₹1,850', priceUnit: 'per sq.ft', verified: true, tags: ['Turnkey', 'Residential', 'Commercial'] },
  { id: 9, name: 'Ar. Karan Mehta', profession: 'Architect', specialization: 'Contemporary villas & interior architecture', experience: '8 yrs', rating: 4.7, projects: 55, location: 'Sector 71, SPR', avatar: 'https://i.pravatar.cc/150?img=55', price: '₹100', priceUnit: 'per sq.ft', verified: false, tags: ['Contemporary', 'Villas', 'Interiors'] },
  { id: 10, name: 'FixIt Renovations', profession: 'Renovation Contractor', specialization: 'Home renovation, waterproofing & painting', experience: '11 yrs', rating: 4.6, projects: 320, location: 'Gurgaon', avatar: 'https://i.pravatar.cc/150?img=14', price: '₹800', priceUnit: 'per sq.ft', verified: true, tags: ['Renovation', 'Waterproofing', 'Painting'] },
]
const EMPTY = { name: '', profession: 'Civil Contractor', specialization: '', experience: '', rating: 4.7, projects: 0, location: '', avatar: '', price: '', priceUnit: 'per sq.ft', verified: true, tags: [] }

export default function Contractors() {
  const { rows, add, update, remove } = useSupabaseCollection('build_services', SEED, { localKey: 'os_build_services', orderBy: 'id' })
  const { canEditModule } = usePermissions()
  const canEdit = canEditModule('Properties')
  const [search, setSearch] = useState('')
  const [prof, setProf] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [showDelete, setShowDelete] = useState(null)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY)

  const filtered = rows.filter(r => {
    if (search && !`${r.name} ${r.profession} ${r.specialization} ${(r.tags || []).join(' ')}`.toLowerCase().includes(search.toLowerCase())) return false
    if (prof !== 'all' && r.profession !== prof) return false
    return true
  })
  const verified = rows.filter(r => r.verified).length

  const openAdd = () => { setEditing(null); setForm(EMPTY); setShowModal(true) }
  const openEdit = (r) => { setEditing(r.id); setForm({ ...EMPTY, ...r, tags: r.tags || [] }); setShowModal(true) }
  const save = () => {
    if (!form.name) return
    const payload = { ...form, rating: Number(form.rating) || 0, projects: Number(form.projects) || 0, avatar: form.avatar || 'https://i.pravatar.cc/150?img=1' }
    editing ? update(editing, payload) : add(payload)
    setShowModal(false)
  }
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><HardHat className="w-6 h-6 text-primary-600" /> Contractors &amp; Services</h1>
          <p className="text-gray-500 mt-1">Build With Us — verified building professionals & service providers</p>
        </div>
        {canEdit
          ? <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-primary-600 rounded-lg hover:bg-primary-700"><Plus className="w-4 h-4" /> Add Provider</button>
          : <span className="text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">🔒 Read-only</span>}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Stat icon={Users} n={rows.length} label="Providers" />
        <Stat icon={BadgeCheck} n={verified} label="Verified" color="text-green-600" />
        <Stat icon={Star} n={new Set(rows.map(r => r.profession)).size} label="Professions" color="text-primary-600" />
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name, profession or skill…" className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200" />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {['all', ...PROFESSIONS].map(c => (
            <button key={c} onClick={() => setProf(c)} className={`px-3 py-1.5 text-xs font-semibold rounded-full border ${prof === c ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-gray-500 border-gray-200 hover:text-gray-800'}`}>
              {c === 'all' ? `All (${rows.length})` : c}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400 bg-white rounded-xl border border-dashed border-gray-200"><HardHat className="w-10 h-10 mx-auto mb-3 opacity-40" /><p className="font-medium text-gray-600">No providers found.</p></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map(r => (
            <div key={r.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-col">
              <div className="flex items-center gap-3">
                <img src={r.avatar} alt={r.name} className="w-12 h-12 rounded-full object-cover bg-gray-100" onError={e => { e.target.style.visibility = 'hidden' }} />
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-gray-900 leading-tight flex items-center gap-1">{r.name} {r.verified && <BadgeCheck className="w-4 h-4 text-green-500 shrink-0" />}</h3>
                  <span className="text-xs font-bold text-primary-600">{r.profession}</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2 line-clamp-2">{r.specialization}</p>
              <div className="flex items-center gap-2 text-xs text-gray-600 mt-2"><Star className="w-3 h-3 text-amber-500" /> {r.rating} · {r.projects} projects · {r.experience}</div>
              <p className="text-xs text-gray-400 mt-1 flex items-center gap-1"><MapPin className="w-3 h-3" /> {r.location}</p>
              <div className="flex flex-wrap gap-1 mt-2">{(r.tags || []).map(t => <span key={t} className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">{t}</span>)}</div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                <div><span className="text-xs text-gray-400">from </span><span className="font-extrabold text-gray-900">{r.price}</span><span className="text-xs text-gray-400"> {r.priceUnit}</span></div>
                {canEdit && <div className="flex gap-1">
                  <button onClick={() => openEdit(r)} className="p-1.5 rounded-md hover:bg-gray-100 text-blue-500"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => setShowDelete(r)} className="p-1.5 rounded-md hover:bg-gray-100 text-red-500"><Trash2 className="w-4 h-4" /></button>
                </div>}
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <Modal title={editing ? 'Edit Provider' : 'New Provider'} onClose={() => setShowModal(false)} onSave={save} saveLabel={editing ? 'Save' : 'Add provider'}>
          <Field label="Name *" cls="sm:col-span-2"><input value={form.name} onChange={e => set('name', e.target.value)} className={inp} /></Field>
          <Field label="Profession"><select value={form.profession} onChange={e => set('profession', e.target.value)} className={inp}>{PROFESSIONS.map(c => <option key={c}>{c}</option>)}</select></Field>
          <Field label="Location"><input value={form.location} onChange={e => set('location', e.target.value)} className={inp} /></Field>
          <Field label="Specialization" cls="sm:col-span-2"><input value={form.specialization} onChange={e => set('specialization', e.target.value)} className={inp} /></Field>
          <Field label="Experience"><input value={form.experience} onChange={e => set('experience', e.target.value)} placeholder="12 yrs" className={inp} /></Field>
          <Field label="Rating"><input type="number" step="0.1" max="5" value={form.rating} onChange={e => set('rating', e.target.value)} className={inp} /></Field>
          <Field label="Projects"><input type="number" value={form.projects} onChange={e => set('projects', e.target.value)} className={inp} /></Field>
          <Field label="Price"><input value={form.price} onChange={e => set('price', e.target.value)} placeholder="₹1,650" className={inp} /></Field>
          <Field label="Price unit"><input value={form.priceUnit} onChange={e => set('priceUnit', e.target.value)} placeholder="per sq.ft" className={inp} /></Field>
          <Field label="Avatar URL"><input value={form.avatar} onChange={e => set('avatar', e.target.value)} className={inp} /></Field>
          <Field label="Tags (comma-separated)" cls="sm:col-span-2"><input value={(form.tags || []).join(', ')} onChange={e => set('tags', e.target.value.split(',').map(s => s.trim()).filter(Boolean))} className={inp} /></Field>
          <Field label="Verified"><select value={form.verified ? 'yes' : 'no'} onChange={e => set('verified', e.target.value === 'yes')} className={inp}><option value="yes">Verified</option><option value="no">Unverified</option></select></Field>
        </Modal>
      )}
      {showDelete && <Confirm title="Delete provider?" sub={showDelete.name} onCancel={() => setShowDelete(null)} onConfirm={() => { remove(showDelete.id); setShowDelete(null) }} />}
    </div>
  )
}

function Stat({ icon: Icon, n, label, color = 'text-gray-900' }) {
  return <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center"><Icon className="w-5 h-5" /></div><div><div className={`text-2xl font-extrabold ${color}`}>{n}</div><div className="text-sm text-gray-500">{label}</div></div></div>
}
const inp = 'w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200'
function Field({ label, children, cls = '' }) {
  return <div className={cls}><label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>{children}</div>
}
