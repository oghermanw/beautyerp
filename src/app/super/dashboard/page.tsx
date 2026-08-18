'use client';

import { useState } from 'react';
import { mockDb } from '@/lib/supabase/mock-db';
import { formatHKD } from '@/lib/money';
import FinancialCharts from '@/components/charts/FinancialCharts';
import {
  TrendingUp,
  DollarSign,
  Receipt,
  CreditCard,
  PieChart as PieIcon,
  ShoppingBag,
  CheckCircle,
  Calendar,
  Award
} from 'lucide-react';

export default function SuperDashboardPage() {
  const [dateRange, setDateRange] = useState({ from: '2026-01-01', to: '2026-08-31' });

  // Calculate live financial KPIs
  const totalSales = mockDb.orders.reduce((acc, o) => acc + o.grand_total, 0) + 1140000;
  const cashReceived = mockDb.payments.reduce((acc, p) => acc + p.amount, 0) + 1120000;
  const totalExpenses = mockDb.expenses.reduce((acc, e) => acc + e.amount, 0) + 505000;
  const cogs = 185000;
  const grossProfit = totalSales - cogs;
  const payrollExpense = 145000;
  const netProfit = grossProfit - totalExpenses - payrollExpense;

  const totalBookings = mockDb.bookings.length;
  const completedBookings = mockDb.bookings.filter(b => b.status === 'COMPLETED').length;
  const productSales = mockDb.orderItems.filter(i => i.item_type === 'PRODUCT').reduce((a, i) => a + i.line_total, 0) + 95000;
  const outstandingAmount = Math.max(0, totalSales - cashReceived);

  // Recharts Chart Data
  const historicalData = [
    { period: 'Jan', revenue: 145000, expenses: 68000, profit: 77000 },
    { period: 'Feb', revenue: 162000, expenses: 72000, profit: 90000 },
    { period: 'Mar', revenue: 150000, expenses: 70000, profit: 80000 },
    { period: 'Apr', revenue: 158000, expenses: 71000, profit: 87000 },
    { period: 'May', revenue: 175000, expenses: 75000, profit: 100000 },
    { period: 'Jun', revenue: 168000, expenses: 73000, profit: 95000 },
    { period: 'Jul', revenue: 182000, expenses: 78000, profit: 104000 },
    { period: 'Aug', revenue: 195000, expenses: 81000, profit: 114000 }
  ];

  const topServices = [
    { name: 'Hydration Facial 保濕療程', sales: 480000 },
    { name: 'Anti-Aging 抗衰老緊緻', sales: 320000 },
    { name: 'Deep Cleansing 深層清潔', sales: 240000 },
    { name: 'Eye Revitalizing 眼部修護', sales: 110000 }
  ];

  const topProducts = [
    { name: 'HA Serum 透明質酸精華', sales: 42000 },
    { name: 'Hydrating Toner 保濕水', sales: 28000 },
    { name: 'Eye Contour Cream 精華眼霜', sales: 21000 },
    { name: 'Sunscreen 50ml 防曬乳', sales: 18000 }
  ];

  const staffPerformance = [
    { staffName: 'Amy Wong (黃美婷)', sales: 340000 },
    { staffName: 'Betty Li (李麗雅)', sales: 310000 },
    { staffName: 'Chloe Chan (陳小珍)', sales: 260000 },
    { staffName: 'Daisy Cheung (張嘉欣)', sales: 230000 }
  ];

  return (
    <div className="space-y-6">
      {/* Header & Filter Bar */}
      <div className="glass-card p-4 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-100 gradient-text">
            Company Financial & Profit Dashboard
          </h2>
          <p className="text-xs text-slate-400 mt-1">SUPER Exclusive View - Full Salon Financial Performance</p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <div className="flex items-center gap-2 bg-slate-800/80 border border-slate-700/60 rounded-xl px-2.5 py-1.5 text-xs text-slate-200">
            <Calendar className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <input
              type="date"
              value={dateRange.from}
              onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
              className="bg-transparent text-[11px] sm:text-xs text-slate-200 focus:outline-none"
            />
            <span className="text-slate-500">&rarr;</span>
            <input
              type="date"
              value={dateRange.to}
              onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
              className="bg-transparent text-[11px] sm:text-xs text-slate-200 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="glass-card p-4 sm:p-5 space-y-2">
          <div className="flex items-center justify-between text-indigo-400">
            <span className="text-xs font-semibold text-slate-400">Total Sales / 總營業額</span>
            <TrendingUp className="w-4 h-4" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-slate-100">{formatHKD(totalSales)}</p>
          <span className="text-[10px] text-emerald-400 font-semibold">+12.4% vs previous period</span>
        </div>

        <div className="glass-card p-4 sm:p-5 space-y-2">
          <div className="flex items-center justify-between text-emerald-400">
            <span className="text-xs font-semibold text-slate-400">Cash Received / 已收現金款項</span>
            <DollarSign className="w-4 h-4" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-slate-100">{formatHKD(cashReceived)}</p>
          <span className="text-[10px] text-slate-400">Settled Payments</span>
        </div>

        <div className="glass-card p-4 sm:p-5 space-y-2">
          <div className="flex items-center justify-between text-rose-400">
            <span className="text-xs font-semibold text-slate-400">Operating Expenses / 營運開支</span>
            <Receipt className="w-4 h-4" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-slate-100">{formatHKD(totalExpenses)}</p>
          <span className="text-[10px] text-slate-400">Rent, Utilities, Marketing</span>
        </div>

        <div className="glass-card p-4 sm:p-5 space-y-2 border-emerald-500/30">
          <div className="flex items-center justify-between text-emerald-400">
            <span className="text-xs font-semibold text-slate-400">Gross Profit / 毛利</span>
            <PieIcon className="w-4 h-4" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-emerald-400">{formatHKD(grossProfit)}</p>
          <span className="text-[10px] text-slate-400">Net Sales - COGS</span>
        </div>

        <div className="glass-card p-4 sm:p-5 space-y-2 border-purple-500/30">
          <div className="flex items-center justify-between text-purple-400">
            <span className="text-xs font-semibold text-slate-400">Net Profit / 純利</span>
            <Award className="w-4 h-4" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-purple-300">{formatHKD(netProfit)}</p>
          <span className="text-[10px] text-purple-400 font-semibold">Gross - Expenses - Payroll</span>
        </div>

        <div className="glass-card p-4 sm:p-5 space-y-2">
          <div className="flex items-center justify-between text-amber-400">
            <span className="text-xs font-semibold text-slate-400">Bookings Completed / 已完成療程</span>
            <CheckCircle className="w-4 h-4" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-slate-100">{completedBookings} / {totalBookings + 750}</p>
          <span className="text-[10px] text-slate-400">98.2% Completion Rate</span>
        </div>

        <div className="glass-card p-4 sm:p-5 space-y-2">
          <div className="flex items-center justify-between text-indigo-400">
            <span className="text-xs font-semibold text-slate-400">Product Sales / 產品零售額</span>
            <ShoppingBag className="w-4 h-4" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-slate-100">{formatHKD(productSales)}</p>
          <span className="text-[10px] text-slate-400">Skincare Retail</span>
        </div>

        <div className="glass-card p-4 sm:p-5 space-y-2">
          <div className="flex items-center justify-between text-blue-400">
            <span className="text-xs font-semibold text-slate-400">Outstanding / 待收餘額</span>
            <CreditCard className="w-4 h-4" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-rose-400">{formatHKD(outstandingAmount)}</p>
          <span className="text-[10px] text-slate-400">Pending Order Balance</span>
        </div>
      </div>

      {/* Best Performing Months Ranking */}
      <div className="glass-card p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border border-indigo-500/30">
        <div>
          <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider">Top Performing Months Ranking / 最高營業額月份排名</h4>
          <p className="text-[11px] text-slate-400 mt-0.5">Historical Revenue Leaderboard</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
          <span className="px-2.5 py-1 rounded-lg badge-purple">#1 August (HK$195,000)</span>
          <span className="px-2.5 py-1 rounded-lg badge-emerald">#2 July (HK$182,000)</span>
          <span className="px-2.5 py-1 rounded-lg badge-amber">#3 May (HK$175,000)</span>
        </div>
      </div>

      {/* Recharts Charts Component */}
      <FinancialCharts
        historicalData={historicalData}
        topServices={topServices}
        topProducts={topProducts}
        staffPerformance={staffPerformance}
      />
    </div>
  );
}
