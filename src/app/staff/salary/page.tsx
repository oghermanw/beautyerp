'use client';

import { useState } from 'react';
import { mockDb } from '@/lib/supabase/mock-db';
import { formatHKD } from '@/lib/money';
import { DollarSign, Award, Sparkles, CheckCircle } from 'lucide-react';

export default function StaffSalaryPage() {
  const staffId = 's-001';
  const statement = mockDb.payrollStatements.find(s => s.staff_id === staffId) || {
    base_salary: 18000,
    worked_hours: 160,
    customer_bonus: 80,
    product_commission: 142,
    manual_bonus: 0,
    net_pay: 18222,
    status: 'APPROVED'
  };

  return (
    <div className="space-y-6">
      <div className="glass-card p-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-100 gradient-text">My Salary & Payroll Breakdown</h2>
          <p className="text-xs text-slate-400 mt-1">STAFF View - Monthly Base Pay, Milestone Bonuses, & Product Commission Earnings</p>
        </div>

        <span className="badge-emerald px-3 py-1 font-bold text-xs">STATUS: {statement.status}</span>
      </div>

      <div className="glass-card p-6 space-y-6 max-w-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-slate-700/60">
          <div>
            <span className="text-xs font-mono text-indigo-400 font-bold">STAFF CODE: S000001</span>
            <h3 className="text-2xl font-black text-slate-100 mt-1">Amy Wong</h3>
            <p className="text-xs text-slate-400">Period: August 2026</p>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-400 uppercase block font-semibold">Total Net Salary</span>
            <span className="text-3xl font-black text-emerald-400">{formatHKD(statement.net_pay)}</span>
          </div>
        </div>

        <div className="space-y-3 text-xs text-slate-300">
          <div className="flex justify-between p-3 rounded-lg bg-slate-800/60 border border-slate-700/50">
            <span>Guaranteed Base Salary</span>
            <span className="font-bold text-slate-100">{formatHKD(statement.base_salary)}</span>
          </div>

          <div className="flex justify-between p-3 rounded-lg bg-slate-800/60 border border-slate-700/50">
            <span>Milestone Customer Bonus ($20 / 5 completed clients)</span>
            <span className="font-bold text-emerald-400">+{formatHKD(statement.customer_bonus)}</span>
          </div>

          <div className="flex justify-between p-3 rounded-lg bg-slate-800/60 border border-slate-700/50">
            <span>Retail Skincare Commission (10%)</span>
            <span className="font-bold text-purple-400">+{formatHKD(statement.product_commission)}</span>
          </div>

          <div className="flex justify-between p-3 rounded-lg bg-slate-800/60 border border-slate-700/50">
            <span>Manual Performance Bonus</span>
            <span className="font-bold text-amber-400">+{formatHKD(statement.manual_bonus)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
