import { useState, useEffect } from 'react'
import { X, Sparkles, Loader2, Copy, Check, RefreshCw, Instagram, MessageCircle, Clapperboard, Hash, Download } from 'lucide-react'
import { heuristicSocial, normalizeSocial } from '../lib/socialContent'

const TABS = [
  { key: 'instagram', label: 'Instagram', icon: Instagram },
  { key: 'whatsapp', label: 'WhatsApp', icon: MessageCircle },
  { key: 'story', label: 'Story', icon: Clapperboard },
]

export default function SocialStudio({ property, onClose, toast }) {
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [source, setSource] = useState(null)
  const [tab, setTab] = useState('instagram')
  const [copied, setCopied] = useState('')

  const image = property?.images?.[0] || property?.thumbnail || ''

  const generate = async () => {
    setLoading(true)
    let result, src
    try {
      const res = await fetch('/api/social-post', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ property }),
      })
      if (res.ok) { result = normalizeSocial((await res.json()).post); src = 'ai' }
      else throw new Error(String(res.status))
    } catch {
      result = heuristicSocial(property); src = 'heuristic'
    }
    setPost(result); setSource(src); setLoading(false)
  }

  useEffect(() => { generate() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const set = (k, v) => setPost(p => ({ ...p, [k]: v }))
  const hashLine = (post?.hashtags || []).join(' ')

  // What gets copied per tab (IG appends hashtags)
  const textFor = (k) => k === 'instagram' ? `${post.instagram}\n\n${hashLine}` : post[k]

  const copy = async (label, text) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(label); setTimeout(() => setCopied(''), 1600)
      toast?.('Copied to clipboard', 'success')
    } catch { toast?.('Copy failed', 'error') }
  }

  const shareWhatsApp = () => {
    const text = `${post.whatsapp}\n\n${hashLine}`
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank', 'noopener')
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[92vh] overflow-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h3 className="font-bold text-gray-900 flex items-center gap-2"><Sparkles className="w-5 h-5 text-primary-600" /> AI Social Post Studio</h3>
          <button onClick={onClose} className="p-1 rounded-md hover:bg-gray-100"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-5">
          {/* Property strip */}
          <div className="flex items-center gap-3 mb-4">
            {image && <img src={image} alt="" className="w-16 h-12 rounded-lg object-cover" />}
            <div className="min-w-0">
              <div className="font-semibold text-gray-900 truncate">{property.title}</div>
              <div className="text-xs text-gray-500 truncate">{property.location}</div>
            </div>
            {source && (
              <span className={`ml-auto text-xs font-bold px-2 py-0.5 rounded-full ${source === 'ai' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
                {source === 'ai' ? '✨ AI' : '⚙️ Draft'}
              </span>
            )}
          </div>

          {loading || !post ? (
            <div className="py-16 text-center text-gray-400"><Loader2 className="w-7 h-7 animate-spin mx-auto mb-2" /> Writing posts…</div>
          ) : (
            <>
              {/* Tabs */}
              <div className="flex gap-1 bg-gray-100 rounded-lg p-1 mb-3 w-fit">
                {TABS.map(t => (
                  <button key={t.key} onClick={() => setTab(t.key)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold rounded-md ${tab === t.key ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}>
                    <t.icon className="w-4 h-4" /> {t.label}
                  </button>
                ))}
              </div>

              {/* Editable text */}
              <div className="relative">
                <textarea
                  value={post[tab]} onChange={e => set(tab, e.target.value)}
                  rows={tab === 'story' ? 2 : 8}
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 whitespace-pre-wrap"
                />
                <button onClick={() => copy(tab, textFor(tab))}
                  className="absolute top-2 right-2 flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-md bg-gray-900 text-white hover:bg-gray-700">
                  {copied === tab ? <><Check className="w-3.5 h-3.5" /> Copied</> : <><Copy className="w-3.5 h-3.5" /> Copy</>}
                </button>
              </div>

              {/* Hashtags */}
              <div className="mt-3">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold text-gray-500 flex items-center gap-1"><Hash className="w-3.5 h-3.5" /> Hashtags</span>
                  <button onClick={() => copy('tags', hashLine)} className="text-xs font-medium text-primary-600 hover:underline">{copied === 'tags' ? 'Copied!' : 'Copy all'}</button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {post.hashtags.map((h, i) => <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-primary-50 text-primary-700 font-medium">{h}</span>)}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 mt-5 flex-wrap">
                <button onClick={generate} className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50"><RefreshCw className="w-4 h-4" /> Regenerate</button>
                <button onClick={shareWhatsApp} className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white rounded-lg bg-green-500 hover:bg-green-600"><MessageCircle className="w-4 h-4" /> Share on WhatsApp</button>
                {image && <a href={image} target="_blank" rel="noopener noreferrer" download className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50"><Download className="w-4 h-4" /> Hero image</a>}
                <button onClick={() => copy('ig', `${post.instagram}\n\n${hashLine}`)} className="ml-auto flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white rounded-lg bg-gradient-to-r from-pink-500 to-violet-600 hover:opacity-90"><Instagram className="w-4 h-4" /> {copied === 'ig' ? 'Copied caption!' : 'Copy IG caption'}</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
