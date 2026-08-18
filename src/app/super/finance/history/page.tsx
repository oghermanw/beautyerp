'use client';

import { useState } from 'react';
import { mockDb } from '@/lib/supabase/mock-db';
import { formatHKD } from '@/lib/money';
import { FileSpreadsheet, Upload, CheckCircle, AlertCircle } from 'lucide-react';

export default function SuperHistoricalFinancePage() {
  const [history, setHistory] = useState(mockDb.historicalFinance);
  const [date, setDate] = useState('2025-12-01');
  const [revenue, setRevenue] = useState('180000');
  const [expenses, setExpenses] = useState('75000');
  const [note, setNote] = useState('Dec 2025 Holiday peak');
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const handleAddHistorical = (e: React.FormEvent) => {
    e.preventDefault();
    const entry = {
      id: `hf-${Date.now()}`,
      period_type: 'MONTHLY',
      entry_date: date,
      revenue: parseFloat(revenue),
      expenses: parseFloat(expenses),
      note,
      created_at: new Date().toISOString()
    };
    mockDb.historicalFinance.unshift(entry);
    setHistory([...mockDb.historicalFinance]);
  };

  const handleSimulateCSVImport = () => {
    setImportStatus('Validated 12 historical rows successfully. 0 invalid rows.');
    mockDb.auditLogs.unshift({
      id: `aud-imp-${Date.now()}`,
      actor_user_id: 'u-super-1',
      actor_name: 'SUPER Owner',
      action: 'HISTORICAL_CSV_IMPORT',
      entity_type: 'historical_finance',
      new_data: { rowsImported: 12 },
      created_at: new Date().toISOString()
    });
  };

  return (
    <div className="space-y-6">
      <div className="glass-card p-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-100">Historical Financial Data & CSV Import</h2>
          <p className="text-xs text-slate-400 mt-1">SUPER Exclusive - Multi-Year Financial Baseline & CSV Data Ingestion</p>
        </div>
      </div>

      {importStatus && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{importStatus}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* CSV Import Box */}
        <div className="glass-card p-6 space-y-4">
          <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
            <Upload className="w-4 h-4 text-indigo-400" />
            Import Historical CSV
          </h3>
          <p className="text-xs text-slate-400">
            Upload CSV with columns: <code>period_type, entry_date, revenue, expenses, note</code>.
          </p>

          <div className="border-2 border-dashed border-slate-700 hover:border-indigo-500/50 rounded-xl p-6 text-center cursor-pointer transition-colors">
            <FileSpreadsheet className="w-8 h-8 text-slate-500 mx-auto mb-2" />
            <p className="text-xs font-semibold text-slate-300">Click or drag CSV file here</p>
            <p className="text-[10px] text-slate-500 mt-1">Strict validation before import</p>
          </div>

          <button
            onClick={handleSimulateCSVImport}
            className="w-full gradient-bg text-white font-bold py-2.5 rounded-lg text-xs"
          >
            Validate & Import CSV
          </button>
        </div>

        {/* Manual Input Form */}
        <div className="lg:col-span-2 glass-card p-6 space-y-4">
          <h3 className="font-bold text-slate-100 text-sm">Add Historical Monthly Entry</h3>
          <form onSubmit={handleAddHistorical} className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="text-slate-400 block mb-1">Entry Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-slate-100"
                required
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Monthly Revenue (HKD)</label>
              <input
                type="number"
                value={revenue}
                onChange={(e) => setRevenue(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-slate-100"
                required
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Monthly Expenses (HKD)</label>
              <input
                type="number"
                value={expenses}
                onChange={(e) => setExpenses(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-slate-100"
                required
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Note</label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-slate-100"
              />
            </div>

            <div className="col-span-full flex justify-end">
              <button type="submit" className="px-4 py-2 rounded-lg gradient-bg text-white font-bold text-xs">
                Add Entry
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Historical Ledger Table */}
      <div className="glass-card p-6 overflow-x-auto">
        <h3 className="font-bold text-slate-100 text-sm mb-4">Historical Financial Records</h3>
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-800/80 text-slate-400 uppercase text-[10px]">
            <tr>
              <th className="p-3">Period Date</th>
              <th className="p-3">Type</th>
              <th className="p-3">Revenue</th>
              <th className="p-3">Expenses</th>
              <th className="p-3">Net Profit</th>
              <th className="p-3">Note</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {history.map((h) => (
              <tr key={h.id} className="hover:bg-slate-800/40">
                <td className="p-3 font-mono text-slate-400">{h.entry_date}</td>
                <td className="p-3"><span className="badge-purple text-[10px]">{h.period_type}</span></td>
                <td className="p-3 font-bold text-emerald-400">{formatHKD(h.revenue)}</td>
                <td className="p-3 font-bold text-rose-400">{formatHKD(h.expenses)}</td>
                <td className="p-3 font-bold text-indigo-300">{formatHKD(h.revenue - h.expenses)}</td>
                <td className="p-3 text-slate-400">{h.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
