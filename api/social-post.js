// Vercel serverless: POST { property } -> { post:{ instagram, whatsapp, story, hashtags } }
import { generateSocial } from './_socialAI.js'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey || apiKey.startsWith('your-')) {
    return res.status(503).json({ error: 'no_key', detail: 'ANTHROPIC_API_KEY not set on server' })
  }
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
    if (!body?.property) return res.status(400).json({ error: 'property required' })
    const post = await generateSocial(body.property, apiKey)
    return res.status(200).json({ post })
  } catch (e) {
    return res.status(e.status || 500).json({ error: 'ai_failed', detail: e.detail || String(e.message || e) })
  }
}
