interface StatCardProps {
  label: string;
  value: string | number;
  accent?: 'blue' | 'green' | 'amber' | 'red' | 'teal';
  sublabel?: string;
}

const accentClasses: Record<string, { text: string; border: string }> = {
  blue: { text: 'text-blue-600', border: 'border-blue-200' },
  green: { text: 'text-emerald-600', border: 'border-emerald-200' },
  amber: { text: 'text-amber-600', border: 'border-amber-200' },
  red: { text: 'text-red-600', border: 'border-red-200' },
  teal: { text: 'text-teal-600', border: 'border-teal-200' },
};

export function StatCard({ label, value, accent = 'blue', sublabel }: StatCardProps) {
  const a = accentClasses[accent];
  return (
    <div className={`rounded-lg border ${a.border} bg-white p-3`}>
      <div className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</div>
      <div className={`text-lg font-bold ${a.text} mt-1`}>{value}</div>
      {sublabel && <div className="mt-0.5 text-xs text-gray-400">{sublabel}</div>}
    </div>
  );
}
