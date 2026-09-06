import { useEffect, useState } from 'react';
import { Crosshair, Activity } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { Section } from '@/components/shared/Section';
import { ArrayVisualization } from '@/components/shared/ArrayVisualization';
import { AlgorithmControls } from '@/components/shared/AlgorithmControls';
import { ProgressBar } from '@/components/shared/ProgressBar';
import { StatCard } from '@/components/shared/StatCard';
import { quickSortSteps } from '@/algorithms/quickSort';
import { useStepAnimation } from '@/hooks/useStepAnimation';
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
  const { theme } = useTheme();
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

  const phaseColor: Record<string, string> = {
    'select-pivot': theme === 'dark' ? 'bg-violet-500/20 text-violet-300' : 'bg-violet-100 text-violet-700',
    partition: theme === 'dark' ? 'bg-blue-500/20 text-blue-300' : 'bg-blue-100 text-blue-700',
    compare: theme === 'dark' ? 'bg-red-500/20 text-red-300' : 'bg-red-100 text-red-700',
    swap: theme === 'dark' ? 'bg-amber-500/20 text-amber-300' : 'bg-amber-100 text-amber-700',
    recurse: theme === 'dark' ? 'bg-teal-500/20 text-teal-300' : 'bg-teal-100 text-teal-700',
    done: theme === 'dark' ? 'bg-gray-500/20 text-gray-300' : 'bg-gray-200 text-gray-700',
  };

  return (
    <Section
      id="quick-sort"
      title="Quick Sort Visualization"
      subtitle="Watch how Quick Sort selects a pivot, partitions the array around it, and recurses on each side."
    >
      <div className="space-y-5">
        {/* Pivot strategy selector */}
        <div className="flex items-center gap-3 flex-wrap">
          <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            Pivot Strategy:
          </span>
          <div className="flex gap-1.5">
            {strategies.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => onPivotStrategyChange(value)}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${
                  pivotStrategy === value
                    ? 'bg-violet-600 text-white shadow-md shadow-violet-500/25'
                    : theme === 'dark'
                    ? 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <ArrayVisualization
          array={step?.array ?? dataset}
          comparing={step?.comparing}
          swapping={step?.swapping}
          pivotIndex={step?.pivotIndex}
          sortedRanges={step?.sortedRanges}
          partitionRange={step?.partitionRange}
          maxHeight={220}
          showValues={dataset.length <= 50}
        />

        {step && (
          <div className="flex items-center gap-3">
            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${phaseColor[step.phase] ?? ''}`}>
              <Crosshair className="w-3 h-3" />
              {step.phase.toUpperCase()}
            </span>
            <p className={`text-sm flex-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              {step.description}
            </p>
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
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <StatCard label="Comparisons" value={stats.comparisons.toLocaleString()} accent="blue" />
            <StatCard label="Swaps" value={stats.swaps.toLocaleString()} accent="amber" />
            <StatCard label="Array Accesses" value={stats.arrayAccesses.toLocaleString()} accent="teal" />
            <StatCard label="Max Recursion" value={stats.maxRecursionDepth} accent="red" />
            <StatCard label="Current Depth" value={stats.recursionDepth} accent="purple" />
            <StatCard label="Pivot" value={step?.array[step.pivotIndex] ?? '-'} accent="purple" sublabel={`Strategy: ${pivotStrategy}`} />
          </div>
        )}

        {step && (
          <div className={`rounded-lg p-4 text-sm ${theme === 'dark' ? 'bg-gray-950/50 text-gray-400' : 'bg-gray-50 text-gray-600'}`}>
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4" />
              <span className="font-medium">Current Operation</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div>Partition: <span className="font-mono">[{step.low}..{step.high}]</span></div>
              <div>Pivot index: <span className="font-mono">{step.pivotIndex}</span></div>
              <div>Phase: <span className="font-mono">{step.phase}</span></div>
              <div>Sorted ranges: <span className="font-mono">{step.sortedRanges.length}</span></div>
            </div>
          </div>
        )}
      </div>
    </Section>
  );
}
