'use client';

import { useState } from 'react';
import { mockDb } from '@/lib/supabase/mock-db';
import { StaffProfile, StaffCompensationPlan } from '@/lib/types';
import { formatHKD } from '@/lib/money';
import { UserCheck, DollarSign, Plus, Edit, ShieldAlert, Award, Sparkles } from 'lucide-react';

export default function SuperStaffPage() {
  const [staffList, setStaffList] = useState<StaffProfile[]>(mockDb.staffProfiles);
  const [selectedStaff, setSelectedStaff] = useState<StaffProfile>(mockDb.staffProfiles[0]);
  const [adminComment, setAdminComment] = useState<string>(selectedStaff.admin_comment || '');

  // Compensation Plan state
  const compPlan = mockDb.compensationPlans.find(cp => cp.staff_id === selectedStaff.id) || {
    salary_type: 'MONTHLY',
    base_salary: 18000,
    hourly_rate: 0
  };

  const [baseSalary, setBaseSalary] = useState<string>(compPlan.base_salary.toString());
  const [hourlyRate, setHourlyRate] = useState<string>(compPlan.hourly_rate.toString());
  const [message, setMessage] = useState<string | null>(null);

  const handleSaveAdminComment = () => {
    selectedStaff.admin_comment = adminComment;
    setMessage('Confidential Admin Comment updated.');
  };

  const handleSaveCompensation = () => {
    let existing = mockDb.compensationPlans.find(cp => cp.staff_id === selectedStaff.id);
    if (!existing) {
      existing = {
        id: `cp-${Date.now()}`,
        staff_id: selectedStaff.id,
        salary_type: 'MONTHLY',
        base_salary: parseFloat(baseSalary),
        hourly_rate: parseFloat(hourlyRate),
        effective_from: new Date().toISOString().split('T')[0],
        active: true,
        created_at: new Date().toISOString()
      };
      mockDb.compensationPlans.push(existing);
    } else {
      existing.base_salary = parseFloat(baseSalary);
      existing.hourly_rate = parseFloat(hourlyRate);
    }

    mockDb.auditLogs.unshift({
      id: `aud-sal-${Date.now()}`,
      actor_user_id: 'u-super-1',
      actor_name: 'SUPER Owner',
      action: 'UPDATE_STAFF_SALARY_PLAN',
      entity_type: 'staff_compensation_plans',
      entity_id: selectedStaff.id,
      new_data: { base_salary: parseFloat(baseSalary), hourly_rate: parseFloat(hourlyRate) },
      created_at: new Date().toISOString()
    });

    setMessage(`Compensation plan for ${selectedStaff.display_name} updated successfully.`);
  };

  return (
    <div className="space-y-6">
      <div className="glass-card p-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-100">Staff Profiles & Compensation Management</h2>
          <p className="text-xs text-slate-400 mt-1">SUPER Exclusive View - Configure Salary Plans, Bonus Rules, & Confidential Comments</p>
        </div>
      </div>

      {message && (
        <div className="p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-xs text-indigo-300">
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Staff List */}
        <div className="glass-card p-4 space-y-2">
          <span className="text-[10px] uppercase font-bold text-slate-400 block px-2 mb-2">Staff Roster ({staffList.length})</span>
          {staffList.map((s) => (
            <div
              key={s.id}
              onClick={() => {
                setSelectedStaff(s);
                setAdminComment(s.admin_comment || '');
                const plan = mockDb.compensationPlans.find(cp => cp.staff_id === s.id);
                if (plan) {
                  setBaseSalary(plan.base_salary.toString());
                  setHourlyRate(plan.hourly_rate.toString());
                }
              }}
              className={`p-3 rounded-xl cursor-pointer transition-all ${
                selectedStaff.id === s.id
                  ? 'bg-indigo-600/30 border border-indigo-500/50 shadow-md'
                  : 'bg-slate-800/40 hover:bg-slate-800/80 border border-slate-700/30'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-indigo-400 font-bold">{s.staff_code}</span>
                <span className="text-[10px] badge-emerald">{s.employment_status}</span>
              </div>
              <p className="font-bold text-sm text-slate-100 mt-1">{s.display_name}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">{s.skills?.join(', ')}</p>
            </div>
          ))}
        </div>

        {/* Selected Staff Salary Config */}
        <div className="lg:col-span-2 glass-card p-6 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-700/60">
            <div>
              <span className="text-xs font-mono text-indigo-400 font-bold">{selectedStaff.staff_code}</span>
              <h2 className="text-2xl font-black text-slate-100 mt-1">{selectedStaff.display_name}</h2>
              <p className="text-xs text-slate-400">Joined {selectedStaff.join_date} • {selectedStaff.residential_area}</p>
            </div>
            <span className="badge-purple text-xs px-3 py-1 font-bold">Active Employee</span>
          </div>

          {/* Confidential Comment (SUPER ONLY - Section 16) */}
          <div className="glass-card p-4 space-y-3 border-purple-500/30">
            <h4 className="text-xs font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-purple-400" />
              Confidential Boss/Admin Comment (SUPER ONLY - Hidden from ADMIN & STAFF)
            </h4>
            <textarea
              value={adminComment}
              onChange={(e) => setAdminComment(e.target.value)}
              placeholder="Enter confidential owner comments..."
              className="w-full h-20 bg-slate-800 border border-slate-700 rounded-lg p-3 text-xs text-slate-200 focus:outline-none"
            />
            <button
              onClick={handleSaveAdminComment}
              className="px-3 py-1.5 rounded-lg bg-purple-600 text-white text-xs font-semibold hover:bg-purple-500 transition-colors"
            >
              Save Confidential Comment
            </button>
          </div>

          {/* Salary & Compensation Settings (SUPER ONLY - Section 4 & 46) */}
          <div className="glass-card p-4 space-y-4">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              Salary & Compensation Rules Configuration
            </h4>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Monthly Base Salary (HKD)</label>
                <input
                  type="number"
                  value={baseSalary}
                  onChange={(e) => setBaseSalary(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-100"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Hourly Wage Rate (HKD)</label>
                <input
                  type="number"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-100"
                />
              </div>
            </div>

            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 space-y-1">
              <p className="font-bold flex items-center gap-1">
                <Award className="w-3.5 h-3.5" /> Bonus & Commission Rules
              </p>
              <p>• Milestone Customer Bonus: $20.00 for every 5 completed customers</p>
              <p>• Retail Skincare Commission: 10% on products sold</p>
            </div>

            <button
              onClick={handleSaveCompensation}
              className="px-4 py-2 rounded-lg gradient-bg text-white text-xs font-bold shadow-md hover:opacity-95 transition-opacity"
            >
              Save Compensation Plan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
