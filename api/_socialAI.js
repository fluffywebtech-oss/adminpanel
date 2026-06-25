// Core: property → ready-to-post social marketing content, via Anthropic Claude.
// Shared by the Vercel serverless function and the Vite dev middleware.

export const SOCIAL_SYSTEM = `You are a senior social-media manager for PropertyInsta, an Indian real-estate brand. Given one property, write punchy, scroll-stopping marketing posts.

Return STRICT JSON only — no markdown, no code fences. Keys:
{
  "instagram": string,   // engaging caption: a hook line, emojis, 3-5 key features on separate lines, a clear CTA. 2-4 short paragraphs with line breaks (\\n).
  "whatsapp": string,    // concise broadcast message with emojis, *bold* for the title, key specs, CTA. Shorter than the IG caption.
  "story": string,       // <= 12 words, punchy overlay text for an Instagram/WhatsApp Story.
  "hashtags": string[]   // 8-12 relevant hashtags, each starting with #. Mix brand, city/corridor, builder, segment.
}

Rules:
- Currency in INR: ₹X.X Cr or ₹X L (e.g. ₹8.2 Cr, ₹95 L).
- Be specific to the property (location, builder, BHK, amenities). Never invent prices/specs not given.
- Tone: aspirational but trustworthy. No ALL CAPS spam. Output the JSON object only.`

function stripToJson(text) {
  let t = String(text || '').trim()
  t = t.replace(/^```(?:json)?/i, '').replace(/```$/, '').trim()
  const a = t.indexOf('{'), b = t.lastIndexOf('}')
  if (a !== -1 && b !== -1) t = t.slice(a, b + 1)
  return JSON.parse(t)
}

function summarize(p) {
  const cr = p.price ? (p.price >= 10000000 ? `₹${(p.price / 10000000).toFixed(2)} Cr` : `₹${Math.round(p.price / 100000)} L`) : 'Price on request'
  return [
    `Title: ${p.title}`,
    `Type: ${p.type || 'Apartment'} | ${p.beds || p.bedrooms || '-'} BHK | ${p.sqft || p.area || '-'} sq.ft`,
    `Location: ${p.location || '-'}`,
    `Builder: ${p.builder || '-'}`,
    `Price: ${cr}`,
    `Possession: ${p.possessionStatus || p.possession || '-'}`,
    `Amenities: ${(p.amenities || []).join(', ') || '-'}`,
    `RERA: ${p.reraId || '-'}`,
  ].join('\n')
}

export async function generateSocial(property, apiKey) {
  const resp = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({
      model: 'claude-haiku-4-5',
      max_tokens: 800,
      system: SOCIAL_SYSTEM,
      messages: [{ role: 'user', content: summarize(property).slice(0, 2000) }],
    }),
  })
  if (!resp.ok) {
    const detail = await resp.text()
    const err = new Error(`Anthropic ${resp.status}`)
    err.status = resp.status; err.detail = detail.slice(0, 500)
    throw err
  }
  const data = await resp.json()
  return stripToJson(data?.content?.[0]?.text)
}
