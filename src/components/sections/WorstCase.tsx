import { useState } from 'react';
import { AlertTriangle, TrendingDown, Lightbulb } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { useTheme } from '@/context/ThemeContext';
import { Section } from '@/components/shared/Section';
import { StatCard } from '@/components/shared/StatCard';
import { benchmarkMergeSort } from '@/algorithms/mergeSort';
import { benchmarkQuickSort } from '@/algorithms/quickSort';
import type { PivotStrategy } from '@/types';

export function WorstCase() {
  const { theme } = useTheme();
  const [results, setResults] = useState<
    { size: number; mergeComp: number; quickFirst: number; quickLast: number; quickMiddle: number; quickRandom: number }[]
  >([]);
  const [running, setRunning] = useState(false);

  const runDemo = () => {
    setRunning(true);
    setTimeout(() => {
      const sizes = [10, 50, 100, 500, 1000, 5000];
      const data = sizes.map((size) => {
        const sorted = Array.from({ length: size }, (_, i) => i + 1);
        const ms = benchmarkMergeSort(sorted);
        const qFirst = benchmarkQuickSort(sorted, 'first');
        const qLast = benchmarkQuickSort(sorted, 'last');
        const qMiddle = benchmarkQuickSort(sorted, 'middle');
        const qRandom = benchmarkQuickSort(sorted, 'random');
        return {
          size,
          mergeComp: ms.comparisons,
          quickFirst: qFirst.comparisons,
          quickLast: qLast.comparisons,
          quickMiddle: qMiddle.comparisons,
          quickRandom: qRandom.comparisons,
        };
      });
      setResults(data);
      setRunning(false);
    }, 50);
  };

  const axisColor = theme === 'dark' ? '#9ca3af' : '#6b7280';
  const gridColor = theme === 'dark' ? '#374151' : '#e5e7eb';

  return (
    <Section
      id="worst-case"
      title="Why Can Quick Sort Become O(n²)?"
      subtitle="See how poor pivot selection on sorted data creates maximally unbalanced partitions — and how better strategies fix it."
    >
      <div className="space-y-6">
        <div className={`rounded-xl border p-5 ${theme === 'dark' ? 'bg-red-950/20 border-red-900/40' : 'bg-red-50 border-red-200'}`}>
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
            <div className="text-sm space-y-2">
              <p className="font-medium text-red-500">The Problem</p>
              <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                When the input is already sorted (e.g., <code className="font-mono text-xs px-1 py-0.5 rounded bg-red-500/10">1, 2, 3, 4, 5, ..., n</code>) and Quick Sort
                always picks the <strong>first</strong> or <strong>last</strong> element as the pivot, every partition is maximally unbalanced:
                one side has 0 elements, the other has n-1. This creates n levels of recursion, each doing O(n) work —
                resulting in <strong>O(n²)</strong> total comparisons instead of O(n log n).
              </p>
            </div>
          </div>
        </div>

        <div className={`rounded-xl border p-5 ${theme === 'dark' ? 'bg-emerald-950/20 border-emerald-900/40' : 'bg-emerald-50 border-emerald-200'}`}>
          <div className="flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
            <div className="text-sm space-y-2">
              <p className="font-medium text-emerald-500">The Solution</p>
              <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                Using a <strong>random</strong> or <strong>middle-element</strong> pivot strategy avoids systematically
                picking the worst pivot. Even on sorted data, these strategies produce balanced partitions on average,
                keeping Quick Sort at O(n log n).
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={runDemo}
          disabled={running}
          className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 font-semibold text-white bg-red-600 hover:bg-red-500 transition-all hover:scale-105 disabled:opacity-40 shadow-lg shadow-red-500/25"
        >
          <TrendingDown className="w-4 h-4" />
          {running ? 'Running...' : 'Run Worst-Case Demo'}
        </button>

        {results.length > 0 && (
          <>
            <div>
              <h3 className={`text-sm font-semibold mb-3 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                Comparisons on Sorted Data — Merge Sort vs Quick Sort (by Pivot Strategy)
              </h3>
              <div className={`rounded-xl border p-4 ${theme === 'dark' ? 'bg-gray-950/50 border-gray-800' : 'bg-gray-50 border-gray-200'}`}>
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={results}>
                    <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                    <XAxis dataKey="size" stroke={axisColor} tick={{ fontSize: 12 }} />
                    <YAxis stroke={axisColor} tick={{ fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: theme === 'dark' ? '#1f2937' : '#fff',
                        border: `1px solid ${gridColor}`,
                        borderRadius: '8px',
                        fontSize: '12px',
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                    <Bar dataKey="mergeComp" name="Merge Sort" fill="#10b981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="quickFirst" name="Quick (first)" fill="#ef4444" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="quickLast" name="Quick (last)" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="quickMiddle" name="Quick (middle)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="quickRandom" name="Quick (random)" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {(() => {
                const last = results[results.length - 1];
                return (
                  <>
                    <StatCard label="Merge Sort (n=5K)" value={last.mergeComp.toLocaleString()} accent="green" sublabel="O(n log n) guaranteed" />
                    <StatCard label="Quick (first) (n=5K)" value={last.quickFirst.toLocaleString()} accent="red" sublabel="O(n²) worst case" />
                    <StatCard label="Quick (middle) (n=5K)" value={last.quickMiddle.toLocaleString()} accent="blue" sublabel="Balanced partitions" />
                    <StatCard label="Quick (random) (n=5K)" value={last.quickRandom.toLocaleString()} accent="purple" sublabel="O(n log n) average" />
                  </>
                );
              })()}
            </div>

            <div className={`rounded-lg p-4 text-sm ${theme === 'dark' ? 'bg-gray-950/50 text-gray-400' : 'bg-gray-50 text-gray-600'}`}>
              <p>
                <strong>Key observation:</strong> On sorted data, Quick Sort with "first" or "last" pivot produces
                approximately <strong>n²/2</strong> comparisons — quadratic growth. Merge Sort and Quick Sort with
                "middle" or "random" pivot stay close to <strong>n log n</strong> — linearithmic growth.
                The difference becomes dramatic as n increases: at n=5,000, the worst-case Quick Sort does over 12 million
                comparisons while Merge Sort does around 60 thousand — a 200x difference.
              </p>
            </div>
          </>
        )}
      </div>
    </Section>
  );
}
