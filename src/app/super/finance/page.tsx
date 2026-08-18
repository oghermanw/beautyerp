'use client';

import { useState } from 'react';
import { mockDb } from '@/lib/supabase/mock-db';
import { formatHKD } from '@/lib/money';
import Link from 'next/link';
import { TrendingUp, Plus, FileSpreadsheet } from 'lucide-react';

export default function SuperFinancePage() {
  const [expenses, setExpenses] = useState(mockDb.expenses);
  const [expenseDate, setExpenseDate] = useState('2026-08-16');
  const [category, setCategory] = useState('Utilities');
  const [description, setDescription] = useState('Salon Cleaning Supplies');
  const [amount, setAmount] = useState('1200');

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const newExp = {
      id: `exp-${Date.now()}`,
      expense_date: expenseDate,
      category,
      description,
      amount: parseFloat(amount),
      vendor: 'Supplier Co',
      affects_profit: true,
      created_at: new Date().toISOString()
    };
    mockDb.expenses.unshift(newExp);
    setExpenses([...mockDb.expenses]);
  };

  return (
    <div className="space-y-6">
      <div className="glass-card p-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-100">Financial Operating Ledger & Expenses</h2>
          <p className="text-xs text-slate-400 mt-1">SUPER Exclusive - Operating Expense Input & Profit Ledger</p>
        </div>

        <Link
          href="/super/finance/history"
          className="gradient-bg text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2"
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Historical Finance & CSV Import</span>
        </Link>
      </div>

      {/* Add Expense Form (Section 58) */}
      <div className="glass-card p-6 space-y-4">
        <h3 className="font-bold text-slate-100 text-sm">Add Salon Operating Expense</h3>
        <form onSubmit={handleAddExpense} className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="text-slate-400 block mb-1">Expense Date</label>
            <input
              type="date"
              value={expenseDate}
              onChange={(e) => setExpenseDate(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-slate-100"
              required
            />
          </div>

          <div>
            <label className="text-slate-400 block mb-1">Category</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-slate-100"
              required
            />
          </div>

          <div>
            <label className="text-slate-400 block mb-1">Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-slate-100"
              required
            />
          </div>

          <div>
            <label className="text-slate-400 block mb-1">Amount (HKD)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-slate-100"
              required
            />
          </div>

          <div className="col-span-full flex justify-end">
            <button type="submit" className="gradient-bg text-white px-5 py-2 rounded-lg text-xs font-bold">
              Record Expense
            </button>
          </div>
        </form>
      </div>

      {/* Expenses Table */}
      <div className="glass-card p-6 overflow-x-auto">
        <h3 className="font-bold text-slate-100 text-sm mb-4">Expenses Ledger</h3>
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-800/80 text-slate-400 uppercase text-[10px]">
            <tr>
              <th className="p-3">Date</th>
              <th className="p-3">Category</th>
              <th className="p-3">Description</th>
              <th className="p-3">Vendor</th>
              <th className="p-3">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {expenses.map((e) => (
              <tr key={e.id} className="hover:bg-slate-800/40">
                <td className="p-3 font-mono text-slate-400">{e.expense_date}</td>
                <td className="p-3 font-semibold text-slate-100">{e.category}</td>
                <td className="p-3">{e.description}</td>
                <td className="p-3 text-slate-400">{e.vendor || 'N/A'}</td>
                <td className="p-3 font-bold text-rose-400">{formatHKD(e.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
