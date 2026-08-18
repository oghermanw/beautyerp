'use client';

import { useState } from 'react';
import BookingCalendar from '@/components/calendar/BookingCalendar';
import BookingDetailModal from '@/components/bookings/BookingDetailModal';
import { mockDb } from '@/lib/supabase/mock-db';
import { Booking } from '@/lib/types';
import { Plus, Calendar as CalendarIcon } from 'lucide-react';

export default function SuperCalendarPage() {
  const [bookings, setBookings] = useState<Booking[]>(mockDb.bookings);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // New Booking Form State
  const [customerName, setCustomerName] = useState('May Chan (陳美玲)');
  const [serviceName, setServiceName] = useState('Hydration Facial 保濕療程');
  const [assignedStaffId, setAssignedStaffId] = useState('s-001');
  const [price, setPrice] = useState('680');
  const [bookingDate, setBookingDate] = useState('2026-08-17');
  const [bookingTime, setBookingTime] = useState('14:00');

  const handleUpdate = () => {
    setBookings([...mockDb.bookings]);
  };

  const handleOpenCreateModal = (prefilledDate?: string) => {
    if (prefilledDate) {
      setBookingDate(prefilledDate);
    }
    setIsCreating(true);
  };

  const handleCreateBooking = (e: React.FormEvent) => {
    e.preventDefault();
    const staff = mockDb.staffProfiles.find(s => s.id === assignedStaffId);
    const startIso = new Date(`${bookingDate}T${bookingTime}:00Z`).toISOString();
    const endIso = new Date(new Date(startIso).getTime() + 3600000).toISOString();

    const newBooking: Booking = {
      id: `b-${Date.now()}`,
      booking_code: `B20260817${(mockDb.bookings.length + 1).toString().padStart(4, '0')}`,
      customer_id: 'c-100',
      customer_name: customerName,
      starts_at: startIso,
      ends_at: endIso,
      status: 'SCHEDULED',
      assigned_staff_id: assignedStaffId,
      assigned_staff_name: staff?.display_name || 'Amy Wong',
      service_name: serviceName,
      price: parseFloat(price),
      created_by: 'u-super-1',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    mockDb.bookings.unshift(newBooking);

    mockDb.orders.unshift({
      id: `ord-${Date.now()}`,
      order_number: `O20260817${(mockDb.orders.length + 1).toString().padStart(4, '0')}`,
      booking_id: newBooking.id,
      customer_id: 'c-100',
      status: 'DRAFT',
      subtotal: parseFloat(price),
      discount_total: 0,
      grand_total: parseFloat(price),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });

    setIsCreating(false);
    handleUpdate();
  };

  return (
    <div className="space-y-6">
      <div className="glass-card p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-100 gradient-text">
            全店預約日曆 (Super Day-by-Day Month Calendar)
          </h2>
          <p className="text-xs text-slate-400 mt-1">按月每日檢視預約狀態 (SCHEDULED / IN_SERVICE / COMPLETED)，支援即時點擊編輯與指派美容師</p>
        </div>
        <button
          onClick={() => handleOpenCreateModal()}
          className="gradient-bg text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/30 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>新增預約 (New Booking)</span>
        </button>
      </div>

      {/* New Booking Form Modal */}
      {isCreating && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-card w-full max-w-md p-6 space-y-4 border border-slate-700">
            <h3 className="text-base font-bold text-slate-100">新增預約安排 (New Appointment Schedule)</h3>
            <form onSubmit={handleCreateBooking} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 block mb-1">顧客姓名 (Customer Name)</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-slate-100"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-300 block mb-1">預約日期 (Date)</label>
                  <input
                    type="date"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-slate-100"
                    required
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1">預約時間 (Time)</label>
                  <input
                    type="time"
                    value={bookingTime}
                    onChange={(e) => setBookingTime(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-slate-100"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 block mb-1">療程服務 (Service)</label>
                <select
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-slate-100"
                >
                  {mockDb.services.map(s => (
                    <option key={s.id} value={s.name}>{s.name} (HK${s.base_price})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-300 block mb-1">指派美容師 (Assign Staff)</label>
                <select
                  value={assignedStaffId}
                  onChange={(e) => setAssignedStaffId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-slate-100"
                >
                  {mockDb.staffProfiles.map(s => (
                    <option key={s.id} value={s.id}>{s.display_name} ({s.staff_code})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-300 block mb-1">預約價格 HKD (Price)</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-slate-100"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-3 py-2 rounded-lg bg-slate-800 text-slate-300 font-semibold"
                >
                  取消 (Cancel)
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg gradient-bg text-white font-bold"
                >
                  確認建立預約 (Create)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Main Calendar Grid */}
      <BookingCalendar
        bookings={bookings}
        staffList={mockDb.staffProfiles}
        role="SUPER"
        onSelectBooking={(b) => setSelectedBooking(b)}
        onCreateBooking={handleOpenCreateModal}
      />

      {/* Booking Detail & State Editor Modal */}
      {selectedBooking && (
        <BookingDetailModal
          booking={selectedBooking}
          role="SUPER"
          currentUserId="u-super-1"
          onClose={() => setSelectedBooking(null)}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
}
