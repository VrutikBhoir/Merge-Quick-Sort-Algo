import { ArrowRight, Zap, Clock, AlertTriangle, Database, Layers } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { StatCard } from '@/components/shared/StatCard';

interface DashboardProps {
  onStart: () => void;
}

export function Dashboard({ onStart }: DashboardProps) {
  const { theme } = useTheme();

  return (
    <div className="space-y-8">
      <div className="text-center py-8 md:py-12 animate-fade-in">
        <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium mb-6 bg-blue-500/10 text-blue-500 border border-blue-500/20">
          <Zap className="w-4 h-4" />
          Interactive Algorithm Efficiency Analyzer
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
          Merge Sort <span className="text-gray-400 font-normal">vs</span> Quick Sort
        </h1>
        <p className={`max-w-2xl mx-auto text-base md:text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          A problem-solving tool to visualize, benchmark, and compare two fundamental sorting
          algorithms. Understand their complexities, explore worst-case scenarios, and learn when
          to choose one over the other.
        </p>
        <button
          onClick={onStart}
          className="mt-8 inline-flex items-center gap-2 rounded-xl px-6 py-3 font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-all hover:scale-105 shadow-lg shadow-blue-500/25"
        >
          Start Analysis
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard label="Best Case" value="O(n log n)" icon={<Clock className="w-4 h-4" />} accent="green" sublabel="Both algorithms" />
        <StatCard label="Average Case" value="O(n log n)" icon={<Layers className="w-4 h-4" />} accent="blue" sublabel="Both algorithms" />
        <StatCard label="Worst Case" value="O(n²) / O(n log n)" icon={<AlertTriangle className="w-4 h-4" />} accent="red" sublabel="Quick Sort / Merge Sort" />
        <StatCard label="Space Complexity" value="O(log n) / O(n)" icon={<Database className="w-4 h-4" />} accent="teal" sublabel="Quick Sort / Merge Sort" />
        <StatCard label="Stability" value="No / Yes" icon={<Layers className="w-4 h-4" />} accent="amber" sublabel="Quick Sort / Merge Sort" />
        <StatCard label="In-Place" value="Yes / No" icon={<Zap className="w-4 h-4" />} accent="purple" sublabel="Quick Sort / Merge Sort" />
      </div>

      <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
        <div className={`rounded-2xl border p-6 ${theme === 'dark' ? 'bg-emerald-950/30 border-emerald-900/50' : 'bg-emerald-50 border-emerald-200'}`}>
          <h3 className="text-lg font-bold mb-3 text-emerald-500">Merge Sort</h3>
          <ul className="space-y-2 text-sm">
            <li>Divide-and-conquer: splits array in half, sorts each half, then merges</li>
            <li>Guaranteed O(n log n) in all cases — best, average, and worst</li>
            <li>Stable: preserves relative order of equal elements</li>
            <li>Requires O(n) extra memory for the merge buffer</li>
            <li>Excellent for linked lists and external sorting</li>
          </ul>
        </div>
        <div className={`rounded-2xl border p-6 ${theme === 'dark' ? 'bg-blue-950/30 border-blue-900/50' : 'bg-blue-50 border-blue-200'}`}>
          <h3 className="text-lg font-bold mb-3 text-blue-500">Quick Sort</h3>
          <ul className="space-y-2 text-sm">
            <li>Divide-and-conquer: selects a pivot, partitions around it, recurses</li>
            <li>Average O(n log n), but worst case O(n²) with poor pivot selection</li>
            <li>Not stable: partitioning can reorder equal elements</li>
            <li>In-place: only O(log n) extra space for the recursion stack</li>
            <li>Typically faster in practice due to cache locality</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
