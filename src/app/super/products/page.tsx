'use client';

import { useState } from 'react';
import { mockDb } from '@/lib/supabase/mock-db';
import { formatHKD } from '@/lib/money';
import { ShoppingBag, Plus } from 'lucide-react';

export default function SuperProductsPage() {
  const [products] = useState(mockDb.products);

  return (
    <div className="space-y-6">
      <div className="glass-card p-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-100">Products & Skincare Catalog</h2>
          <p className="text-xs text-slate-400 mt-1">SUPER Access - Retail & Consumable Catalog with Unit Costs</p>
        </div>
      </div>

      <div className="glass-card p-6 overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-800/80 text-slate-400 uppercase text-[10px]">
            <tr>
              <th className="p-3">SKU</th>
              <th className="p-3">Product Name</th>
              <th className="p-3">Category</th>
              <th className="p-3">Type</th>
              <th className="p-3">Selling Price</th>
              <th className="p-3">Unit Cost (COGS)</th>
              <th className="p-3">Margin</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {products.map((p) => {
              const cost = mockDb.productCosts[p.id] || 45;
              const margin = p.selling_price - cost;
              return (
                <tr key={p.id} className="hover:bg-slate-800/40">
                  <td className="p-3 font-mono font-bold text-indigo-400">{p.sku}</td>
                  <td className="p-3 font-semibold text-slate-100">{p.name}</td>
                  <td className="p-3 text-slate-400">{p.category_name}</td>
                  <td className="p-3"><span className="badge-purple text-[10px]">{p.product_type}</span></td>
                  <td className="p-3 font-bold text-emerald-400">{formatHKD(p.selling_price)}</td>
                  <td className="p-3 font-bold text-rose-300">{formatHKD(cost)}</td>
                  <td className="p-3 font-bold text-indigo-300">+{formatHKD(margin)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
