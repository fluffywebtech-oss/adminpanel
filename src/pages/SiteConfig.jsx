import { useState } from 'react'
import { Save, Plus, Edit2, Trash2, X, Globe, Video, Tag, BarChart3, Play, Upload } from 'lucide-react'
import { siteConfig } from '../data/mockData'

export default function SiteConfig() {
  const [config, setConfig] = useState(structuredClone(siteConfig))
  const [activeTab, setActiveTab] = useState('hero')
  const [saved, setSaved] = useState(false)
  const [editingTag, setEditingTag] = useState(null)
  const [editingStat, setEditingStat] = useState(null)
  const [tagForm, setTagForm] = useState({ label: '', active: true })
  const [statForm, setStatForm] = useState({ icon: 'building', label: '', value: '' })
  const [tabForm, setTabForm] = useState({ id: '', label: '', active: false })

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const addTag = () => {
    if (!tagForm.label) return
    const newTag = { id: Date.now(), label: tagForm.label, active: tagForm.active }
    setConfig(c => ({ ...c, searchTags: [...c.searchTags, newTag] }))
    setTagForm({ label: '', active: true })
  }

  const updateTag = (id) => {
    setConfig(c => ({ ...c, searchTags: c.searchTags.map(t => t.id === id ? editingTag : t) }))
    setEditingTag(null)
  }

  const deleteTag = (id) => {
    setConfig(c => ({ ...c, searchTags: c.searchTags.filter(t => t.id !== id) }))
  }

  const toggleTag = (id) => {
    setConfig(c => ({ ...c, searchTags: c.searchTags.map(t => t.id === id ? { ...t, active: !t.active } : t) }))
  }

  const addStat = () => {
    if (!statForm.label || !statForm.value) return
    const newStat = { id: Date.now(), ...statForm }
    setConfig(c => ({ ...c, heroStats: [...c.heroStats, newStat] }))
    setStatForm({ icon: 'building', label: '', value: '' })
  }

  const updateStat = (id) => {
    setConfig(c => ({ ...c, heroStats: c.heroStats.map(s => s.id === id ? editingStat : s) }))
    setEditingStat(null)
  }

  const deleteStat = (id) => {
    setConfig(c => ({ ...c, heroStats: c.heroStats.filter(s => s.id !== id) }))
  }

  const toggleTab = (id) => {
    setConfig(c => ({ ...c, searchTabs: c.searchTabs.map(t => ({ ...t, active: t.id === id })) }))
  }

  const addTab = () => {
    if (!tabForm.id || !tabForm.label) return
    setConfig(c => ({ ...c, searchTabs: [...c.searchTabs, { ...tabForm }] }))
    setTabForm({ id: '', label: '', active: false })
  }

  const deleteTab = (id) => {
    setConfig(c => ({ ...c, searchTabs: c.searchTabs.filter(t => t.id !== id) }))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Site Configuration</h1>
          <p className="text-gray-500 mt-1">Control hero banner, search tags, and homepage stats</p>
        </div>
        <button onClick={handleSave} className={`btn-primary flex items-center gap-2 ${saved ? 'bg-green-600' : ''}`}>
          {saved ? <><Check className="w-4 h-4" />Saved!</> : <><Save className="w-4 h-4" />Save Changes</>}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 pb-0">
        {[
          { id: 'hero', label: 'Hero Banner', icon: Video },
          { id: 'search', label: 'Search Tabs', icon: Globe },
          { id: 'tags', label: 'Search Tags', icon: Tag },
          { id: 'stats', label: 'Hero Stats', icon: BarChart3 },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors ${
              activeTab === tab.id ? 'bg-primary-600 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <tab.icon className="w-4 h-4" />{tab.label}
          </button>
        ))}
      </div>

      {/* Hero Banner Section */}
      {activeTab === 'hero' && (
        <div className="card space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2"><Video className="w-5 h-5 text-primary-600" />Hero Banner Settings</h2>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hero Video URL</label>
              <input
                type="text"
                value={config.heroVideo}
                onChange={e => setConfig({ ...config, heroVideo: e.target.value })}
                className="input-field"
                placeholder="/video.mp4"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hero Title</label>
              <input
                type="text"
                value={config.heroTitle}
                onChange={e => setConfig({ ...config, heroTitle: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hero Subtitle</label>
              <input
                type="text"
                value={config.heroSubtitle}
                onChange={e => setConfig({ ...config, heroSubtitle: e.target.value })}
                className="input-field"
              />
            </div>
          </div>
          {/* Preview */}
          <div className="relative h-48 rounded-xl overflow-hidden bg-gradient-to-br from-primary-900 to-primary-700">
            <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white p-6 text-center">
              <h2 className="text-2xl font-bold mb-1">{config.heroTitle || 'Hero Title'}</h2>
              <p className="text-white/80 text-sm">{config.heroSubtitle || 'Hero Subtitle'}</p>
              <div className="flex items-center gap-2 mt-3 bg-white/10 rounded-full px-4 py-2 text-sm">
                <Play className="w-4 h-4" />{config.heroVideo}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search Tabs Section */}
      {activeTab === 'search' && (
        <div className="card space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2"><Globe className="w-5 h-5 text-primary-600" />Search Tabs</h2>
          </div>
          <div className="space-y-2">
            {config.searchTabs.map(tab => (
              <div key={tab.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <button
                  onClick={() => toggleTab(tab.id)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    tab.active ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 border'
                  }`}
                >
                  {tab.label} {tab.active && '✓'}
                </button>
                <span className="text-xs text-gray-500 capitalize">ID: {tab.id}</span>
                <button onClick={() => deleteTab(tab.id)} className="ml-auto p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-3 pt-3 border-t">
            <input
              type="text"
              placeholder="Tab ID (e.g. buy)"
              value={tabForm.id}
              onChange={e => setTabForm(f => ({ ...f, id: e.target.value }))}
              className="input-field flex-1"
            />
            <input
              type="text"
              placeholder="Tab Label (e.g. Buy)"
              value={tabForm.label}
              onChange={e => setTabForm(f => ({ ...f, label: e.target.value }))}
              className="input-field flex-1"
            />
            <button onClick={addTab} className="btn-primary flex items-center gap-1"><Plus className="w-4 h-4" />Add</button>
          </div>
        </div>
      )}

      {/* Search Tags Section */}
      {activeTab === 'tags' && (
        <div className="card space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2"><Tag className="w-5 h-5 text-primary-600" />Search Tags</h2>
            <span className="text-sm text-gray-500">{config.searchTags.length} tags</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {config.searchTags.map(tag => (
              <div key={tag.id} className="group relative">
                {editingTag && editingTag.id === tag.id ? (
                  <div className="flex items-center gap-1">
                    <input
                      type="text"
                      value={editingTag.label}
                      onChange={e => setEditingTag({ ...editingTag, label: e.target.value })}
                      className="input-field w-28 text-sm py-1"
                      autoFocus
                    />
                    <button onClick={() => updateTag(tag.id)} className="p-1 text-green-600 hover:bg-green-50 rounded">✓</button>
                    <button onClick={() => setEditingTag(null)} className="p-1 text-gray-400 hover:bg-gray-100 rounded"><X className="w-3 h-3" /></button>
                  </div>
                ) : (
                  <button
                    onClick={() => toggleTag(tag.id)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all cursor-pointer group ${
                      tag.active
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-500 line-through'
                    }`}
                  >
                    {tag.label}
                    <span className="ml-1 opacity-0 group-hover:opacity-100 inline-flex gap-0.5">
                      <span onClick={(e) => { e.stopPropagation(); setEditingTag(tag) }} className="hover:bg-white/20 rounded px-0.5">✎</span>
                      <span onClick={(e) => { e.stopPropagation(); deleteTag(tag.id) }} className="hover:bg-white/20 rounded px-0.5">×</span>
                    </span>
                  </button>
                )}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-3 pt-3 border-t">
            <input
              type="text"
              placeholder="New tag label"
              value={tagForm.label}
              onChange={e => setTagForm(f => ({ ...f, label: e.target.value }))}
              className="input-field flex-1"
              onKeyDown={e => e.key === 'Enter' && addTag()}
            />
            <button onClick={addTag} className="btn-primary flex items-center gap-1"><Plus className="w-4 h-4" />Add Tag</button>
          </div>
        </div>
      )}

      {/* Hero Stats Section */}
      {activeTab === 'stats' && (
        <div className="card space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2"><BarChart3 className="w-5 h-5 text-primary-600" />Hero Statistics</h2>
            <span className="text-sm text-gray-500">{config.heroStats.length} stats</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {config.heroStats.map(stat => (
              <div key={stat.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg group">
                {editingStat && editingStat.id === stat.id ? (
                  <div className="flex flex-col gap-2 w-full">
                    <input
                      type="text"
                      value={editingStat.icon}
                      onChange={e => setEditingStat({ ...editingStat, icon: e.target.value })}
                      className="input-field text-sm py-1"
                      placeholder="icon name"
                    />
                    <input
                      type="text"
                      value={editingStat.label}
                      onChange={e => setEditingStat({ ...editingStat, label: e.target.value })}
                      className="input-field text-sm py-1"
                      placeholder="label"
                    />
                    <input
                      type="text"
                      value={editingStat.value}
                      onChange={e => setEditingStat({ ...editingStat, value: e.target.value })}
                      className="input-field text-sm py-1"
                      placeholder="value"
                    />
                    <div className="flex gap-2">
                      <button onClick={() => updateStat(stat.id)} className="btn-primary text-xs py-1">Save</button>
                      <button onClick={() => setEditingStat(null)} className="btn-secondary text-xs py-1">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center text-lg">{stat.icon === 'building' ? '🏢' : stat.icon === 'users' ? '👥' : stat.icon === 'mapPin' ? '📍' : stat.icon === 'star' ? '⭐' : '📊'}</div>
                    <div className="flex-1">
                      <p className="font-bold text-gray-900">{stat.value}</p>
                      <p className="text-xs text-gray-500">{stat.label}</p>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => setEditingStat(stat)} className="p-1 text-blue-500 hover:bg-blue-50 rounded"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => deleteStat(stat.id)} className="p-1 text-red-500 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-3 pt-3 border-t">
            <select value={statForm.icon} onChange={e => setStatForm(f => ({ ...f, icon: e.target.value }))} className="input-field w-auto">
              <option value="building">Building</option>
              <option value="users">Users</option>
              <option value="mapPin">Map Pin</option>
              <option value="star">Star</option>
            </select>
            <input
              type="text"
              placeholder="Label"
              value={statForm.label}
              onChange={e => setStatForm(f => ({ ...f, label: e.target.value }))}
              className="input-field flex-1"
            />
            <input
              type="text"
              placeholder="Value (e.g. 10,000+)"
              value={statForm.value}
              onChange={e => setStatForm(f => ({ ...f, value: e.target.value }))}
              className="input-field w-28"
            />
            <button onClick={addStat} className="btn-primary flex items-center gap-1"><Plus className="w-4 h-4" />Add</button>
          </div>
        </div>
      )}
    </div>
  )
}

function Check({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  )
}