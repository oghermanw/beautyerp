'use client';

import { useState } from 'react';
import { mockDb } from '@/lib/supabase/mock-db';
import { formatHKD } from '@/lib/money';
import BookingDetailModal from '@/components/bookings/BookingDetailModal';
import { Clock, DollarSign, Award, CheckCircle, Sparkles } from 'lucide-react';

export default function StaffDashboardPage() {
  const staffId = 's-001'; // Amy Wong
  const [bookings, setBookings] = useState(mockDb.bookings.filter(b => b.assigned_staff_id === staffId));
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [message, setMessage] = useState<string | null>(null);

  const statement = mockDb.payrollStatements.find(s => s.staff_id === staffId) || {
    base_salary: 18000,
    customer_bonus: 80,
    product_commission: 142,
    manual_bonus: 0,
    net_pay: 18222
  };

  const handleQuickComplete = (bookingId: string) => {
    const result = mockDb.completeBookingAtomic(bookingId, 'u-staff-1', 'STAFF');
    setMessage(result.message);
    setBookings(mockDb.bookings.filter(b => b.assigned_staff_id === staffId));
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="glass-card p-4 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-100 gradient-text">
            Staff Technician Portal
          </h2>
          <p className="text-xs text-slate-400 mt-1">Staff Technician Portal - Today's Appointments & Commission Performance</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2.5 sm:p-3 rounded-xl glass-card border border-emerald-500/30 text-right">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Est. Net Pay This Month</span>
            <span className="text-base sm:text-lg font-black text-emerald-400">{formatHKD(statement.net_pay)}</span>
          </div>
        </div>
      </div>

      {message && (
        <div className="p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-xs text-indigo-300 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-indigo-400 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* Salary & Milestone Bonus Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="glass-card p-4 sm:p-5 space-y-2">
          <div className="flex items-center justify-between text-indigo-400">
            <span className="text-xs font-semibold text-slate-400">底薪 / Base Salary</span>
            <DollarSign className="w-4 h-4" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-slate-100">{formatHKD(statement.base_salary)}</p>
          <span className="text-[10px] text-slate-400">Monthly Guaranteed Base</span>
        </div>

        <div className="glass-card p-4 sm:p-5 space-y-2">
          <div className="flex items-center justify-between text-emerald-400">
            <span className="text-xs font-semibold text-slate-400">客數達標獎金 / Customer Bonus</span>
            <Award className="w-4 h-4" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-emerald-400">{formatHKD(statement.customer_bonus)}</p>
          <span className="text-[10px] text-emerald-300 font-semibold">$20 per 5 completed treatments</span>
        </div>

        <div className="glass-card p-4 sm:p-5 space-y-2">
          <div className="flex items-center justify-between text-purple-400">
            <span className="text-xs font-semibold text-slate-400">產品零售提成 / Retail Commission</span>
            <Sparkles className="w-4 h-4" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-purple-300">{formatHKD(statement.product_commission)}</p>
          <span className="text-[10px] text-purple-300 font-semibold">10% on skincare sales</span>
        </div>
      </div>

      {/* My Assigned Bookings List */}
      <div className="glass-card p-4 sm:p-6 space-y-4">
        <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
          <Clock className="w-4 h-4 text-indigo-400" />
          Today's Appointments / 我的今日預約 ({bookings.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {bookings.map((b) => (
            <div key={b.id} className="glass-card p-4 space-y-3 hover:border-indigo-500/40 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-indigo-400 font-bold">{b.booking_code}</span>
                <span className="badge-purple text-[10px]">{b.status}</span>
              </div>

              <div>
                <h4 className="font-bold text-slate-100 text-base">{b.customer_name}</h4>
                <p className="text-xs text-slate-300 mt-0.5">{b.service_name}</p>
                <p className="text-[10px] text-slate-400 mt-1">{new Date(b.starts_at).toLocaleString()}</p>
              </div>

              <div className="pt-3 border-t border-slate-700/50 flex flex-wrap items-center justify-between gap-2">
                <button
                  onClick={() => setSelectedBooking(b)}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600/30 text-indigo-300 text-xs font-semibold hover:bg-indigo-600/50"
                >
                  View Notes / 療程紀錄
                </button>

                {b.status !== 'COMPLETED' && (
                  <button
                    onClick={() => handleQuickComplete(b.id)}
                    className="gradient-bg text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-md"
                  >
                    Complete Service
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedBooking && (
        <BookingDetailModal
          booking={selectedBooking}
          role="STAFF"
          currentUserId="u-staff-1"
          currentStaffId={staffId}
          onClose={() => setSelectedBooking(null)}
          onUpdate={() => setBookings(mockDb.bookings.filter(b => b.assigned_staff_id === staffId))}
        />
      )}
    </div>
  );
}
