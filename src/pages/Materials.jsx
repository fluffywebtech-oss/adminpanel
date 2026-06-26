import { useState } from 'react'
import { Hammer, Plus, Edit2, Trash2, Search, Package, Truck, Tag } from 'lucide-react'
import { useSupabaseCollection } from '../hooks/useSupabaseCollection'
import { Modal, Confirm } from './Transactions'
import { usePermissions } from '../hooks/usePermissions'

const CATEGORIES = ['Cement', 'Steel & TMT', 'Bricks & Blocks', 'Tiles & Flooring', 'Paints', 'Plumbing', 'Electrical', 'Sanitaryware', 'Hardware & Fittings', 'Wood & Ply', 'Glass & Aluminium']
const STOCK = ['In Stock', 'Low Stock', 'Out of Stock']
const STOCK_STYLE = { 'In Stock': 'bg-green-50 text-green-700', 'Low Stock': 'bg-amber-50 text-amber-700', 'Out of Stock': 'bg-red-50 text-red-600' }
const IMG = {
  Cement: '1581094794329-c8112a89af12', 'Steel & TMT': '1565008576549-57569a49371d', 'Bricks & Blocks': '1599629954294-14df9ec8bc05',
  'Tiles & Flooring': '1615873968403-89e068629265', Paints: '1589939705384-5185137a7f0f', Plumbing: '1607472586893-edb57bdc0e39',
  Electrical: '1558002038-1055907df827', Sanitaryware: '1584622650111-993a426fbf0a', 'Hardware & Fittings': '1530124566582-a618bc2615dc',
  'Wood & Ply': '1520208422220-d12a3c588e6c', 'Glass & Aluminium': '1503387762-592deb58ef4e',
}
const img = (cat) => `https://images.unsplash.com/photo-${IMG[cat] || IMG.Cement}?w=600&h=400&fit=crop`

const SEED = [
  { id: 1, name: 'UltraTech Cement OPC 53 Grade', category: 'Cement', brand: 'UltraTech', supplier: 'BuildMart Gurgaon', unit: '50kg bag', price: 410, stock: 'In Stock', image: img('Cement'), description: 'High-strength OPC for RCC & structural work.' },
  { id: 2, name: 'TATA Tiscon 550SD TMT Bars (12mm)', category: 'Steel & TMT', brand: 'TATA Steel', supplier: 'Steel Hub Sohna Rd', unit: 'per ton', price: 62500, stock: 'In Stock', image: img('Steel & TMT'), description: 'Earthquake-resistant Fe-550 TMT rebars.' },
  { id: 3, name: 'AAC Lightweight Blocks (600x200x100)', category: 'Bricks & Blocks', brand: 'Magicrete', supplier: 'New Gurgaon Depot', unit: 'per block', price: 48, stock: 'In Stock', image: img('Bricks & Blocks'), description: 'Autoclaved aerated concrete — light & insulating.' },
  { id: 4, name: 'Kajaria Vitrified Floor Tiles (600x600)', category: 'Tiles & Flooring', brand: 'Kajaria', supplier: 'Tile Studio DLF', unit: 'per box (4)', price: 1180, stock: 'Low Stock', image: img('Tiles & Flooring'), description: 'Double-charge vitrified tiles, matt finish.' },
  { id: 5, name: 'Asian Paints Royale Luxury Emulsion', category: 'Paints', brand: 'Asian Paints', supplier: 'ColorWorld SPR', unit: '20L bucket', price: 7600, stock: 'In Stock', image: img('Paints'), description: 'Premium interior emulsion, washable.' },
  { id: 6, name: 'Astral CPVC Pipes & Fittings Set', category: 'Plumbing', brand: 'Astral', supplier: 'AquaFit Traders', unit: 'set', price: 3400, stock: 'In Stock', image: img('Plumbing'), description: 'Lead-free hot & cold water CPVC system.' },
  { id: 7, name: 'Havells Modular Switches & MCB Kit', category: 'Electrical', brand: 'Havells', supplier: 'Voltline Gurgaon', unit: 'kit', price: 5200, stock: 'In Stock', image: img('Electrical'), description: 'Complete switchgear + modular plates.' },
  { id: 8, name: 'Hindware Wall-Hung WC + Cistern', category: 'Sanitaryware', brand: 'Hindware', supplier: 'Bath Gallery', unit: 'piece', price: 9800, stock: 'Out of Stock', image: img('Sanitaryware'), description: 'Rimless wall-hung toilet with soft-close.' },
]
const EMPTY = { name: '', category: 'Cement', brand: '', supplier: '', unit: '50kg bag', price: '', stock: 'In Stock', image: '', description: '' }
const inr = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`

export default function Materials() {
  const { rows, add, update, remove } = useSupabaseCollection('build_materials', SEED, { localKey: 'os_build_materials', orderBy: 'id' })
  const { canEditModule } = usePermissions()
  const canEdit = canEditModule('Properties')
  const [search, setSearch] = useState('')
  const [cat, setCat] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [showDelete, setShowDelete] = useState(null)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY)

  const filtered = rows.filter(r => {
    if (search && !`${r.name} ${r.brand} ${r.supplier}`.toLowerCase().includes(search.toLowerCase())) return false
    if (cat !== 'all' && r.category !== cat) return false
    return true
  })
  const suppliers = new Set(rows.map(r => r.supplier)).size
  const inStock = rows.filter(r => r.stock === 'In Stock').length

  const openAdd = () => { setEditing(null); setForm({ ...EMPTY, image: img('Cement') }); setShowModal(true) }
  const openEdit = (r) => { setEditing(r.id); setForm({ ...EMPTY, ...r }); setShowModal(true) }
  const save = () => {
    if (!form.name) return
    const payload = { ...form, price: Number(form.price) || 0, image: form.image || img(form.category) }
    editing ? update(editing, payload) : add(payload)
    setShowModal(false)
  }
  const set = (k, v) => setForm(f => ({ ...f, [k]: v, ...(k === 'category' && !f.image ? { image: img(v) } : {}) }))

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><Hammer className="w-6 h-6 text-primary-600" /> Materials &amp; Hardware</h1>
          <p className="text-gray-500 mt-1">Build With Us — curated building materials, hardware &amp; suppliers</p>
        </div>
        {canEdit
          ? <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-primary-600 rounded-lg hover:bg-primary-700"><Plus className="w-4 h-4" /> Add Item</button>
          : <span className="text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">🔒 Read-only</span>}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Stat icon={Package} n={rows.length} label="Catalog items" />
        <Stat icon={Tag} n={inStock} label="In stock" color="text-green-600" />
        <Stat icon={Truck} n={suppliers} label="Suppliers" color="text-primary-600" />
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search material, brand or supplier…" className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200" />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {['all', ...CATEGORIES].map(c => (
            <button key={c} onClick={() => setCat(c)} className={`px-3 py-1.5 text-xs font-semibold rounded-full border ${cat === c ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-gray-500 border-gray-200 hover:text-gray-800'}`}>
              {c === 'all' ? `All (${rows.length})` : c}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400 bg-white rounded-xl border border-dashed border-gray-200"><Hammer className="w-10 h-10 mx-auto mb-3 opacity-40" /><p className="font-medium text-gray-600">No items found.</p></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map(r => (
            <div key={r.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
              <div className="relative aspect-video bg-gray-100">
                <img src={r.image} alt={r.name} className="w-full h-full object-cover" onError={e => { e.target.style.display = 'none' }} />
                <span className={`absolute top-2 left-2 text-xs font-bold px-2 py-0.5 rounded-full ${STOCK_STYLE[r.stock]}`}>{r.stock}</span>
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <span className="text-xs font-bold text-primary-600 uppercase tracking-wide">{r.category}</span>
                <h3 className="font-bold text-gray-900 mt-1 leading-snug line-clamp-2">{r.name}</h3>
                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1"><Truck className="w-3 h-3" /> {r.supplier} · {r.brand}</p>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                  <div><span className="font-extrabold text-gray-900">{inr(r.price)}</span><span className="text-xs text-gray-400"> / {r.unit}</span></div>
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
        <Modal title={editing ? 'Edit Item' : 'New Item'} onClose={() => setShowModal(false)} onSave={save} saveLabel={editing ? 'Save' : 'Add item'}>
          <Field label="Name *" cls="sm:col-span-2"><input value={form.name} onChange={e => set('name', e.target.value)} className={inp} /></Field>
          <Field label="Category"><select value={form.category} onChange={e => set('category', e.target.value)} className={inp}>{CATEGORIES.map(c => <option key={c}>{c}</option>)}</select></Field>
          <Field label="Brand"><input value={form.brand} onChange={e => set('brand', e.target.value)} className={inp} /></Field>
          <Field label="Supplier"><input value={form.supplier} onChange={e => set('supplier', e.target.value)} className={inp} /></Field>
          <Field label="Unit"><input value={form.unit} onChange={e => set('unit', e.target.value)} placeholder="50kg bag / per ton / piece" className={inp} /></Field>
          <Field label="Price (₹)"><input type="number" value={form.price} onChange={e => set('price', e.target.value)} className={inp} /></Field>
          <Field label="Stock"><select value={form.stock} onChange={e => set('stock', e.target.value)} className={inp}>{STOCK.map(s => <option key={s}>{s}</option>)}</select></Field>
          <Field label="Image URL" cls="sm:col-span-2"><input value={form.image} onChange={e => set('image', e.target.value)} className={inp} /></Field>
          <Field label="Description" cls="sm:col-span-2"><textarea rows={2} value={form.description} onChange={e => set('description', e.target.value)} className={inp} /></Field>
        </Modal>
      )}
      {showDelete && <Confirm title="Delete item?" sub={showDelete.name} onCancel={() => setShowDelete(null)} onConfirm={() => { remove(showDelete.id); setShowDelete(null) }} />}
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
