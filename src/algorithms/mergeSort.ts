import type { MergeStep, SortStats } from '@/types';

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

export function mergeSortSteps(input: number[]): MergeStep[] {
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

    const existingIdx = sortedRanges.findIndex(
      (r) => r[0] === left && r[1] === right
    );
    void existingIdx;
    // merge sorted ranges
    const leftIdx = sortedRanges.findIndex((r) => r[0] === left && r[1] === mid);
    const rightIdx = sortedRanges.findIndex((r) => r[0] === mid + 1 && r[1] === right);
    if (leftIdx !== -1) sortedRanges.splice(leftIdx, 1);
    const adj = rightIdx !== -1 ? sortedRanges.findIndex((r) => r[0] === mid + 1 && r[1] === right) : -1;
    if (adj !== -1) sortedRanges.splice(adj, 1);
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

export function benchmarkMergeSort(input: number[]): SortStats {
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
  return stats;
}
