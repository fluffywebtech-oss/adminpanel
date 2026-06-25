import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { generateListing } from './api/_listingAI.js'
import { generateSocial } from './api/_socialAI.js'
import { askAssistant } from './api/_assistantAI.js'

// Dev-only middleware so the /api/* AI endpoints work under `vite` (no Vercel runtime).
function devApiPlugin(apiKey) {
  const route = (path, key, fn) => ({ path, key, fn })
  const routes = [
    route('/api/generate-listing', 'listing', (body) => generateListing(body.prompt, apiKey)),
    route('/api/social-post', 'post', (body) => generateSocial(body.property, apiKey)),
    route('/api/assistant', 'reply', (body) => askAssistant(body.messages, body.context, apiKey)),
  ]
  return {
    name: 'dev-api-ai',
    configureServer(server) {
      for (const r of routes) {
        server.middlewares.use(r.path, (req, res) => {
          if (req.method !== 'POST') { res.statusCode = 405; return res.end('Method not allowed') }
          let body = ''
          req.on('data', (c) => (body += c))
          req.on('end', async () => {
            res.setHeader('content-type', 'application/json')
            try {
              if (!apiKey || apiKey.startsWith('your-')) { res.statusCode = 503; return res.end(JSON.stringify({ error: 'no_key' })) }
              const result = await r.fn(JSON.parse(body || '{}'))
              res.end(JSON.stringify({ [r.key]: result }))
            } catch (e) {
              res.statusCode = e.status || 500
              res.end(JSON.stringify({ error: 'ai_failed', detail: e.detail || String(e.message || e) }))
            }
          })
        })
      }
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react(), devApiPlugin(env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY)],
    server: { port: 3000, open: true },
  }
})
