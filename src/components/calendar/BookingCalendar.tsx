'use client';

import { useState } from 'react';
import { Booking, StaffProfile, UserRole } from '@/lib/types';
import { formatHKD } from '@/lib/money';
import {
  Calendar as CalendarIcon,
  Clock,
  Filter,
  Plus,
  User,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface BookingCalendarProps {
  bookings: Booking[];
  staffList: StaffProfile[];
  role: UserRole;
  currentStaffId?: string;
  onSelectBooking: (booking: Booking) => void;
  onCreateBooking?: (prefilledDate?: string) => void;
}

export default function BookingCalendar({
  bookings,
  staffList,
  role,
  currentStaffId,
  onSelectBooking,
  onCreateBooking
}: BookingCalendarProps) {
  const [viewMode, setViewMode] = useState<'month' | 'day' | 'list'>('month');
  const [selectedStaffFilter, setSelectedStaffFilter] = useState<string>('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ALL');
  const [currentYear, setCurrentYear] = useState<number>(2026);
  const [currentMonth, setCurrentMonth] = useState<number>(7); // 0-indexed: 7 = August
  const [selectedDay, setSelectedDay] = useState<number>(17);

  // Month navigation
  const monthNames = [
    '一月 (Jan)', '二月 (Feb)', '三月 (Mar)', '四月 (Apr)',
    '五月 (May)', '六月 (Jun)', '七月 (Jul)', '八月 (Aug)',
    '九月 (Sep)', '十月 (Oct)', '十一月 (Nov)', '十二月 (Dec)'
  ];

  const daysOfWeek = [
    { label: '日 (Sun)', short: '日' },
    { label: '一 (Mon)', short: '一' },
    { label: '二 (Tue)', short: '二' },
    { label: '三 (Wed)', short: '三' },
    { label: '四 (Thu)', short: '四' },
    { label: '五 (Fri)', short: '五' },
    { label: '六 (Sat)', short: '六' }
  ];

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // Filter bookings based on role and active filters
  const filteredBookings = bookings.filter(b => {
    if (role === 'STAFF' && b.assigned_staff_id !== currentStaffId) {
      return false;
    }
    if (selectedStaffFilter !== 'ALL' && b.assigned_staff_id !== selectedStaffFilter) {
      return false;
    }
    if (selectedStatusFilter !== 'ALL' && b.status !== selectedStatusFilter) {
      return false;
    }
    return true;
  });

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'IN_SERVICE': return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
      case 'CONFIRMED': return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'SCHEDULED': return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
      case 'CANCELLED': return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      default: return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'COMPLETED': return '已完成';
      case 'IN_SERVICE': return '進行中';
      case 'CONFIRMED': return '已確認';
      case 'SCHEDULED': return '已預約';
      case 'CANCELLED': return '已取消';
      default: return status;
    }
  };

  // Calculate days for the calendar grid
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();

  // Map bookings to day numbers in the active month
  const getBookingsForDay = (day: number) => {
    return filteredBookings.filter(b => {
      const d = new Date(b.starts_at);
      return d.getFullYear() === currentYear && d.getMonth() === currentMonth && d.getDate() === day;
    });
  };

  // Time slots for Day view (09:00 - 20:00)
  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00', '13:00',
    '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
  ];

  return (
    <div className="space-y-6">
      {/* Top Controls Bar */}
      <div className="glass-card p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Month Selector & View Switcher */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 bg-slate-800/90 p-1 rounded-xl border border-slate-700/60">
            <button
              onClick={() => setViewMode('month')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'month' ? 'gradient-bg text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              按月日曆 (Month Grid)
            </button>
            <button
              onClick={() => setViewMode('day')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'day' ? 'gradient-bg text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              單日時段 (Day Timeline)
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'list' ? 'gradient-bg text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              列表檢視 (List View)
            </button>
          </div>

          {/* Month Navigation */}
          <div className="flex items-center gap-2 bg-slate-800/80 border border-slate-700/60 rounded-xl px-2.5 py-1 text-xs">
            <button onClick={handlePrevMonth} className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-bold text-slate-100 min-w-[100px] text-center">
              {currentYear}年 {monthNames[currentMonth]}
            </span>
            <button onClick={handleNextMonth} className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2.5">
          {role !== 'STAFF' && (
            <div className="flex items-center gap-1.5 bg-slate-800/80 border border-slate-700/60 rounded-xl px-3 py-1.5">
              <User className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={selectedStaffFilter}
                onChange={(e) => setSelectedStaffFilter(e.target.value)}
                className="bg-transparent text-xs text-slate-200 focus:outline-none cursor-pointer"
              >
                <option value="ALL" className="bg-slate-900">所有美容師 (All Staff)</option>
                {staffList.map((s) => (
                  <option key={s.id} value={s.id} className="bg-slate-900">{s.display_name}</option>
                ))}
              </select>
            </div>
          )}

          <div className="flex items-center gap-1.5 bg-slate-800/80 border border-slate-700/60 rounded-xl px-3 py-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className="bg-transparent text-xs text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-slate-900">所有狀態 (All Status)</option>
              <option value="SCHEDULED" className="bg-slate-900">🔵 已預約 (SCHEDULED)</option>
              <option value="CONFIRMED" className="bg-slate-900">🟡 已確認 (CONFIRMED)</option>
              <option value="IN_SERVICE" className="bg-slate-900">🟣 進行中 (IN SERVICE)</option>
              <option value="COMPLETED" className="bg-slate-900">🟢 已完成 (COMPLETED)</option>
              <option value="CANCELLED" className="bg-slate-900">🔴 已取消 (CANCELLED)</option>
            </select>
          </div>

          {role !== 'STAFF' && onCreateBooking && (
            <button
              onClick={() => onCreateBooking()}
              className="gradient-bg text-white px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md hover:opacity-95"
            >
              <Plus className="w-4 h-4" />
              <span>新增預約</span>
            </button>
          )}
        </div>
      </div>

      {/* VIEWMODE 1: MONTH GRID VIEW (DAY BY DAY) */}
      {viewMode === 'month' && (
        <div className="glass-card p-2 sm:p-4 space-y-2">
          {/* Days of week header */}
          <div className="grid grid-cols-7 gap-1 text-center font-bold text-xs text-slate-400 pb-2 border-b border-slate-700/60">
            {daysOfWeek.map(d => (
              <div key={d.label} className="py-1">
                <span className="hidden sm:inline">{d.label}</span>
                <span className="sm:hidden">{d.short}</span>
              </div>
            ))}
          </div>

          {/* Calendar Grid Cells */}
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
            {/* Blank leading cells */}
            {Array.from({ length: firstDayOfWeek }).map((_, i) => (
              <div key={`blank-${i}`} className="min-h-[90px] sm:min-h-[120px] rounded-xl bg-slate-900/30 border border-slate-800/30 p-1 opacity-30"></div>
            ))}

            {/* Actual Month Days */}
            {Array.from({ length: daysInMonth }).map((_, idx) => {
              const dayNum = idx + 1;
              const dayBookings = getBookingsForDay(dayNum);
              const isSelected = selectedDay === dayNum;

              return (
                <div
                  key={`day-${dayNum}`}
                  onClick={() => setSelectedDay(dayNum)}
                  className={`min-h-[95px] sm:min-h-[125px] rounded-xl p-1.5 sm:p-2 border flex flex-col justify-between transition-all duration-200 relative group cursor-pointer ${
                    isSelected
                      ? 'bg-slate-800/90 border-indigo-500/80 shadow-lg ring-1 ring-indigo-500/50'
                      : 'bg-slate-900/70 border-slate-800/80 hover:border-slate-700 hover:bg-slate-800/50'
                  }`}
                >
                  {/* Day Number Header */}
                  <div className="flex items-center justify-between">
                    <span className={`text-xs sm:text-sm font-black rounded-lg w-6 h-6 flex items-center justify-center ${
                      dayNum === 17 ? 'gradient-bg text-white shadow-sm' : 'text-slate-200'
                    }`}>
                      {dayNum}
                    </span>

                    {dayBookings.length > 0 ? (
                      <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        {dayBookings.length} 預約
                      </span>
                    ) : (
                      role !== 'STAFF' && onCreateBooking && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onCreateBooking(`${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-${dayNum.toString().padStart(2, '0')}`);
                          }}
                          className="opacity-0 group-hover:opacity-100 p-0.5 text-slate-400 hover:text-indigo-400 rounded transition-opacity"
                          title="在此日期新增預約"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      )
                    )}
                  </div>

                  {/* Day's Booking Badges */}
                  <div className="space-y-1 my-1 overflow-y-auto max-h-[70px] sm:max-h-[85px] pr-0.5 scrollbar-thin">
                    {dayBookings.map((b) => (
                      <div
                        key={b.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectBooking(b);
                        }}
                        className={`p-1 rounded-md text-[9px] sm:text-[10px] font-semibold border flex flex-col hover:scale-[1.02] transition-transform ${getStatusBadgeStyle(b.status)}`}
                      >
                        <div className="flex items-center justify-between leading-tight gap-1">
                          <span className="font-bold truncate">{b.customer_name}</span>
                          <span className="shrink-0 text-[8px] font-extrabold px-1 py-0.2 rounded bg-slate-950/40">
                            {getStatusText(b.status)}
                          </span>
                        </div>
                        <div className="text-[8px] opacity-85 truncate mt-0.5">
                          {new Date(b.starts_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {b.service_name}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Cell Footer */}
                  <div className="text-[8px] text-slate-500 text-right font-mono">
                    {dayBookings.length > 0 ? `${dayBookings.filter(b => b.status === 'COMPLETED').length} 完成` : ''}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEWMODE 2: DAY TIMELINE VIEW */}
      {viewMode === 'day' && (
        <div className="glass-card p-4 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-indigo-400" />
                {currentYear}年 {currentMonth + 1}月 {selectedDay}日 預約日程表 (Day Schedule)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">當日預約時段安排與美容師指派細節</p>
            </div>

            {/* Quick Day Selector */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-400 font-semibold">選擇日期:</span>
              <select
                value={selectedDay}
                onChange={(e) => setSelectedDay(parseInt(e.target.value))}
                className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-100"
              >
                {Array.from({ length: daysInMonth }).map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1} 日 ({getBookingsForDay(i + 1).length}個預約)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Timeline Slots Grid */}
          <div className="space-y-3">
            {timeSlots.map((slot) => {
              const slotBookings = getBookingsForDay(selectedDay).filter(b => {
                const hour = new Date(b.starts_at).getHours();
                const slotHour = parseInt(slot.split(':')[0]);
                return hour === slotHour;
              });

              return (
                <div key={slot} className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
                  <span className="w-14 text-xs font-mono font-bold text-indigo-400 shrink-0 pt-1">{slot}</span>
                  <div className="flex-1 min-h-[40px] flex flex-wrap items-center gap-2">
                    {slotBookings.length === 0 ? (
                      <span className="text-xs text-slate-600 italic">此時段無預約安排 (Available)</span>
                    ) : (
                      slotBookings.map((b) => (
                        <div
                          key={b.id}
                          onClick={() => onSelectBooking(b)}
                          className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-between gap-3 cursor-pointer hover:scale-[1.01] transition-transform ${getStatusBadgeStyle(b.status)}`}
                        >
                          <div>
                            <span className="font-bold text-slate-100">{b.customer_name}</span>
                            <span className="text-slate-300 ml-2">({b.service_name})</span>
                            <span className="text-[10px] text-indigo-300 block mt-0.5">美容師: {b.assigned_staff_name || '未指派'}</span>
                          </div>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-950/60">
                            {getStatusText(b.status)}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEWMODE 3: LIST VIEW */}
      {viewMode === 'list' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBookings.length === 0 ? (
            <div className="col-span-full glass-card p-12 text-center">
              <CalendarIcon className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-300 font-semibold text-sm">未找到符合條件的預約紀錄</p>
            </div>
          ) : (
            filteredBookings.map((b) => (
              <div
                key={b.id}
                onClick={() => onSelectBooking(b)}
                className="glass-card p-5 hover:border-indigo-500/50 cursor-pointer transition-all duration-200 hover:-translate-y-1 relative group"
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <span className="text-[10px] font-mono text-indigo-400 font-semibold">{b.booking_code}</span>
                    <h3 className="font-bold text-base text-slate-100 group-hover:text-indigo-300 transition-colors">
                      {b.customer_name}
                    </h3>
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${getStatusBadgeStyle(b.status)}`}>
                    {getStatusText(b.status)}
                  </span>
                </div>

                <div className="space-y-2 text-xs text-slate-300 mb-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{new Date(b.starts_at).toLocaleDateString()} {new Date(b.starts_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-700/50">
                    <span className="font-medium text-slate-200">{b.service_name}</span>
                    {role !== 'STAFF' && b.price && (
                      <span className="font-bold text-emerald-400">{formatHKD(b.price)}</span>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-700/40 flex items-center justify-between text-[11px] text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-full bg-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-200">
                      {b.assigned_staff_name ? b.assigned_staff_name[0] : 'U'}
                    </div>
                    <span>{b.assigned_staff_name || '未指派'}</span>
                  </div>
                  <span className="text-indigo-400 group-hover:underline">修改/詳情 &rarr;</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
