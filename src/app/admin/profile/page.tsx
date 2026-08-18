'use client';

import { User } from 'lucide-react';

export default function AdminProfilePage() {
  return (
    <div className="space-y-6 max-w-xl">
      <div className="glass-card p-6 space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl gradient-bg flex items-center justify-center text-white font-bold text-xl shadow-lg">
            A
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-100">Operational Manager (ADMIN)</h2>
            <p className="text-xs text-slate-400">admin1@aurasalon.com</p>
            <span className="badge-emerald text-[10px] mt-1 inline-block">Active Operational Role</span>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-700/50 space-y-2 text-xs text-slate-300">
          <p>• Allowed Permissions: View/Create Bookings, View/Create Customer Profiles, Stock Quantities, Stock-In Arrival.</p>
          <p className="text-rose-400">• Restricted Permissions: Payroll, Salary Plans, COGS, Profit, Financial Dashboards, Audit Logs, Full System Export.</p>
        </div>
      </div>
    </div>
  );
}
