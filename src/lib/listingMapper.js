// Shared helpers: map an AI/heuristic listing → Supabase row, pick a hero image,
// and a no-API heuristic fallback that drafts a listing straight from the prompt.

// Curated Unsplash hero photos by property flavour
const IMG = {
  tower:     ['1545324418-cc1a3fa10c00', '1486406146926-c627a92ad1ab', '1512453979798-5ea266f8880c', '1600596542815-ffad4c1539a9'],
  villa:     ['1564013799919-ab600027ffc6', '1600585154340-be6161a56a0c', '1512917774080-9991f1c4c750'],
  apartment: ['1600210492486-724fe5c67fb0', '1600047509807-ba8f99d2cdde', '1600573472550-8090b5e0745e'],
  office:    ['1497366216548-37526070297c', '1486406146926-c627a92ad1ab'],
  land:      ['1500382017468-9049fed747ef', '1416879595882-3373a0480b5b'],
}
const url = (id) => `https://images.unsplash.com/photo-${id}?w=800&h=500&fit=crop`

// Pick a hero image from type + AI imageKeywords
export function pickImage(p) {
  const s = `${p.type || ''} ${p.imageKeywords || ''} ${p.title || ''}`.toLowerCase()
  let bucket = 'apartment'
  if (/penthouse|tower|high.?rise|skyscraper|luxury|sky/.test(s)) bucket = 'tower'
  else if (/villa|bungalow|independent|floor/.test(s)) bucket = 'villa'
  else if (/commercial|office|retail|shop|sco/.test(s)) bucket = 'office'
  else if (/plot|land|farm/.test(s)) bucket = 'land'
  const pool = IMG[bucket]
  // stable pick from the title so re-renders don't shuffle
  const seed = (p.title || '').length
  return url(pool[seed % pool.length])
}

const KNOWN_BUILDERS = ['DLF', 'Godrej', 'M3M', 'Sobha', 'Emaar', 'Adani', 'Birla', 'Signature Global', 'Smartworld', 'Central Park', 'Elan', 'Hero Realty', 'Puri', 'Max Estates', 'Tribeca', 'Whiteland', 'Tata', 'Ireo', 'Omaxe', 'Ashiana', 'TARC']

// Parse "₹8.2 Cr" / "1.95 crore" / "₹95 L" → rupees. Requires an explicit
// unit or a ₹ prefix, so "4 BHK" is never mistaken for the price.
function parsePrice(text) {
  let m = text.match(/([\d.]+)\s*(cr|crore|crores|l|lac|lacs|lakh|lakhs)\b/i)
  if (m) {
    const n = parseFloat(m[1]); const unit = m[2].toLowerCase()
    if (/cr/.test(unit)) return Math.round(n * 10000000)
    return Math.round(n * 100000)
  }
  m = text.match(/₹\s*([\d,]+)/)
  if (m) { const n = parseInt(m[1].replace(/,/g, ''), 10); if (n > 100000) return n }
  return 0
}

// No-API draft: extract what we can from the prompt; sensible defaults for the rest.
export function heuristicFromPrompt(prompt) {
  const p = prompt.trim()
  const beds = Number((p.match(/(\d+)\s*BHK/i) || [])[1]) || 3
  const builder = KNOWN_BUILDERS.find(b => new RegExp(`\\b${b}\\b`, 'i').test(p)) || ''
  const sector = (p.match(/sector\s*[-\s]?\d+[A-Z]?/i) || [])[0]
  const corridor = (p.match(/SPR|Dwarka Expressway|Golf Course (?:Extension|Road|Ext)|New Gurgaon|Sohna|Cyber City/i) || [])[0]
  const city = /gurgaon|gurugram/i.test(p) ? 'Gurgaon' : /noida/i.test(p) ? 'Noida' : /delhi/i.test(p) ? 'Delhi' : 'Gurgaon'
  const location = [sector, corridor, city].filter(Boolean).join(', ') || city
  const type = /penthouse/i.test(p) ? 'Penthouse' : /villa/i.test(p) ? 'Villa' : /plot|land/i.test(p) ? 'Plot' : /commercial|office/i.test(p) ? 'Commercial' : 'Apartment'
  const price = parsePrice(p) || (type === 'Penthouse' ? 80000000 : 40000000)
  const sqft = type === 'Penthouse' ? 4200 : type === 'Villa' ? 3600 : 2200
  const luxury = /luxury|ultra|premium|penthouse/i.test(p)
  // Title: prefer "<Builder> <Name>" or the first clause of the prompt
  const namePart = p.split(/[,–-]/)[0].trim()
  const title = builder && !new RegExp(builder, 'i').test(namePart)
    ? `${builder} ${namePart}`
    : (namePart || `${builder} ${type}`).slice(0, 80)
  return {
    title: `${title} – ${beds} BHK${type === 'Penthouse' ? ' & Penthouses' : ''}`.replace(/\s+/g, ' '),
    location, price, beds, baths: Math.max(2, beds), sqft,
    type, status: /rent/i.test(p) ? 'For Rent' : 'For Sale',
    builder: builder || 'Premium Developer',
    possessionStatus: /ready/i.test(p) ? 'Ready to Move' : 'New Launch',
    reraId: `HR/RERA/GUR/2026/${300 + Math.floor(Math.random() * 99)}`,
    description: `${title} offers ${beds} BHK ${type.toLowerCase()} residences in ${location}. ${luxury ? 'Ultra-premium finishes, ' : ''}modern amenities and excellent connectivity make it a standout ${city} address.`,
    amenities: luxury ? ['pool', 'gym', 'parking', 'security', 'smartHome', 'garden'] : ['gym', 'parking', 'security', 'garden'],
    facing: 'East', featured: luxury, hot: true,
    agentName: 'PropertyInsta Desk',
    imageKeywords: `${luxury ? 'luxury ' : ''}${type} ${corridor || city}`,
    _source: 'heuristic',
  }
}

// Normalize an AI JSON response into the same internal shape (defensive defaults)
export function normalizeAi(ai) {
  const price = Number(ai.price) || 0
  const sqft = Number(ai.sqft) || 0
  return {
    title: ai.title || 'Untitled listing',
    location: ai.location || '',
    price, beds: Number(ai.beds) || 0, baths: Number(ai.baths) || 0, sqft,
    type: ai.type || 'Apartment',
    status: /rent/i.test(ai.status || '') ? 'For Rent' : 'For Sale',
    builder: ai.builder || '',
    possessionStatus: ai.possessionStatus || 'New Launch',
    reraId: ai.reraId || '',
    description: ai.description || '',
    amenities: Array.isArray(ai.amenities) ? ai.amenities : [],
    facing: ai.facing || 'East',
    featured: !!ai.featured, hot: !!ai.hot,
    agentName: ai.agentName || 'PropertyInsta Desk',
    imageKeywords: ai.imageKeywords || '',
    _source: 'ai',
  }
}

// Internal listing → exact `properties` table columns (snake_case)
export function toDbRow(p, image) {
  const sqft = Number(p.sqft) || 0
  const price = Number(p.price) || 0
  return {
    title: p.title, location: p.location, price,
    beds: Number(p.beds) || 0, baths: Number(p.baths) || 0, sqft,
    type: p.type,
    status: /rent/i.test(p.status) ? 'For Rent' : 'For Sale',
    builder: p.builder, rera_id: p.reraId, possession_status: p.possessionStatus,
    furnishing: 'Semi-Furnished', emi_estimate: Math.round(price * 0.00785), bank_offers: true,
    images: image ? [image, ...(p.images || [])] : (p.images || [pickImage(p)]),
    amenities: p.amenities || [],
    featured: !!p.featured, hot: !!p.hot,
    badge: p.hot ? 'Hot Deal' : (p.featured ? 'Featured' : null),
    facing: p.facing || 'East', parking: '2 Covered',
    price_per_sqft: sqft ? Math.round(price / sqft) : 0,
    verified: true, views: 0, description: p.description,
    agent_id: 'agent-ai', agent_name: p.agentName || 'PropertyInsta Desk',
    agent_avatar: 'https://i.pravatar.cc/150?img=12', agent_rating: 4.7, agent_sales: 0,
    agent_phone: '+91-98100 00000', agent_email: 'desk@propertyinsta.com',
    post_date: 'Just now', comments: 0, shares: 0,
    neighborhood: ['Schools: Reputed nearby', 'Transit: Arterial road / metro', 'Walk Score: 64/100', 'Crime Rate: Low'],
    trending: !!p.hot, age: p.possessionStatus,
    media_aspect_ratio: '4/3', listing_status: p.possessionStatus,
  }
}
