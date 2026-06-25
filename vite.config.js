import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { generateListing } from './api/_listingAI.js'

// Dev-only middleware so /api/generate-listing works under `vite` (no Vercel runtime).
function devApiPlugin(apiKey) {
  return {
    name: 'dev-api-generate-listing',
    configureServer(server) {
      server.middlewares.use('/api/generate-listing', (req, res) => {
        if (req.method !== 'POST') { res.statusCode = 405; return res.end('Method not allowed') }
        let body = ''
        req.on('data', (c) => (body += c))
        req.on('end', async () => {
          res.setHeader('content-type', 'application/json')
          try {
            const { prompt } = JSON.parse(body || '{}')
            if (!apiKey || apiKey.startsWith('your-')) { res.statusCode = 503; return res.end(JSON.stringify({ error: 'no_key' })) }
            const listing = await generateListing(prompt, apiKey)
            res.end(JSON.stringify({ listing }))
          } catch (e) {
            res.statusCode = e.status || 500
            res.end(JSON.stringify({ error: 'ai_failed', detail: e.detail || String(e.message || e) }))
          }
        })
      })
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
