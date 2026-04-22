import { Badge } from '@/components/ui/badge'
import { User } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import type { Profile } from '@/types/supabase'

interface AdminUsersTabProps {
  users: Profile[]
}

export function AdminUsersTab({ users }: AdminUsersTabProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-gray-900">All Users ({users.length})</h2>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              {['User', 'Phone', 'Role', 'Joined'].map((h) => (
                <th
                  key={h}
                  className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-12 text-gray-400">
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-brand-light flex items-center justify-center shrink-0">
                        <User size={14} className="text-brand" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{user.full_name}</p>
                        <p className="text-xs text-gray-400 font-mono">{user.id.slice(0, 8)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{user.phone ?? '—'}</td>
                  <td className="px-4 py-3">
                    <Badge
                      className={
                        user.role === 'admin'
                          ? 'bg-brand-light text-brand border-red-200'
                          : 'bg-gray-100 text-gray-600'
                      }
                      variant="outline"
                    >
                      {user.role}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{formatDate(user.created_at)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
