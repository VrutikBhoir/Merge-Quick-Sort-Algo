import { useState } from 'react';
import { BarChart3, Loader2 } from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts';
import { useTheme } from '@/context/ThemeContext';
import { Section } from '@/components/shared/Section';
import { generateDataset, isSorted } from '@/utils/dataset';
import { benchmarkMergeSort } from '@/algorithms/mergeSort';
import { benchmarkQuickSort } from '@/algorithms/quickSort';
import type { DatasetType, PivotStrategy } from '@/types';

interface BenchmarkProps {
  pivotStrategy: PivotStrategy;
}

const DATASET_TYPES: { type: DatasetType; label: string }[] = [
  { type: 'random', label: 'Random' },
  { type: 'sorted', label: 'Sorted' },
  { type: 'reverse', label: 'Reverse' },
  { type: 'nearly', label: 'Nearly Sorted' },
  { type: 'duplicates', label: 'Duplicate-Heavy' },
];

const SIZES = [100, 500, 1000, 5000, 10000, 50000];

export function Benchmark({ pivotStrategy }: BenchmarkProps) {
  const { theme } = useTheme();
  const [selectedTypes, setSelectedTypes] = useState<DatasetType[]>(['random', 'sorted', 'reverse']);
  const [results, setResults] = useState<any[]>([]);
  const [typeResults, setTypeResults] = useState<any[]>([]);
  const [running, setRunning] = useState(false);

  const toggleType = (type: DatasetType) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const runBenchmark = () => {
    setRunning(true);
    setTimeout(() => {
      const sizeData: any[] = [];
      const typeData: any[] = [];

      for (const size of SIZES) {
        const row: any = { size };
        for (const type of selectedTypes) {
          const data = generateDataset(type, size);
          const ms = benchmarkMergeSort(data);
          const qs = benchmarkQuickSort(data, pivotStrategy);
          row[`${type}_merge_time`] = ms.executionTime;
          row[`${type}_quick_time`] = qs.executionTime;
          row[`${type}_merge_comp`] = ms.comparisons;
          row[`${type}_quick_comp`] = qs.comparisons;
        }
        sizeData.push(row);
      }

      const fixedSize = 5000;
      for (const dt of DATASET_TYPES) {
        const data = generateDataset(dt.type, fixedSize);
        const ms = benchmarkMergeSort(data);
        const qs = benchmarkQuickSort(data, pivotStrategy);
        typeData.push({
          name: dt.label,
          mergeTime: ms.executionTime,
          quickTime: qs.executionTime,
          mergeComp: ms.comparisons,
          quickComp: qs.comparisons,
          mergeDepth: ms.maxRecursionDepth,
          quickDepth: qs.maxRecursionDepth,
          sorted: isSorted([...data].sort((a, b) => a - b)),
        });
      }

      setResults(sizeData);
      setTypeResults(typeData);
      setRunning(false);
    }, 50);
  };

  const axisColor = theme === 'dark' ? '#9ca3af' : '#6b7280';
  const gridColor = theme === 'dark' ? '#374151' : '#e5e7eb';
  const mergeColor = '#10b981';
  const quickColor = '#3b82f6';

  return (
    <Section
      id="benchmark"
      title="Performance Benchmark"
      subtitle="Run both algorithms across multiple dataset types and sizes. All numbers come from actual execution — no synthetic data."
    >
      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-3">
          <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            Dataset Types:
          </span>
          {DATASET_TYPES.map(({ type, label }) => (
            <button
              key={type}
              onClick={() => toggleType(type)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${
                selectedTypes.includes(type)
                  ? 'bg-blue-600 text-white'
                  : theme === 'dark'
                  ? 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <button
          onClick={runBenchmark}
          disabled={running || selectedTypes.length === 0}
          className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-all hover:scale-105 disabled:opacity-40 shadow-lg shadow-blue-500/25"
        >
          {running ? <Loader2 className="w-4 h-4 animate-spin" /> : <BarChart3 className="w-4 h-4" />}
          {running ? 'Running Benchmark...' : 'Run Benchmark'}
        </button>

        {results.length > 0 && (
          <>
            {/* Chart 1: Execution Time vs Input Size */}
            <div>
              <h3 className={`text-sm font-semibold mb-3 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                Chart 1 — Execution Time vs Input Size
              </h3>
              <div className={`rounded-xl border p-4 ${theme === 'dark' ? 'bg-gray-950/50 border-gray-800' : 'bg-gray-50 border-gray-200'}`}>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={results}>
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
                    {selectedTypes.map((type) => (
                      <Line key={`m-${type}`} type="monotone" dataKey={`${type}_merge_time`} name={`Merge (${type})`} stroke={mergeColor} dot={false} strokeWidth={2} />
                    ))}
                    {selectedTypes.map((type) => (
                      <Line key={`q-${type}`} type="monotone" dataKey={`${type}_quick_time`} name={`Quick (${type})`} stroke={quickColor} dot={false} strokeWidth={2} strokeDasharray="5 5" />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Comparisons vs Input Size */}
            <div>
              <h3 className={`text-sm font-semibold mb-3 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                Chart 2 — Comparisons vs Input Size
              </h3>
              <div className={`rounded-xl border p-4 ${theme === 'dark' ? 'bg-gray-950/50 border-gray-800' : 'bg-gray-50 border-gray-200'}`}>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={results}>
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
                    {selectedTypes.map((type) => (
                      <Line key={`m-${type}`} type="monotone" dataKey={`${type}_merge_comp`} name={`Merge (${type})`} stroke={mergeColor} dot={false} strokeWidth={2} />
                    ))}
                    {selectedTypes.map((type) => (
                      <Line key={`q-${type}`} type="monotone" dataKey={`${type}_quick_comp`} name={`Quick (${type})`} stroke={quickColor} dot={false} strokeWidth={2} strokeDasharray="5 5" />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}

        {/* Chart 3: Performance by Dataset Type */}
        {typeResults.length > 0 && (
          <div>
            <h3 className={`text-sm font-semibold mb-3 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
              Chart 3 — Performance by Dataset Type (n=5,000)
            </h3>
            <div className={`rounded-xl border p-4 ${theme === 'dark' ? 'bg-gray-950/50 border-gray-800' : 'bg-gray-50 border-gray-200'}`}>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={typeResults}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                  <XAxis dataKey="name" stroke={axisColor} tick={{ fontSize: 12 }} />
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
                  <Bar dataKey="mergeTime" name="Merge Sort (ms)" fill={mergeColor} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="quickTime" name="Quick Sort (ms)" fill={quickColor} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {typeResults.length > 0 && (
          <div className={`overflow-x-auto rounded-xl border ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
            <table className="w-full text-sm">
              <thead>
                <tr className={theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-50'}>
                  <th className="text-left px-4 py-3 font-semibold">Dataset Type</th>
                  <th className="text-right px-4 py-3 font-semibold text-emerald-500">Merge Time</th>
                  <th className="text-right px-4 py-3 font-semibold text-blue-500">Quick Time</th>
                  <th className="text-right px-4 py-3 font-semibold text-emerald-500">Merge Comp.</th>
                  <th className="text-right px-4 py-3 font-semibold text-blue-500">Quick Comp.</th>
                  <th className="text-right px-4 py-3 font-semibold text-emerald-500">Merge Depth</th>
                  <th className="text-right px-4 py-3 font-semibold text-blue-500">Quick Depth</th>
                </tr>
              </thead>
              <tbody>
                {typeResults.map((r) => (
                  <tr key={r.name} className={`border-t ${theme === 'dark' ? 'border-gray-800' : 'border-gray-100'}`}>
                    <td className="px-4 py-3 font-medium">{r.name}</td>
                    <td className="px-4 py-3 text-right font-mono">{r.mergeTime.toFixed(3)} ms</td>
                    <td className="px-4 py-3 text-right font-mono">{r.quickTime.toFixed(3)} ms</td>
                    <td className="px-4 py-3 text-right font-mono">{r.mergeComp.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right font-mono">{r.quickComp.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right font-mono">{r.mergeDepth}</td>
                    <td className="px-4 py-3 text-right font-mono">{r.quickDepth}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Section>
  );
}
