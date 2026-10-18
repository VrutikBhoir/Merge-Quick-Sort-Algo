import { useState } from 'react';
import { Section } from '@/components/shared/Section';
import { benchmarkMergeSort } from '@/algorithms/mergeSort';
import { benchmarkQuickSort } from '@/algorithms/quickSort';

interface Row {
  size: number;
  mergeComp: number;
  quickFirst: number;
  quickLast: number;
  quickMiddle: number;
  quickRandom: number;
}

export function WorstCase() {
  const [results, setResults] = useState<Row[]>([]);
  const [running, setRunning] = useState(false);

  const runDemo = () => {
    setRunning(true);
    setTimeout(() => {
      const sizes = [100, 500, 1000, 5000];
      const data = sizes.map((size) => {
        const sorted = Array.from({ length: size }, (_, i) => i + 1);
        const ms = benchmarkMergeSort(sorted);
        const qFirst = benchmarkQuickSort(sorted, 'first');
        const qLast = benchmarkQuickSort(sorted, 'last');
        const qMiddle = benchmarkQuickSort(sorted, 'middle');
        const qRandom = benchmarkQuickSort(sorted, 'random');
        return {
          size,
          mergeComp: ms.stats.comparisons,
          quickFirst: qFirst.stats.comparisons,
          quickLast: qLast.stats.comparisons,
          quickMiddle: qMiddle.stats.comparisons,
          quickRandom: qRandom.stats.comparisons,
        };
      });
      setResults(data);
      setRunning(false);
    }, 50);
  };

  return (
    <Section
      id="worst-case"
      title="Worst-Case: Pivot Selection on Sorted Data"
      subtitle="See how poor pivot selection on sorted data creates maximally unbalanced partitions."
    >
      <div className="space-y-5">
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-gray-700">
          <p className="font-medium text-amber-700 mb-1">The Problem</p>
          <p>
            When the input is already sorted and Quick Sort picks the <strong>first</strong> or{' '}
            <strong>last</strong> element as pivot, every partition is maximally unbalanced — one side
            has 0 elements, the other has n−1. This creates n levels of recursion, each doing O(n) work,
            resulting in <strong>O(n²)</strong> comparisons instead of O(n log n).
          </p>
        </div>

        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-gray-700">
          <p className="font-medium text-emerald-700 mb-1">The Solution</p>
          <p>
            Using a <strong>random</strong> or <strong>middle-element</strong> pivot avoids systematically
            picking the worst pivot, keeping Quick Sort at O(n log n) on average even on sorted data.
          </p>
        </div>

        <button
          onClick={runDemo}
          disabled={running}
          className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 font-medium text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-40"
        >
          {running ? 'Running...' : 'Run Worst-Case Demo'}
        </button>

        {results.length > 0 && (
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left px-4 py-2.5 font-semibold text-gray-700">Size (n)</th>
                  <th className="text-right px-4 py-2.5 font-semibold text-emerald-600">Merge Sort</th>
                  <th className="text-right px-4 py-2.5 font-semibold text-red-600">Quick (first)</th>
                  <th className="text-right px-4 py-2.5 font-semibold text-amber-600">Quick (last)</th>
                  <th className="text-right px-4 py-2.5 font-semibold text-blue-600">Quick (middle)</th>
                  <th className="text-right px-4 py-2.5 font-semibold text-violet-600">Quick (random)</th>
                </tr>
              </thead>
              <tbody>
                {results.map((row) => (
                  <tr key={row.size} className="border-t border-gray-100">
                    <td className="px-4 py-2.5 font-mono text-gray-700">{row.size.toLocaleString()}</td>
                    <td className="px-4 py-2.5 font-mono text-right text-emerald-600">{row.mergeComp.toLocaleString()}</td>
                    <td className="px-4 py-2.5 font-mono text-right text-red-600">{row.quickFirst.toLocaleString()}</td>
                    <td className="px-4 py-2.5 font-mono text-right text-amber-600">{row.quickLast.toLocaleString()}</td>
                    <td className="px-4 py-2.5 font-mono text-right text-blue-600">{row.quickMiddle.toLocaleString()}</td>
                    <td className="px-4 py-2.5 font-mono text-right text-violet-600">{row.quickRandom.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {results.length > 0 && (
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700">
            <p>
              <strong>Key observation:</strong> On sorted data, Quick Sort with "first" or "last" pivot
              produces approximately n²/2 comparisons — quadratic growth. Merge Sort and Quick Sort with
              "middle" or "random" pivot stay close to n log n — linearithmic growth.
            </p>
          </div>
        )}
      </div>
    </Section>
  );
}
