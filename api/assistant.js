// Vercel serverless: POST { messages, context } -> { reply }
import { askAssistant } from './_assistantAI.js'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey || apiKey.startsWith('your-')) return res.status(503).json({ error: 'no_key' })
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
    const reply = await askAssistant(body?.messages, body?.context, apiKey)
    return res.status(200).json({ reply })
  } catch (e) {
    return res.status(e.status || 500).json({ error: 'ai_failed', detail: e.detail || String(e.message || e) })
  }
}
