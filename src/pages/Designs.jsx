import { useState } from 'react'
import { Palette, Plus, Edit2, Trash2, Search, LayoutGrid, Sofa, Trees, Clock } from 'lucide-react'
import { useSupabaseCollection } from '../hooks/useSupabaseCollection'
import { Modal, Confirm } from './Transactions'
import { usePermissions } from '../hooks/usePermissions'

const SCOPES = ['Interior', 'Exterior']
const ZONES = ['Living Room', 'Bedroom', 'Kitchen', 'Bathroom', 'Facade', 'Landscape']
const img = (id) => `https://images.unsplash.com/photo-${id}?w=600&h=400&fit=crop`

const SEED = [
  { id: 1, title: 'Modern Living Room', scope: 'Interior', zone: 'Living Room', style: 'Modern', designer: 'Priya Interiors Studio', rating: 4.9, priceFrom: 85000, priceUnit: 'per room', timeline: '3–4 weeks', image: img('1586023492125-27b2c045efd7'), description: 'Warm minimalist living room with statement accent chair, gallery art & layered lighting.', tags: ['Modern', 'Minimal', 'Accent Decor'] },
  { id: 2, title: 'Open-Plan Living & Dining', scope: 'Interior', zone: 'Living Room', style: 'Contemporary', designer: 'Ar. Karan Mehta', rating: 4.7, priceFrom: 120000, priceUnit: 'per room', timeline: '4–5 weeks', image: img('1522708323590-d24dbb6b0267'), description: 'Space-smart open layout merging kitchen, dining & lounge for compact homes.', tags: ['Contemporary', 'Open-Plan', 'Space-Saving'] },
  { id: 3, title: 'Luxury Master Bedroom', scope: 'Interior', zone: 'Bedroom', style: 'Luxury', designer: 'Priya Interiors Studio', rating: 4.9, priceFrom: 110000, priceUnit: 'per room', timeline: '4–5 weeks', image: img('1616594039964-ae9021a400a0'), description: 'Dark statement wall, upholstered bed, designer chandelier & city-view drapery.', tags: ['Luxury', 'Statement Wall', 'Cozy'] },
  { id: 4, title: 'Coastal Living Room', scope: 'Interior', zone: 'Living Room', style: 'Coastal', designer: 'Ar. Sneha Malhotra', rating: 4.8, priceFrom: 95000, priceUnit: 'per room', timeline: '3–4 weeks', image: img('1505691938895-1758d7feb511'), description: 'Bright, breezy living room with blue accents, natural light & relaxed textures.', tags: ['Coastal', 'Bright', 'Relaxed'] },
  { id: 5, title: 'Minimal Modular Kitchen', scope: 'Interior', zone: 'Kitchen', style: 'Minimalist', designer: 'Priya Interiors Studio', rating: 4.9, priceFrom: 180000, priceUnit: 'per kitchen', timeline: '5–6 weeks', image: img('1556911220-bff31c812dba'), description: 'Handle-less white modular kitchen with marble counters & built-in appliances.', tags: ['Modular', 'Marble', 'Handle-less'] },
  { id: 6, title: 'Classic Island Kitchen', scope: 'Interior', zone: 'Kitchen', style: 'Classic', designer: 'Priya Interiors Studio', rating: 4.8, priceFrom: 165000, priceUnit: 'per kitchen', timeline: '5–6 weeks', image: img('1556912172-45b7abe8b7e1'), description: 'Shaker cabinetry, wood-clad island, hex backsplash & breakfast seating.', tags: ['Modular', 'Island', 'Hex Tile'] },
  { id: 7, title: 'Spa Bathroom', scope: 'Interior', zone: 'Bathroom', style: 'Spa', designer: 'Ar. Karan Mehta', rating: 4.7, priceFrom: 95000, priceUnit: 'per bath', timeline: '3–4 weeks', image: img('1620626011761-996317b8d101'), description: 'Freestanding soaking tub, vessel basin & calm neutral palette with greenery.', tags: ['Spa', 'Freestanding Tub', 'Premium'] },
  { id: 8, title: 'Modern Bathroom', scope: 'Interior', zone: 'Bathroom', style: 'Modern', designer: 'Priya Interiors Studio', rating: 4.8, priceFrom: 80000, priceUnit: 'per bath', timeline: '3–4 weeks', image: img('1584622650111-993a426fbf0a'), description: 'Walk-in glass shower, double vanity & warm wood-tone flooring.', tags: ['Modern', 'Walk-in Shower', 'Vanity'] },
  { id: 9, title: 'Modern House Facade', scope: 'Exterior', zone: 'Facade', style: 'Modern', designer: 'Ar. Sneha Malhotra', rating: 4.8, priceFrom: 150, priceUnit: 'per sq.ft', timeline: '6–8 weeks', image: img('1600585154340-be6161a56a0c'), description: 'Contemporary elevation in timber cladding, full-height glazing & dusk lighting.', tags: ['Facade', 'Glass', 'Wood Cladding'] },
  { id: 10, title: 'Pool & Landscape', scope: 'Exterior', zone: 'Landscape', style: 'Contemporary', designer: 'GreenScape Landscape Studio', rating: 4.8, priceFrom: 320, priceUnit: 'per sq.ft', timeline: '6–8 weeks', image: img('1564013799919-ab600027ffc6'), description: 'Resort-style backyard with pool deck, tropical planting & outdoor lounge.', tags: ['Pool', 'Garden', 'Outdoor'] },
  { id: 11, title: 'Mediterranean Courtyard', scope: 'Exterior', zone: 'Landscape', style: 'Mediterranean', designer: 'GreenScape Landscape Studio', rating: 4.8, priceFrom: 280, priceUnit: 'per sq.ft', timeline: '7–9 weeks', image: img('1416331108676-a22ccb276e35'), description: 'Arched villa courtyard with circular pool, terracotta accents & ambient lighting.', tags: ['Courtyard', 'Pool', 'Arches'] },
]
const EMPTY = { title: '', scope: 'Interior', zone: 'Living Room', style: '', designer: '', rating: 4.8, priceFrom: '', priceUnit: 'per room', timeline: '', image: '', description: '', tags: [] }
const inr = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`
const SCOPE_STYLE = { Interior: 'bg-violet-100 text-violet-700', Exterior: 'bg-emerald-100 text-emerald-700' }

export default function Designs() {
  const { rows, add, update, remove } = useSupabaseCollection('build_designs', SEED, { localKey: 'os_build_designs', orderBy: 'id' })
  const { canEditModule } = usePermissions()
  const canEdit = canEditModule('Properties')
  const [search, setSearch] = useState('')
  const [scope, setScope] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [showDelete, setShowDelete] = useState(null)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY)

  const filtered = rows.filter(r => {
    if (search && !`${r.title} ${r.style} ${r.zone} ${r.designer} ${(r.tags || []).join(' ')}`.toLowerCase().includes(search.toLowerCase())) return false
    if (scope !== 'all' && r.scope !== scope) return false
    return true
  })
  const interiors = rows.filter(r => r.scope === 'Interior').length

  const openAdd = () => { setEditing(null); setForm(EMPTY); setShowModal(true) }
  const openEdit = (r) => { setEditing(r.id); setForm({ ...EMPTY, ...r, tags: r.tags || [] }); setShowModal(true) }
  const save = () => {
    if (!form.title) return
    const payload = { ...form, rating: Number(form.rating) || 0, priceFrom: Number(form.priceFrom) || 0 }
    editing ? update(editing, payload) : add(payload)
    setShowModal(false)
  }
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><Palette className="w-6 h-6 text-primary-600" /> Interior &amp; Exterior Design</h1>
          <p className="text-gray-500 mt-1">Build With Us — curated design ideas for the consumer gallery</p>
        </div>
        {canEdit
          ? <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-primary-600 rounded-lg hover:bg-primary-700"><Plus className="w-4 h-4" /> Add Design</button>
          : <span className="text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">🔒 Read-only</span>}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Stat icon={LayoutGrid} n={rows.length} label="Design ideas" />
        <Stat icon={Sofa} n={interiors} label="Interior" color="text-violet-600" />
        <Stat icon={Trees} n={rows.length - interiors} label="Exterior" color="text-emerald-600" />
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search title, style, zone or designer…" className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200" />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {['all', ...SCOPES].map(c => (
            <button key={c} onClick={() => setScope(c)} className={`px-3 py-1.5 text-xs font-semibold rounded-full border ${scope === c ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-gray-500 border-gray-200 hover:text-gray-800'}`}>
              {c === 'all' ? `All (${rows.length})` : c}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400 bg-white rounded-xl border border-dashed border-gray-200"><Palette className="w-10 h-10 mx-auto mb-3 opacity-40" /><p className="font-medium text-gray-600">No designs found.</p></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map(r => (
            <div key={r.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
              <div className="relative aspect-video bg-gray-100">
                <img src={r.image} alt={r.title} className="w-full h-full object-cover" onError={e => { e.target.style.display = 'none' }} />
                <span className={`absolute top-2 left-2 text-xs font-bold px-2 py-0.5 rounded-full ${SCOPE_STYLE[r.scope]}`}>{r.scope}</span>
                <span className="absolute bottom-2 right-2 text-xs font-bold px-2 py-0.5 rounded-full bg-gray-900/75 text-white">{r.style}</span>
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <span className="text-xs font-bold text-primary-600 uppercase tracking-wide">{r.zone}</span>
                <h3 className="font-bold text-gray-900 mt-1 leading-snug">{r.title}</h3>
                <p className="text-xs text-gray-500 mt-1">🎨 {r.designer} · ⭐ {r.rating}</p>
                <p className="text-xs text-gray-400 mt-1 flex items-center gap-1"><Clock className="w-3 h-3" /> {r.timeline}</p>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                  <div><span className="text-xs text-gray-400">from </span><span className="font-extrabold text-gray-900">{inr(r.priceFrom)}</span><span className="text-xs text-gray-400"> {r.priceUnit}</span></div>
                  {canEdit && <div className="flex gap-1">
                    <button onClick={() => openEdit(r)} className="p-1.5 rounded-md hover:bg-gray-100 text-blue-500"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => setShowDelete(r)} className="p-1.5 rounded-md hover:bg-gray-100 text-red-500"><Trash2 className="w-4 h-4" /></button>
                  </div>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <Modal title={editing ? 'Edit Design' : 'New Design'} onClose={() => setShowModal(false)} onSave={save} saveLabel={editing ? 'Save' : 'Add design'}>
          <Field label="Title *" cls="sm:col-span-2"><input value={form.title} onChange={e => set('title', e.target.value)} className={inp} /></Field>
          <Field label="Scope"><select value={form.scope} onChange={e => set('scope', e.target.value)} className={inp}>{SCOPES.map(c => <option key={c}>{c}</option>)}</select></Field>
          <Field label="Zone"><select value={form.zone} onChange={e => set('zone', e.target.value)} className={inp}>{ZONES.map(c => <option key={c}>{c}</option>)}</select></Field>
          <Field label="Style"><input value={form.style} onChange={e => set('style', e.target.value)} placeholder="Modern / Luxury…" className={inp} /></Field>
          <Field label="Designer"><input value={form.designer} onChange={e => set('designer', e.target.value)} className={inp} /></Field>
          <Field label="Rating"><input type="number" step="0.1" max="5" value={form.rating} onChange={e => set('rating', e.target.value)} className={inp} /></Field>
          <Field label="Price from (₹)"><input type="number" value={form.priceFrom} onChange={e => set('priceFrom', e.target.value)} className={inp} /></Field>
          <Field label="Price unit"><input value={form.priceUnit} onChange={e => set('priceUnit', e.target.value)} placeholder="per room / per sq.ft" className={inp} /></Field>
          <Field label="Timeline"><input value={form.timeline} onChange={e => set('timeline', e.target.value)} placeholder="3–4 weeks" className={inp} /></Field>
          <Field label="Image URL" cls="sm:col-span-2"><input value={form.image} onChange={e => set('image', e.target.value)} className={inp} /></Field>
          <Field label="Tags (comma-separated)" cls="sm:col-span-2"><input value={(form.tags || []).join(', ')} onChange={e => set('tags', e.target.value.split(',').map(s => s.trim()).filter(Boolean))} className={inp} /></Field>
          <Field label="Description" cls="sm:col-span-2"><textarea rows={2} value={form.description} onChange={e => set('description', e.target.value)} className={inp} /></Field>
        </Modal>
      )}
      {showDelete && <Confirm title="Delete design?" sub={showDelete.title} onCancel={() => setShowDelete(null)} onConfirm={() => { remove(showDelete.id); setShowDelete(null) }} />}
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
