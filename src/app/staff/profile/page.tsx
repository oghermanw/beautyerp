'use client';

import { User } from 'lucide-react';

export default function StaffProfilePage() {
  return (
    <div className="space-y-6 max-w-xl">
      <div className="glass-card p-6 space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl gradient-bg flex items-center justify-center text-white font-bold text-xl shadow-lg">
            S
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-100">Amy Wong (Staff Technician)</h2>
            <p className="text-xs text-slate-400">amy@aurasalon.com • Code: S000001</p>
            <span className="badge-amber text-[10px] mt-1 inline-block">Senior Facial Technician</span>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-700/50 space-y-2 text-xs text-slate-300">
          <p>• Assigned Skills: Facial Treatment, Hydration Facial, Skin Analysis, Eye Contour</p>
          <p>• Employment Status: Full-Time Active</p>
        </div>
      </div>
    </div>
  );
}
