'use client';

import { UserRole } from '@/lib/types';
import { Bell, Search } from 'lucide-react';
import ThemeToggle from '@/components/common/ThemeToggle';

interface HeaderProps {
  title: string;
  role: UserRole;
  userDisplayName?: string;
}

export default function Header({ title, role, userDisplayName }: HeaderProps) {
  return (
    <header className="h-14 sm:h-16 glass-card rounded-none border-b border-slate-800 px-3 sm:px-6 flex items-center justify-between sticky top-0 z-30 bg-slate-900/80 backdrop-blur-md">
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <h1 className="text-xs sm:text-base font-bold text-slate-100 tracking-tight truncate">{title}</h1>
        <span className={`text-[9px] sm:text-xs px-2 py-0.5 rounded-full font-semibold shrink-0 ${
          role === 'SUPER' ? 'badge-purple' : role === 'ADMIN' ? 'badge-emerald' : 'badge-amber'
        }`}>
          {role}
        </span>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Search */}
        <div className="relative hidden md:block w-48 sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="搜尋預約、顧客紀錄 (Search)..."
            className="w-full bg-slate-800/60 border border-slate-700/60 rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        {/* Dark/Light White/Black Theme Switcher */}
        <ThemeToggle />

        {/* Profile Pill */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-700/50">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full gradient-bg flex items-center justify-center text-white text-xs font-bold shadow-md shadow-indigo-500/20 shrink-0">
            {role[0]}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-semibold text-slate-200 leading-tight">{userDisplayName || `${role} User`}</p>
            <p className="text-[10px] text-slate-400 leading-tight">HKD 港幣</p>
          </div>
        </div>
      </div>
    </header>
  );
}
