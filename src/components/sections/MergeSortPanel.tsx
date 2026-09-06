import { useEffect, useMemo, useState } from 'react';
import { GitMerge, Activity } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { Section } from '@/components/shared/Section';
import { ArrayVisualization } from '@/components/shared/ArrayVisualization';
import { AlgorithmControls } from '@/components/shared/AlgorithmControls';
import { ProgressBar } from '@/components/shared/ProgressBar';
import { StatCard } from '@/components/shared/StatCard';
import { mergeSortSteps } from '@/algorithms/mergeSort';
import { useStepAnimation } from '@/hooks/useStepAnimation';
import type { MergeStep } from '@/types';

interface MergeSortPanelProps {
  dataset: number[];
}

export function MergeSortPanel({ dataset }: MergeSortPanelProps) {
  const { theme } = useTheme();
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

  const phaseColor: Record<string, string> = {
    divide: theme === 'dark' ? 'bg-blue-500/20 text-blue-300' : 'bg-blue-100 text-blue-700',
    merge: theme === 'dark' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-emerald-100 text-emerald-700',
    compare: theme === 'dark' ? 'bg-red-500/20 text-red-300' : 'bg-red-100 text-red-700',
    done: theme === 'dark' ? 'bg-gray-500/20 text-gray-300' : 'bg-gray-200 text-gray-700',
  };

  return (
    <Section
      id="merge-sort"
      title="Merge Sort Visualization"
      subtitle="Watch how Merge Sort divides the array into single elements, then merges them back in sorted order."
    >
      <div className="space-y-5">
        <ArrayVisualization
          array={step?.array ?? dataset}
          comparing={step?.comparing}
          writing={step?.writing}
          sortedRanges={step?.sortedRanges}
          maxHeight={220}
          showValues={dataset.length <= 50}
        />

        {step && (
          <div className="flex items-center gap-3">
            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${phaseColor[step.phase] ?? ''}`}>
              <GitMerge className="w-3 h-3" />
              {step.phase.toUpperCase()}
            </span>
            <p className={`text-sm flex-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              {step.description}
            </p>
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
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <StatCard label="Comparisons" value={stats.comparisons.toLocaleString()} accent="blue" />
            <StatCard label="Array Accesses" value={stats.arrayAccesses.toLocaleString()} accent="teal" />
            <StatCard label="Merges" value={stats.merges.toLocaleString()} accent="green" />
            <StatCard label="Recursion Depth" value={stats.maxRecursionDepth} accent="amber" />
            <StatCard label="Current Depth" value={stats.recursionDepth} accent="purple" />
            <StatCard label="Space (O(n))" value={`${dataset.length.toLocaleString()}`} accent="red" sublabel="Auxiliary array" />
          </div>
        )}

        {step && (
          <div className={`rounded-lg p-4 text-sm ${theme === 'dark' ? 'bg-gray-950/50 text-gray-400' : 'bg-gray-50 text-gray-600'}`}>
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4" />
              <span className="font-medium">Current Operation</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div>Subarray: <span className="font-mono">[{step.left}..{step.right}]</span></div>
              <div>Mid: <span className="font-mono">{step.mid}</span></div>
              <div>Phase: <span className="font-mono">{step.phase}</span></div>
              <div>Sorted ranges: <span className="font-mono">{step.sortedRanges.length}</span></div>
            </div>
          </div>
        )}
      </div>
    </Section>
  );
}
