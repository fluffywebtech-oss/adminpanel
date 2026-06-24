import { useState } from 'react'
import { Search, Plus, Edit2, Trash2, X, Mic, Play, Headphones, Star, Clock, AlertTriangle } from 'lucide-react'
import { useData } from '../context/DataContext'

const CATEGORIES = ['market-analysis', 'buyer-guide', 'finance', 'technology', 'legal']
const CAT_LABEL = {
  'market-analysis': 'Market Analysis', 'buyer-guide': 'Buyer Guide',
  finance: 'Finance', technology: 'Technology', legal: 'Legal',
}

const EMPTY = {
  title: '', description: '', guest: '', guestRole: '', guestAvatar: '',
  audioUrl: '', videoUrl: '', poster: '', duration: '', date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
  listens: 0, category: 'market-analysis', featured: false, tags: '',
}

export default function Podcasts() {
  const { podcasts, addPodcast, updatePodcast, deletePodcast } = useData()
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [showDelete, setShowDelete] = useState(null)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY)

  const filtered = podcasts.filter(p => {
    if (search && !`${p.title} ${p.guest}`.toLowerCase().includes(search.toLowerCase())) return false
    if (categoryFilter !== 'all' && p.category !== categoryFilter) return false
    return true
  })

  const totalListens = podcasts.reduce((s, p) => s + (Number(p.listens) || 0), 0)

  const openAdd = () => { setEditing(null); setForm(EMPTY); setShowModal(true) }
  const openEdit = (p) => {
    setEditing(p.id)
    setForm({ ...EMPTY, ...p, tags: Array.isArray(p.tags) ? p.tags.join(', ') : (p.tags || '') })
    setShowModal(true)
  }

  const handleSave = () => {
    if (!form.title || !form.guest) return
    const payload = {
      ...form,
      listens: Number(form.listens) || 0,
      tags: String(form.tags).split(',').map(t => t.trim()).filter(Boolean),
    }
    if (editing) updatePodcast(editing, payload)
    else addPodcast(payload)
    setShowModal(false)
  }

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Mic className="w-6 h-6 text-primary-600" /> Podcasts
          </h1>
          <p className="text-gray-500 mt-1">{podcasts.length} episodes · {totalListens.toLocaleString()} total listens</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-primary-600 rounded-lg hover:bg-primary-700">
          <Plus className="w-4 h-4" /> New Episode
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search title or guest…"
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200" />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {['all', ...CATEGORIES].map(c => (
            <button key={c} onClick={() => setCategoryFilter(c)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-full border ${categoryFilter === c ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-gray-500 border-gray-200 hover:text-gray-800'}`}>
              {c === 'all' ? `All (${podcasts.length})` : CAT_LABEL[c]}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400 bg-white rounded-xl border border-dashed border-gray-200">
          <Mic className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p className="font-medium text-gray-600">No episodes found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map(p => (
            <div key={p.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
              <div className="relative aspect-video bg-gray-100">
                {p.poster
                  ? <img src={p.poster} alt={p.title} className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center text-4xl">🎙️</div>}
                <span className="absolute inset-0 m-auto w-11 h-11 flex items-center justify-center rounded-full bg-black/55 text-white border-2 border-white/80">
                  <Play className="w-4 h-4 ml-0.5" />
                </span>
                {p.featured && <span className="absolute top-2 left-2 flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full bg-amber-400 text-amber-900"><Star className="w-3 h-3" /> Featured</span>}
                {p.duration && <span className="absolute bottom-2 right-2 flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded bg-black/70 text-white"><Clock className="w-3 h-3" /> {p.duration}</span>}
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <span className="text-xs font-bold text-primary-600 uppercase tracking-wide">{CAT_LABEL[p.category] || p.category}</span>
                <h3 className="font-bold text-gray-900 mt-1 leading-snug line-clamp-2">{p.title}</h3>
                <div className="flex items-center gap-2 mt-2">
                  {p.guestAvatar && <img src={p.guestAvatar} alt="" className="w-7 h-7 rounded-full object-cover" />}
                  <span className="text-xs text-gray-500 truncate">{p.guest}</span>
                </div>
                <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500">
                  <span className="flex items-center gap-1"><Headphones className="w-3.5 h-3.5" /> {Number(p.listens).toLocaleString()}</span>
                  <span>{p.date}</span>
                  <div className="ml-auto flex gap-1">
                    <button onClick={() => openEdit(p)} className="p-1.5 rounded-md hover:bg-gray-100 text-blue-500"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => setShowDelete(p)} className="p-1.5 rounded-md hover:bg-gray-100 text-red-500"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-gray-100 sticky top-0 bg-white">
              <h3 className="font-bold text-gray-900">{editing ? 'Edit Episode' : 'New Episode'}</h3>
              <button onClick={() => setShowModal(false)} className="p-1 rounded-md hover:bg-gray-100"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field className="sm:col-span-2" label="Title *"><input value={form.title} onChange={e => set('title', e.target.value)} className={inp} /></Field>
              <Field className="sm:col-span-2" label="Description"><textarea rows={2} value={form.description} onChange={e => set('description', e.target.value)} className={inp} /></Field>
              <Field label="Guest *"><input value={form.guest} onChange={e => set('guest', e.target.value)} className={inp} /></Field>
              <Field label="Guest role"><input value={form.guestRole} onChange={e => set('guestRole', e.target.value)} className={inp} /></Field>
              <Field label="Guest avatar URL"><input value={form.guestAvatar} onChange={e => set('guestAvatar', e.target.value)} className={inp} /></Field>
              <Field label="Poster image URL"><input value={form.poster} onChange={e => set('poster', e.target.value)} className={inp} /></Field>
              <Field label="Audio URL"><input value={form.audioUrl} onChange={e => set('audioUrl', e.target.value)} className={inp} /></Field>
              <Field label="Video URL"><input value={form.videoUrl} onChange={e => set('videoUrl', e.target.value)} className={inp} /></Field>
              <Field label="Duration"><input value={form.duration} onChange={e => set('duration', e.target.value)} placeholder="45:32" className={inp} /></Field>
              <Field label="Listens"><input type="number" value={form.listens} onChange={e => set('listens', e.target.value)} className={inp} /></Field>
              <Field label="Date"><input value={form.date} onChange={e => set('date', e.target.value)} className={inp} /></Field>
              <Field label="Category">
                <select value={form.category} onChange={e => set('category', e.target.value)} className={inp}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{CAT_LABEL[c]}</option>)}
                </select>
              </Field>
              <Field className="sm:col-span-2" label="Tags (comma-separated)"><input value={form.tags} onChange={e => set('tags', e.target.value)} className={inp} /></Field>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
                <input type="checkbox" checked={form.featured} onChange={e => set('featured', e.target.checked)} /> Featured episode
              </label>
            </div>
            <div className="flex justify-end gap-2 p-4 border-t border-gray-100">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
              <button onClick={handleSave} className="px-4 py-2 text-sm font-semibold text-white bg-primary-600 rounded-lg hover:bg-primary-700">{editing ? 'Save changes' : 'Add episode'}</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {showDelete && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => setShowDelete(null)}>
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6 text-center" onClick={e => e.stopPropagation()}>
            <AlertTriangle className="w-10 h-10 text-red-500 mx-auto mb-3" />
            <h3 className="font-bold text-gray-900">Delete episode?</h3>
            <p className="text-sm text-gray-500 mt-1">“{showDelete.title}” will be removed.</p>
            <div className="flex gap-2 mt-5">
              <button onClick={() => setShowDelete(null)} className="flex-1 px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
              <button onClick={() => { deletePodcast(showDelete.id); setShowDelete(null) }} className="flex-1 px-4 py-2 text-sm font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const inp = 'w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200'
function Field({ label, children, className = '' }) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {children}
    </div>
  )
}
