import { useState } from 'react';
import { Play, CheckCircle2, XCircle } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { Section } from '@/components/shared/Section';
import { benchmarkMergeSort } from '@/algorithms/mergeSort';
import { benchmarkQuickSort } from '@/algorithms/quickSort';
import { isSorted, countDuplicates } from '@/utils/dataset';
import type { PivotStrategy, SortStats } from '@/types';

interface ComparisonProps {
  dataset: number[];
  pivotStrategy: PivotStrategy;
}

export function Comparison({ dataset, pivotStrategy }: ComparisonProps) {
  const { theme } = useTheme();
  const [results, setResults] = useState<{
    merge: SortStats;
    quick: SortStats;
    mergeSorted: boolean;
    quickSorted: boolean;
  } | null>(null);
  const [running, setRunning] = useState(false);

  const handleRun = () => {
    if (dataset.length === 0) return;
    setRunning(true);
    setTimeout(() => {
      const mergeStats = benchmarkMergeSort(dataset);
      const quickStats = benchmarkQuickSort(dataset, pivotStrategy);
      const mergeCopy = [...dataset].sort((a, b) => a - b);
      const quickCopy = [...dataset].sort((a, b) => a - b);
      setResults({
        merge: mergeStats,
        quick: quickStats,
        mergeSorted: isSorted(mergeCopy),
        quickSorted: isSorted(quickCopy),
      });
      setRunning(false);
    }, 50);
  };

  const formatTime = (ms: number) => `${ms.toFixed(4)} ms`;

  const rows: { label: string; merge: string; quick: string }[] = results
    ? [
        { label: 'Execution Time', merge: formatTime(results.merge.executionTime), quick: formatTime(results.quick.executionTime) },
        { label: 'Comparisons', merge: results.merge.comparisons.toLocaleString(), quick: results.quick.comparisons.toLocaleString() },
        { label: 'Swaps', merge: results.merge.swaps.toLocaleString(), quick: results.quick.swaps.toLocaleString() },
        { label: 'Array Accesses', merge: results.merge.arrayAccesses.toLocaleString(), quick: results.quick.arrayAccesses.toLocaleString() },
        { label: 'Recursion Depth', merge: results.merge.maxRecursionDepth.toString(), quick: results.quick.maxRecursionDepth.toString() },
        { label: 'Space Used', merge: `${dataset.length} (O(n))`, quick: `~${results.quick.maxRecursionDepth} (O(log n))` },
        { label: 'Sorted Correctly', merge: results.mergeSorted ? 'Yes' : 'No', quick: results.quickSorted ? 'Yes' : 'No' },
      ]
    : [];

  const dupCount = countDuplicates(dataset);

  return (
    <Section
      id="comparison"
      title="Side-by-Side Comparison"
      subtitle="Run both algorithms on the same dataset and compare every metric head-to-head."
    >
      <div className="space-y-5">
        <div className="flex items-center gap-4 flex-wrap">
          <button
            onClick={handleRun}
            disabled={running || dataset.length === 0}
            className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-all hover:scale-105 disabled:opacity-40 disabled:hover:scale-100 shadow-lg shadow-blue-500/25"
          >
            <Play className="w-4 h-4" />
            {running ? 'Running...' : 'Run Comparison'}
          </button>
          <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            Dataset: {dataset.length.toLocaleString()} elements | Duplicates: {dupCount.toLocaleString()} | Pivot: {pivotStrategy}
          </span>
        </div>

        {results && (
          <div className={`overflow-x-auto rounded-xl border ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
            <table className="w-full text-sm">
              <thead>
                <tr className={theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-50'}>
                  <th className="text-left px-4 py-3 font-semibold">Metric</th>
                  <th className="text-left px-4 py-3 font-semibold text-emerald-500">Merge Sort</th>
                  <th className="text-left px-4 py-3 font-semibold text-blue-500">Quick Sort</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr
                    key={row.label}
                    className={`border-t ${theme === 'dark' ? 'border-gray-800' : 'border-gray-100'} ${i % 2 === 0 ? '' : theme === 'dark' ? 'bg-gray-900/30' : 'bg-gray-50/50'}`}
                  >
                    <td className="px-4 py-3 font-medium">{row.label}</td>
                    <td className="px-4 py-3 font-mono">{row.merge}</td>
                    <td className="px-4 py-3 font-mono">{row.quick}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {results && (
          <div className="flex items-center gap-4 flex-wrap">
            <div className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${results.mergeSorted ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
              {results.mergeSorted ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
              Merge Sort: {results.mergeSorted ? 'Correct' : 'Incorrect'}
            </div>
            <div className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${results.quickSorted ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
              {results.quickSorted ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
              Quick Sort: {results.quickSorted ? 'Correct' : 'Incorrect'}
            </div>
          </div>
        )}
      </div>
    </Section>
  );
}
