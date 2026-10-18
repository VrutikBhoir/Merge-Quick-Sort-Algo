import type { SortStats, SortResult } from '@/types';

/**
 * A benchmark result built from several timed repetitions of the same input.
 *
 * `medianMs` is the reported figure. Every other counter comes from the single run
 * whose time was closest to that median, so the counts and the time describe the same
 * execution. Note that with a randomized pivot these counters legitimately differ
 * from run to run, so they are one observed sample and not an average.
 */
export interface TimedBenchmark {
  stats: SortStats;
  output: number[];
  sorted: boolean;
  medianMs: number;
  minMs: number;
  maxMs: number;
  runs: number;
  warmupRuns: number;
  samples: number[];
}

/**
 * How many warm-up and timed runs to use for a given input size.
 *
 * Small inputs are dominated by JIT warm-up, so they get the most repetitions to make
 * the median meaningful. Large inputs already run long enough for a handful of
 * repetitions to be stable without stalling the tab. Run counts are odd so the median
 * is an actual sample rather than an average of two neighbours.
 */
export function benchmarkPlan(size: number): { warmup: number; runs: number } {
  if (size <= 500) return { warmup: 3, runs: 11 };
  if (size <= 5000) return { warmup: 2, runs: 5 };
  return { warmup: 1, runs: 3 };
}

function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = sorted.length >> 1;
  return sorted.length % 2 === 1 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

/**
 * Runs `benchmark` repeatedly on the same input and reports the median wall-clock
 * time.
 *
 * The benchmark function owns its own timing, so warm-up, repetition and aggregation
 * all live out here rather than inside the algorithms. Each repetition is handed its
 * own copy of the source array, which guarantees every run — and both algorithms in a
 * comparison — work on equivalent copies and that no run can be perturbed by another.
 * Copying, correctness checking and any visualization recording stay outside the timed
 * region because the benchmark functions do them outside their own `performance.now()`
 * window.
 */
export function runTimedBenchmark(
  benchmark: (input: number[]) => SortResult,
  input: number[],
  overrides: { warmup?: number; runs?: number } = {}
): TimedBenchmark {
  const plan = benchmarkPlan(input.length);
  const warmupRuns = Math.max(0, overrides.warmup ?? plan.warmup);
  const runs = Math.max(1, overrides.runs ?? plan.runs);

  for (let i = 0; i < warmupRuns; i++) {
    benchmark([...input]);
  }

  const results: SortResult[] = [];
  for (let i = 0; i < runs; i++) {
    results.push(benchmark([...input]));
  }

  const samples = results.map((r) => r.stats.executionTime);
  const medianMs = median(samples);

  let representative = 0;
  for (let i = 1; i < samples.length; i++) {
    if (Math.abs(samples[i] - medianMs) < Math.abs(samples[representative] - medianMs)) {
      representative = i;
    }
  }
  const run = results[representative];

  return {
    stats: run.stats,
    output: run.output,
    sorted: run.sorted,
    medianMs,
    minMs: Math.min(...samples),
    maxMs: Math.max(...samples),
    runs,
    warmupRuns,
    samples,
  };
}