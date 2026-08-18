'use client';

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend
} from 'recharts';
import { formatHKD } from '@/lib/money';

interface FinancialChartsProps {
  historicalData: Array<{ period: string; revenue: number; expenses: number; profit: number }>;
  topServices: Array<{ name: string; sales: number }>;
  topProducts: Array<{ name: string; sales: number }>;
  staffPerformance: Array<{ staffName: string; sales: number }>;
}

const COLORS = ['#6366f1', '#a855f7', '#3b82f6', '#10b981', '#f59e0b', '#ec4899'];

export default function FinancialCharts({
  historicalData,
  topServices,
  topProducts,
  staffPerformance
}: FinancialChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 1. Monthly Revenue & Net Profit Trend */}
      <div className="glass-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-100 text-sm">Monthly Revenue & Profit Trend (HKD)</h3>
          <span className="text-[10px] badge-purple">Recharts Engine</span>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={historicalData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="period" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(val) => `$${val / 1000}k`} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                formatter={(value: any) => [formatHKD(Number(value) || 0)]}
              />
              <Legend wrapperStyle={{ fontSize: '11px', color: '#cbd5e1' }} />
              <Bar dataKey="revenue" fill="#6366f1" radius={[4, 4, 0, 0]} name="Revenue" />
              <Bar dataKey="profit" fill="#10b981" radius={[4, 4, 0, 0]} name="Net Profit" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. Top Performing Services Breakdown */}
      <div className="glass-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-100 text-sm">Top Performing Salon Services</h3>
          <span className="text-[10px] badge-emerald">Service Sales</span>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={topServices}
                dataKey="sales"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                innerRadius={45}
                paddingAngle={4}
                label={({ name, percent }: any) => `${name} (${((percent || 0) * 100).toFixed(0)}%)`}
              >
                {topServices.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                formatter={(value: any) => [formatHKD(Number(value) || 0)]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3. Top Products Retail Performance */}
      <div className="glass-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-100 text-sm">Retail Skincare Product Sales</h3>
          <span className="text-[10px] badge-amber">Product Revenue</span>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topProducts} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis type="number" stroke="#94a3b8" fontSize={11} tickFormatter={(val) => `$${val}`} />
              <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={11} width={120} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                formatter={(value: any) => [formatHKD(Number(value) || 0)]}
              />
              <Bar dataKey="sales" fill="#a855f7" radius={[0, 4, 4, 0]} name="Product Sales" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 4. Staff Performance & Sales Attribution */}
      <div className="glass-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-100 text-sm">Staff Sales Attribution</h3>
          <span className="text-[10px] badge-purple">Technicians</span>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={staffPerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="staffName" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(val) => `$${val}`} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                formatter={(value: any) => [formatHKD(Number(value) || 0)]}
              />
              <Bar dataKey="sales" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Total Attributed Sales" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
