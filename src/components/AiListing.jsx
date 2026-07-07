import { useState } from 'react'
import { X, Sparkles, Loader2, Wand2, ImageIcon, RefreshCw, CheckCircle2 } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { normalizeAi, heuristicFromPrompt, pickImage, toDbRow } from '../lib/listingMapper'
import { logAudit } from '../lib/audit'

const EXAMPLES = [
  'DLF Privana North, 4 BHK penthouse, Sector 76 SPR Gurgaon, ultra-luxury ₹8.2 Cr, new launch',
  'Affordable 2 BHK by Signature Global on Dwarka Expressway, ready to move, ₹95 lakh',
  'Sobha villa in Sector 80 New Gurgaon, 4 BHK, premium, ₹3.5 Cr',
]
const TYPES = ['Apartment', 'Penthouse', 'Villa', 'Plot', 'Commercial']
const POSSESSION = ['New Launch', 'Under Construction', 'Ready to Move']
const AMENITY_OPTS = ['pool', 'gym', 'parking', 'security', 'smartHome', 'garden', 'clubhouse']

export default function AiListing({ onClose, toast }) {
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [draft, setDraft] = useState(null)
  const [image, setImage] = useState('')
  const [source, setSource] = useState(null)   // 'ai' | 'heuristic'
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const set = (k, v) => setDraft(d => ({ ...d, [k]: v }))
  const toggleAmenity = (a) => setDraft(d => ({ ...d, amenities: d.amenities.includes(a) ? d.amenities.filter(x => x !== a) : [...d.amenities, a] }))

  const generate = async () => {
    if (!prompt.trim()) return
    setLoading(true)
    let listing, src
    try {
      const res = await fetch('/api/generate-listing', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      })
      if (res.ok) { listing = normalizeAi((await res.json()).listing); src = 'ai' }
      else throw new Error(String(res.status))
    } catch {
      listing = heuristicFromPrompt(prompt); src = 'heuristic'   // graceful no-API fallback
    }
    setDraft(listing); setSource(src); setImage(pickImage(listing)); setLoading(false)
  }

  const save = async () => {
    if (!draft) return
    setSaving(true)
    const { error } = await supabase.from('properties').insert(toDbRow(draft, image)).select('id')
    setSaving(false)
    if (error) { toast?.('Save failed: ' + error.message, 'error'); return }
    logAudit('Published listing', `${draft.title} (AI)`)
    setSaved(true); toast?.('Listing published to Supabase', 'success')
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[92vh] overflow-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h3 className="font-bold text-gray-900 flex items-center gap-2"><Sparkles className="w-5 h-5 text-primary-600" /> AI Listing Generator</h3>
          <button onClick={onClose} className="p-1 rounded-md hover:bg-gray-100"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-5 space-y-4">
          {saved ? (
            <div className="text-center py-10">
              <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-gray-900">Published!</h3>
              <p className="text-gray-500 mt-1">“{draft.title}” is live in Supabase.</p>
              <div className="flex gap-2 justify-center mt-5">
                <button onClick={() => { setSaved(false); setDraft(null); setPrompt('') }} className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">Generate another</button>
                <button onClick={onClose} className="px-5 py-2 text-sm font-semibold text-white bg-primary-600 rounded-lg hover:bg-primary-700">Done</button>
              </div>
            </div>
          ) : (
            <>
              {/* Prompt */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Describe the property</label>
                <textarea value={prompt} onChange={e => setPrompt(e.target.value)} rows={2}
                  placeholder="e.g. DLF Privana North, 4 BHK penthouse, Sector 76 SPR Gurgaon, ultra-luxury ₹8.2 Cr, new launch"
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200" />
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {EXAMPLES.map((ex, i) => (
                    <button key={i} onClick={() => setPrompt(ex)} className="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 hover:bg-primary-50 hover:text-primary-700">{ex.split(',')[0]}…</button>
                  ))}
                </div>
                <button onClick={generate} disabled={!prompt.trim() || loading}
                  className="mt-3 flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:opacity-50">
                  {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating…</> : <><Wand2 className="w-4 h-4" /> Generate listing</>}
                </button>
              </div>

              {/* Draft preview (editable) */}
              {draft && (
                <div className="border-t border-gray-100 pt-4 space-y-4">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${source === 'ai' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
                      {source === 'ai' ? '✨ AI-generated' : '⚙️ Drafted from prompt (set ANTHROPIC_API_KEY for full AI)'}
                    </span>
                  </div>

                  {/* Hero image */}
                  <div className="grid grid-cols-1 sm:grid-cols-[200px_1fr] gap-4">
                    <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
                      {image ? <img src={image} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-300"><ImageIcon className="w-8 h-8" /></div>}
                      <button onClick={() => setImage(pickImage({ ...draft, title: draft.title + Math.random() }))} title="Shuffle image" className="absolute bottom-1 right-1 p-1.5 rounded-md bg-black/60 text-white hover:bg-black/80"><RefreshCw className="w-3.5 h-3.5" /></button>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Hero image URL (auto-picked — paste your own to override)</label>
                      <input value={image} onChange={e => setImage(e.target.value)} className={inp} />
                      <p className="text-xs text-gray-400 mt-1">Tip: upload the real render in the property’s Edit screen (Supabase Storage).</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <F label="Title" cls="sm:col-span-2"><input value={draft.title} onChange={e => set('title', e.target.value)} className={inp} /></F>
                    <F label="Location"><input value={draft.location} onChange={e => set('location', e.target.value)} className={inp} /></F>
                    <F label="Builder"><input value={draft.builder} onChange={e => set('builder', e.target.value)} className={inp} /></F>
                    <F label="Price (₹)"><input type="number" value={draft.price} onChange={e => set('price', Number(e.target.value))} className={inp} /></F>
                    <F label="Type"><select value={draft.type} onChange={e => set('type', e.target.value)} className={inp}>{TYPES.map(t => <option key={t}>{t}</option>)}</select></F>
                    <F label="Beds"><input type="number" value={draft.beds} onChange={e => set('beds', Number(e.target.value))} className={inp} /></F>
                    <F label="Baths"><input type="number" value={draft.baths} onChange={e => set('baths', Number(e.target.value))} className={inp} /></F>
                    <F label="Sq.ft"><input type="number" value={draft.sqft} onChange={e => set('sqft', Number(e.target.value))} className={inp} /></F>
                    <F label="Possession"><select value={draft.possessionStatus} onChange={e => set('possessionStatus', e.target.value)} className={inp}>{POSSESSION.map(t => <option key={t}>{t}</option>)}</select></F>
                    <F label="RERA ID"><input value={draft.reraId} onChange={e => set('reraId', e.target.value)} className={inp} /></F>
                    <F label="Agent"><input value={draft.agentName} onChange={e => set('agentName', e.target.value)} className={inp} /></F>
                    <F label="Description" cls="sm:col-span-2"><textarea rows={2} value={draft.description} onChange={e => set('description', e.target.value)} className={inp} /></F>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1.5">Amenities</label>
                    <div className="flex flex-wrap gap-1.5">
                      {AMENITY_OPTS.map(a => (
                        <button key={a} onClick={() => toggleAmenity(a)} className={`text-xs px-2.5 py-1 rounded-full border ${draft.amenities.includes(a) ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-gray-500 border-gray-200'}`}>{a}</button>
                      ))}
                    </div>
                    <div className="flex gap-4 mt-3 text-sm">
                      <label className="flex items-center gap-1.5"><input type="checkbox" checked={draft.featured} onChange={e => set('featured', e.target.checked)} /> Featured</label>
                      <label className="flex items-center gap-1.5"><input type="checkbox" checked={draft.hot} onChange={e => set('hot', e.target.checked)} /> Hot deal</label>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-1">
                    <button onClick={generate} className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">↻ Regenerate</button>
                    <button onClick={save} disabled={saving} className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:opacity-50">
                      {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Publishing…</> : 'Publish to Supabase'}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

const inp = 'w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200'
function F({ label, children, cls = '' }) {
  return <div className={cls}><label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>{children}</div>
}
