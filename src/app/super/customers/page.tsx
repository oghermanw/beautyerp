'use client';

import { useState } from 'react';
import { mockDb } from '@/lib/supabase/mock-db';
import { Customer } from '@/lib/types';
import { formatHKD } from '@/lib/money';
import { Users, Search, Phone, Mail, MapPin, Calendar, HeartPulse, CreditCard, Clock, Sparkles } from 'lucide-react';

export default function SuperCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>(mockDb.customers);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('c-100');
  const [activeTab, setActiveTab] = useState<'overview' | 'skin' | 'service' | 'payments' | 'notes'>('overview');

  const filteredCustomers = customers.filter(c =>
    c.display_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.customer_code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedCustomer = mockDb.customers.find(c => c.id === selectedCustomerId) || mockDb.customers[0];
  const pii = mockDb.customerPrivateDetails[selectedCustomer.id] || {
    full_name: selectedCustomer.display_name,
    phone: '+852 9123 4567',
    email: 'may.chan@example.hk',
    residential_area: 'Central, Hong Kong'
  };
  const skin = mockDb.customerSkinProfiles[selectedCustomer.id] || {};
  const notes = mockDb.customerNotes.filter(n => n.customer_id === selectedCustomer.id);
  const customerBookings = mockDb.bookings.filter(b => b.customer_id === selectedCustomer.id);
  const customerPayments = mockDb.payments.filter(p => p.customer_id === selectedCustomer.id);

  // Financial aggregates for SUPER (Section 22)
  const lifetimeSpend = customerPayments.reduce((acc, p) => acc + p.amount, 0) + 4800; // Total
  const visitCount = customerBookings.length + 5;
  const averageSpend = lifetimeSpend / Math.max(1, visitCount);

  return (
    <div className="space-y-6">
      <div className="glass-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100">Customer CRM Center</h2>
          <p className="text-xs text-slate-400 mt-1">SUPER Complete View - Lifetime Value, Spending History, & Skin Profiles</p>
        </div>

        <div className="relative w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search code or name..."
            className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer List Column */}
        <div className="glass-card p-4 space-y-2 h-[680px] overflow-y-auto">
          <span className="text-[10px] uppercase font-bold text-slate-400 block px-2 mb-2">
            Customers ({filteredCustomers.length})
          </span>
          {filteredCustomers.map((c) => (
            <div
              key={c.id}
              onClick={() => setSelectedCustomerId(c.id)}
              className={`p-3 rounded-xl cursor-pointer transition-all ${
                selectedCustomerId === c.id
                  ? 'bg-indigo-600/30 border border-indigo-500/50 shadow-md'
                  : 'bg-slate-800/40 hover:bg-slate-800/80 border border-slate-700/30'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-indigo-400 font-semibold">{c.customer_code}</span>
                <span className="text-[10px] badge-emerald">ACTIVE</span>
              </div>
              <p className="font-bold text-sm text-slate-100 mt-1">{c.display_name}</p>
            </div>
          ))}
        </div>

        {/* Selected Customer Detail Tabs (SUPER View) */}
        <div className="lg:col-span-2 glass-card p-6 flex flex-col space-y-6">
          {/* Header Info */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-700/60">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-indigo-400 font-bold">{selectedCustomer.customer_code}</span>
                <span className="text-xs text-slate-400">• Customer Since 2023</span>
              </div>
              <h2 className="text-2xl font-black text-slate-100 mt-1">{pii.full_name}</h2>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 mt-2">
                <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-slate-400" /> {pii.phone}</span>
                <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-slate-400" /> {pii.email}</span>
                <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-slate-400" /> {pii.residential_area}</span>
              </div>
            </div>

            {/* SUPER Financial Aggregates */}
            <div className="grid grid-cols-3 gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-700/60 text-center">
              <div>
                <span className="text-[10px] text-slate-400 uppercase block font-semibold">Lifetime Spend</span>
                <span className="text-sm font-bold text-emerald-400">{formatHKD(lifetimeSpend)}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase block font-semibold">Visits</span>
                <span className="text-sm font-bold text-indigo-300">{visitCount}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase block font-semibold">Avg Spend</span>
                <span className="text-sm font-bold text-slate-200">{formatHKD(averageSpend)}</span>
              </div>
            </div>
          </div>

          {/* Sub Navigation */}
          <div className="flex border-b border-slate-700/50 gap-4 text-xs font-semibold">
            {(['overview', 'skin', 'service', 'payments', 'notes'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 capitalize border-b-2 transition-all ${
                  activeTab === tab ? 'border-indigo-500 text-indigo-300' : 'border-transparent text-slate-400'
                }`}
              >
                {tab === 'skin' ? 'Skin Profile' : tab === 'service' ? 'Service History' : tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="space-y-4 flex-1">
            {activeTab === 'overview' && (
              <div className="grid grid-cols-2 gap-4">
                <div className="glass-card p-4 space-y-2">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Date of Birth & Age</span>
                  <p className="text-sm font-bold text-slate-100">{selectedCustomer.birth_date || '1995-05-15'} (Age 31)</p>
                </div>
                <div className="glass-card p-4 space-y-2">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Primary Contact</span>
                  <p className="text-sm font-bold text-slate-100">{pii.phone}</p>
                </div>
                <div className="glass-card p-4 col-span-2 space-y-2">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Emergency Contact</span>
                  <p className="text-sm font-bold text-slate-200">{pii.emergency_contact || '+852 9000 1111'}</p>
                </div>
              </div>
            )}

            {activeTab === 'skin' && (
              <div className="space-y-4">
                <div className="glass-card p-4 space-y-2">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Skin Type & Conditions</span>
                  <p className="text-sm font-bold text-slate-100">{skin.skin_type || 'Combination / Sensitive'}</p>
                  <div className="flex gap-2 mt-1">
                    {(skin.skin_conditions || ['Dehydration', 'Redness']).map((cond: string, i: number) => (
                      <span key={i} className="text-[10px] badge-purple">{cond}</span>
                    ))}
                  </div>
                </div>

                <div className="glass-card p-4 space-y-2">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Allergies & Sensitivities</span>
                  <p className="text-xs text-rose-300 font-semibold">{skin.allergies?.join(', ') || 'Alcohol, Fragrance'}</p>
                  <p className="text-xs text-slate-300">Sensitivity Level: {skin.sensitivity || 'High'}</p>
                </div>
              </div>
            )}

            {activeTab === 'service' && (
              <div className="space-y-3">
                {customerBookings.map((b) => (
                  <div key={b.id} className="glass-card p-3 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-slate-100">{b.service_name}</p>
                      <p className="text-[10px] text-slate-400">{new Date(b.starts_at).toLocaleDateString()} • {b.assigned_staff_name}</p>
                    </div>
                    <span className="font-bold text-emerald-400">{formatHKD(b.price || 680)}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'payments' && (
              <div className="space-y-3">
                {customerPayments.map((p) => (
                  <div key={p.id} className="glass-card p-3 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-slate-100">Method: {p.method}</p>
                      <p className="text-[10px] text-slate-400">{new Date(p.paid_at).toLocaleString()} • Ref: {p.external_reference || 'N/A'}</p>
                    </div>
                    <span className="font-bold text-emerald-400">{formatHKD(p.amount)}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'notes' && (
              <div className="space-y-3">
                {notes.map((n) => (
                  <div key={n.id} className="glass-card p-3 space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="badge-purple text-[10px]">{n.visibility}</span>
                      <span className="text-[10px] text-slate-500">{new Date(n.created_at).toLocaleDateString()}</span>
                    </div>
                    <p className="text-slate-200">{n.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
