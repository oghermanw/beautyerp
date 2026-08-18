'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { UserRole } from '@/lib/types';
import {
  LayoutDashboard,
  Calendar,
  Users,
  UserCheck,
  DollarSign,
  Package,
  Sparkles,
  Scissors,
  TrendingUp,
  FileSpreadsheet,
  Download,
  UserPlus,
  Settings,
  ShieldCheck,
  LogOut,
  Clock,
  User,
  ShoppingBag
} from 'lucide-react';

interface SidebarProps {
  role: UserRole;
  userDisplayName?: string;
}

export default function Sidebar({ role, userDisplayName }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    document.cookie = 'salon_session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    router.push('/login');
    router.refresh();
  };

  const getSuperNav = () => [
    { label: '儀表板 (Dashboard)', href: '/super/dashboard', icon: LayoutDashboard },
    { label: '預約月曆 (Calendar)', href: '/super/calendar', icon: Calendar },
    { label: '預約管理 (Bookings)', href: '/super/bookings', icon: Clock },
    { label: '顧客管理 (Customers)', href: '/super/customers', icon: Users },
    { label: '員工管理 (Staff)', href: '/super/staff', icon: UserCheck },
    { label: '薪酬計算 (Payroll)', href: '/super/payroll', icon: DollarSign },
    { label: '庫存管理 (Inventory)', href: '/super/inventory', icon: Package },
    { label: '產品管理 (Products)', href: '/super/products', icon: ShoppingBag },
    { label: '療程項目 (Services)', href: '/super/services', icon: Scissors },
    { label: '財務分析 (Finance)', href: '/super/finance', icon: TrendingUp },
    { label: '報表統計 (Reports)', href: '/super/reports', icon: FileSpreadsheet },
    { label: '數據匯出 (Data Export)', href: '/super/data-export', icon: Download },
    { label: '帳號管理 (Users)', href: '/super/users', icon: UserPlus },
    { label: '系統設定 (Settings)', href: '/super/settings', icon: Settings },
    { label: '審計日誌 (Audit Log)', href: '/super/audit', icon: ShieldCheck },
  ];

  const getAdminNav = () => [
    { label: '營運儀表板 (Dashboard)', href: '/admin/dashboard', icon: LayoutDashboard },
    { label: '預約月曆 (Calendar)', href: '/admin/calendar', icon: Calendar },
    { label: '預約管理 (Bookings)', href: '/admin/bookings', icon: Clock },
    { label: '顧客管理 (Customers)', href: '/admin/customers', icon: Users },
    { label: '庫存管理 (Inventory)', href: '/admin/inventory', icon: Package },
    { label: '產品管理 (Products)', href: '/admin/products', icon: ShoppingBag },
    { label: '療程項目 (Services)', href: '/admin/services', icon: Scissors },
    { label: '個人檔案 (My Profile)', href: '/admin/profile', icon: User },
  ];

  const getStaffNav = () => [
    { label: '工作台 (Dashboard)', href: '/staff/dashboard', icon: LayoutDashboard },
    { label: '預約日程 (Calendar)', href: '/staff/calendar', icon: Calendar },
    { label: '薪酬提成 (My Salary)', href: '/staff/salary', icon: DollarSign },
    { label: '個人檔案 (My Profile)', href: '/staff/profile', icon: User },
  ];

  const navItems = role === 'SUPER' ? getSuperNav() : role === 'ADMIN' ? getAdminNav() : getStaffNav();

  return (
    <aside className="hidden md:flex w-64 glass-panel h-screen sticky top-0 flex-col justify-between p-4 z-40 text-slate-200">
      <div>
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-3 py-4 mb-4 border-b border-slate-700/50">
          <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-base leading-tight gradient-text">Aura 美容管理</h1>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                role === 'SUPER' ? 'badge-purple' : role === 'ADMIN' ? 'badge-emerald' : 'badge-amber'
              }`}>
                {role} 權限
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1 overflow-y-auto max-h-[calc(100vh-220px)] pr-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-indigo-600/30 text-white border border-indigo-500/40 shadow-sm shadow-indigo-500/20 translate-x-1 font-bold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 hover:translate-x-0.5'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Footer */}
      <div className="pt-4 border-t border-slate-700/50 space-y-2">
        <div className="px-3 py-2 rounded-lg bg-slate-800/40 border border-slate-700/30">
          <p className="text-xs font-medium text-slate-300 truncate">{userDisplayName || `${role} User`}</p>
          <p className="text-[10px] text-slate-500 truncate">{role.toLowerCase()}@aurasalon.com</p>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 border border-rose-500/20 transition-all duration-200"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>登出系統 (Sign Out)</span>
        </button>
      </div>
    </aside>
  );
}
