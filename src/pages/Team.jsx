import { useMemo, useState } from 'react'
import { Users, ShieldCheck, ScrollText, Plus, Edit2, Trash2, Search, Mail, Circle, Save, RotateCcw, Lock } from 'lucide-react'
import { useSupabaseCollection } from '../hooks/useSupabaseCollection'
import { Modal, Confirm } from './Transactions'
import { getAudit, logAudit } from '../lib/audit'
import { getMatrix, setMatrix, resetMatrix, LEVELS } from '../lib/permissions'

const ROLES = ['Owner', 'Manager', 'Agent', 'Builder', 'Viewer']
const ROLE_STYLE = {
  Owner: 'bg-violet-50 text-violet-700', Manager: 'bg-blue-50 text-blue-700',
  Agent: 'bg-teal-50 text-teal-700', Builder: 'bg-orange-50 text-orange-700', Viewer: 'bg-gray-100 text-gray-500',
}
const MODULES = ['Properties', 'Enquiries & Meetings', 'Content (Blog/Video/Podcast)', 'Finance (Deals/Invest)', 'Site & Settings', 'Team & Audit']
// permission level per role × module: full | edit | view | none
const MATRIX = {
  Properties:                     { Owner: 'full', Manager: 'edit', Agent: 'edit', Viewer: 'view' },
  'Enquiries & Meetings':         { Owner: 'full', Manager: 'edit', Agent: 'edit', Viewer: 'view' },
  'Content (Blog/Video/Podcast)': { Owner: 'full', Manager: 'edit', Agent: 'view', Viewer: 'view' },
  'Finance (Deals/Invest)':       { Owner: 'full', Manager: 'edit', Agent: 'none', Viewer: 'view' },
  'Site & Settings':              { Owner: 'full', Manager: 'view', Agent: 'none', Viewer: 'none' },
  'Team & Audit':                 { Owner: 'full', Manager: 'view', Agent: 'none', Viewer: 'none' },
}
const LEVEL = {
  full: { label: 'Full', cls: 'bg-violet-100 text-violet-700' },
  edit: { label: 'Edit', cls: 'bg-blue-100 text-blue-700' },
  view: { label: 'View', cls: 'bg-gray-100 text-gray-600' },
  none: { label: '—', cls: 'bg-gray-50 text-gray-300' },
}

const SEED_TEAM = [
  { id: 1, name: 'You (Owner)', email: 'admin@example.com', role: 'Owner', status: 'Active', last_active: 'Just now' },
  { id: 2, name: 'Priya Sharma', email: 'priya@propertyinsta.com', role: 'Manager', status: 'Active', last_active: '2h ago' },
  { id: 3, name: 'Rajiv Malhotra', email: 'rajiv@propertyinsta.com', role: 'Agent', status: 'Active', last_active: 'Yesterday' },
  { id: 5, name: 'DLF Projects Desk', email: 'builder@dlf.com', role: 'Builder', status: 'Active', last_active: '1h ago' },
  { id: 4, name: 'External Auditor', email: 'audit@propertyinsta.com', role: 'Viewer', status: 'Invited', last_active: '—' },
]
const EMPTY = { name: '', email: '', role: 'Agent', status: 'Invited', last_active: '—' }
const timeAgo = (iso) => { const m = Math.floor((Date.now() - new Date(iso)) / 60000); if (m < 1) return 'just now'; if (m < 60) return m + 'm ago'; const h = Math.floor(m / 60); if (h < 24) return h + 'h ago'; return Math.floor(h / 24) + 'd ago' }

export default function Team() {
  const { rows: members, add, update, remove } = useSupabaseCollection('team_members', SEED_TEAM, { localKey: 'os_team', orderBy: 'id' })
  const [tab, setTab] = useState('members')
  const [showModal, setShowModal] = useState(false)
  const [showDelete, setShowDelete] = useState(null)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [audit] = useState(() => getAudit())
  const [auditActor, setAuditActor] = useState('all')
  const [search, setSearch] = useState('')
  const [matrix, setMatrixState] = useState(() => getMatrix())
  const [permDirty, setPermDirty] = useState(false)

  const cycle = (mod, role) => {
    if (role === 'Owner') return // owner is always full
    const cur = matrix[mod][role]
    const next = LEVELS[(LEVELS.indexOf(cur) + 1) % LEVELS.length]
    setMatrixState(m => ({ ...m, [mod]: { ...m[mod], [role]: next } }))
    setPermDirty(true)
  }
  const savePerms = () => { setMatrix(matrix); setPermDirty(false); logAudit('Updated role permissions', 'access matrix') }
  const resetPerms = () => { resetMatrix(); setMatrixState(getMatrix()); setPermDirty(false); logAudit('Reset role permissions', 'factory defaults') }

  const openAdd = () => { setEditing(null); setForm(EMPTY); setShowModal(true) }
  const openEdit = (m) => { setEditing(m.id); setForm({ ...EMPTY, ...m }); setShowModal(true) }
  const save = () => {
    if (!form.name || !form.email) return
    if (editing) { update(editing, form); logAudit('Updated team member', `${form.name} (${form.role})`) }
    else { add(form); logAudit('Invited team member', `${form.email} (${form.role})`) }
    setShowModal(false)
  }
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const actors = useMemo(() => ['all', ...new Set(audit.map(a => a.actor))], [audit])
  const filteredAudit = audit.filter(a => auditActor === 'all' || a.actor === auditActor)
  const filteredMembers = members.filter(m => !search || `${m.name} ${m.email}`.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><ShieldCheck className="w-6 h-6 text-primary-600" /> Team & Access</h1>
          <p className="text-gray-500 mt-1">Members, role permissions & the audit trail</p>
        </div>
        {tab === 'members' && <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-primary-600 rounded-lg hover:bg-primary-700"><Plus className="w-4 h-4" /> Invite member</button>}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-100">
        {[['members', 'Members', Users], ['roles', 'Roles & Permissions', ShieldCheck], ['audit', 'Audit Log', ScrollText]].map(([k, label, Icon]) => (
          <button key={k} onClick={() => setTab(k)} className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold border-b-2 -mb-px ${tab === k ? 'text-primary-600 border-primary-600' : 'text-gray-500 border-transparent hover:text-gray-800'}`}>
            <Icon className="w-4 h-4" /> {label}{k === 'audit' && <span className="ml-1 text-xs bg-gray-100 text-gray-500 rounded-full px-1.5">{audit.length}</span>}
          </button>
        ))}
      </div>

      {/* ── Members ── */}
      {tab === 'members' && (
        <>
          <div className="relative max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search members…" className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200" />
          </div>
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            {filteredMembers.map(m => (
              <div key={m.id} className="flex items-center gap-3 px-4 py-3 border-t border-gray-100 first:border-t-0">
                <div className="w-9 h-9 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-sm shrink-0">{(m.name || '?')[0]}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-900 text-sm">{m.name}</div>
                  <div className="text-xs text-gray-500 flex items-center gap-1"><Mail className="w-3 h-3" /> {m.email}</div>
                </div>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${ROLE_STYLE[m.role]}`}>{m.role}</span>
                <span className="text-xs flex items-center gap-1 w-20"><Circle className={`w-2 h-2 fill-current ${m.status === 'Active' ? 'text-green-500' : 'text-amber-400'}`} />{m.status}</span>
                <span className="text-xs text-gray-400 w-20 text-right hidden sm:block">{m.last_active}</span>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(m)} className="p-1.5 rounded-md hover:bg-gray-100 text-blue-500"><Edit2 className="w-4 h-4" /></button>
                  {m.role !== 'Owner' && <button onClick={() => setShowDelete(m)} className="p-1.5 rounded-md hover:bg-gray-100 text-red-500"><Trash2 className="w-4 h-4" /></button>}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── Roles matrix (editable) ── */}
      {tab === 'roles' && (
        <div>
          <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
            <p className="text-sm text-gray-500">Click any cell to change a role’s access. Changes apply to those users on their next visit.</p>
            <div className="flex items-center gap-2">
              <button onClick={resetPerms} className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50"><RotateCcw className="w-4 h-4" /> Reset</button>
              <button onClick={savePerms} disabled={!permDirty} className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:opacity-40"><Save className="w-4 h-4" /> {permDirty ? 'Save changes' : 'Saved'}</button>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                  <th className="text-left px-4 py-3 font-bold">Module</th>
                  {ROLES.map(r => <th key={r} className="px-4 py-3 font-bold text-center">{r}{r === 'Owner' && <Lock className="w-3 h-3 inline ml-1 -mt-0.5 text-gray-400" />}</th>)}
                </tr>
              </thead>
              <tbody>
                {MODULES.map(mod => (
                  <tr key={mod} className="border-t border-gray-100">
                    <td className="px-4 py-3 font-medium text-gray-800">{mod}</td>
                    {ROLES.map(r => {
                      const lvl = LEVEL[matrix[mod][r]]
                      const locked = r === 'Owner'
                      return (
                        <td key={r} className="px-4 py-2.5 text-center">
                          <button onClick={() => cycle(mod, r)} disabled={locked}
                            className={`text-xs font-bold px-2.5 py-1 rounded-full ${lvl.cls} ${locked ? 'cursor-default opacity-90' : 'hover:ring-2 hover:ring-primary-200 cursor-pointer'}`}>
                            {lvl.label}
                          </button>
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-xs text-gray-400 px-4 py-3 border-t border-gray-100">Levels cycle: — → View → Edit → Full. Owner is locked to Full so you can’t lock yourself out.</p>
          </div>
        </div>
      )}

      {/* ── Audit log ── */}
      {tab === 'audit' && (
        <>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-gray-500">Filter by:</span>
            {actors.map(a => <button key={a} onClick={() => setAuditActor(a)} className={`text-xs px-2.5 py-1 rounded-full border ${auditActor === a ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-gray-500 border-gray-200'}`}>{a === 'all' ? 'Everyone' : a.split('@')[0]}</button>)}
          </div>
          <div className="relative pl-4">
            <div className="absolute left-[7px] top-1 bottom-1 w-px bg-gray-200" />
            <div className="space-y-4">
              {filteredAudit.map(a => (
                <div key={a.id} className="relative">
                  <div className="absolute -left-4 top-1 w-3.5 h-3.5 rounded-full bg-white border-2 border-primary-400" />
                  <div className="bg-white rounded-lg border border-gray-100 px-4 py-2.5">
                    <div className="text-sm text-gray-800"><span className="font-semibold">{a.actor.split('@')[0]}</span> {a.action.toLowerCase()} <span className="font-medium text-gray-900">{a.target}</span></div>
                    <div className="text-xs text-gray-400 mt-0.5">{a.actor} · {timeAgo(a.ts)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {showModal && (
        <Modal title={editing ? 'Edit Member' : 'Invite Member'} onClose={() => setShowModal(false)} onSave={save} saveLabel={editing ? 'Save' : 'Send invite'}>
          <Field label="Name *"><input value={form.name} onChange={e => set('name', e.target.value)} className={inp} /></Field>
          <Field label="Email *"><input type="email" value={form.email} onChange={e => set('email', e.target.value)} className={inp} /></Field>
          <Field label="Role"><select value={form.role} onChange={e => set('role', e.target.value)} className={inp}>{ROLES.map(r => <option key={r}>{r}</option>)}</select></Field>
          <Field label="Status"><select value={form.status} onChange={e => set('status', e.target.value)} className={inp}>{['Active', 'Invited', 'Suspended'].map(s => <option key={s}>{s}</option>)}</select></Field>
        </Modal>
      )}
      {showDelete && <Confirm title="Remove member?" sub={showDelete.name} onCancel={() => setShowDelete(null)} onConfirm={() => { remove(showDelete.id); logAudit('Removed team member', showDelete.email); setShowDelete(null) }} />}
    </div>
  )
}

const inp = 'w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200'
function Field({ label, children, cls = '' }) {
  return <div className={cls}><label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>{children}</div>
}
