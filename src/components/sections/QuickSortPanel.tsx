import { useEffect, useState } from 'react';
import { Section } from '@/components/shared/Section';
import { ArrayVisualization } from '@/components/shared/ArrayVisualization';
import { AlgorithmControls } from '@/components/shared/AlgorithmControls';
import { ProgressBar } from '@/components/shared/ProgressBar';
import { StatCard } from '@/components/shared/StatCard';
import { quickSortSteps } from '@/algorithms/quickSort';
import { useStepAnimation } from '@/hooks/useStepAnimation';
import { InputNotice } from '@/components/shared/InputNotice';
import { MAX_ANIMATED_SIZE } from '@/constants';
import { isSorted } from '@/utils/dataset';
import type { PivotStrategy, QuickStep } from '@/types';

interface QuickSortPanelProps {
  dataset: number[];
  pivotStrategy: PivotStrategy;
  onPivotStrategyChange: (s: PivotStrategy) => void;
}

const strategies: { value: PivotStrategy; label: string }[] = [
  { value: 'first', label: 'First' },
  { value: 'last', label: 'Last' },
  { value: 'middle', label: 'Middle' },
  { value: 'random', label: 'Random' },
];

export function QuickSortPanel({ dataset, pivotStrategy, onPivotStrategyChange }: QuickSortPanelProps) {
  const [speed, setSpeed] = useState(5);
  const [steps, setSteps] = useState<QuickStep[]>([]);
  const [blockedNotice, setBlockedNotice] = useState(false);

  // Step recording stores a copy of the whole array per step, so it is only done for
  // arrays small enough to animate. Everything above this size uses the benchmark.
  const canAnimate = dataset.length > 0 && dataset.length <= MAX_ANIMATED_SIZE;

  // Nothing to visualise when the array is already non-decreasing: a correct sort
  // performs no swaps, so stepping through it would show an unchanging array. The
  // benchmark is unaffected and still measures this input.
  const alreadySorted = dataset.length > 1 && isSorted(dataset);

  useEffect(() => {
    setSteps(canAnimate && !alreadySorted ? quickSortSteps(dataset, pivotStrategy) : []);
  }, [dataset, pivotStrategy, canAnimate, alreadySorted]);

  useEffect(() => {
    setBlockedNotice(false);
  }, [dataset, pivotStrategy]);

  const totalSteps = steps.length;
  const {
    currentStep,
    isPlaying,
    play,
    pause,
    next,
    prev,
    restart,
  } = useStepAnimation({ totalSteps, speed });

  const handlePlay = () => {
    if (alreadySorted) {
      setBlockedNotice(true);
      return;
    }
    setBlockedNotice(false);
    play();
  };

  const step = steps[currentStep];
  const stats = step?.stats;

  const phaseColors: Record<string, string> = {
    'select-pivot': 'bg-violet-100 text-violet-700',
    compare: 'bg-red-100 text-red-700',
    swap: 'bg-amber-100 text-amber-700',
    done: 'bg-gray-200 text-gray-700',
  };

  const fullArray = step?.array ?? dataset;
  const vizArray = fullArray.length > MAX_ANIMATED_SIZE ? fullArray.slice(0, MAX_ANIMATED_SIZE) : fullArray;

  return (
    <Section
      id="quick-sort"
      title="Quick Sort Visualization"
      subtitle="Quick Sort selects a pivot, partitions the array around it, and recurses on each side."
    >
      <div className="space-y-4">
        <InputNotice dataset={dataset} pivotStrategy={pivotStrategy} showBlocked={blockedNotice} />

        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-sm font-medium text-gray-700">Pivot Strategy:</span>
          <div className="flex gap-1.5">
            {strategies.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => onPivotStrategyChange(value)}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  pivotStrategy === value
                    ? 'bg-violet-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <ArrayVisualization
          array={vizArray}
          comparing={step?.comparing}
          swapping={step?.swapping}
          pivotIndex={step?.pivotIndex}
          sortedRanges={step?.sortedRanges}
          partitionRange={step?.partitionRange}
          maxHeight={200}
          showValues={canAnimate}
        />

        {alreadySorted && (
          <p className="rounded-md bg-gray-50 px-3 py-2 text-xs text-gray-500">
            Simulation paused — this array needs no reordering. The bars above show the final sorted
            order.
          </p>
        )}

        {!alreadySorted && step && (
          <div className="flex items-center gap-3">
            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${phaseColors[step.phase] ?? ''}`}>
              {step.phase.toUpperCase()}
            </span>
            <p className="text-sm flex-1 text-gray-700">{step.description}</p>
          </div>
        )}

        {canAnimate ? (
          <>
            <ProgressBar value={currentStep + 1} max={totalSteps} accent="blue" />

            <AlgorithmControls
              isPlaying={isPlaying}
              onPlay={handlePlay}
              onPause={pause}
              onNext={next}
              onPrev={prev}
              onRestart={restart}
              speed={speed}
              onSpeedChange={setSpeed}
              currentStep={currentStep}
              totalSteps={totalSteps}
            />
          </>
        ) : (
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-gray-700">
            <p className="font-medium text-blue-700 mb-1">
              {dataset.length === 0 ? 'No dataset loaded' : 'Animation unavailable at this size'}
            </p>
            <p>
              {dataset.length === 0
                ? 'Create a dataset above to visualize Quick Sort step by step.'
                : `Step-by-step animation is limited to ${MAX_ANIMATED_SIZE} elements so the browser stays responsive. This dataset has ${dataset.length.toLocaleString()} elements — use "Run Comparison" below to benchmark Quick Sort on it.`}
            </p>
          </div>
        )}

        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            <StatCard label="Comparisons" value={stats.comparisons.toLocaleString()} accent="blue" />
            <StatCard label="Swaps" value={stats.swaps.toLocaleString()} accent="amber" />
            <StatCard label="Array Accesses" value={stats.arrayAccesses.toLocaleString()} accent="teal" />
            <StatCard label="Max Depth" value={stats.maxRecursionDepth} accent="red" />
            <StatCard label="Pivot" value={step?.array[step.pivotIndex] ?? '-'} accent="blue" sublabel={pivotStrategy} />
          </div>
        )}
      </div>
    </Section>
  );
}