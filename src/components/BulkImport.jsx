import { useState } from 'react'
import { X, Upload, FileText, Braces, Download, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react'
import { supabase } from '../lib/supabase'

// Map a normalized property to the EXACT `properties` table columns (snake_case).
// Deliberately omits developer_logo/developer_website which don't exist on the table.
function toDbRow(p) {
  return {
    title: p.title,
    location: p.location,
    price: p.price,
    beds: p.beds, baths: p.baths, sqft: p.sqft,
    type: p.type,
    status: p.status === 'rent' ? 'For Rent' : 'For Sale',
    builder: p.builder,
    rera_id: p.reraId,
    possession_status: p.possessionStatus,
    furnishing: 'Semi-Furnished',
    emi_estimate: Math.round(p.price * 0.00785),
    bank_offers: true,
    images: p.images,
    amenities: p.amenities,
    featured: p.featured, hot: p.hot,
    badge: p.hot ? 'Hot Deal' : (p.featured ? 'Featured' : null),
    facing: p.facing, parking: p.parking,
    price_per_sqft: p.pricePerSqft,
    verified: true, views: 0,
    description: p.description,
    agent_id: p.agent.id, agent_name: p.agent.name, agent_avatar: p.agent.avatar,
    agent_rating: p.agent.rating, agent_sales: p.agent.sales,
    agent_phone: p.agent.phone, agent_email: p.agent.email,
    post_date: 'Just now', comments: 0, shares: 0,
    neighborhood: ['Schools: Nearby', 'Transit: Arterial road', 'Walk Score: 60/100', 'Crime Rate: Low'],
    trending: p.hot, age: p.possessionStatus,
    media_aspect_ratio: '4/3', listing_status: p.possessionStatus,
  }
}

// Columns accepted in CSV (header row). Extra columns are ignored.
const CSV_COLUMNS = ['title', 'location', 'price', 'beds', 'baths', 'sqft', 'type', 'status', 'builder', 'possessionStatus', 'reraId', 'images', 'amenities', 'description', 'agentName', 'featured', 'hot']

const SAMPLE_CSV = `title,location,price,beds,baths,sqft,type,status,builder,possessionStatus,reraId,images,amenities,description,agentName,featured,hot
DLF Privana North – 4 BHK,"Sector 76 & 77, SPR / New Gurgaon",82000000,4,4,4400,Penthouse,For Sale,DLF Limited,New Launch,HR/RERA/GUR/2026/321,https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800,pool|gym|parking|security,"Four sculpted glass towers with Aravalli views.",Rajiv Malhotra,true,true
M3M Crown Heights – 3 BHK,"Sector 111, Dwarka Expressway",31000000,3,3,2150,Apartment,For Sale,M3M India,Under Construction,HR/RERA/GUR/2026/340,https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800,pool|gym|parking,"Value-luxury homes on Dwarka Expressway.",Priya Sharma,false,true`

// Minimal but correct CSV parser (handles quoted fields + commas + escaped quotes)
function parseCSV(text) {
  const rows = []
  let row = [], field = '', q = false
  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (q) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++ }
      else if (c === '"') q = false
      else field += c
    } else {
      if (c === '"') q = true
      else if (c === ',') { row.push(field); field = '' }
      else if (c === '\n' || c === '\r') {
        if (c === '\r' && text[i + 1] === '\n') i++
        row.push(field); field = ''
        if (row.length > 1 || row[0] !== '') rows.push(row)
        row = []
      } else field += c
    }
  }
  if (field !== '' || row.length) { row.push(field); rows.push(row) }
  return rows
}

const toBool = (v) => /^(true|yes|1|y)$/i.test(String(v).trim())
const splitList = (v) => String(v || '').split(/[|;]/).map(s => s.trim()).filter(Boolean)

// Turn one parsed record into the addProperty() shape
function normalize(rec) {
  const price = Number(rec.price) || 0
  const sqft = Number(rec.sqft) || 0
  const statusRaw = String(rec.status || 'For Sale')
  return {
    title: rec.title?.trim(),
    location: rec.location?.trim() || '',
    price,
    beds: Number(rec.beds) || 0,
    baths: Number(rec.baths) || 0,
    sqft,
    type: (rec.type || 'Apartment').trim(),
    status: /rent/i.test(statusRaw) ? 'rent' : 'sale',
    builder: rec.builder?.trim() || '',
    reraId: rec.reraId?.trim() || '',
    possessionStatus: rec.possessionStatus?.trim() || 'New Launch',
    images: Array.isArray(rec.images) ? rec.images : splitList(rec.images),
    amenities: Array.isArray(rec.amenities) ? rec.amenities : splitList(rec.amenities),
    description: rec.description?.trim() || '',
    featured: toBool(rec.featured),
    hot: toBool(rec.hot),
    verified: true,
    views: 0,
    pricePerSqft: sqft ? Math.round(price / sqft) : 0,
    facing: rec.facing || 'East',
    parking: '1 Covered',
    agent: {
      id: 'agent-bulk',
      name: rec.agentName?.trim() || 'PropertyInsta Desk',
      avatar: 'https://i.pravatar.cc/150?img=12',
      rating: 4.6, sales: 0,
      phone: rec.agentPhone || '+91-98100 00000',
      email: rec.agentEmail || 'desk@propertyinsta.com',
    },
  }
}

export default function BulkImport({ onClose, toast }) {
  const [mode, setMode] = useState('csv')
  const [text, setText] = useState('')
  const [parsed, setParsed] = useState(null)   // { ok: [...], errors: [...] }
  const [importing, setImporting] = useState(false)
  const [progress, setProgress] = useState({ done: 0, total: 0 })
  const [result, setResult] = useState(null)    // { added, failed }

  const onFile = (e) => {
    const f = e.target.files?.[0]; if (!f) return
    const r = new FileReader()
    r.onload = () => { setText(String(r.result)); setMode(f.name.endsWith('.json') ? 'json' : 'csv'); setParsed(null) }
    r.readAsText(f)
  }

  const handleParse = () => {
    const ok = [], errors = []
    try {
      let records = []
      if (mode === 'json') {
        const data = JSON.parse(text)
        records = Array.isArray(data) ? data : [data]
      } else {
        const rows = parseCSV(text.trim())
        if (rows.length < 2) throw new Error('Need a header row + at least one data row')
        const header = rows[0].map(h => h.trim())
        records = rows.slice(1).map(cols => Object.fromEntries(header.map((h, i) => [h, cols[i] ?? ''])))
      }
      records.forEach((rec, i) => {
        const n = normalize(rec)
        if (!n.title) errors.push(`Row ${i + 1}: missing title`)
        else if (!n.price) errors.push(`Row ${i + 1} (${n.title}): missing/invalid price`)
        else ok.push(n)
      })
    } catch (err) {
      errors.push('Parse error: ' + err.message)
    }
    setParsed({ ok, errors })
  }

  const handleImport = async () => {
    if (!parsed?.ok.length) return
    setImporting(true)
    setProgress({ done: 0, total: parsed.ok.length })
    let added = 0, failed = 0
    // Insert in chunks straight to Supabase (clean payload — bypasses the stale
    // developer_logo/website columns that break DataContext.addProperty).
    const rows = parsed.ok.map(toDbRow)
    const CHUNK = 20
    for (let i = 0; i < rows.length; i += CHUNK) {
      const batch = rows.slice(i, i + CHUNK)
      const { data, error } = await supabase.from('properties').insert(batch).select('id')
      if (error) failed += batch.length
      else added += (data?.length || batch.length)
      setProgress({ done: Math.min(i + CHUNK, rows.length), total: rows.length })
    }
    setImporting(false)
    setResult({ added, failed })
    toast?.(`Imported ${added} listing${added === 1 ? '' : 's'}${failed ? `, ${failed} failed` : ''}`, failed ? 'warning' : 'success')
  }

  const downloadTemplate = () => {
    const blob = new Blob([SAMPLE_CSV], { type: 'text/csv' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob); a.download = 'propertyinsta-listings-template.csv'; a.click()
    URL.revokeObjectURL(a.href)
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[92vh] overflow-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-gray-100 sticky top-0 bg-white">
          <h3 className="font-bold text-gray-900 flex items-center gap-2"><Upload className="w-5 h-5 text-primary-600" /> Bulk Import Listings</h3>
          <button onClick={onClose} className="p-1 rounded-md hover:bg-gray-100"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-5 space-y-4">
          {result ? (
            <div className="text-center py-8">
              <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-gray-900">Import complete</h3>
              <p className="text-gray-500 mt-1">{result.added} listing(s) added to Supabase{result.failed ? ` · ${result.failed} failed` : ''}.</p>
              <button onClick={onClose} className="mt-5 px-5 py-2 text-sm font-semibold text-white bg-primary-600 rounded-lg hover:bg-primary-700">Done</button>
            </div>
          ) : (
            <>
              {/* Mode + template */}
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
                  <button onClick={() => { setMode('csv'); setParsed(null) }} className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold rounded-md ${mode === 'csv' ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}><FileText className="w-4 h-4" /> CSV</button>
                  <button onClick={() => { setMode('json'); setParsed(null) }} className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold rounded-md ${mode === 'json' ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}><Braces className="w-4 h-4" /> JSON</button>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={downloadTemplate} className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-primary-600 hover:bg-primary-50 rounded-lg"><Download className="w-4 h-4" /> CSV template</button>
                  <label className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <Upload className="w-4 h-4" /> Upload file
                    <input type="file" accept=".csv,.json,.txt" className="hidden" onChange={onFile} />
                  </label>
                </div>
              </div>

              <p className="text-xs text-gray-500">
                {mode === 'csv'
                  ? <>First row = headers. Columns: <code className="bg-gray-100 px-1 rounded">{CSV_COLUMNS.join(', ')}</code>. Use <code className="bg-gray-100 px-1 rounded">|</code> to separate multiple images / amenities.</>
                  : <>Paste a JSON array of objects with keys like <code className="bg-gray-100 px-1 rounded">title, location, price, beds, sqft, builder, images[]…</code></>}
              </p>

              <textarea
                value={text}
                onChange={e => { setText(e.target.value); setParsed(null) }}
                placeholder={mode === 'csv' ? SAMPLE_CSV : '[\n  { "title": "…", "location": "…", "price": 82000000, "beds": 4, "sqft": 4400, "builder": "DLF Limited", "images": ["https://…"] }\n]'}
                rows={9}
                className="w-full px-3 py-2 text-xs font-mono border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200"
              />

              {/* Parse preview */}
              {parsed && (
                <div className="rounded-lg border border-gray-200 p-3 text-sm">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5 font-semibold text-green-600"><CheckCircle2 className="w-4 h-4" /> {parsed.ok.length} ready</span>
                    {parsed.errors.length > 0 && <span className="flex items-center gap-1.5 font-semibold text-amber-600"><AlertTriangle className="w-4 h-4" /> {parsed.errors.length} issue(s)</span>}
                  </div>
                  {parsed.ok.length > 0 && (
                    <div className="mt-2 max-h-32 overflow-auto divide-y divide-gray-100">
                      {parsed.ok.slice(0, 8).map((p, i) => (
                        <div key={i} className="py-1.5 flex items-center gap-2 text-xs">
                          <span className="font-medium text-gray-900 truncate flex-1">{p.title}</span>
                          <span className="text-gray-400">{p.builder}</span>
                          <span className="font-semibold text-gray-700">₹{(p.price / 10000000).toFixed(2)} Cr</span>
                        </div>
                      ))}
                      {parsed.ok.length > 8 && <div className="py-1 text-xs text-gray-400">+ {parsed.ok.length - 8} more…</div>}
                    </div>
                  )}
                  {parsed.errors.length > 0 && (
                    <ul className="mt-2 text-xs text-amber-700 list-disc list-inside max-h-24 overflow-auto">
                      {parsed.errors.slice(0, 8).map((e, i) => <li key={i}>{e}</li>)}
                    </ul>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-1">
                <button onClick={handleParse} disabled={!text.trim()} className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50">Validate</button>
                <button onClick={handleImport} disabled={!parsed?.ok.length || importing} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:opacity-50">
                  {importing ? <><Loader2 className="w-4 h-4 animate-spin" /> Importing {progress.done}/{progress.total}</> : <>Import {parsed?.ok.length || ''} to Supabase</>}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
