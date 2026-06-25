// Format rupees → "₹8.20 Cr" / "₹95 L"
export function priceLabel(n) {
  const v = Number(n) || 0
  if (v >= 10000000) return `₹${(v / 10000000).toFixed(2)} Cr`
  if (v >= 100000) return `₹${Math.round(v / 100000)} L`
  return v ? `₹${v.toLocaleString('en-IN')}` : 'Price on request'
}

function corridorOf(location = '') {
  const m = location.match(/SPR|Dwarka Expressway|Golf Course (?:Extension|Road|Ext)|New Gurgaon|Sohna|Cyber City/i)
  return m ? m[0] : ''
}
function cityOf(location = '') {
  const m = location.match(/Gurgaon|Gurugram|Noida|Delhi|Mumbai|Bangalore|Hyderabad|Pune/i)
  return m ? m[0] : 'Gurgaon'
}
const tag = (s) => '#' + String(s || '').replace(/[^a-zA-Z0-9]/g, '')

// No-API draft built straight from the property fields.
export function heuristicSocial(p) {
  const beds = p.beds ?? p.bedrooms ?? ''
  const sqft = p.sqft ?? p.area ?? ''
  const type = p.type || 'Apartment'
  const price = priceLabel(p.price)
  const city = cityOf(p.location)
  const corridor = corridorOf(p.location)
  const am = (p.amenities || []).slice(0, 4)
  const amLine = am.length ? am.map(a => `✓ ${a}`).join('  ') : ''
  const luxury = /penthouse|villa/i.test(type) || (p.price || 0) >= 50000000

  const hashtags = [
    '#PropertyInsta', '#RealEstate', tag(city), tag(p.builder), `${beds}BHK`.replace(/^BHK/, ''),
    tag(type), corridor && tag(corridor), luxury ? '#LuxuryHomes' : '#DreamHome',
    '#PropertyForSale', '#NewLaunch', '#Gurugram',
  ].filter(Boolean).map(t => (t.startsWith('#') ? t : '#' + t))

  const instagram =
`✨ ${p.title}

📍 ${p.location}
🏠 ${beds ? beds + ' BHK • ' : ''}${sqft ? sqft + ' sq.ft • ' : ''}${type}
💰 ${price}${p.builder ? `\n🏗️ By ${p.builder}` : ''}
${amLine ? amLine + '\n' : ''}
📞 DM us to book a site visit today!`

  const whatsapp =
`*${p.title}*
📍 ${p.location}
${beds ? `🛏️ ${beds} BHK` : ''}${sqft ? ` • ${sqft} sq.ft` : ''} • ${type}
💰 ${price}${p.builder ? ` • by ${p.builder}` : ''}
${p.possessionStatus ? `🔑 ${p.possessionStatus}` : ''}

Reply to schedule a visit 🏡`

  const story = `${beds ? beds + ' BHK ' : ''}from ${price}${corridor ? ' • ' + corridor : ' • ' + city}`

  return { instagram, whatsapp, story, hashtags, _source: 'heuristic' }
}

export function normalizeSocial(post) {
  return {
    instagram: post.instagram || '',
    whatsapp: post.whatsapp || '',
    story: post.story || '',
    hashtags: Array.isArray(post.hashtags) ? post.hashtags.map(h => (h.startsWith('#') ? h : '#' + h)) : [],
    _source: 'ai',
  }
}
