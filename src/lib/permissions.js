// Central RBAC: roles, the module × role permission matrix, route→module map,
// and helpers to resolve a user's role + what they can see/do.

export const ROLES = ['Owner', 'Manager', 'Agent', 'Viewer']

export const MODULES = [
  'Properties',
  'Enquiries & Meetings',
  'Content (Blog/Video/Podcast)',
  'Finance (Deals/Invest)',
  'Site & Settings',
  'Team & Audit',
]

// level per role × module: full | edit | view | none
export const MATRIX = {
  Properties:                     { Owner: 'full', Manager: 'edit', Agent: 'edit', Viewer: 'view' },
  'Enquiries & Meetings':         { Owner: 'full', Manager: 'edit', Agent: 'edit', Viewer: 'view' },
  'Content (Blog/Video/Podcast)': { Owner: 'full', Manager: 'edit', Agent: 'view', Viewer: 'view' },
  'Finance (Deals/Invest)':       { Owner: 'full', Manager: 'edit', Agent: 'none', Viewer: 'view' },
  'Site & Settings':              { Owner: 'full', Manager: 'view', Agent: 'none', Viewer: 'none' },
  'Team & Audit':                 { Owner: 'full', Manager: 'view', Agent: 'none', Viewer: 'none' },
}

// Default team (also the demo accounts). Password for all = 'demo123' (Owner also 'admin123').
export const DEFAULT_TEAM = [
  { id: 1, name: 'You (Owner)', email: 'admin@example.com', role: 'Owner', status: 'Active', last_active: 'Just now' },
  { id: 2, name: 'Priya Sharma', email: 'priya@propertyinsta.com', role: 'Manager', status: 'Active', last_active: '2h ago' },
  { id: 3, name: 'Rajiv Malhotra', email: 'rajiv@propertyinsta.com', role: 'Agent', status: 'Active', last_active: 'Yesterday' },
  { id: 4, name: 'External Auditor', email: 'audit@propertyinsta.com', role: 'Viewer', status: 'Invited', last_active: '—' },
]

const ROUTE_MODULE = {
  '/': 'always', '/assistant': 'always',
  '/enquiries': 'Enquiries & Meetings', '/meetings': 'Enquiries & Meetings',
  '/properties': 'Properties', '/property-management': 'Properties',
  '/builder-erp': 'Properties', '/channel-partners': 'Properties', '/society-os': 'Properties',
  '/reels': 'Content (Blog/Video/Podcast)', '/stories': 'Content (Blog/Video/Podcast)',
  '/blogs': 'Content (Blog/Video/Podcast)', '/podcasts': 'Content (Blog/Video/Podcast)',
  '/videos': 'Content (Blog/Video/Podcast)', '/agents': 'Content (Blog/Video/Podcast)',
  '/transactions': 'Finance (Deals/Invest)', '/investments': 'Finance (Deals/Invest)',
  '/site-config': 'Site & Settings', '/settings': 'Site & Settings',
  '/notifications': 'Site & Settings', '/reviews': 'Site & Settings', '/quiz': 'Site & Settings',
  '/team': 'Team & Audit', '/reports': 'Team & Audit',
}

export const moduleForRoute = (path) => ROUTE_MODULE[path] || 'always'
export const levelFor = (role, module) => (module === 'always' ? 'full' : (MATRIX[module]?.[role] || 'none'))
export const canView = (role, module) => levelFor(role, module) !== 'none'
export const canEdit = (role, module) => ['edit', 'full'].includes(levelFor(role, module))

// Merge the live team (localStorage) over the defaults, by email.
export function getTeam() {
  let stored = []
  try { stored = JSON.parse(localStorage.getItem('os_team') || '[]') } catch { /* ignore */ }
  const byEmail = {}
  DEFAULT_TEAM.forEach(m => { byEmail[m.email] = m })
  stored.forEach(m => { if (m.email) byEmail[m.email] = m })
  return Object.values(byEmail)
}

// Resolve a login email → role (admin@example.com is always Owner).
export function resolveRole(email) {
  if (!email) return 'Viewer'
  if (email === 'admin@example.com') return 'Owner'
  return getTeam().find(m => m.email?.toLowerCase() === email.toLowerCase())?.role || 'Viewer'
}

// Validate a demo login → returns the user object or null.
export function demoLogin(email, password) {
  const e = (email || '').toLowerCase()
  if (e === 'admin@example.com' && (password === 'admin123' || password === 'demo123')) {
    return { id: 1, name: 'Admin User', email: 'admin@example.com', role: 'admin', accessRole: 'Owner' }
  }
  const member = getTeam().find(m => m.email?.toLowerCase() === e)
  if (member && password === 'demo123') {
    return { id: member.id, name: member.name, email: member.email, role: 'admin', accessRole: member.role }
  }
  return null
}
