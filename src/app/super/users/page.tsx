'use client';

import { useState } from 'react';
import { mockDb } from '@/lib/supabase/mock-db';
import { UserProfile, UserRole } from '@/lib/types';
import { UserPlus, ShieldAlert, CheckCircle, Lock, UserX, UserCheck } from 'lucide-react';

export default function SuperUsersPage() {
  const [users, setUsers] = useState<UserProfile[]>(mockDb.userProfiles);
  const [newRole, setNewRole] = useState<UserRole>('ADMIN');
  const [newEmail, setNewEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: UserProfile = {
      id: `u-${Date.now()}`,
      role: newRole,
      status: 'ACTIVE',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    mockDb.userProfiles.unshift(newUser);

    mockDb.auditLogs.unshift({
      id: `aud-usr-${Date.now()}`,
      actor_user_id: 'u-super-1',
      actor_name: 'SUPER Owner',
      action: 'CREATE_USER_ACCOUNT',
      entity_type: 'user_profiles',
      entity_id: newUser.id,
      new_data: { role: newRole, email: newEmail },
      created_at: new Date().toISOString()
    });

    setMessage(`Created new ${newRole} account for ${newEmail}. Temporary password set.`);
    setNewEmail('');
    setUsers([...mockDb.userProfiles]);
  };

  const toggleStatus = (userId: string) => {
    const u = users.find(usr => usr.id === userId);
    if (u) {
      u.status = u.status === 'ACTIVE' ? 'DISABLED' : 'ACTIVE';
      setMessage(`User ${u.id} status changed to ${u.status}.`);
      setUsers([...mockDb.userProfiles]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="glass-card p-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-100">User Account Management Center</h2>
          <p className="text-xs text-slate-400 mt-1">SUPER Exclusive - Provision ADMIN & STAFF Accounts, Disable Accounts, Reset Passwords</p>
        </div>
      </div>

      {message && (
        <div className="p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-xs text-indigo-300">
          {message}
        </div>
      )}

      {/* Account Provisioning Form */}
      <div className="glass-card p-6 space-y-4">
        <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
          <UserPlus className="w-4 h-4 text-indigo-400" />
          Provision New ADMIN or STAFF Account
        </h3>

        <form onSubmit={handleCreateAccount} className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="text-slate-400 block mb-1">Account Role</label>
            <select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value as UserRole)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-slate-100"
            >
              <option value="ADMIN">ADMIN (Operational Manager)</option>
              <option value="STAFF">STAFF (Salon Technician)</option>
            </select>
          </div>

          <div>
            <label className="text-slate-400 block mb-1">Email Address</label>
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="user@aurasalon.com"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-slate-100"
              required
            />
          </div>

          <div className="flex items-end">
            <button type="submit" className="w-full gradient-bg text-white font-bold py-2.5 rounded-lg text-xs">
              Provision Account
            </button>
          </div>
        </form>
      </div>

      {/* Users Table */}
      <div className="glass-card p-6 overflow-x-auto">
        <h3 className="font-bold text-slate-100 text-sm mb-4">Application User Roster</h3>
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-800/80 text-slate-400 uppercase text-[10px]">
            <tr>
              <th className="p-3">User ID</th>
              <th className="p-3">Role</th>
              <th className="p-3">Status</th>
              <th className="p-3">Created Date</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-slate-800/40">
                <td className="p-3 font-mono text-indigo-400">{u.id}</td>
                <td className="p-3">
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                    u.role === 'SUPER' ? 'badge-purple' : u.role === 'ADMIN' ? 'badge-emerald' : 'badge-amber'
                  }`}>
                    {u.role}
                  </span>
                </td>
                <td className="p-3">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    u.status === 'ACTIVE' ? 'badge-emerald' : 'badge-rose'
                  }`}>
                    {u.status}
                  </span>
                </td>
                <td className="p-3 text-slate-400">{new Date(u.created_at).toLocaleDateString()}</td>
                <td className="p-3">
                  {u.role !== 'SUPER' && (
                    <button
                      onClick={() => toggleStatus(u.id)}
                      className={`px-3 py-1 rounded-lg text-[10px] font-bold ${
                        u.status === 'ACTIVE'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}
                    >
                      {u.status === 'ACTIVE' ? 'Disable Account' : 'Enable Account'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
