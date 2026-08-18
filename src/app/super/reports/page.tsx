'use client';

import { FileSpreadsheet, Download } from 'lucide-react';

export default function SuperReportsPage() {
  return (
    <div className="space-y-6">
      <div className="glass-card p-6">
        <h2 className="text-xl font-bold text-slate-100">Salon Financial & Operational Reports</h2>
        <p className="text-xs text-slate-400 mt-1">SUPER Exclusive - Automated Business Intelligence & P&L Statement Summaries</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 space-y-3">
          <FileSpreadsheet className="w-8 h-8 text-indigo-400" />
          <h3 className="font-bold text-slate-100 text-sm">P&L Profitability Report</h3>
          <p className="text-xs text-slate-400">Monthly profit & loss statement breakdown with COGS and operating expenses.</p>
          <button className="gradient-bg text-white px-4 py-2 rounded-lg text-xs font-bold w-full">Generate P&L Report</button>
        </div>

        <div className="glass-card p-6 space-y-3">
          <FileSpreadsheet className="w-8 h-8 text-emerald-400" />
          <h3 className="font-bold text-slate-100 text-sm">Staff Sales & Commission Report</h3>
          <p className="text-xs text-slate-400">Technician productivity, product retail commission, and booking counts.</p>
          <button className="gradient-bg text-white px-4 py-2 rounded-lg text-xs font-bold w-full">Generate Staff Report</button>
        </div>

        <div className="glass-card p-6 space-y-3">
          <FileSpreadsheet className="w-8 h-8 text-purple-400" />
          <h3 className="font-bold text-slate-100 text-sm">Inventory COGS Valuation Report</h3>
          <p className="text-xs text-slate-400">Current stock valuation, facial consumable recipe usage rate, and low-stock alerts.</p>
          <button className="gradient-bg text-white px-4 py-2 rounded-lg text-xs font-bold w-full">Generate Inventory Report</button>
        </div>
      </div>
    </div>
  );
}
