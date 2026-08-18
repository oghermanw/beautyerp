'use client';

import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const savedTheme = localStorage.getItem('salon_theme') as 'dark' | 'light' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      if (savedTheme === 'light') {
        document.documentElement.classList.add('light');
      } else {
        document.documentElement.classList.remove('light');
      }
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('salon_theme', nextTheme);
    if (nextTheme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  };

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-xs font-semibold text-slate-200 hover:text-white transition-all shadow-sm cursor-pointer"
      title="切換 深色(Black) / 淺色(White) 主題"
    >
      {theme === 'dark' ? (
        <>
          <Moon className="w-3.5 h-3.5 text-indigo-400" />
          <span className="text-[11px]">黑夜 (Black)</span>
        </>
      ) : (
        <>
          <Sun className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-[11px]">白亮 (White)</span>
        </>
      )}
    </button>
  );
}
