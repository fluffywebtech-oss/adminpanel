import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'admin-sync-middleware',
      configureServer(server) {
        // POST /api/save-properties — writes properties to PropertyInsta's public/ dir
        server.middlewares.use('/api/save-properties', (req, res) => {
          if (req.method !== 'POST') {
            res.statusCode = 405
            res.end('Method Not Allowed')
            return
          }
          let body = ''
          req.on('data', chunk => { body += chunk })
          req.on('end', () => {
            try {
              const targetPath = path.resolve(__dirname, '..', 'react-propertyinsta', 'public', 'admin-properties.json')
              // Validate it's valid JSON
              JSON.parse(body)
              fs.writeFileSync(targetPath, body, 'utf-8')
              res.statusCode = 200
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ ok: true }))
            } catch (err) {
              res.statusCode = 400
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ ok: false, error: err.message }))
            }
          })
        })
        // GET /api/load-properties — returns properties from shared file
        server.middlewares.use('/api/load-properties', (req, res) => {
          if (req.method !== 'GET') {
            res.statusCode = 405
            res.end('Method Not Allowed')
            return
          }
          try {
            const targetPath = path.resolve(__dirname, '..', 'react-propertyinsta', 'public', 'admin-properties.json')
            if (!fs.existsSync(targetPath)) {
              fs.writeFileSync(targetPath, '[]', 'utf-8')
            }
            const data = fs.readFileSync(targetPath, 'utf-8')
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.end(data)
          } catch (err) {
            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify([]))
          }
        })
      },
    },
  ],
  server: {
    port: 3000,
    open: true,
  },
})