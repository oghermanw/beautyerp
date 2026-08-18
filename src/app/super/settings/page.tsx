'use client';

import { useState } from 'react';
import { Settings, ShieldCheck, CheckCircle } from 'lucide-react';

export default function SuperSettingsPage() {
  const [liveDate, setLiveDate] = useState('2026-08-01');
  const [appName, setAppName] = useState('Aura Beauty Salon');
  const [currency, setCurrency] = useState('HKD');
  const [message, setMessage] = useState<string | null>(null);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('System settings and Live Date updated successfully.');
  };

  return (
    <div className="space-y-6">
      <div className="glass-card p-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-100">Application Configuration & Live Date Settings</h2>
          <p className="text-xs text-slate-400 mt-1">SUPER Exclusive - System Parameters & Double-Counting Prevention Controls</p>
        </div>
      </div>

      {message && (
        <div className="p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-xs text-indigo-300 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-indigo-400" />
          <span>{message}</span>
        </div>
      )}

      <div className="glass-card p-6 space-y-6 max-w-2xl">
        <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
          <div>
            <label className="text-slate-300 font-semibold block mb-1">System Live Date (Prevent Double-Counting)</label>
            <p className="text-[11px] text-slate-400 mb-2">
              Historical summary records apply before this date. Live transactional sales apply on/after this date.
            </p>
            <input
              type="date"
              value={liveDate}
              onChange={(e) => setLiveDate(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-slate-100"
            />
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">Application Brand Name</label>
            <input
              type="text"
              value={appName}
              onChange={(e) => setAppName(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-slate-100"
            />
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">Operating Currency</label>
            <input
              type="text"
              value={currency}
              disabled
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-slate-400 font-mono"
            />
          </div>

          <button type="submit" className="gradient-bg text-white font-bold px-5 py-2.5 rounded-xl text-xs">
            Save System Settings
          </button>
        </form>
      </div>
    </div>
  );
}
