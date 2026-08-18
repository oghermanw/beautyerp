'use client';

import { useState } from 'react';
import { mockDb } from '@/lib/supabase/mock-db';
import { PayrollPeriod, PayrollStatement } from '@/lib/types';
import { formatHKD } from '@/lib/money';
import { DollarSign, Lock, Unlock, CheckCircle, Plus, ShieldCheck } from 'lucide-react';

export default function SuperPayrollPage() {
  const [periods, setPeriods] = useState<PayrollPeriod[]>(mockDb.payrollPeriods);
  const [selectedPeriodId, setSelectedPeriodId] = useState<string>('pp-202608');
  const [statements, setStatements] = useState<PayrollStatement[]>(mockDb.payrollStatements);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const selectedPeriod = periods.find(p => p.id === selectedPeriodId) || periods[0];

  const handleLockPayroll = () => {
    if (selectedPeriod.status === 'LOCKED') {
      setActionMessage('Payroll period is already LOCKED.');
      return;
    }

    selectedPeriod.status = 'LOCKED';
    statements.forEach(s => s.status = 'LOCKED');

    mockDb.auditLogs.unshift({
      id: `aud-lock-${Date.now()}`,
      actor_user_id: 'u-super-1',
      actor_name: 'SUPER Owner',
      action: 'LOCK_PAYROLL_PERIOD',
      entity_type: 'payroll_periods',
      entity_id: selectedPeriod.id,
      new_data: { status: 'LOCKED' },
      created_at: new Date().toISOString()
    });

    setActionMessage(`Payroll period ${selectedPeriod.period_name} has been LOCKED. Historical values frozen.`);
    setPeriods([...mockDb.payrollPeriods]);
  };

  const handleAddManualBonus = (staffId: string) => {
    const statement = statements.find(s => s.staff_id === staffId);
    if (statement) {
      if (selectedPeriod.status === 'LOCKED') {
        setActionMessage('Cannot modify locked payroll period!');
        return;
      }
      statement.manual_bonus += 100;
      statement.net_pay += 100;
      setActionMessage(`Added $100 manual bonus to statement.`);
      setStatements([...mockDb.payrollStatements]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="glass-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 gradient-text">Salon Payroll & Compensation Engine</h2>
          <p className="text-xs text-slate-400 mt-1">SUPER Exclusive - Monthly Payroll Processing, Lock Controls, & Audit Logged Statements</p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedPeriodId}
            onChange={(e) => setSelectedPeriodId(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-xs text-slate-100 font-bold focus:outline-none"
          >
            {periods.map(p => (
              <option key={p.id} value={p.id}>{p.period_name} ({p.status})</option>
            ))}
          </select>

          <button
            onClick={handleLockPayroll}
            disabled={selectedPeriod.status === 'LOCKED'}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              selectedPeriod.status === 'LOCKED'
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'gradient-bg text-white shadow-lg shadow-indigo-500/30 hover:opacity-95'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>{selectedPeriod.status === 'LOCKED' ? 'Payroll Period Locked' : 'Lock Payroll Period'}</span>
          </button>
        </div>
      </div>

      {actionMessage && (
        <div className="p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-xs text-indigo-300 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-indigo-400" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Payroll Table */}
      <div className="glass-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-100 text-sm">Staff Salary Statements - {selectedPeriod.period_name}</h3>
          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
            selectedPeriod.status === 'LOCKED' ? 'badge-rose' : 'badge-emerald'
          }`}>
            STATUS: {selectedPeriod.status}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/80 text-slate-400 uppercase text-[10px]">
              <tr>
                <th className="p-3">Staff Code</th>
                <th className="p-3">Name</th>
                <th className="p-3">Base Salary</th>
                <th className="p-3">Worked Hours</th>
                <th className="p-3">Customer Bonus</th>
                <th className="p-3">Product Comm</th>
                <th className="p-3">Manual Bonus</th>
                <th className="p-3">Net Pay</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {statements.map((s) => (
                <tr key={s.id} className="hover:bg-slate-800/40">
                  <td className="p-3 font-mono font-bold text-indigo-400">{s.staff_code}</td>
                  <td className="p-3 font-semibold text-slate-100">{s.staff_name}</td>
                  <td className="p-3">{formatHKD(s.base_salary)}</td>
                  <td className="p-3">{s.worked_hours} hrs</td>
                  <td className="p-3 text-emerald-400">+{formatHKD(s.customer_bonus)}</td>
                  <td className="p-3 text-purple-400">+{formatHKD(s.product_commission)}</td>
                  <td className="p-3 text-amber-400">+{formatHKD(s.manual_bonus)}</td>
                  <td className="p-3 font-bold text-base text-emerald-400">{formatHKD(s.net_pay)}</td>
                  <td className="p-3">
                    <button
                      onClick={() => handleAddManualBonus(s.staff_id)}
                      disabled={selectedPeriod.status === 'LOCKED'}
                      className="px-2.5 py-1 rounded-md bg-amber-500/20 text-amber-300 text-[10px] font-semibold hover:bg-amber-500/30 disabled:opacity-40"
                    >
                      + $100 Bonus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
