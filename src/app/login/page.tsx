'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserRole } from '@/lib/types';
import { Sparkles, Lock, Mail, ShieldCheck, ArrowRight } from 'lucide-react';
import ThemeToggle from '@/components/common/ThemeToggle';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('super@beauty.com');
  const [password, setPassword] = useState('password123');
  const [selectedRole, setSelectedRole] = useState<UserRole>('SUPER');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    let displayName = 'SUPER Owner';
    let staffId: string | null = null;

    if (selectedRole === 'ADMIN') {
      displayName = 'ADMIN Manager';
    } else if (selectedRole === 'STAFF') {
      displayName = 'Amy Wong';
      staffId = 's-001';
    }

    const sessionPayload = {
      id: selectedRole === 'SUPER' ? 'u-super-1' : selectedRole === 'ADMIN' ? 'u-admin-1' : 'u-staff-1',
      email,
      role: selectedRole,
      displayName,
      staffId,
      status: 'ACTIVE'
    };

    // Store cookie with encodeURIComponent to prevent HTTP header mangling
    document.cookie = `salon_session=${encodeURIComponent(JSON.stringify(sessionPayload))}; Path=/; SameSite=Lax; Max-Age=86400`;

    setTimeout(() => {
      setLoading(false);
      if (selectedRole === 'SUPER') {
        router.push('/super/dashboard');
      } else if (selectedRole === 'ADMIN') {
        router.push('/admin/dashboard');
      } else {
        router.push('/staff/dashboard');
      }
      router.refresh();
    }, 300);
  };

  const setRoleDemo = (role: UserRole) => {
    setSelectedRole(role);
    if (role === 'SUPER') {
      setEmail('super@beauty.com');
    } else if (role === 'ADMIN') {
      setEmail('admin1@beauty.com');
    } else {
      setEmail('amy@beauty.com');
    }
  };

  const getRoleBadge = (role: UserRole) => {
    if (role === 'SUPER') return 'SUPER 總監';
    if (role === 'ADMIN') return 'ADMIN 經理';
    return 'STAFF 美容師';
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Top Header Theme Toggle */}
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
      </div>

      {/* Background Decorative Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 md:w-96 h-80 md:h-96 bg-indigo-600/20 blur-[100px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-64 md:w-80 h-64 md:h-80 bg-purple-600/15 blur-[90px] rounded-full pointer-events-none"></div>

      <div className="w-full max-w-sm sm:max-w-md space-y-5 sm:space-y-6 relative z-10">
        {/* Brand Logo Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl gradient-bg mx-auto flex items-center justify-center text-white shadow-xl shadow-indigo-500/30">
            <Sparkles className="w-6 h-6 sm:w-8 sm:h-8" />
          </div>
          <div>
            <h1 className="text-lg sm:text-2xl font-black tracking-tight text-white gradient-text">Aura 美容院管理系統</h1>
            <p className="text-xs text-slate-400 mt-0.5">Enterprise Salon System MVP v4 (HKD 港幣版)</p>
          </div>
        </div>

        {/* Quick Demo Role Selector */}
        <div className="glass-card p-3 sm:p-4 space-y-2">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block text-center">
            選擇權限身份快捷測試 / Select Role Demo
          </span>
          <div className="grid grid-cols-3 gap-2">
            {(['SUPER', 'ADMIN', 'STAFF'] as const).map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => setRoleDemo(role)}
                className={`py-3 px-1 rounded-xl text-xs font-bold transition-all text-center flex flex-col items-center justify-center cursor-pointer min-h-[44px] ${
                  selectedRole === role
                    ? 'gradient-bg text-white shadow-md shadow-indigo-500/30 border border-indigo-400/30 scale-105'
                    : 'bg-slate-800/90 text-slate-300 hover:text-white border border-slate-700/60'
                }`}
              >
                <span>{getRoleBadge(role)}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="glass-card p-5 sm:p-6 space-y-4">
          <div className="space-y-3 sm:space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">電郵帳號 / Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-slate-900/80 border border-slate-700/80 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">登入密碼 / Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-slate-900/80 border border-slate-700/80 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full gradient-bg text-white font-bold py-3.5 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25 hover:opacity-95 transition-opacity disabled:opacity-50 cursor-pointer min-h-[44px]"
          >
            <span>{loading ? '驗證身份中...' : `以 ${getRoleBadge(selectedRole)} 身份登入`}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-[11px] text-slate-500 flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>三級權限控制 (SUPER / ADMIN / STAFF) 已生效</span>
        </div>
      </div>
    </div>
  );
}
