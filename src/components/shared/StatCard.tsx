import type { ReactNode } from 'react';
import { useTheme } from '@/context/ThemeContext';

interface StatCardProps {
  label: string;
  value: ReactNode;
  icon?: ReactNode;
  accent?: 'blue' | 'green' | 'amber' | 'red' | 'purple' | 'teal';
  sublabel?: string;
}

const accentClasses: Record<string, { bg: string; text: string; border: string }> = {
  blue: { bg: 'bg-blue-500/10', text: 'text-blue-500', border: 'border-blue-500/20' },
  green: { bg: 'bg-emerald-500/10', text: 'text-emerald-500', border: 'border-emerald-500/20' },
  amber: { bg: 'bg-amber-500/10', text: 'text-amber-500', border: 'border-amber-500/20' },
  red: { bg: 'bg-red-500/10', text: 'text-red-500', border: 'border-red-500/20' },
  purple: { bg: 'bg-violet-500/10', text: 'text-violet-500', border: 'border-violet-500/20' },
  teal: { bg: 'bg-teal-500/10', text: 'text-teal-500', border: 'border-teal-500/20' },
};

export function StatCard({ label, value, icon, accent = 'blue', sublabel }: StatCardProps) {
  const { theme } = useTheme();
  const a = accentClasses[accent];
  return (
    <div
      className={`rounded-xl border p-4 transition-all hover:scale-[1.02] hover:shadow-md ${
        theme === 'dark'
          ? 'bg-gray-900/60 border-gray-800'
          : 'bg-white border-gray-200'
      } ${a.border}`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className={`text-xs font-medium uppercase tracking-wide ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
          {label}
        </span>
        {icon && <span className={`${a.text} ${a.bg} rounded-lg p-1.5`}>{icon}</span>}
      </div>
      <div className={`text-xl md:text-2xl font-bold ${a.text}`}>{value}</div>
      {sublabel && (
        <div className={`mt-1 text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
          {sublabel}
        </div>
      )}
    </div>
  );
}
