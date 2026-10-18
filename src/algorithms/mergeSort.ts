import type { MergeStep, SortStats, SortResult } from '@/types';
import { isSorted } from '@/utils/dataset';
import { MAX_ANIMATED_SIZE } from '@/constants';

function cloneStats(s: SortStats): SortStats {
  return { ...s };
}

function emptyStats(): SortStats {
  return {
    comparisons: 0,
    swaps: 0,
    arrayAccesses: 0,
    recursionDepth: 0,
    maxRecursionDepth: 0,
    merges: 0,
    executionTime: 0,
  };
}

/**
 * Builds the animation timeline.
 *
 * Every step stores a full copy of the array, so the recorded history grows as
 * O(n^2 log n). Inputs larger than MAX_ANIMATED_SIZE are rejected outright and return
 * an empty timeline; callers are expected to check the size first and offer the
 * benchmark instead. Use `benchmarkMergeSort` to measure arrays of any size.
 */
export function mergeSortSteps(input: number[]): MergeStep[] {
  if (input.length > MAX_ANIMATED_SIZE) return [];

  const arr = [...input];
  const steps: MergeStep[] = [];
  const sortedRanges: [number, number][] = [];

  function record(
    phase: MergeStep['phase'],
    left: number,
    mid: number,
    right: number,
    description: string,
    stats: SortStats,
    extra?: Partial<MergeStep>
  ): void {
    steps.push({
      array: [...arr],
      left,
      mid,
      right,
      phase,
      sortedRanges: sortedRanges.map((r) => [...r] as [number, number]),
      description,
      stats: cloneStats(stats),
      ...extra,
    });
  }

  function mergeSort(left: number, right: number, depth: number, stats: SortStats): void {
    stats.recursionDepth = depth;
    stats.maxRecursionDepth = Math.max(stats.maxRecursionDepth, depth);

    if (left >= right) {
      if (left === right) {
        record('divide', left, left, right, `Single element at index ${left} — base case reached.`, stats);
        sortedRanges.push([left, right]);
      }
      return;
    }

    const mid = Math.floor((left + right) / 2);
    record('divide', left, mid, right, `Dividing [${left}..${right}] into [${left}..${mid}] and [${mid + 1}..${right}].`, stats);

    mergeSort(left, mid, depth + 1, stats);
    mergeSort(mid + 1, right, depth + 1, stats);

    merge(left, mid, right, stats);
  }

  function merge(left: number, mid: number, right: number, stats: SortStats): void {
    const temp: number[] = [];
    let i = left;
    let j = mid + 1;

    record('merge', left, mid, right, `Merging [${left}..${mid}] with [${mid + 1}..${right}].`, stats);

    while (i <= mid && j <= right) {
      stats.comparisons++;
      stats.arrayAccesses += 2;
      record('compare', left, mid, right, `Comparing ${arr[i]} and ${arr[j]}.`, stats, {
        comparing: [i, j],
      });

      if (arr[i] <= arr[j]) {
        temp.push(arr[i]);
        i++;
      } else {
        temp.push(arr[j]);
        j++;
      }
    }

    while (i <= mid) {
      stats.arrayAccesses++;
      temp.push(arr[i]);
      i++;
    }

    while (j <= right) {
      stats.arrayAccesses++;
      temp.push(arr[j]);
      j++;
    }

    for (let k = 0; k < temp.length; k++) {
      arr[left + k] = temp[k];
      stats.arrayAccesses++;
      record('merge', left, mid, right, `Writing ${temp[k]} to index ${left + k}.`, stats, {
        writing: left + k,
      });
    }

    stats.merges++;

    // Collapse the two child ranges into the range they were just merged into.
    // Each index is re-looked-up after the previous splice so the indices stay valid.
    const leftIdx = sortedRanges.findIndex((r) => r[0] === left && r[1] === mid);
    if (leftIdx !== -1) sortedRanges.splice(leftIdx, 1);
    const rightIdx = sortedRanges.findIndex((r) => r[0] === mid + 1 && r[1] === right);
    if (rightIdx !== -1) sortedRanges.splice(rightIdx, 1);
    sortedRanges.push([left, right]);

    record('merge', left, mid, right, `Merged [${left}..${right}] is now sorted.`, stats);
  }

  const stats = emptyStats();
  record('divide', 0, 0, arr.length - 1, `Starting Merge Sort on ${arr.length} elements.`, stats);
  if (arr.length > 0) {
    mergeSort(0, arr.length - 1, 0, stats);
  }
  record('done', 0, 0, arr.length - 1, `Merge Sort complete. Array is fully sorted.`, stats);

  return steps;
}

/**
 * Headless benchmark — identical algorithm to `mergeSortSteps` but without any step
 * recording, so nothing in the timed region is instrumentation overhead.
 * Runs at any input size.
 */
export function benchmarkMergeSort(input: number[]): SortResult {
  const arr = [...input];
  const stats = emptyStats();
  const start = performance.now();

  function mergeSort(left: number, right: number, depth: number): void {
    stats.recursionDepth = depth;
    stats.maxRecursionDepth = Math.max(stats.maxRecursionDepth, depth);
    if (left >= right) return;
    const mid = Math.floor((left + right) / 2);
    mergeSort(left, mid, depth + 1);
    mergeSort(mid + 1, right, depth + 1);
    merge(left, mid, right);
  }

  function merge(left: number, mid: number, right: number): void {
    const temp: number[] = [];
    let i = left;
    let j = mid + 1;
    while (i <= mid && j <= right) {
      stats.comparisons++;
      stats.arrayAccesses += 2;
      if (arr[i] <= arr[j]) {
        temp.push(arr[i]);
        i++;
      } else {
        temp.push(arr[j]);
        j++;
      }
    }
    while (i <= mid) {
      stats.arrayAccesses++;
      temp.push(arr[i]);
      i++;
    }
    while (j <= right) {
      stats.arrayAccesses++;
      temp.push(arr[j]);
      j++;
    }
    for (let k = 0; k < temp.length; k++) {
      arr[left + k] = temp[k];
      stats.arrayAccesses++;
    }
    stats.merges++;
  }

  if (arr.length > 0) mergeSort(0, arr.length - 1, 0);
  stats.executionTime = performance.now() - start;
  return { stats, output: arr, sorted: isSorted(arr) };
}