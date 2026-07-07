// Lightweight audit trail: who did what, when.
// Always logs to localStorage; best-effort mirror to a Supabase `audit_log` table.
import { supabase } from './supabase'

const LS_KEY = 'os_audit'

function actor() {
  try {
    const u = JSON.parse(localStorage.getItem('admin_user') || 'null')
    return u?.email || u?.name || 'admin@example.com'
  } catch { return 'admin@example.com' }
}

export function logAudit(action, target = '', meta = {}) {
  const entry = {
    id: Date.now() + Math.floor(Math.random() * 1000),
    ts: new Date().toISOString(),
    actor: actor(),
    action,           // e.g. "Published listing", "Deleted property", "Imported listings"
    target,           // e.g. "DLF Privana North"
    ...meta,
  }
  try {
    const all = JSON.parse(localStorage.getItem(LS_KEY) || '[]')
    all.unshift(entry)
    localStorage.setItem(LS_KEY, JSON.stringify(all.slice(0, 500)))
  } catch { /* ignore */ }
  try { supabase.from('audit_log').insert(entry).then(() => {}, () => {}) } catch { /* no table */ }
  return entry
}

function seed() {
  const now = Date.now()
  const e = (mins, actorEmail, action, target) => ({ id: now - mins, ts: new Date(now - mins * 60000).toISOString(), actor: actorEmail, action, target })
  return [
    e(4, 'admin@example.com', 'Published listing', 'DLF Privana North – 4 BHK'),
    e(38, 'priya@propertyinsta.com', 'Updated enquiry status', 'Ananya Reddy → Contacted'),
    e(95, 'admin@example.com', 'Imported listings', '2 properties via CSV'),
    e(160, 'rajiv@propertyinsta.com', 'Scheduled meeting', 'Arjun Sharma · Site Visit'),
    e(320, 'priya@propertyinsta.com', 'Edited property', 'Godrej Aristocrat – 3 BHK'),
    e(1440, 'admin@example.com', 'Invited team member', 'audit@propertyinsta.com (Viewer)'),
  ]
}

export function getAudit() {
  let all = []
  try { all = JSON.parse(localStorage.getItem(LS_KEY) || '[]') } catch { /* ignore */ }
  if (!all.length) { all = seed(); try { localStorage.setItem(LS_KEY, JSON.stringify(all)) } catch { /* ignore */ } }
  return all
}
