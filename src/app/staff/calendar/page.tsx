'use client';

import { useState } from 'react';
import BookingCalendar from '@/components/calendar/BookingCalendar';
import BookingDetailModal from '@/components/bookings/BookingDetailModal';
import { mockDb } from '@/lib/supabase/mock-db';
import { Booking } from '@/lib/types';

export default function StaffCalendarPage() {
  const staffId = 's-001';
  const [bookings, setBookings] = useState<Booking[]>(mockDb.bookings);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  return (
    <div className="space-y-6">
      <div className="glass-card p-6">
        <h2 className="text-xl font-bold text-slate-100">My Assigned Appointments Calendar</h2>
        <p className="text-xs text-slate-400 mt-1">STAFF View - Filtered strictly to your assigned client schedule.</p>
      </div>

      <BookingCalendar
        bookings={bookings}
        staffList={mockDb.staffProfiles}
        role="STAFF"
        currentStaffId={staffId}
        onSelectBooking={(b) => setSelectedBooking(b)}
      />

      {selectedBooking && (
        <BookingDetailModal
          booking={selectedBooking}
          role="STAFF"
          currentUserId="u-staff-1"
          currentStaffId={staffId}
          onClose={() => setSelectedBooking(null)}
          onUpdate={() => setBookings([...mockDb.bookings])}
        />
      )}
    </div>
  );
}
