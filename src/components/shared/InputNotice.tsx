import { describeInput, isSorted } from '@/utils/dataset';

interface InputNoticeProps {
  dataset: number[];
  pivotStrategy?: string;
  /** Show the "simulation cannot run" message (raised by pressing Play). */
  showBlocked?: boolean;
}

/**
 * Compact label describing the current dataset, and the reason the step animation is
 * unavailable when there is nothing to reorder.
 *
 * Blocking here is deliberately limited to the visualization. The benchmark still runs
 * the algorithms on this exact input, because the comparison counts on pre-sorted data
 * are the interesting result, not something to hide.
 */
export function InputNotice({ dataset, pivotStrategy, showBlocked = false }: InputNoticeProps) {
  const shape = describeInput(dataset);
  if (shape === 'empty' || shape === 'single' || shape === 'unordered') return null;

  // Non-decreasing: already ascending, or every value identical. Either way a correct
  // sort cannot move anything, so stepping through it would show no change at all.
  const isFlat = isSorted(dataset);
  if (!isFlat) {
    // Reverse sorted still needs real work, so this is informational only.
    return (
      <p className="text-xs text-gray-500">
        <span className="rounded border border-gray-200 bg-gray-100 px-1.5 py-0.5 font-medium">Reverse sorted</span>
        <span className="ml-2">Every element must be reordered, so the simulation can run.</span>
      </p>
    );
  }

  const isAllEqual = shape === 'all-equal';
  const what = isAllEqual ? 'all elements are identical' : 'the array is already in ascending order';
  const label = isAllEqual ? 'All elements identical' : 'Already sorted';

  return (
    <div className="space-y-1">
      <p className="text-xs text-gray-500">
        <span className="rounded border border-amber-200 bg-amber-50 px-1.5 py-0.5 font-medium text-amber-700">
          {label}
        </span>
        <span className="ml-2">
          {what}, so the simulation has nothing to show.
        </span>
      </p>

      {pivotStrategy && (
        <p className="text-xs text-gray-400">
          Benchmarking still runs — the <strong>{pivotStrategy}</strong> pivot is worth comparing on this input.
        </p>
      )}

      {showBlocked && (
        <p
          role="status"
          className="rounded-md border border-amber-200 bg-amber-50 px-2 py-1.5 text-xs text-amber-800"
        >
          Can&apos;t run the simulation: the array is already sorted, so there are no swaps or
          comparisons to step through. Use{' '}
          <strong>Run Comparison</strong> to benchmark this input instead.
        </p>
      )}
    </div>
  );
}