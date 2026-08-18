'use client';

import { mockDb } from '@/lib/supabase/mock-db';
import { Calendar, Clock, CheckCircle, AlertCircle, Users } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const bookings = mockDb.bookings;
  const todayBookings = bookings.length;
  const inService = bookings.filter(b => b.status === 'IN_SERVICE').length;
  const completed = bookings.filter(b => b.status === 'COMPLETED').length;
  const scheduled = bookings.filter(b => b.status === 'SCHEDULED' || b.status === 'CONFIRMED').length;

  const lowStockProducts = mockDb.products.filter(p => (p.current_stock || 0) <= p.low_stock_threshold);

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="glass-card p-4 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-100 gradient-text">
            Operational Management Center
          </h2>
          <p className="text-xs text-slate-400 mt-1">ADMIN Operational View - Appointments, Customer Service, & Stock Quantities</p>
        </div>

        <Link
          href="/admin/calendar"
          className="gradient-bg text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 self-start md:self-auto"
        >
          <Calendar className="w-4 h-4" />
          <span>Open Booking Schedule &rarr;</span>
        </Link>
      </div>

      {/* Operational KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="glass-card p-4 sm:p-5 space-y-2">
          <div className="flex items-center justify-between text-indigo-400">
            <span className="text-xs font-semibold text-slate-400">Total Bookings Today</span>
            <Clock className="w-4 h-4" />
          </div>
          <p className="text-2xl font-black text-slate-100">{todayBookings}</p>
          <span className="text-[10px] text-slate-400">Scheduled Appointments</span>
        </div>

        <div className="glass-card p-4 sm:p-5 space-y-2">
          <div className="flex items-center justify-between text-amber-400">
            <span className="text-xs font-semibold text-slate-400">Upcoming / Scheduled</span>
            <Calendar className="w-4 h-4" />
          </div>
          <p className="text-2xl font-black text-amber-300">{scheduled}</p>
          <span className="text-[10px] text-slate-400">Confirmed Clients</span>
        </div>

        <div className="glass-card p-4 sm:p-5 space-y-2">
          <div className="flex items-center justify-between text-purple-400">
            <span className="text-xs font-semibold text-slate-400">In Service Now</span>
            <Users className="w-4 h-4" />
          </div>
          <p className="text-2xl font-black text-purple-300">{inService}</p>
          <span className="text-[10px] text-purple-400">Active Treatments</span>
        </div>

        <div className="glass-card p-4 sm:p-5 space-y-2">
          <div className="flex items-center justify-between text-emerald-400">
            <span className="text-xs font-semibold text-slate-400">Completed Today</span>
            <CheckCircle className="w-4 h-4" />
          </div>
          <p className="text-2xl font-black text-emerald-400">{completed}</p>
          <span className="text-[10px] text-slate-400 font-semibold">Atomic Deductions Finalized</span>
        </div>
      </div>

      {/* Grid: Low Stock Alerts & Recent Bookings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low Stock Operational Alerts */}
        <div className="glass-card p-4 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400" />
              Low Stock Operational Alerts
            </h3>
            <Link href="/admin/inventory" className="text-xs text-indigo-400 font-semibold hover:underline">
              View Inventory &rarr;
            </Link>
          </div>

          <div className="space-y-3">
            {lowStockProducts.length === 0 ? (
              <p className="text-xs text-slate-500">All inventory levels healthy.</p>
            ) : (
              lowStockProducts.map((p) => (
                <div key={p.id} className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-100">{p.name}</span>
                    <span className="text-[10px] text-slate-400 block">SKU: {p.sku}</span>
                  </div>
                  <span className="badge-rose text-[10px] font-bold">
                    Stock: {p.current_stock} {p.base_unit} (Threshold: {p.low_stock_threshold})
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Today's Schedule Overview */}
        <div className="glass-card p-4 sm:p-6 space-y-4">
          <h3 className="font-bold text-slate-100 text-sm">Today's Salon Schedule / 今日預約日程</h3>
          <div className="space-y-3">
            {bookings.slice(0, 4).map((b) => (
              <div key={b.id} className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-100">{b.customer_name}</span>
                  <span className="text-slate-400 block">{b.service_name} • {b.assigned_staff_name}</span>
                </div>
                <span className="badge-purple text-[10px]">{b.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
