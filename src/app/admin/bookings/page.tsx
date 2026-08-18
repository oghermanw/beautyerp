'use client';

import { useState } from 'react';
import { mockDb } from '@/lib/supabase/mock-db';
import { Booking } from '@/lib/types';
import { formatHKD } from '@/lib/money';
import BookingDetailModal from '@/components/bookings/BookingDetailModal';

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>(mockDb.bookings);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  return (
    <div className="space-y-6">
      <div className="glass-card p-6">
        <h2 className="text-xl font-bold text-slate-100">Operational Bookings Management</h2>
        <p className="text-xs text-slate-400 mt-1">ADMIN View - View appointments, assign staff, complete treatments.</p>
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
            {bookings.map((b) => (
              <tr key={b.id} className="hover:bg-slate-800/40">
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
                    className="px-3 py-1 rounded-lg bg-indigo-600/30 text-indigo-300 font-semibold"
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
          role="ADMIN"
          currentUserId="u-admin-1"
          onClose={() => setSelectedBooking(null)}
          onUpdate={() => setBookings([...mockDb.bookings])}
        />
      )}
    </div>
  );
}
