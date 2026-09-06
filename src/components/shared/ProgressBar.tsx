import { useTheme } from '@/context/ThemeContext';

interface ProgressBarProps {
  value: number;
  max: number;
  accent?: 'blue' | 'green' | 'amber';
}

export function ProgressBar({ value, max, accent = 'blue' }: ProgressBarProps) {
  const { theme } = useTheme();
  const pct = max > 0 ? (value / max) * 100 : 0;
  const colorClass =
    accent === 'green' ? 'bg-emerald-500' : accent === 'amber' ? 'bg-amber-500' : 'bg-blue-500';
  return (
    <div className={`h-2 rounded-full overflow-hidden ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'}`}>
      <div
        className={`h-full ${colorClass} transition-all duration-300 ease-out`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
