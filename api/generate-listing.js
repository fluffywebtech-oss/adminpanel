// Vercel serverless: POST { prompt } -> { listing }
// The ANTHROPIC_API_KEY stays server-side (Vercel env), never shipped to the browser.
import { generateListing } from './_listingAI.js'

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
    const prompt = body?.prompt
    if (!prompt) return res.status(400).json({ error: 'prompt required' })
    const listing = await generateListing(prompt, apiKey)
    return res.status(200).json({ listing })
  } catch (e) {
    return res.status(e.status || 500).json({ error: 'ai_failed', detail: e.detail || String(e.message || e) })
  }
}
