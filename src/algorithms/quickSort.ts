import type { QuickStep, SortStats, PivotStrategy } from '@/types';

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

function pickPivot(arr: number[], low: number, high: number, strategy: PivotStrategy): number {
  switch (strategy) {
    case 'first':
      return low;
    case 'last':
      return high;
    case 'middle':
      return Math.floor((low + high) / 2);
    case 'random':
      return low + Math.floor(Math.random() * (high - low + 1));
    default:
      return high;
  }
}

export function quickSortSteps(
  input: number[],
  strategy: PivotStrategy = 'last'
): QuickStep[] {
  const arr = [...input];
  const steps: QuickStep[] = [];
  const sortedRanges: [number, number][] = [];

  function record(
    phase: QuickStep['phase'],
    low: number,
    high: number,
    pivotIndex: number,
    description: string,
    stats: SortStats,
    extra?: Partial<QuickStep>
  ): void {
    steps.push({
      array: [...arr],
      low,
      high,
      pivotIndex,
      phase,
      sortedRanges: sortedRanges.map((r) => [...r] as [number, number]),
      description,
      stats: cloneStats(stats),
      ...extra,
    });
  }

  function quickSort(low: number, high: number, depth: number, stats: SortStats): void {
    stats.recursionDepth = depth;
    stats.maxRecursionDepth = Math.max(stats.maxRecursionDepth, depth);

    if (low > high) return;
    if (low === high) {
      sortedRanges.push([low, low]);
      record('done', low, high, low, `Element at index ${low} is in its final sorted position.`, stats);
      return;
    }

    const pivotIndex = pickPivot(arr, low, high, strategy);
    record('select-pivot', low, high, pivotIndex, `Selected pivot: ${arr[pivotIndex]} (index ${pivotIndex}) using "${strategy}" strategy.`, stats, {
      partitionRange: [low, high],
    });

    const finalPivot = partition(low, high, pivotIndex, stats);

    sortedRanges.push([finalPivot, finalPivot]);
    record('done', low, high, finalPivot, `Pivot ${arr[finalPivot]} placed at index ${finalPivot}. Left side < pivot, right side > pivot.`, stats);

    quickSort(low, finalPivot - 1, depth + 1, stats);
    quickSort(finalPivot + 1, high, depth + 1, stats);
  }

  function partition(low: number, high: number, pivotIndex: number, stats: SortStats): number {
    // Move pivot to end
    if (pivotIndex !== high) {
      stats.swaps++;
      stats.arrayAccesses += 2;
      [arr[pivotIndex], arr[high]] = [arr[high], arr[pivotIndex]];
      record('swap', low, high, high, `Moved pivot ${arr[high]} to the end for partitioning.`, stats, {
        swapping: [pivotIndex, high],
        partitionRange: [low, high],
      });
    }

    const pivotValue = arr[high];
    let i = low - 1;

    for (let j = low; j < high; j++) {
      stats.comparisons++;
      stats.arrayAccesses += 2;
      record('compare', low, high, high, `Comparing ${arr[j]} with pivot ${pivotValue}.`, stats, {
        comparing: [j, high],
        partitionRange: [low, high],
      });

      if (arr[j] <= pivotValue) {
        i++;
        if (i !== j) {
          stats.swaps++;
          stats.arrayAccesses += 2;
          [arr[i], arr[j]] = [arr[j], arr[i]];
          record('swap', low, high, high, `Swapped ${arr[i]} and ${arr[j]} (element ≤ pivot moved left).`, stats, {
            swapping: [i, j],
            partitionRange: [low, high],
          });
        }
      }
    }

    // Place pivot in correct position
    if (i + 1 !== high) {
      stats.swaps++;
      stats.arrayAccesses += 2;
      [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
      record('swap', low, high, i + 1, `Placed pivot ${pivotValue} at its sorted position ${i + 1}.`, stats, {
        swapping: [i + 1, high],
        partitionRange: [low, high],
      });
    }

    return i + 1;
  }

  const stats = emptyStats();
  record('select-pivot', 0, Math.max(0, arr.length - 1), 0, `Starting Quick Sort on ${arr.length} elements with "${strategy}" pivot strategy.`, stats);
  if (arr.length > 0) {
    quickSort(0, arr.length - 1, 0, stats);
  }
  record('done', 0, Math.max(0, arr.length - 1), 0, `Quick Sort complete. Array is fully sorted.`, stats);

  return steps;
}

export function benchmarkQuickSort(
  input: number[],
  strategy: PivotStrategy = 'last'
): SortStats {
  const arr = [...input];
  const stats = emptyStats();
  const start = performance.now();

  function quickSort(low: number, high: number, depth: number): void {
    stats.recursionDepth = depth;
    stats.maxRecursionDepth = Math.max(stats.maxRecursionDepth, depth);
    if (low > high) return;
    if (low === high) return;

    const pivotIndex = pickPivot(arr, low, high, strategy);
    const finalPivot = partition(low, high, pivotIndex);
    quickSort(low, finalPivot - 1, depth + 1);
    quickSort(finalPivot + 1, high, depth + 1);
  }

  function partition(low: number, high: number, pivotIndex: number): number {
    if (pivotIndex !== high) {
      stats.swaps++;
      stats.arrayAccesses += 2;
      [arr[pivotIndex], arr[high]] = [arr[high], arr[pivotIndex]];
    }
    const pivotValue = arr[high];
    let i = low - 1;
    for (let j = low; j < high; j++) {
      stats.comparisons++;
      stats.arrayAccesses += 2;
      if (arr[j] <= pivotValue) {
        i++;
        if (i !== j) {
          stats.swaps++;
          stats.arrayAccesses += 2;
          [arr[i], arr[j]] = [arr[j], arr[i]];
        }
      }
    }
    if (i + 1 !== high) {
      stats.swaps++;
      stats.arrayAccesses += 2;
      [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    }
    return i + 1;
  }

  if (arr.length > 0) quickSort(0, arr.length - 1, 0);
  stats.executionTime = performance.now() - start;
  return stats;
}
