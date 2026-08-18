'use client';

import { useState } from 'react';
import { mockDb } from '@/lib/supabase/mock-db';
import { Customer } from '@/lib/types';
import { Users, Search, Phone, Mail, MapPin, ShieldAlert } from 'lucide-react';

export default function AdminCustomersPage() {
  const [customers] = useState<Customer[]>(mockDb.customers);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('c-100');

  const filtered = customers.filter(c =>
    c.display_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.customer_code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedCustomer = mockDb.customers.find(c => c.id === selectedCustomerId) || mockDb.customers[0];
  const pii = mockDb.customerPrivateDetails[selectedCustomer.id] || {
    full_name: selectedCustomer.display_name,
    phone: '+852 9123 4567',
    email: 'may.chan@example.hk',
    residential_area: 'Central'
  };
  const skin = mockDb.customerSkinProfiles[selectedCustomer.id] || {};
  const customerBookings = mockDb.bookings.filter(b => b.customer_id === selectedCustomer.id);

  return (
    <div className="space-y-6">
      <div className="glass-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100">Operational Customer CRM</h2>
          <p className="text-xs text-slate-400 mt-1">ADMIN Operational View - Contact Info, Skin Profiles, & Treatment History</p>
        </div>

        <div className="relative w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search code or name..."
            className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-100 focus:outline-none"
          />
        </div>
      </div>

      <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 flex items-center gap-2">
        <ShieldAlert className="w-4 h-4 text-amber-400" />
        <span>ADMIN Security Boundary: Customer Lifetime Value (LTV) and Profit metrics hidden.</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer List */}
        <div className="glass-card p-4 space-y-2 h-[600px] overflow-y-auto">
          {filtered.map((c) => (
            <div
              key={c.id}
              onClick={() => setSelectedCustomerId(c.id)}
              className={`p-3 rounded-xl cursor-pointer transition-all ${
                selectedCustomerId === c.id
                  ? 'bg-indigo-600/30 border border-indigo-500/50'
                  : 'bg-slate-800/40 hover:bg-slate-800/80 border border-slate-700/30'
              }`}
            >
              <span className="text-xs font-mono text-indigo-400 font-bold">{c.customer_code}</span>
              <p className="font-bold text-sm text-slate-100 mt-1">{c.display_name}</p>
            </div>
          ))}
        </div>

        {/* Selected Customer Detail (ADMIN View) */}
        <div className="lg:col-span-2 glass-card p-6 space-y-6">
          <div className="pb-4 border-b border-slate-700/60">
            <span className="text-xs font-mono text-indigo-400 font-bold">{selectedCustomer.customer_code}</span>
            <h2 className="text-2xl font-black text-slate-100 mt-1">{pii.full_name}</h2>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 mt-2">
              <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-slate-400" /> {pii.phone}</span>
              <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-slate-400" /> {pii.email}</span>
              <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-slate-400" /> {pii.residential_area}</span>
            </div>
          </div>

          {/* Skin Profile */}
          <div className="glass-card p-4 space-y-2">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Skin Profile & Allergies</h4>
            <p className="text-sm font-semibold text-slate-100">Skin Type: {skin.skin_type || 'Combination / Sensitive'}</p>
            <p className="text-xs text-rose-300">Allergies: {skin.allergies?.join(', ') || 'Alcohol, Fragrance'}</p>
          </div>

          {/* Treatment History */}
          <div className="glass-card p-4 space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Treatment History</h4>
            <div className="space-y-2">
              {customerBookings.map((b) => (
                <div key={b.id} className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/50 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-100">{b.service_name}</span>
                    <span className="text-[10px] text-slate-400 block">{new Date(b.starts_at).toLocaleDateString()} • {b.assigned_staff_name}</span>
                  </div>
                  <span className="badge-purple text-[10px]">{b.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
