import { useState, useRef, useEffect, useMemo } from 'react'
import { Sparkles, Send, Loader2, User } from 'lucide-react'
import { useData } from '../context/DataContext'
import { useSupabaseCollection } from '../hooks/useSupabaseCollection'
import { buildContext, localAnswer } from '../lib/assistantFallback'

const SUGGESTIONS = [
  'How many new enquiries do I have?',
  'Which corridor has the most listings?',
  'Draft a WhatsApp reply for the latest enquiry',
  'What price range is my inventory?',
]

// Tiny markdown: **bold**, line breaks, "- " bullets
function MarkdownLite({ text }) {
  const lines = String(text).split('\n')
  return (
    <div className="space-y-1">
      {lines.map((ln, i) => {
        const bullet = /^\s*-\s+/.test(ln)
        const html = ln.replace(/^\s*-\s+/, '').replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/_(.+?)_/g, '<em>$1</em>')
        if (!ln.trim()) return <div key={i} className="h-1" />
        return <div key={i} className={bullet ? 'flex gap-2' : ''}>{bullet && <span className="text-primary-500">•</span>}<span dangerouslySetInnerHTML={{ __html: html }} /></div>
      })}
    </div>
  )
}

export default function Assistant() {
  const { properties } = useData()
  const { rows: leads } = useSupabaseCollection('leads', [], { localKey: 'os_leads', orderBy: 'created_at', ascending: false })
  const ctx = useMemo(() => buildContext(properties, leads), [properties, leads])

  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi! I'm your **Admin Copilot**. Ask me about your inventory & enquiries, or have me draft listing / marketing copy. Try a suggestion below 👇" },
  ])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const endRef = useRef(null)

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, busy])

  const send = async (text) => {
    const q = (text ?? input).trim()
    if (!q || busy) return
    const next = [...messages, { role: 'user', content: q }]
    setMessages(next); setInput(''); setBusy(true)
    let reply
    try {
      const res = await fetch('/api/assistant', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next.filter(m => m.role !== 'system'), context: ctx }),
      })
      if (res.ok) reply = (await res.json()).reply
      else throw new Error(String(res.status))
    } catch {
      reply = localAnswer(q, ctx)   // graceful no-API fallback
    }
    setMessages(m => [...m, { role: 'assistant', content: reply || '…' }])
    setBusy(false)
  }

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)]">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white"><Sparkles className="w-5 h-5" /></div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">AI Assistant</h1>
          <p className="text-xs text-gray-500">Knows your {ctx.propertyCount} listings & {ctx.leadCount} enquiries</p>
        </div>
      </div>

      {/* Conversation */}
      <div className="flex-1 overflow-auto rounded-xl border border-gray-100 bg-white p-4 space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${m.role === 'user' ? 'bg-gray-200 text-gray-600' : 'bg-gradient-to-br from-violet-600 to-indigo-600 text-white'}`}>
              {m.role === 'user' ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
            </div>
            <div className={`max-w-[78%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${m.role === 'user' ? 'bg-primary-600 text-white' : 'bg-gray-50 text-gray-800'}`}>
              <MarkdownLite text={m.content} />
            </div>
          </div>
        ))}
        {busy && <div className="flex gap-3"><div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 text-white flex items-center justify-center"><Sparkles className="w-4 h-4" /></div><div className="px-4 py-2.5 rounded-2xl bg-gray-50 text-gray-400"><Loader2 className="w-4 h-4 animate-spin" /></div></div>}
        <div ref={endRef} />
      </div>

      {/* Suggestions */}
      {messages.length <= 1 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {SUGGESTIONS.map((s, i) => <button key={i} onClick={() => send(s)} className="text-xs px-3 py-1.5 rounded-full bg-gray-100 text-gray-600 hover:bg-primary-50 hover:text-primary-700">{s}</button>)}
        </div>
      )}

      {/* Composer */}
      <form onSubmit={e => { e.preventDefault(); send() }} className="flex items-center gap-2 mt-3">
        <input value={input} onChange={e => setInput(e.target.value)} placeholder="Ask anything about your platform…"
          className="flex-1 px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-200" />
        <button type="submit" disabled={busy || !input.trim()} className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold text-white bg-primary-600 rounded-xl hover:bg-primary-700 disabled:opacity-50">
          <Send className="w-4 h-4" /> Send
        </button>
      </form>
    </div>
  )
}
