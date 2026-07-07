// Core: admin AI assistant — answers questions about the live platform data.
// Shared by the Vercel serverless function and the Vite dev middleware.

export const ASSISTANT_SYSTEM = `You are PropertyInsta Admin Copilot — an assistant for the PropertyInsta back-office team (Indian real estate).

You help the admin operator: understand their inventory & leads, draft listing/marketing copy, suggest pricing and follow-ups, and explain real-estate concepts (RERA, EMI, stamp duty, yields).

Style:
- Concise and specific. Use **markdown**: bold key terms, bullet lists, short tables.
- Currency in INR (₹8.2 Cr, ₹95 L, ₹12,500/sqft).
- Ground answers in the CONTEXT provided (live counts, sample listings, recent enquiries). Never invent specific properties, prices, or leads that aren't in the context.
- When asked to draft copy or a reply, just write it cleanly.
- If something needs data you don't have, say so briefly.`

function contextBlock(ctx = {}) {
  let s = ''
  if (ctx.propertyCount != null) s += `\nInventory: ${ctx.propertyCount} listings`
  if (ctx.byCorridor) s += `\nBy corridor: ${Object.entries(ctx.byCorridor).map(([k, v]) => `${k} (${v})`).join(', ')}`
  if (ctx.priceRange) s += `\nPrice range: ₹${ctx.priceRange[0]} – ₹${ctx.priceRange[1]}`
  if (Array.isArray(ctx.sampleListings) && ctx.sampleListings.length) {
    s += `\nSample listings:`
    ctx.sampleListings.slice(0, 14).forEach(p => { s += `\n- ${p.title} | ${p.location} | ₹${p.price} | ${p.beds || '-'} BHK | ${p.builder || '-'}` })
  }
  if (ctx.leadCount != null) s += `\nEnquiries: ${ctx.leadCount} total (${ctx.newLeadCount || 0} new)`
  if (Array.isArray(ctx.recentLeads) && ctx.recentLeads.length) {
    s += `\nRecent enquiries:`
    ctx.recentLeads.slice(0, 8).forEach(l => { s += `\n- ${l.name || 'Unnamed'} | ${l.intent || 'contact'} | ${l.property_title || '-'} | status ${l.status || 'New'}` })
  }
  return s
}

export async function askAssistant(messages, context, apiKey) {
  const system = ASSISTANT_SYSTEM + (context ? `\n\nLIVE CONTEXT:${contextBlock(context)}` : '')
  const msgs = (messages || [])
    .filter(m => m.role === 'user' || m.role === 'assistant')
    .map(m => ({ role: m.role, content: String(m.content || '').slice(0, 6000) }))
  if (msgs[msgs.length - 1]?.role !== 'user') throw Object.assign(new Error('last message must be user'), { status: 400 })

  const resp = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({ model: 'claude-haiku-4-5', max_tokens: 900, system, messages: msgs }),
  })
  if (!resp.ok) {
    const detail = await resp.text()
    throw Object.assign(new Error(`Anthropic ${resp.status}`), { status: resp.status, detail: detail.slice(0, 500) })
  }
  const data = await resp.json()
  return data?.content?.[0]?.text || ''
}
