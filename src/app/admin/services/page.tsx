'use client';

import { useState } from 'react';
import { mockDb } from '@/lib/supabase/mock-db';
import { formatHKD } from '@/lib/money';

export default function AdminServicesPage() {
  const [services] = useState(mockDb.services);

  return (
    <div className="space-y-6">
      <div className="glass-card p-6">
        <h2 className="text-xl font-bold text-slate-100">Treatment Services Catalog</h2>
        <p className="text-xs text-slate-400 mt-1">ADMIN View - Service durations and catalog prices.</p>
      </div>

      <div className="glass-card p-6 overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-800/80 text-slate-400 uppercase text-[10px]">
            <tr>
              <th className="p-3">Code</th>
              <th className="p-3">Service Name</th>
              <th className="p-3">Category</th>
              <th className="p-3">Duration</th>
              <th className="p-3">Price</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {services.map((s) => (
              <tr key={s.id} className="hover:bg-slate-800/40">
                <td className="p-3 font-mono font-bold text-indigo-400">{s.service_code}</td>
                <td className="p-3 font-semibold text-slate-100">{s.name}</td>
                <td className="p-3 text-slate-400">{s.category_name}</td>
                <td className="p-3">{s.duration_minutes} mins</td>
                <td className="p-3 font-bold text-emerald-400">{formatHKD(s.base_price)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
