// Core: prompt → complete property listing JSON, via Anthropic Claude.
// Shared by the Vercel serverless function and the Vite dev middleware.

export const LISTING_SYSTEM = `You are a real-estate listing generator for PropertyInsta, an Indian property platform. Given a short prompt, produce ONE complete, realistic property listing.

Return STRICT JSON only — no markdown, no code fences, no commentary. Use exactly these keys:
{
  "title": string,                 // e.g. "DLF Privana North – 4 BHK & Penthouses"
  "location": string,              // e.g. "Sector 76 & 77, SPR / New Gurgaon"
  "price": integer,                // PLAIN rupees, e.g. 82000000 for ₹8.2 Cr
  "beds": integer,
  "baths": integer,
  "sqft": integer,
  "type": "Apartment"|"Penthouse"|"Villa"|"Plot"|"Commercial",
  "status": "For Sale"|"For Rent",
  "builder": string,               // realistic Indian developer
  "possessionStatus": "New Launch"|"Under Construction"|"Ready to Move",
  "reraId": string,                // e.g. "HR/RERA/GUR/2026/321"
  "description": string,           // 2-3 vivid sentences
  "amenities": string[],           // from: pool, gym, parking, security, smartHome, garden, clubhouse
  "facing": string,
  "featured": boolean,
  "hot": boolean,
  "agentName": string,
  "imageKeywords": string          // 3-5 words describing the hero photo
}

Infer sensible, market-consistent values for anything not stated. Prices in INR appropriate for the location & segment. Output JSON object only.`

function stripToJson(text) {
  let t = String(text || '').trim()
  t = t.replace(/^```(?:json)?/i, '').replace(/```$/, '').trim()
  const a = t.indexOf('{'), b = t.lastIndexOf('}')
  if (a !== -1 && b !== -1) t = t.slice(a, b + 1)
  return JSON.parse(t)
}

export async function generateListing(prompt, apiKey) {
  const resp = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5',
      max_tokens: 700,
      system: LISTING_SYSTEM,
      messages: [{ role: 'user', content: String(prompt || '').slice(0, 2000) }],
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
