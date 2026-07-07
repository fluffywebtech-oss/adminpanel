import { useState } from 'react'
import { PencilRuler, Plus, Edit2, Trash2, Search, Users, BadgeCheck, Star, MapPin } from 'lucide-react'
import { useSupabaseCollection } from '../hooks/useSupabaseCollection'
import { Modal, Confirm } from './Transactions'
import { usePermissions } from '../hooks/usePermissions'

const ROLES = ['Interior Designer', 'Architect', 'Landscape Designer', 'Facade Architect']
const img = (id) => `https://images.unsplash.com/photo-${id}?w=600&h=400&fit=crop`

const SEED = [
  { id: 1, name: 'Priya Interiors Studio', role: 'Interior Designer', scope: ['Interior'], styles: ['Modern', 'Luxury', 'Minimalist'], experience: '10 yrs', rating: 4.9, projects: 130, location: 'Golf Course Road, Gurgaon', avatar: 'https://i.pravatar.cc/150?img=45', price: '₹1,500', priceUnit: 'per sq.ft', verified: true, bio: 'Luxury homes, modular kitchens & bespoke wardrobes with a warm minimalist signature.', portfolio: [img('1586023492125-27b2c045efd7'), img('1616594039964-ae9021a400a0'), img('1556911220-bff31c812dba')] },
  { id: 2, name: 'Ar. Sneha Malhotra', role: 'Architect', scope: ['Interior', 'Exterior'], styles: ['Modern', 'Sustainable', 'Coastal'], experience: '12 yrs', rating: 4.8, projects: 95, location: 'DLF Phase 5, Gurgaon', avatar: 'https://i.pravatar.cc/150?img=47', price: '₹120', priceUnit: 'per sq.ft', verified: true, bio: 'Modern, sustainable residential & commercial design — from facade to interiors.', portfolio: [img('1600585154340-be6161a56a0c'), img('1505691938895-1758d7feb511')] },
  { id: 3, name: 'GreenScape Landscape Studio', role: 'Landscape Designer', scope: ['Exterior'], styles: ['Contemporary', 'Mediterranean', 'Tropical'], experience: '9 yrs', rating: 4.8, projects: 70, location: 'New Gurgaon', avatar: 'https://i.pravatar.cc/150?img=23', price: '₹250', priceUnit: 'per sq.ft', verified: true, bio: 'Pool decks, courtyards, terrace gardens & vertical greens for resort-style outdoors.', portfolio: [img('1564013799919-ab600027ffc6'), img('1416331108676-a22ccb276e35')] },
  { id: 4, name: 'Studio Terra Interiors', role: 'Interior Designer', scope: ['Interior'], styles: ['Classic', 'Modern', 'Spa'], experience: '11 yrs', rating: 4.8, projects: 88, location: 'Sohna Road, Gurgaon', avatar: 'https://i.pravatar.cc/150?img=32', price: '₹1,300', priceUnit: 'per sq.ft', verified: true, bio: 'Classic island kitchens, spa bathrooms & timeless living spaces with rich materials.', portfolio: [img('1556912172-45b7abe8b7e1'), img('1620626011761-996317b8d101'), img('1584622650111-993a426fbf0a')] },
  { id: 5, name: 'Ar. Karan Mehta', role: 'Architect', scope: ['Interior', 'Exterior'], styles: ['Contemporary', 'Compact', 'Villas'], experience: '8 yrs', rating: 4.7, projects: 55, location: 'Sector 71, SPR', avatar: 'https://i.pravatar.cc/150?img=55', price: '₹100', priceUnit: 'per sq.ft', verified: false, bio: 'Contemporary villas & space-smart interior architecture for compact urban homes.', portfolio: [img('1522708323590-d24dbb6b0267'), img('1586023492125-27b2c045efd7')] },
  { id: 6, name: 'Elevation Architects', role: 'Facade Architect', scope: ['Exterior', 'Interior'], styles: ['Modern', 'Industrial', 'Glass'], experience: '14 yrs', rating: 4.7, projects: 64, location: 'Sector 49, Gurgaon', avatar: 'https://i.pravatar.cc/150?img=60', price: '₹140', priceUnit: 'per sq.ft', verified: true, bio: 'Striking elevations in glass, stone & timber cladding — kerb appeal that lasts.', portfolio: [img('1600585154340-be6161a56a0c'), img('1522708323590-d24dbb6b0267')] },
]
const EMPTY = { name: '', role: 'Interior Designer', scope: ['Interior'], styles: [], experience: '', rating: 4.8, projects: 0, location: '', avatar: '', price: '', priceUnit: 'per sq.ft', verified: true, bio: '', portfolio: [] }
const SCOPE_STYLE = { Interior: 'bg-violet-100 text-violet-700', Exterior: 'bg-emerald-100 text-emerald-700' }

export default function Designers() {
  const { rows, add, update, remove } = useSupabaseCollection('build_designers', SEED, { localKey: 'os_build_designers', orderBy: 'id' })
  const { canEditModule } = usePermissions()
  const canEdit = canEditModule('Properties')
  const [search, setSearch] = useState('')
  const [role, setRole] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [showDelete, setShowDelete] = useState(null)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY)

  const filtered = rows.filter(r => {
    if (search && !`${r.name} ${r.role} ${r.bio} ${(r.styles || []).join(' ')}`.toLowerCase().includes(search.toLowerCase())) return false
    if (role !== 'all' && r.role !== role) return false
    return true
  })
  const verified = rows.filter(r => r.verified).length

  const openAdd = () => { setEditing(null); setForm(EMPTY); setShowModal(true) }
  const openEdit = (r) => { setEditing(r.id); setForm({ ...EMPTY, ...r, scope: r.scope || [], styles: r.styles || [], portfolio: r.portfolio || [] }); setShowModal(true) }
  const save = () => {
    if (!form.name) return
    const payload = { ...form, rating: Number(form.rating) || 0, projects: Number(form.projects) || 0, avatar: form.avatar || 'https://i.pravatar.cc/150?img=1' }
    editing ? update(editing, payload) : add(payload)
    setShowModal(false)
  }
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const toggleScope = (s) => setForm(f => ({ ...f, scope: f.scope.includes(s) ? f.scope.filter(x => x !== s) : [...f.scope, s] }))

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><PencilRuler className="w-6 h-6 text-primary-600" /> Designers</h1>
          <p className="text-gray-500 mt-1">Build With Us — the hire-a-designer directory</p>
        </div>
        {canEdit
          ? <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-primary-600 rounded-lg hover:bg-primary-700"><Plus className="w-4 h-4" /> Add Designer</button>
          : <span className="text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">🔒 Read-only</span>}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Stat icon={Users} n={rows.length} label="Designers" />
        <Stat icon={BadgeCheck} n={verified} label="Verified" color="text-green-600" />
        <Stat icon={Star} n={new Set(rows.map(r => r.role)).size} label="Disciplines" color="text-primary-600" />
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name, role or style…" className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200" />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {['all', ...ROLES].map(c => (
            <button key={c} onClick={() => setRole(c)} className={`px-3 py-1.5 text-xs font-semibold rounded-full border ${role === c ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-gray-500 border-gray-200 hover:text-gray-800'}`}>
              {c === 'all' ? `All (${rows.length})` : c}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400 bg-white rounded-xl border border-dashed border-gray-200"><PencilRuler className="w-10 h-10 mx-auto mb-3 opacity-40" /><p className="font-medium text-gray-600">No designers found.</p></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map(r => (
            <div key={r.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-col">
              <div className="flex items-center gap-3">
                <img src={r.avatar} alt={r.name} className="w-12 h-12 rounded-full object-cover bg-gray-100" onError={e => { e.target.style.visibility = 'hidden' }} />
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-gray-900 leading-tight flex items-center gap-1">{r.name} {r.verified && <BadgeCheck className="w-4 h-4 text-green-500 shrink-0" />}</h3>
                  <span className="text-xs font-bold text-primary-600">{r.role}</span>
                </div>
                <div className="flex flex-col gap-1 items-end">{(r.scope || []).map(s => <span key={s} className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${SCOPE_STYLE[s]}`}>{s}</span>)}</div>
              </div>
              <p className="text-xs text-gray-500 mt-2 line-clamp-2">{r.bio}</p>
              <div className="grid grid-cols-3 gap-1 mt-2">{(r.portfolio || []).slice(0, 3).map((src, i) => <img key={i} src={src} alt="" className="w-full aspect-[4/3] object-cover rounded-md bg-gray-100" onError={e => { e.target.style.visibility = 'hidden' }} />)}</div>
              <div className="flex items-center gap-2 text-xs text-gray-600 mt-2"><Star className="w-3 h-3 text-amber-500" /> {r.rating} · {r.projects} projects · {r.experience}</div>
              <p className="text-xs text-gray-400 mt-1 flex items-center gap-1"><MapPin className="w-3 h-3" /> {r.location}</p>
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
        <Modal title={editing ? 'Edit Designer' : 'New Designer'} onClose={() => setShowModal(false)} onSave={save} saveLabel={editing ? 'Save' : 'Add designer'}>
          <Field label="Name *" cls="sm:col-span-2"><input value={form.name} onChange={e => set('name', e.target.value)} className={inp} /></Field>
          <Field label="Role"><select value={form.role} onChange={e => set('role', e.target.value)} className={inp}>{ROLES.map(c => <option key={c}>{c}</option>)}</select></Field>
          <Field label="Location"><input value={form.location} onChange={e => set('location', e.target.value)} className={inp} /></Field>
          <Field label="Scope" cls="sm:col-span-2">
            <div className="flex gap-2">{['Interior', 'Exterior'].map(s => (
              <button key={s} type="button" onClick={() => toggleScope(s)} className={`px-3 py-1.5 text-xs font-semibold rounded-full border ${form.scope.includes(s) ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-gray-500 border-gray-200'}`}>{s}</button>
            ))}</div>
          </Field>
          <Field label="Bio" cls="sm:col-span-2"><textarea rows={2} value={form.bio} onChange={e => set('bio', e.target.value)} className={inp} /></Field>
          <Field label="Experience"><input value={form.experience} onChange={e => set('experience', e.target.value)} placeholder="10 yrs" className={inp} /></Field>
          <Field label="Rating"><input type="number" step="0.1" max="5" value={form.rating} onChange={e => set('rating', e.target.value)} className={inp} /></Field>
          <Field label="Projects"><input type="number" value={form.projects} onChange={e => set('projects', e.target.value)} className={inp} /></Field>
          <Field label="Price"><input value={form.price} onChange={e => set('price', e.target.value)} placeholder="₹1,500" className={inp} /></Field>
          <Field label="Price unit"><input value={form.priceUnit} onChange={e => set('priceUnit', e.target.value)} placeholder="per sq.ft" className={inp} /></Field>
          <Field label="Avatar URL"><input value={form.avatar} onChange={e => set('avatar', e.target.value)} className={inp} /></Field>
          <Field label="Styles (comma-separated)" cls="sm:col-span-2"><input value={(form.styles || []).join(', ')} onChange={e => set('styles', e.target.value.split(',').map(s => s.trim()).filter(Boolean))} className={inp} /></Field>
          <Field label="Portfolio image URLs (comma-separated)" cls="sm:col-span-2"><textarea rows={2} value={(form.portfolio || []).join(', ')} onChange={e => set('portfolio', e.target.value.split(',').map(s => s.trim()).filter(Boolean))} className={inp} /></Field>
          <Field label="Verified"><select value={form.verified ? 'yes' : 'no'} onChange={e => set('verified', e.target.value === 'yes')} className={inp}><option value="yes">Verified</option><option value="no">Unverified</option></select></Field>
        </Modal>
      )}
      {showDelete && <Confirm title="Delete designer?" sub={showDelete.name} onCancel={() => setShowDelete(null)} onConfirm={() => { remove(showDelete.id); setShowDelete(null) }} />}
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
