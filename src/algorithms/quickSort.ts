import type { QuickStep, SortStats, SortResult, PivotStrategy } from '@/types';
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

function pickPivot(low: number, high: number, strategy: PivotStrategy): number {
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

/** Result of a 3-way partition. */
interface PartitionRange {
  /** First index of the contiguous run equal to the pivot. */
  lt: number;
  /** Last index of the contiguous run equal to the pivot. */
  equalEnd: number;
}

/**
 * Builds the animation timeline.
 *
 * Every step stores a full copy of the array, so the recorded history grows as
 * O(n^2 log n). Inputs larger than MAX_ANIMATED_SIZE are rejected outright and return
 * an empty timeline; callers are expected to check the size first and offer the
 * benchmark instead. Use `benchmarkQuickSort` to measure arrays of any size.
 */
export function quickSortSteps(
  input: number[],
  strategy: PivotStrategy = 'last'
): QuickStep[] {
  if (input.length > MAX_ANIMATED_SIZE) return [];

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

    const pivotIndex = pickPivot(low, high, strategy);
    record('select-pivot', low, high, pivotIndex, `Selected pivot: ${arr[pivotIndex]} (index ${pivotIndex}) using "${strategy}" strategy.`, stats, {
      partitionRange: [low, high],
    });

    const { lt, equalEnd } = partition(low, high, pivotIndex, stats);

    sortedRanges.push([lt, equalEnd]);
    record('done', low, high, lt, `Pivot ${arr[lt]} fixed at indices ${lt}..${equalEnd}. Left side < pivot, right side > pivot.`, stats);

    quickSort(low, lt - 1, depth + 1, stats);
    quickSort(equalEnd + 1, high, depth + 1, stats);
  }

  /**
   * 3-way (Dutch National Flag) partition.
   *
   * After this call the pivot run occupies [lt..equalEnd] in its final sorted
   * position, [low..lt-1] holds only values smaller than the pivot and
   * [equalEnd+1..high] only values larger than it.
   *
   * Collecting equal values into their own block is what stops duplicate-heavy or
   * all-equal input from degenerating into O(n^2): a Lomuto partition sends every
   * equal element to the same side and ends up with n levels of recursion.
   */
  function partition(
    low: number,
    high: number,
    pivotIndex: number,
    stats: SortStats
  ): PartitionRange {
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
    let lt = low;
    let gt = high - 1;
    let i = low;

    while (i <= gt) {
      stats.comparisons++;
      stats.arrayAccesses++;
      record('compare', low, high, high, `Comparing ${arr[i]} with pivot ${pivotValue}.`, stats, {
        comparing: [i, high],
        partitionRange: [low, high],
      });

      if (arr[i] < pivotValue) {
        if (i !== lt) {
          stats.swaps++;
          stats.arrayAccesses += 2;
          [arr[lt], arr[i]] = [arr[i], arr[lt]];
          record('swap', low, high, high, `Swapped ${arr[lt]} and ${arr[i]} (element < pivot moved left).`, stats, {
            swapping: [lt, i],
            partitionRange: [low, high],
          });
        }
        lt++;
        i++;
      } else {
        // Second comparison: only reached when the first one failed.
        stats.comparisons++;
        stats.arrayAccesses++;
        if (arr[i] > pivotValue) {
          if (i !== gt) {
            stats.swaps++;
            stats.arrayAccesses += 2;
            [arr[i], arr[gt]] = [arr[gt], arr[i]];
            record('swap', low, high, high, `Swapped ${arr[i]} and ${arr[gt]} (element > pivot moved right).`, stats, {
              swapping: [i, gt],
              partitionRange: [low, high],
            });
          }
          // arr[gt] is now > pivot; re-examine index i on the next iteration.
          gt--;
        } else {
          i++;
        }
      }
    }

    // arr[high] still holds the pivot value. Move it alongside the equal block so the
    // whole run [lt..equalEnd] is the pivot's final sorted position.
    const equalEnd = gt + 1;
    if (equalEnd !== high) {
      stats.swaps++;
      stats.arrayAccesses += 2;
      [arr[equalEnd], arr[high]] = [arr[high], arr[equalEnd]];
      record('swap', low, high, equalEnd, `Placed pivot ${pivotValue} at its sorted position ${equalEnd}.`, stats, {
        swapping: [equalEnd, high],
        partitionRange: [low, high],
      });
    }

    return { lt, equalEnd };
  }

  const stats = emptyStats();
  record('select-pivot', 0, Math.max(0, arr.length - 1), 0, `Starting Quick Sort on ${arr.length} elements with "${strategy}" pivot strategy.`, stats);
  if (arr.length > 0) {
    quickSort(0, arr.length - 1, 0, stats);
  }
  record('done', 0, Math.max(0, arr.length - 1), 0, `Quick Sort complete. Array is fully sorted.`, stats);

  return steps;
}

/**
 * Headless benchmark — identical algorithm to `quickSortSteps` (same 3-way
 * partition, same pivot strategies) but without any step recording, so nothing in the
 * timed region is instrumentation overhead. Runs at any input size.
 */
export function benchmarkQuickSort(
  input: number[],
  strategy: PivotStrategy = 'last'
): SortResult {
  const arr = [...input];
  const stats = emptyStats();
  const start = performance.now();

  function quickSort(lo: number, hi: number, depth: number): void {
    // `low`/`high` are the loop variables, so the larger partition is handled by
    // iterating rather than by recursing.
    let low = lo;
    let high = hi;

    for (;;) {
      stats.recursionDepth = depth;
      stats.maxRecursionDepth = Math.max(stats.maxRecursionDepth, depth);
      if (low >= high) return;

      const pivotIndex = pickPivot(low, high, strategy);
      const { lt, equalEnd } = partition(low, high, pivotIndex);

      // Recurse into the smaller side and iterate over the larger one. Either order
      // sorts correctly and performs identical work, but iterating on the larger side
      // caps the stack at O(log n) instead of O(n). This matters for adversarial pivot
      // choices: on sorted input the "last" strategy partitions n-1/0 every time, which
      // without this recurses ~n deep and can overflow the call stack on large inputs.
      const leftSize = lt - low;
      const rightSize = high - equalEnd;
      if (leftSize < rightSize) {
        quickSort(low, lt - 1, depth + 1);
        low = equalEnd + 1;
      } else {
        quickSort(equalEnd + 1, high, depth + 1);
        high = lt - 1;
      }
    }
  }

  function partition(low: number, high: number, pivotIndex: number): PartitionRange {
    if (pivotIndex !== high) {
      stats.swaps++;
      stats.arrayAccesses += 2;
      [arr[pivotIndex], arr[high]] = [arr[high], arr[pivotIndex]];
    }
    const pivotValue = arr[high];
    let lt = low;
    let gt = high - 1;
    let i = low;

    while (i <= gt) {
      stats.comparisons++;
      stats.arrayAccesses++;
      if (arr[i] < pivotValue) {
        if (i !== lt) {
          stats.swaps++;
          stats.arrayAccesses += 2;
          [arr[lt], arr[i]] = [arr[i], arr[lt]];
        }
        lt++;
        i++;
      } else {
        stats.comparisons++;
        stats.arrayAccesses++;
        if (arr[i] > pivotValue) {
          if (i !== gt) {
            stats.swaps++;
            stats.arrayAccesses += 2;
            [arr[i], arr[gt]] = [arr[gt], arr[i]];
          }
          gt--;
        } else {
          i++;
        }
      }
    }

    const equalEnd = gt + 1;
    if (equalEnd !== high) {
      stats.swaps++;
      stats.arrayAccesses += 2;
      [arr[equalEnd], arr[high]] = [arr[high], arr[equalEnd]];
    }

    return { lt, equalEnd };
  }

  if (arr.length > 0) quickSort(0, arr.length - 1, 0);
  stats.executionTime = performance.now() - start;
  return { stats, output: arr, sorted: isSorted(arr) };
}