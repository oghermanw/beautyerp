'use client';

import { useState } from 'react';
import { mockDb } from '@/lib/supabase/mock-db';
import { Product } from '@/lib/types';
import { formatHKD } from '@/lib/money';
import { Package, Plus, ShieldAlert } from 'lucide-react';

export default function AdminInventoryPage() {
  const [products, setProducts] = useState<Product[]>(mockDb.products);
  const [stockInProductId, setStockInProductId] = useState<string>('prd-3');
  const [stockInQty, setStockInQty] = useState<string>('15');
  const [message, setMessage] = useState<string | null>(null);

  const handleStockIn = (e: React.FormEvent) => {
    e.preventDefault();
    const qty = parseFloat(stockInQty);
    const prd = products.find(p => p.id === stockInProductId);

    if (prd) {
      prd.current_stock = (prd.current_stock || 0) + qty;

      mockDb.inventoryMovements.unshift({
        id: `im-in-${Date.now()}`,
        product_id: prd.id,
        product_name: prd.name,
        movement_type: 'STOCK_IN',
        quantity: qty,
        reason: 'ADMIN Stock-In Delivery Arrival',
        created_by: 'u-admin-1',
        created_at: new Date().toISOString()
      });

      setMessage(`Stock-In recorded: +${qty} ${prd.base_unit} of ${prd.name}.`);
      setProducts([...mockDb.products]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="glass-card p-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-100">Operational Inventory Management</h2>
          <p className="text-xs text-slate-400 mt-1">ADMIN Operational View - Stock Level Tracking & Delivery Arrival</p>
        </div>
      </div>

      <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 flex items-center gap-2">
        <ShieldAlert className="w-4 h-4 text-amber-400" />
        <span>ADMIN Security Boundary: Unit COGS Product Costs hidden.</span>
      </div>

      {message && (
        <div className="p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-xs text-indigo-300">
          {message}
        </div>
      )}

      {/* Stock-In Form (NO COGS Input) */}
      <div className="glass-card p-6 space-y-4">
        <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
          <Plus className="w-4 h-4 text-indigo-400" />
          Record Delivery Stock Arrival
        </h3>

        <form onSubmit={handleStockIn} className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="text-slate-400 block mb-1">Product</label>
            <select
              value={stockInProductId}
              onChange={(e) => setStockInProductId(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-slate-100"
            >
              {products.map(p => (
                <option key={p.id} value={p.id}>{p.name} ({p.sku})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-slate-400 block mb-1">Quantity Arrived</label>
            <input
              type="number"
              value={stockInQty}
              onChange={(e) => setStockInQty(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-slate-100"
              required
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full gradient-bg text-white font-bold py-2.5 rounded-lg text-xs shadow-md hover:opacity-95"
            >
              Record Stock-In
            </button>
          </div>
        </form>
      </div>

      {/* Inventory Roster Table (NO COGS Column) */}
      <div className="glass-card p-6 overflow-x-auto">
        <h3 className="font-bold text-slate-100 text-sm mb-4">Current Salon Stock Quantities</h3>
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-800/80 text-slate-400 uppercase text-[10px]">
            <tr>
              <th className="p-3">SKU</th>
              <th className="p-3">Product Name</th>
              <th className="p-3">Type</th>
              <th className="p-3">Current Stock</th>
              <th className="p-3">Retail Price</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {products.map((p) => {
              const stock = p.current_stock || 0;
              const isLow = stock <= p.low_stock_threshold;
              return (
                <tr key={p.id} className="hover:bg-slate-800/40">
                  <td className="p-3 font-mono font-bold text-indigo-400">{p.sku}</td>
                  <td className="p-3 font-semibold text-slate-100">{p.name}</td>
                  <td className="p-3"><span className="badge-purple text-[10px]">{p.product_type}</span></td>
                  <td className="p-3 font-bold text-slate-100">{stock} {p.base_unit}</td>
                  <td className="p-3 font-bold text-emerald-400">{formatHKD(p.selling_price)}</td>
                  <td className="p-3">
                    {isLow ? (
                      <span className="badge-rose text-[10px] font-bold">LOW STOCK</span>
                    ) : (
                      <span className="badge-emerald text-[10px] font-bold">OK</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
