import { useState } from 'react';
import { Lightbulb, Check } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { Section } from '@/components/shared/Section';
import { recommend } from '@/utils/recommendation';
import { benchmarkMergeSort } from '@/algorithms/mergeSort';
import { benchmarkQuickSort } from '@/algorithms/quickSort';
import { countDuplicates } from '@/utils/dataset';
import type { DatasetType, PivotStrategy } from '@/types';

interface RecommendationProps {
  dataset: number[];
  datasetType: DatasetType;
  pivotStrategy: PivotStrategy;
}

export function Recommendation({ dataset, datasetType, pivotStrategy }: RecommendationProps) {
  const { theme } = useTheme();
  const [result, setResult] = useState<ReturnType<typeof recommend> | null>(null);
  const [requiresStability, setRequiresStability] = useState(false);
  const [limitedMemory, setLimitedMemory] = useState(false);

  const handleAnalyze = () => {
    if (dataset.length === 0) return;
    const mergeStats = benchmarkMergeSort(dataset);
    const quickStats = benchmarkQuickSort(dataset, pivotStrategy);
    setResult(
      recommend({
        dataset,
        datasetType,
        size: dataset.length,
        pivotStrategy,
        mergeStats,
        quickStats,
        requiresStability,
        limitedMemory,
      })
    );
  };

  const isMerge = result?.algorithm === 'merge';
  const dupCount = countDuplicates(dataset);

  return (
    <Section
      id="recommendation"
      title="Which Algorithm Should I Choose?"
      subtitle="Set your requirements, analyze the current dataset, and get a recommendation with reasoning."
    >
      <div className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className={`flex items-center gap-3 rounded-lg border p-4 cursor-pointer transition-all ${theme === 'dark' ? 'bg-gray-900/50 border-gray-800 hover:border-gray-700' : 'bg-gray-50 border-gray-200 hover:border-gray-300'} ${requiresStability ? 'ring-2 ring-emerald-500/50' : ''}`}>
            <input
              type="checkbox"
              checked={requiresStability}
              onChange={(e) => setRequiresStability(e.target.checked)}
              className="w-4 h-4 accent-emerald-500"
            />
            <div>
              <span className="text-sm font-medium">Stable sorting required</span>
              <span className={`block text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                Equal elements must keep their original order
              </span>
            </div>
          </label>
          <label className={`flex items-center gap-3 rounded-lg border p-4 cursor-pointer transition-all ${theme === 'dark' ? 'bg-gray-900/50 border-gray-800 hover:border-gray-700' : 'bg-gray-50 border-gray-200 hover:border-gray-300'} ${limitedMemory ? 'ring-2 ring-blue-500/50' : ''}`}>
            <input
              type="checkbox"
              checked={limitedMemory}
              onChange={(e) => setLimitedMemory(e.target.checked)}
              className="w-4 h-4 accent-blue-500"
            />
            <div>
              <span className="text-sm font-medium">Memory is limited</span>
              <span className={`block text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                Prefer in-place sorting to save memory
              </span>
            </div>
          </label>
        </div>

        <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
          Dataset: {dataset.length.toLocaleString()} elements | Type: {datasetType} | Duplicates: {dupCount.toLocaleString()} | Pivot: {pivotStrategy}
        </div>

        <button
          onClick={handleAnalyze}
          disabled={dataset.length === 0}
          className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 font-semibold text-white bg-violet-600 hover:bg-violet-500 transition-all hover:scale-105 disabled:opacity-40 shadow-lg shadow-violet-500/25"
        >
          <Lightbulb className="w-4 h-4" />
          Analyze & Recommend
        </button>

        {result && (
          <div className={`rounded-xl border p-6 animate-slide-up ${isMerge ? (theme === 'dark' ? 'bg-emerald-950/30 border-emerald-900/50' : 'bg-emerald-50 border-emerald-200') : (theme === 'dark' ? 'bg-blue-950/30 border-blue-900/50' : 'bg-blue-50 border-blue-200')}`}>
            <div className="flex items-center gap-3 mb-4">
              <div className={`rounded-lg p-2 ${isMerge ? 'bg-emerald-500/20' : 'bg-blue-500/20'}`}>
                <Check className={`w-5 h-5 ${isMerge ? 'text-emerald-500' : 'text-blue-500'}`} />
              </div>
              <div>
                <h3 className={`text-xl font-bold ${isMerge ? 'text-emerald-500' : 'text-blue-500'}`}>
                  Recommended: {result.title}
                </h3>
              </div>
            </div>
            <p className={`text-sm mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              {result.explanation}
            </p>
            <div>
              <h4 className={`text-xs font-semibold uppercase tracking-wide mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                Reasoning
              </h4>
              <ul className="space-y-1.5">
                {result.reasons.map((reason, i) => (
                  <li key={i} className={`flex items-start gap-2 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    <span className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${isMerge ? 'bg-emerald-500' : 'bg-blue-500'}`} />
                    {reason}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </Section>
  );
}
