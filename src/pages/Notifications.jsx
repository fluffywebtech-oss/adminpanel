import { useState } from 'react'
import { Plus, Edit2, Trash2, X, Bell, BellOff, Search, Filter, Send } from 'lucide-react'
import { frontendNotifications, allProperties } from '../data/mockData'

export default function Notifications() {
  const [notifs, setNotifs] = useState(frontendNotifications.map(n => ({ ...n })))
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [readFilter, setReadFilter] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [showDelete, setShowDelete] = useState(null)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ title: '', message: '', type: 'property', read: false })

  const filtered = notifs.filter(n => {
    if (search && !n.title.toLowerCase().includes(search.toLowerCase()) && !n.message.toLowerCase().includes(search.toLowerCase())) return false
    if (typeFilter !== 'all' && n.type !== typeFilter) return false
    if (readFilter === 'read' && !n.read) return false
    if (readFilter === 'unread' && n.read) return false
    return true
  })

  const openAdd = () => {
    setEditing(null)
    setForm({ title: '', message: '', type: 'property', read: false })
    setShowModal(true)
  }

  const openEdit = (n) => {
    setEditing(n.id)
    setForm({ title: n.title, message: n.message, type: n.type, read: n.read })
    setShowModal(true)
  }

  const handleSave = () => {
    if (!form.title || !form.message) return
    if (editing) {
      setNotifs(notifs.map(n => n.id === editing ? { ...n, ...form, timestamp: Date.now() } : n))
    } else {
      setNotifs([...notifs, { id: Date.now(), ...form, timestamp: Date.now() }])
    }
    setShowModal(false)
  }

  const toggleRead = (id) => {
    setNotifs(notifs.map(n => n.id === id ? { ...n, read: !n.read } : n))
  }

  const handleDelete = () => {
    setNotifs(notifs.filter(n => n.id !== showDelete))
    setShowDelete(null)
  }

  const timeAgo = (ts) => {
    const diff = Date.now() - ts
    const mins = Math.floor(diff / 60000)
    if (mins < 60) return `${mins}m ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs}h ago`
    return `${Math.floor(hrs / 24)}d ago`
  }

  const typeIcons = { property: '🏠', price: '💰', offer: '🎉', rera: '📋', guide: '📚' }
  const typeColors = { property: 'bg-blue-100 text-blue-700', price: 'bg-green-100 text-green-700', offer: 'bg-purple-100 text-purple-700', rera: 'bg-orange-100 text-orange-700', guide: 'bg-teal-100 text-teal-700' }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Frontend Notifications</h1>
          <p className="text-gray-500 mt-1">Manage push notifications shown to users ({notifs.filter(n => !n.read).length} unread)</p>
        </div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2"><Plus className="w-4 h-4" />Send Notification</button>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search notifications..." value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-10" />
          </div>
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="input-field w-auto">
            <option value="all">All Types</option>
            <option value="property">🏠 Property</option>
            <option value="price">💰 Price</option>
            <option value="offer">🎉 Offer</option>
            <option value="rera">📋 RERA</option>
            <option value="guide">📚 Guide</option>
          </select>
          <select value={readFilter} onChange={e => setReadFilter(e.target.value)} className="input-field w-auto">
            <option value="all">All Status</option>
            <option value="unread">Unread</option>
            <option value="read">Read</option>
          </select>
        </div>
      </div>

      {/* Notification List */}
      <div className="card space-y-2">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Bell className="w-12 h-12 mx-auto mb-3" />
            <p>No notifications found</p>
          </div>
        ) : (
          filtered.map(n => (
            <div key={n.id} className={`flex items-start gap-4 p-4 rounded-xl transition-colors ${n.read ? 'bg-white' : 'bg-primary-50 border border-primary-100'}`}>
              <button
                onClick={() => toggleRead(n.id)}
                className={`mt-0.5 p-1 rounded-full transition-colors ${n.read ? 'text-gray-300 hover:text-gray-500' : 'text-primary-500 hover:text-primary-700'}`}
                title={n.read ? 'Mark unread' : 'Mark read'}
              >
                {n.read ? <BellOff className="w-5 h-5" /> : <Bell className="w-5 h-5" />}
              </button>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className={`text-sm font-semibold ${n.read ? 'text-gray-800' : 'text-gray-900'}`}>{n.title}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${typeColors[n.type] || 'bg-gray-100 text-gray-600'}`}>
                    {n.type}
                  </span>
                </div>
                <p className={`text-sm ${n.read ? 'text-gray-500' : 'text-gray-700'}`}>{n.message}</p>
                <p className="text-xs text-gray-400 mt-1">{timeAgo(n.timestamp)}</p>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => openEdit(n)} className="p-1.5 rounded-md hover:bg-gray-100 text-blue-500"><Edit2 className="w-4 h-4" /></button>
                <button onClick={() => setShowDelete(n.id)} className="p-1.5 rounded-md hover:bg-gray-100 text-red-500"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-lg font-semibold">{editing ? 'Edit Notification' : 'Send New Notification'}</h2>
              <button onClick={() => setShowModal(false)} className="p-1 rounded-md hover:bg-gray-100"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="input-field" placeholder="Notification title" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
                <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} className="input-field" rows={3} placeholder="Notification message" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="input-field">
                    <option value="property">🏠 Property</option>
                    <option value="price">💰 Price</option>
                    <option value="offer">🎉 Offer</option>
                    <option value="rera">📋 RERA</option>
                    <option value="guide">📚 Guide</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select value={form.read ? 'read' : 'unread'} onChange={e => setForm({ ...form, read: e.target.value === 'read' })} className="input-field">
                    <option value="unread">Unread</option>
                    <option value="read">Read</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 p-6 border-t">
              <button onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
              <button onClick={handleSave} className="btn-primary flex items-center gap-2"><Send className="w-4 h-4" />{editing ? 'Update' : 'Send'}</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {showDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full text-center">
            <BellOff className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Notification?</h3>
            <p className="text-sm text-gray-500 mb-6">This action cannot be undone.</p>
            <div className="flex items-center justify-center gap-3">
              <button onClick={() => setShowDelete(null)} className="btn-secondary">Cancel</button>
              <button onClick={handleDelete} className="btn-danger">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}