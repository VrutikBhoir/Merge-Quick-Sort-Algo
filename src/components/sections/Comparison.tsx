import { useState } from 'react';
import { Play, CheckCircle2, XCircle } from 'lucide-react';
import { Section } from '@/components/shared/Section';
import { benchmarkMergeSort } from '@/algorithms/mergeSort';
import { benchmarkQuickSort } from '@/algorithms/quickSort';
import { isSorted, countDuplicates, arraysEqual } from '@/utils/dataset';
import type { PivotStrategy, SortStats } from '@/types';

interface ComparisonProps {
  dataset: number[];
  pivotStrategy: PivotStrategy;
}

interface ComparisonResults {
  merge: SortStats;
  quick: SortStats;
  mergeSorted: boolean;
  quickSorted: boolean;
  outputsMatch: boolean;
}

export function Comparison({ dataset, pivotStrategy }: ComparisonProps) {
  const [results, setResults] = useState<ComparisonResults | null>(null);
  const [running, setRunning] = useState(false);

  const handleRun = () => {
    if (dataset.length === 0) return;
    setRunning(true);
    setTimeout(() => {
      const mergeResult = benchmarkMergeSort(dataset);
      const quickResult = benchmarkQuickSort(dataset, pivotStrategy);
      setResults({
        merge: mergeResult.stats,
        quick: quickResult.stats,
        mergeSorted: mergeResult.sorted,
        quickSorted: quickResult.sorted,
        outputsMatch: arraysEqual(mergeResult.output, quickResult.output),
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
        { label: 'Est. Aux. Space', merge: `O(n) = ${dataset.length}`, quick: `O(log n) ~ ${results.quick.maxRecursionDepth}` },
        { label: 'Sorted Correctly', merge: results.mergeSorted ? 'Yes' : 'No', quick: results.quickSorted ? 'Yes' : 'No' },
      ]
    : [];

  const dupCount = countDuplicates(dataset);
  const faster = results && results.merge.executionTime < results.quick.executionTime ? 'merge' : 'quick';

  return (
    <Section
      id="comparison"
      title="Side-by-Side Comparison"
      subtitle="Run both algorithms on identical copies of the same dataset and compare every metric."
    >
      <div className="space-y-5">
        <div className="flex items-center gap-4 flex-wrap">
          <button
            onClick={handleRun}
            disabled={running || dataset.length === 0}
            className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 font-medium text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-40"
          >
            <Play className="w-4 h-4" />
            {running ? 'Running...' : 'Run Comparison'}
          </button>
          <span className="text-sm text-gray-500">
            {dataset.length.toLocaleString()} elements | Duplicates: {dupCount.toLocaleString()} | Pivot: {pivotStrategy}
          </span>
        </div>

        {dataset.length <= 100 && (
          <p className="text-xs text-gray-400">
            Note: Execution times for small datasets may be affected by system noise and should
            be interpreted as approximate.
          </p>
        )}

        {results && (
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">Metric</th>
                  <th className="text-left px-4 py-3 font-semibold text-emerald-600">Merge Sort</th>
                  <th className="text-left px-4 py-3 font-semibold text-blue-600">Quick Sort</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.label} className="border-t border-gray-100">
                    <td className="px-4 py-3 font-medium text-gray-700">{row.label}</td>
                    <td className="px-4 py-3 font-mono text-gray-800">{row.merge}</td>
                    <td className="px-4 py-3 font-mono text-gray-800">{row.quick}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {results && (
          <div className="flex items-center gap-4 flex-wrap">
            <div className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${results.mergeSorted ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
              {results.mergeSorted ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
              Merge Sort: {results.mergeSorted ? 'Correct' : 'Incorrect'}
            </div>
            <div className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${results.quickSorted ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
              {results.quickSorted ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
              Quick Sort: {results.quickSorted ? 'Correct' : 'Incorrect'}
            </div>
            {!results.outputsMatch && (
              <div className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm bg-amber-50 text-amber-600">
                <XCircle className="w-4 h-4" />
                Outputs differ between algorithms
              </div>
            )}
          </div>
        )}

        {results && (
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700 space-y-2">
            <p className="font-medium text-gray-800">Conclusion</p>
            <p>
              <strong>{faster === 'merge' ? 'Merge Sort' : 'Quick Sort'}</strong> was faster on this dataset
              with the "{pivotStrategy}" pivot strategy. Merge Sort guarantees O(n log n) in all cases but
              uses O(n) extra memory; Quick Sort is in-place and typically faster in practice but can
              degrade to O(n²) with poor pivot selection.
            </p>
            <p>
              There is no universally best sorting algorithm. Merge Sort is preferable when stable sorting
              and predictable worst-case performance matter; Quick Sort is preferable when average-case speed
              and low memory usage matter, provided a good pivot strategy is used.
            </p>
            <p className="text-xs text-gray-400">
              Space values shown above are theoretical estimates, not directly measured memory.
            </p>
          </div>
        )}
      </div>
    </Section>
  );
}
