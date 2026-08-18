'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserRole } from '@/lib/types';
import {
  LayoutDashboard,
  Calendar,
  Clock,
  Users,
  TrendingUp,
  Package,
  DollarSign,
  User
} from 'lucide-react';

interface MobileNavProps {
  role: UserRole;
}

export default function MobileNav({ role }: MobileNavProps) {
  const pathname = usePathname();

  const getSuperTabs = () => [
    { label: '儀表板', href: '/super/dashboard', icon: LayoutDashboard },
    { label: '預約月曆', href: '/super/calendar', icon: Calendar },
    { label: '預約紀錄', href: '/super/bookings', icon: Clock },
    { label: '顧客管理', href: '/super/customers', icon: Users },
    { label: '財務統計', href: '/super/finance', icon: TrendingUp },
  ];

  const getAdminTabs = () => [
    { label: '儀表板', href: '/admin/dashboard', icon: LayoutDashboard },
    { label: '預約月曆', href: '/admin/calendar', icon: Calendar },
    { label: '預約紀錄', href: '/admin/bookings', icon: Clock },
    { label: '顧客管理', href: '/admin/customers', icon: Users },
    { label: '庫存管理', href: '/admin/inventory', icon: Package },
  ];

  const getStaffTabs = () => [
    { label: '工作台', href: '/staff/dashboard', icon: LayoutDashboard },
    { label: '預約日程', href: '/staff/calendar', icon: Calendar },
    { label: '薪酬提成', href: '/staff/salary', icon: DollarSign },
    { label: '個人檔案', href: '/staff/profile', icon: User },
  ];

  const tabs = role === 'SUPER' ? getSuperTabs() : role === 'ADMIN' ? getAdminTabs() : getStaffTabs();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 border-t border-slate-800/80 backdrop-blur-xl px-1 py-1.5 flex justify-around items-center safe-area-bottom">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = pathname === tab.href;

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`flex flex-col items-center justify-center w-full py-1 rounded-xl transition-all ${
              isActive
                ? 'text-indigo-400 font-bold scale-105'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
            <span className="text-[10px] mt-0.5 leading-none font-medium">{tab.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
