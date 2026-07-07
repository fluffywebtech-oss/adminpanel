// Central appearance manager — theme, accent colour, font size & compact sidebar.
// Persists to localStorage and applies to <html> so it works app-wide.
// Themes: light · dark · warm (low-blue-light "eye care" tone).
const KEY = 'admin_appearance'

export const ACCENTS = {
  blue: { 50: '#eef4fd', 500: '#2e6fe0', 600: '#1f56c4', 700: '#1b4db1' },
  purple: { 50: '#f5f3ff', 500: '#8b5cf6', 600: '#7c3aed', 700: '#6d28d9' },
  green: { 50: '#ecfdf5', 500: '#10b981', 600: '#059669', 700: '#047857' },
  orange: { 50: '#fff7ed', 500: '#f97316', 600: '#ea580c', 700: '#c2410c' },
  red: { 50: '#fef2f2', 500: '#ef4444', 600: '#dc2626', 700: '#b91c1c' },
  pink: { 50: '#fdf2f8', 500: '#ec4899', 600: '#db2777', 700: '#be185d' },
}
export const ACCENT_KEYS = Object.keys(ACCENTS)

export const DEFAULTS = { theme: 'light', accent: 'blue', fontSize: '16', compact: false }

export function loadAppearance() {
  try {
    const s = { ...DEFAULTS, ...(JSON.parse(localStorage.getItem(KEY) || '{}')) }
    if (!['light', 'dark', 'warm'].includes(s.theme)) s.theme = 'light' // migrate legacy 'system'
    return s
  } catch { return { ...DEFAULTS } }
}

export function applyAppearance(s) {
  const root = document.documentElement
  root.classList.toggle('dark', s.theme === 'dark')
  root.classList.toggle('warm', s.theme === 'warm')
  root.classList.toggle('admin-compact', !!s.compact)
  root.style.fontSize = `${s.fontSize || 16}px`
  const a = ACCENTS[s.accent] || ACCENTS.blue
  root.style.setProperty('--accent-50', a[50])
  root.style.setProperty('--accent-500', a[500])
  root.style.setProperty('--accent-600', a[600])
  root.style.setProperty('--accent-700', a[700])
}

export function saveAppearance(s) {
  try { localStorage.setItem(KEY, JSON.stringify(s)) } catch { /* ignore */ }
  applyAppearance(s)
  window.dispatchEvent(new CustomEvent('appearancechange', { detail: s }))
}

// Apply saved prefs on boot.
export function initAppearance() {
  applyAppearance(loadAppearance())
}
