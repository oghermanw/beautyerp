'use client';

import { useState } from 'react';
import { generateFullCSVZip, generateExcelWorkbook } from '@/lib/export';
import { Download, FileSpreadsheet, Archive, CheckCircle } from 'lucide-react';

export default function SuperDataExportPage() {
  const [isExporting, setIsExporting] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const handleExportZip = async () => {
    setIsExporting(true);
    setStatus('Generating encrypted full system backup ZIP...');
    try {
      const zipBlob = await generateFullCSVZip('SUPER');
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `AURA_SALON_MIGRATION_BACKUP_${new Date().toISOString().slice(0, 10)}.zip`;
      a.click();
      URL.revokeObjectURL(url);
      setStatus('Export complete! Full CSV ZIP downloaded successfully.');
    } catch (err: any) {
      setStatus(`Export failed: ${err.message}`);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportExcel = async () => {
    setIsExporting(true);
    setStatus('Generating multi-sheet financial workbook...');
    try {
      const buffer = await generateExcelWorkbook('SUPER');
      const blob = new Blob([new Uint8Array(buffer)], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `AURA_SALON_FINANCIAL_WORKBOOK_${new Date().toISOString().slice(0, 10)}.xlsx`;
      a.click();
      URL.revokeObjectURL(url);
      setStatus('Export complete! Multi-sheet Excel workbook downloaded.');
    } catch (err: any) {
      setStatus(`Export failed: ${err.message}`);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="glass-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 gradient-text">Full System Data Export & Backup Center</h2>
          <p className="text-xs text-slate-400 mt-1">SUPER Exclusive - One-Click Migration-Ready Data Export & Multi-Sheet Excel Workbook</p>
        </div>

        <span className="badge-purple font-bold text-xs px-3 py-1">Zero Vendor Lock-In Guaranteed</span>
      </div>

      {status && (
        <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-xs text-indigo-300 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-indigo-400" />
          <span>{status}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Full System CSV ZIP Export */}
        <div className="glass-card p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-indigo-500/20 text-indigo-400">
              <Archive className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-sm">Full System CSV Backup (ZIP)</h3>
              <p className="text-xs text-slate-400">All 33 relational tables exported as standalone CSV files.</p>
            </div>
          </div>

          <div className="text-xs text-slate-400 space-y-1 pl-2 border-l-2 border-indigo-500/40">
            <p>• Includes: Users, Customers, PII, Bookings, Orders, Items, Payments</p>
            <p>• Includes: Staff, Salary Plans, Commissions, Payroll Statements</p>
            <p>• Includes: Inventory, COGS, Expenses, Historical Finance, Audit Logs</p>
          </div>

          <button
            onClick={handleExportZip}
            disabled={isExporting}
            className="w-full gradient-bg text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>Download Complete CSV Package (.zip)</span>
          </button>
        </div>

        {/* Multi-Sheet Excel Workbook Export */}
        <div className="glass-card p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-sm">Multi-Sheet Financial Workbook (.xlsx)</h3>
              <p className="text-xs text-slate-400">Excel workbook formatted for financial analysis and tax accounting.</p>
            </div>
          </div>

          <div className="text-xs text-slate-400 space-y-1 pl-2 border-l-2 border-emerald-500/40">
            <p>• Tab 1: Financial P&L & COGS Ledger</p>
            <p>• Tab 2: Payroll & Staff Compensation</p>
            <p>• Tab 3: Customer CRM & LTV Matrix</p>
            <p>• Tab 4: Inventory Valuation & Movements</p>
          </div>

          <button
            onClick={handleExportExcel}
            disabled={isExporting}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>Download Multi-Sheet Workbook (.xlsx)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
