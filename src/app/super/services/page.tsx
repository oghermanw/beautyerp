'use client';

import { useState } from 'react';
import { mockDb } from '@/lib/supabase/mock-db';
import { formatHKD } from '@/lib/money';
import { Scissors, Sparkles } from 'lucide-react';

export default function SuperServicesPage() {
  const [services] = useState(mockDb.services);
  const recipes = mockDb.serviceRecipes;

  return (
    <div className="space-y-6">
      <div className="glass-card p-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-100">Salon Treatment Services & Consumable Recipes</h2>
          <p className="text-xs text-slate-400 mt-1">SUPER Access - Facial Services Catalog & Automatic Facial Recipe Ingredient Deductions</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card p-6 overflow-x-auto">
          <h3 className="font-bold text-slate-100 text-sm mb-4">Treatment Services Catalog</h3>
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/80 text-slate-400 uppercase text-[10px]">
              <tr>
                <th className="p-3">Code</th>
                <th className="p-3">Service Name</th>
                <th className="p-3">Category</th>
                <th className="p-3">Duration</th>
                <th className="p-3">Base Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {services.map((s) => (
                <tr key={s.id} className="hover:bg-slate-800/40">
                  <td className="p-3 font-mono font-bold text-indigo-400">{s.service_code}</td>
                  <td className="p-3 font-semibold text-slate-100">{s.name}</td>
                  <td className="p-3 text-slate-400">{s.category_name}</td>
                  <td className="p-3">{s.duration_minutes} mins</td>
                  <td className="p-3 font-bold text-emerald-400">{formatHKD(s.base_price)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Recipe Mapping (Section 28) */}
        <div className="glass-card p-6 space-y-4">
          <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            Hydration Facial Recipe Ingredients
          </h3>
          <p className="text-xs text-slate-400">
            Automatic inventory deduction upon completing a Hydration Facial booking:
          </p>

          <div className="space-y-2">
            {recipes.map((r) => (
              <div key={r.id} className="p-3 rounded-lg bg-slate-800/60 border border-slate-700/50 flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-200">{r.product_name}</span>
                <span className="font-bold text-indigo-300">{r.quantity_required} {r.unit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
