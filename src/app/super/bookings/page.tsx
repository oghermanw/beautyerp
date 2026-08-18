'use client';

import { useState } from 'react';
import { mockDb } from '@/lib/supabase/mock-db';
import { Booking } from '@/lib/types';
import { formatHKD } from '@/lib/money';
import BookingDetailModal from '@/components/bookings/BookingDetailModal';
import { Clock, Search, Filter } from 'lucide-react';

export default function SuperBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>(mockDb.bookings);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = bookings.filter(b =>
    b.booking_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.service_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="glass-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100">All Salon Bookings Ledger</h2>
          <p className="text-xs text-slate-400 mt-1">SUPER Access - Operational & Financial Booking Management</p>
        </div>

        <div className="relative w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search code, customer, service..."
            className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-100 focus:outline-none"
          />
        </div>
      </div>

      <div className="glass-card p-6 overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-800/80 text-slate-400 uppercase text-[10px]">
            <tr>
              <th className="p-3">Booking Code</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Service</th>
              <th className="p-3">Assigned Staff</th>
              <th className="p-3">Time</th>
              <th className="p-3">Price</th>
              <th className="p-3">Status</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {filtered.map((b) => (
              <tr key={b.id} className="hover:bg-slate-800/40 cursor-pointer">
                <td className="p-3 font-mono font-bold text-indigo-400">{b.booking_code}</td>
                <td className="p-3 font-semibold text-slate-100">{b.customer_name}</td>
                <td className="p-3">{b.service_name}</td>
                <td className="p-3 text-indigo-300">{b.assigned_staff_name || 'Unassigned'}</td>
                <td className="p-3">{new Date(b.starts_at).toLocaleString()}</td>
                <td className="p-3 font-bold text-emerald-400">{formatHKD(b.price || 680)}</td>
                <td className="p-3">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full badge-purple">
                    {b.status}
                  </span>
                </td>
                <td className="p-3">
                  <button
                    onClick={() => setSelectedBooking(b)}
                    className="px-3 py-1 rounded-lg bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 font-semibold hover:bg-indigo-600/50"
                  >
                    View / Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedBooking && (
        <BookingDetailModal
          booking={selectedBooking}
          role="SUPER"
          currentUserId="u-super-1"
          onClose={() => setSelectedBooking(null)}
          onUpdate={() => setBookings([...mockDb.bookings])}
        />
      )}
    </div>
  );
}
