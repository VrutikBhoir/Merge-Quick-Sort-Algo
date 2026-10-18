import { useEffect, useState } from 'react';
import { Section } from '@/components/shared/Section';
import { ArrayVisualization } from '@/components/shared/ArrayVisualization';
import { AlgorithmControls } from '@/components/shared/AlgorithmControls';
import { ProgressBar } from '@/components/shared/ProgressBar';
import { StatCard } from '@/components/shared/StatCard';
import { quickSortSteps } from '@/algorithms/quickSort';
import { useStepAnimation } from '@/hooks/useStepAnimation';
import type { PivotStrategy, QuickStep } from '@/types';

const VIZ_CAP = 50;

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

  useEffect(() => {
    setSteps(quickSortSteps(dataset, pivotStrategy));
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

  const step = steps[currentStep];
  const stats = step?.stats;

  const phaseColors: Record<string, string> = {
    'select-pivot': 'bg-violet-100 text-violet-700',
    partition: 'bg-blue-100 text-blue-700',
    compare: 'bg-red-100 text-red-700',
    swap: 'bg-amber-100 text-amber-700',
    recurse: 'bg-teal-100 text-teal-700',
    done: 'bg-gray-200 text-gray-700',
  };

  const fullArray = step?.array ?? dataset;
  const vizArray = fullArray.length > VIZ_CAP ? fullArray.slice(0, VIZ_CAP) : fullArray;

  return (
    <Section
      id="quick-sort"
      title="Quick Sort Visualization"
      subtitle="Quick Sort selects a pivot, partitions the array around it, and recurses on each side."
    >
      <div className="space-y-4">
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
          showValues={dataset.length <= 50}
        />

        {step && (
          <div className="flex items-center gap-3">
            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${phaseColors[step.phase] ?? ''}`}>
              {step.phase.toUpperCase()}
            </span>
            <p className="text-sm flex-1 text-gray-700">{step.description}</p>
          </div>
        )}

        <ProgressBar value={currentStep + 1} max={totalSteps} accent="blue" />

        <AlgorithmControls
          isPlaying={isPlaying}
          onPlay={play}
          onPause={pause}
          onNext={next}
          onPrev={prev}
          onRestart={restart}
          speed={speed}
          onSpeedChange={setSpeed}
          currentStep={currentStep}
          totalSteps={totalSteps}
        />

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
