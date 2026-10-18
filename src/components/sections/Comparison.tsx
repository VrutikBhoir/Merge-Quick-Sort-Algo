import { useState } from 'react';
import { Play, CheckCircle2, XCircle } from 'lucide-react';
import { Section } from '@/components/shared/Section';
import { benchmarkMergeSort } from '@/algorithms/mergeSort';
import { benchmarkQuickSort } from '@/algorithms/quickSort';
import { countDuplicates, arraysEqual, INPUT_SHAPE_LABEL, describeInput } from '@/utils/dataset';
import { InputNotice } from '@/components/shared/InputNotice';
import { runTimedBenchmark, type TimedBenchmark } from '@/utils/benchmark';
import type { PivotStrategy } from '@/types';

interface ComparisonProps {
  dataset: number[];
  pivotStrategy: PivotStrategy;
}

interface ComparisonResults {
  merge: TimedBenchmark;
  quick: TimedBenchmark;
  outputsMatch: boolean;
}

/**
 * What produced each cell:
 *  time       — wall-clock duration measured over the timed runs
 *  counts     — operation counters and depth, counted by the algorithms during a run
 *  theoretical— complexity bound quoted from theory, never measured here
 *  validation — correctness check on the produced output
 */
type RowKind = 'time' | 'counts' | 'theoretical' | 'validation';

const KIND_BADGE: Record<RowKind, string> = {
  time: 'measured',
  counts: 'counted',
  theoretical: 'theory',
  validation: 'checked',
};

const KIND_CELL: Record<RowKind, string> = {
  time: 'text-gray-800',
  counts: 'text-gray-800',
  theoretical: 'text-gray-400 italic',
  validation: 'text-gray-800',
};

interface Row {
  label: string;
  kind: RowKind;
  merge: string;
  quick: string;
}

function formatTime(ms: number): string {
  if (!Number.isFinite(ms) || ms <= 0) return '< 0.0001 ms';
  if (ms < 0.01) return `${ms.toFixed(5)} ms`;
  return `${ms.toFixed(4)} ms`;
}

export function Comparison({ dataset, pivotStrategy }: ComparisonProps) {
  const [results, setResults] = useState<ComparisonResults | null>(null);
  const [running, setRunning] = useState(false);

  const handleRun = () => {
    if (dataset.length === 0) return;
    setRunning(true);
    // Yield once so the button can repaint before the synchronous benchmark loop.
    setTimeout(() => {
      const mergeResult = runTimedBenchmark(benchmarkMergeSort, dataset);
      const quickResult = runTimedBenchmark((input) => benchmarkQuickSort(input, pivotStrategy), dataset);
      setResults({
        merge: mergeResult,
        quick: quickResult,
        outputsMatch: arraysEqual(mergeResult.output, quickResult.output),
      });
      setRunning(false);
    }, 50);
  };

  const rows: Row[] = results
    ? [
        {
          label: 'Median Execution Time',
          kind: 'time',
          merge: formatTime(results.merge.medianMs),
          quick: formatTime(results.quick.medianMs),
        },
        {
          label: 'Time Range (min\u2013max)',
          kind: 'time',
          merge: `${formatTime(results.merge.minMs)} \u2013 ${formatTime(results.merge.maxMs)}`,
          quick: `${formatTime(results.quick.minMs)} \u2013 ${formatTime(results.quick.maxMs)}`,
        },
        {
          label: 'Timed Runs (warm-up)',
          kind: 'time',
          merge: `${results.merge.runs} (${results.merge.warmupRuns})`,
          quick: `${results.quick.runs} (${results.quick.warmupRuns})`,
        },
        { label: 'Comparisons', kind: 'counts', merge: results.merge.stats.comparisons.toLocaleString(), quick: results.quick.stats.comparisons.toLocaleString() },
        { label: 'Swaps', kind: 'counts', merge: results.merge.stats.swaps.toLocaleString(), quick: results.quick.stats.swaps.toLocaleString() },
        { label: 'Array Accesses', kind: 'counts', merge: results.merge.stats.arrayAccesses.toLocaleString(), quick: results.quick.stats.arrayAccesses.toLocaleString() },
        { label: 'Max Recursion Depth', kind: 'counts', merge: results.merge.stats.maxRecursionDepth.toString(), quick: results.quick.stats.maxRecursionDepth.toString() },
        {
          label: 'Auxiliary Space',
          kind: 'theoretical',
          merge: `O(n) \u2014 bound, not measured`,
          quick: `O(log n) \u2014 bound, not measured`,
        },
        {
          label: 'Output Correctly Sorted',
          kind: 'validation',
          merge: results.merge.sorted ? 'Yes' : 'No',
          quick: results.quick.sorted ? 'Yes' : 'No',
        },
      ]
    : [];

  const dupCount = countDuplicates(dataset);

  // A single untimed sample is too noisy to call a winner from, so differences below
  // 2% of the larger median are reported as a tie rather than a ranking.
  const verdict = (() => {
    if (!results) return null;
    const mergeMs = results.merge.medianMs;
    const quickMs = results.quick.medianMs;
    const larger = Math.max(mergeMs, quickMs);
    const relativeDiff = larger > 0 ? Math.abs(mergeMs - quickMs) / larger : 0;
    if (relativeDiff < 0.02) return 'tie' as const;
    return mergeMs < quickMs ? ('merge' as const) : ('quick' as const);
  })();

  const verdictText =
    verdict === 'merge'
      ? 'Merge Sort had the lower median time in this measurement.'
      : verdict === 'quick'
        ? 'Quick Sort had the lower median time in this measurement.'
        : verdict === 'tie'
          ? 'The two median times were within 2% of each other, so this run does not separate the algorithms.'
          : '';

  return (
    <Section
      id="comparison"
      title="Side-by-Side Comparison"
      subtitle="Run both algorithms on equivalent copies of the same dataset and compare measured metrics against theoretical bounds."
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
          <span className="rounded border border-gray-200 bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
            {INPUT_SHAPE_LABEL[describeInput(dataset)]}
          </span>
        </div>

        <InputNotice dataset={dataset} pivotStrategy={pivotStrategy} />

        <p className="text-xs text-gray-400">
          Each algorithm is warmed up and then timed over several runs; the median is reported.
          Timings are wall-clock measurements from this browser tab and are affected by JIT state,
          machine load and other background work, so small differences should be treated as noise.
          Only compare figures produced by the same run.
        </p>

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
                    <td className="px-4 py-3 font-medium text-gray-700">
                      {row.label}
                      <span
                        className={`ml-2 rounded px-1.5 py-0.5 text-[10px] font-normal uppercase tracking-wide ${
                          row.kind === 'theoretical' ? 'bg-amber-50 text-amber-600' : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {KIND_BADGE[row.kind]}
                      </span>
                    </td>
                    <td className={`px-4 py-3 font-mono ${KIND_CELL[row.kind]}`}>{row.merge}</td>
                    <td className={`px-4 py-3 font-mono ${KIND_CELL[row.kind]}`}>{row.quick}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {results && (
          <p className="text-xs text-gray-400">
            <strong className="font-semibold text-gray-500">measured</strong> = wall-clock
            duration, median over the timed runs. &nbsp;
            <strong className="font-semibold text-gray-500">counted</strong> = operations and
            depth counted by the algorithm during one run. &nbsp;
            <strong className="font-semibold text-amber-600">theory</strong> = complexity bound,
            not measured here. &nbsp;
            <strong className="font-semibold text-gray-500">checked</strong> = correctness
            verification of the output.
          </p>
        )}

        {results && pivotStrategy === 'random' && (
          <p className="text-xs text-gray-400">
            The &quot;random&quot; pivot strategy chooses a different pivot on every run, so the
            comparison, swap and recursion-depth counts above are one observed run rather than
            an average, and they will differ between runs.
          </p>
        )}

        {results && (
          <div className="flex items-center gap-4 flex-wrap">
            <div className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${results.merge.sorted ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
              {results.merge.sorted ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
              Merge Sort: {results.merge.sorted ? 'Correct' : 'Incorrect'}
            </div>
            <div className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${results.quick.sorted ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
              {results.quick.sorted ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
              Quick Sort: {results.quick.sorted ? 'Correct' : 'Incorrect'}
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
            <p className="font-medium text-gray-800">What this run measured</p>
            <p>
              {verdictText} On this dataset of {dataset.length.toLocaleString()} elements, Merge
              Sort's median was {formatTime(results.merge.medianMs)} over{' '}
              {results.merge.runs} timed runs and Quick Sort's was{' '}
              {formatTime(results.quick.medianMs)} over {results.quick.runs} timed runs, using the
              &quot;{pivotStrategy}&quot; pivot strategy.
            </p>
            <p>
              That result applies to these two implementations, on this dataset, with this pivot
              strategy, on this machine at this moment. It is not a general result. The outcome
              depends on the input distribution, the pivot strategy chosen, how each algorithm
              happens to be implemented, and the runtime environment including the JavaScript
              engine, its JIT state and whatever else is competing for the CPU. Changing the
              dataset, the pivot strategy or the machine can reverse it.
            </p>
            <p className="font-medium text-gray-800 pt-1">Theoretical bounds (separate from the measurement above)</p>
            <p>
              Complexity bounds describe how work grows with input size; they do not say which
              implementation is faster at a particular size. Merge Sort is O(n log n) in the best,
              average and worst case and is stable, but needs O(n) auxiliary memory. Quick Sort is
              O(n log n) on average with O(log n) auxiliary memory, but degrades to O(n²) with
              adversarial pivot choices and is not stable. Auxiliary space in the table above is
              quoted as a bound, not as measured memory.
            </p>
            <p>
              Neither algorithm is universally better. Merge Sort suits workloads that need stable
              ordering or predictable worst-case bounds; Quick Sort suits workloads where low
              auxiliary memory matters. The right choice follows from the requirements, not from a
              single timing.
            </p>
          </div>
        )}
      </div>
    </Section>
  );
}