// Build the live-data context sent to the AI, and a no-API local answerer.

const CORRIDORS = ['SPR', 'Dwarka Expressway', 'Golf Course Extension', 'Golf Course Road', 'New Gurgaon', 'Sohna', 'Cyber City', 'Noida', 'Delhi']

function corridorOf(loc = '') {
  const m = CORRIDORS.find(c => new RegExp(c.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i').test(loc))
  return m || (loc.split(',').pop() || 'Other').trim()
}
const cr = (n) => (Number(n) >= 10000000 ? `₹${(n / 10000000).toFixed(2)} Cr` : `₹${Math.round(Number(n) / 100000)} L`)

export function buildContext(properties = [], leads = []) {
  const byCorridor = {}
  let min = Infinity, max = 0
  properties.forEach(p => {
    const c = corridorOf(p.location)
    byCorridor[c] = (byCorridor[c] || 0) + 1
    const v = Number(p.price) || 0
    if (v) { min = Math.min(min, v); max = Math.max(max, v) }
  })
  return {
    propertyCount: properties.length,
    byCorridor,
    priceRange: properties.length ? [cr(min), cr(max)] : null,
    sampleListings: properties.slice(0, 14).map(p => ({ title: p.title, location: p.location, price: p.price, beds: p.beds ?? p.bedrooms, builder: p.builder })),
    leadCount: leads.length,
    newLeadCount: leads.filter(l => (l.status || 'New') === 'New').length,
    recentLeads: leads.slice(0, 8),
  }
}

// Heuristic answer when ANTHROPIC_API_KEY isn't set — covers the common questions.
export function localAnswer(q, ctx) {
  const s = q.toLowerCase()
  const top = Object.entries(ctx.byCorridor || {}).sort((a, b) => b[1] - a[1])
  const note = '\n\n_⚙️ Quick answer from your data. Set **ANTHROPIC_API_KEY** for full conversational AI._'

  if (/how many.*(propert|listing|inventory)|total.*(propert|listing)/.test(s))
    return `You have **${ctx.propertyCount} listings**.${top.length ? ` Top corridors: ${top.slice(0, 3).map(([k, v]) => `${k} (${v})`).join(', ')}.` : ''}${note}`
  if (/how many.*(lead|enquir)|new lead|new enquir/.test(s))
    return `**${ctx.leadCount} enquiries** total — **${ctx.newLeadCount} new**.${ctx.recentLeads?.[0] ? ` Latest: ${ctx.recentLeads[0].name} (${ctx.recentLeads[0].intent}).` : ''}${note}`
  if (/corridor|area|location|where|hot|popular/.test(s) && top.length)
    return `Most inventory is in **${top[0][0]}** (${top[0][1]} listings). Full split:\n${top.slice(0, 6).map(([k, v]) => `- ${k}: ${v}`).join('\n')}${note}`
  if (/price|expensive|cheap|range|budget/.test(s) && ctx.priceRange)
    return `Listings range from **${ctx.priceRange[0]}** to **${ctx.priceRange[1]}**.${note}`
  if (/help|what can you|hello|hi\b/.test(s))
    return `I'm your **Admin Copilot**. I can summarise inventory & enquiries, draft listing/marketing copy, and explain real-estate concepts.\n\nTry: *"How many new enquiries?"*, *"Which corridor has most listings?"*, *"Draft a WhatsApp reply for the latest lead."*${note}`
  return `I can answer that fully once **ANTHROPIC_API_KEY** is set. Meanwhile, here's what I know: **${ctx.propertyCount} listings**, **${ctx.leadCount} enquiries** (${ctx.newLeadCount} new)${top.length ? `, top corridor **${top[0][0]}**` : ''}.${note}`
}
