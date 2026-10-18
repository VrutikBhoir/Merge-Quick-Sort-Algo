import { useEffect, useMemo, useState } from 'react';
import { Section } from '@/components/shared/Section';
import { ArrayVisualization } from '@/components/shared/ArrayVisualization';
import { AlgorithmControls } from '@/components/shared/AlgorithmControls';
import { ProgressBar } from '@/components/shared/ProgressBar';
import { StatCard } from '@/components/shared/StatCard';
import { mergeSortSteps } from '@/algorithms/mergeSort';
import { useStepAnimation } from '@/hooks/useStepAnimation';
import type { MergeStep } from '@/types';

const VIZ_CAP = 50;

interface MergeSortPanelProps {
  dataset: number[];
}

export function MergeSortPanel({ dataset }: MergeSortPanelProps) {
  const [speed, setSpeed] = useState(5);
  const [steps, setSteps] = useState<MergeStep[]>([]);

  useEffect(() => {
    setSteps(mergeSortSteps(dataset));
  }, [dataset]);

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
    divide: 'bg-blue-100 text-blue-700',
    merge: 'bg-emerald-100 text-emerald-700',
    compare: 'bg-red-100 text-red-700',
    done: 'bg-gray-200 text-gray-700',
  };

  const fullArray = step?.array ?? dataset;
  const vizArray = fullArray.length > VIZ_CAP ? fullArray.slice(0, VIZ_CAP) : fullArray;

  return (
    <Section
      id="merge-sort"
      title="Merge Sort Visualization"
      subtitle="Merge Sort divides the array into single elements, then merges them back in sorted order."
    >
      <div className="space-y-4">
        <ArrayVisualization
          array={vizArray}
          comparing={step?.comparing}
          writing={step?.writing}
          sortedRanges={step?.sortedRanges}
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

        <ProgressBar value={currentStep + 1} max={totalSteps} accent="green" />

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
            <StatCard label="Array Accesses" value={stats.arrayAccesses.toLocaleString()} accent="teal" />
            <StatCard label="Merges" value={stats.merges.toLocaleString()} accent="green" />
            <StatCard label="Max Depth" value={stats.maxRecursionDepth} accent="amber" />
            <StatCard label="Aux. Space" value={`O(n)`} accent="red" sublabel={`${dataset.length.toLocaleString()} elements`} />
          </div>
        )}
      </div>
    </Section>
  );
}
