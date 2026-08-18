'use client';

import { useState } from 'react';
import BookingCalendar from '@/components/calendar/BookingCalendar';
import BookingDetailModal from '@/components/bookings/BookingDetailModal';
import { mockDb } from '@/lib/supabase/mock-db';
import { Booking } from '@/lib/types';
import { Plus } from 'lucide-react';

export default function AdminCalendarPage() {
  const [bookings, setBookings] = useState<Booking[]>(mockDb.bookings);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  return (
    <div className="space-y-6">
      <div className="glass-card p-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-100">Operational Booking Calendar</h2>
          <p className="text-xs text-slate-400 mt-1">ADMIN View - Schedule appointments, assign staff, and complete bookings.</p>
        </div>
      </div>

      <BookingCalendar
        bookings={bookings}
        staffList={mockDb.staffProfiles}
        role="ADMIN"
        onSelectBooking={(b) => setSelectedBooking(b)}
      />

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
