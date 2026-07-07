import { useAuth } from '../context/AuthContext'
import { resolveRole, canView, canEdit, moduleForRoute } from '../lib/permissions'

// Current user's effective role + what they can see/do.
export function usePermissions() {
  const { user } = useAuth()
  const role = user?.accessRole || resolveRole(user?.email) || 'Viewer'
  return {
    role,
    isOwner: role === 'Owner',
    canViewModule: (m) => canView(role, m),
    canEditModule: (m) => canEdit(role, m),
    canViewRoute: (p) => canView(role, moduleForRoute(p)),
    canEditRoute: (p) => canEdit(role, moduleForRoute(p)),
  }
}
