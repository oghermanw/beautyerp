'use client';

import { useState } from 'react';
import { mockDb } from '@/lib/supabase/mock-db';
import { ShieldCheck, Search } from 'lucide-react';

export default function SuperAuditPage() {
  const [logs] = useState(mockDb.auditLogs);
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = logs.filter(l =>
    l.action?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.actor_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.entity_type?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="glass-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 gradient-text">System Security & Audit Trail</h2>
          <p className="text-xs text-slate-400 mt-1">SUPER Exclusive - Complete Audit Trail for Price Overrides, Exports, Payroll Locks, & System Changes</p>
        </div>

        <div className="relative w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search action, actor, entity..."
            className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-100 focus:outline-none"
          />
        </div>
      </div>

      <div className="glass-card p-6 overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-800/80 text-slate-400 uppercase text-[10px]">
            <tr>
              <th className="p-3">Timestamp</th>
              <th className="p-3">Actor Name</th>
              <th className="p-3">Action</th>
              <th className="p-3">Entity Type</th>
              <th className="p-3">Entity ID</th>
              <th className="p-3">Change Payload</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {filtered.map((l) => (
              <tr key={l.id} className="hover:bg-slate-800/40">
                <td className="p-3 font-mono text-slate-400">{new Date(l.created_at).toLocaleString()}</td>
                <td className="p-3 font-semibold text-slate-100">{l.actor_name}</td>
                <td className="p-3 font-bold text-indigo-400">{l.action}</td>
                <td className="p-3"><span className="badge-purple text-[10px]">{l.entity_type}</span></td>
                <td className="p-3 font-mono text-slate-400">{l.entity_id || 'N/A'}</td>
                <td className="p-3 font-mono text-[10px] text-slate-400 max-w-xs truncate">
                  {JSON.stringify(l.new_data || {})}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
