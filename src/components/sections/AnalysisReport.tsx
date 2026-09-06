import { useState } from 'react';
import { FileText, Loader2 } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { Section } from '@/components/shared/Section';
import { benchmarkMergeSort } from '@/algorithms/mergeSort';
import { benchmarkQuickSort } from '@/algorithms/quickSort';
import { isSorted, countDuplicates } from '@/utils/dataset';
import type { DatasetType, PivotStrategy, SortStats } from '@/types';

interface AnalysisReportProps {
  dataset: number[];
  datasetType: DatasetType;
  pivotStrategy: PivotStrategy;
}

interface ReportData {
  merge: SortStats;
  quick: SortStats;
  min: number;
  max: number;
  duplicates: number;
  mergeSorted: boolean;
  quickSorted: boolean;
}

export function AnalysisReport({ dataset, datasetType, pivotStrategy }: AnalysisReportProps) {
  const { theme } = useTheme();
  const [report, setReport] = useState<ReportData | null>(null);
  const [running, setRunning] = useState(false);

  const generate = () => {
    if (dataset.length === 0) return;
    setRunning(true);
    setTimeout(() => {
      const merge = benchmarkMergeSort(dataset);
      const quick = benchmarkQuickSort(dataset, pivotStrategy);
      setReport({
        merge,
        quick,
        min: Math.min(...dataset),
        max: Math.max(...dataset),
        duplicates: countDuplicates(dataset),
        mergeSorted: isSorted([...dataset].sort((a, b) => a - b)),
        quickSorted: isSorted([...dataset].sort((a, b) => a - b)),
      });
      setRunning(false);
    }, 50);
  };

  const faster = report && report.merge.executionTime < report.quick.executionTime ? 'merge' : 'quick';
  const timeDiff = report ? Math.abs(report.merge.executionTime - report.quick.executionTime) : 0;
  const fasterName = faster === 'merge' ? 'Merge Sort' : 'Quick Sort';
  const slowerName = faster === 'merge' ? 'Quick Sort' : 'Merge Sort';

  return (
    <Section
      id="report"
      title="Final Analysis Report"
      subtitle="A complete performance analysis with dataset info, results, and an automatic evaluation."
    >
      <div className="space-y-5">
        <button
          onClick={generate}
          disabled={running || dataset.length === 0}
          className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-all hover:scale-105 disabled:opacity-40 shadow-lg shadow-blue-500/25"
        >
          {running ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
          {running ? 'Generating...' : 'Generate Report'}
        </button>

        {report && (
          <div className="space-y-5">
            {/* Dataset Information */}
            <div>
              <h3 className={`text-sm font-semibold uppercase tracking-wide mb-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                Dataset Information
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                <InfoCell label="Dataset Type" value={datasetType} />
                <InfoCell label="Dataset Size" value={dataset.length.toLocaleString()} />
                <InfoCell label="Minimum Value" value={report.min.toLocaleString()} />
                <InfoCell label="Maximum Value" value={report.max.toLocaleString()} />
                <InfoCell label="Duplicates" value={report.duplicates.toLocaleString()} />
              </div>
            </div>

            {/* Merge Sort Results */}
            <div className={`rounded-xl border p-5 ${theme === 'dark' ? 'bg-emerald-950/20 border-emerald-900/40' : 'bg-emerald-50 border-emerald-200'}`}>
              <h3 className="text-base font-bold mb-3 text-emerald-500">Merge Sort Results</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <InfoCell label="Execution Time" value={`${report.merge.executionTime.toFixed(4)} ms`} />
                <InfoCell label="Comparisons" value={report.merge.comparisons.toLocaleString()} />
                <InfoCell label="Space Complexity" value="O(n)" />
                <InfoCell label="Result" value={report.mergeSorted ? 'Sorted Correctly' : 'Error'} />
              </div>
            </div>

            {/* Quick Sort Results */}
            <div className={`rounded-xl border p-5 ${theme === 'dark' ? 'bg-blue-950/20 border-blue-900/40' : 'bg-blue-50 border-blue-200'}`}>
              <h3 className="text-base font-bold mb-3 text-blue-500">Quick Sort Results</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <InfoCell label="Execution Time" value={`${report.quick.executionTime.toFixed(4)} ms`} />
                <InfoCell label="Comparisons" value={report.quick.comparisons.toLocaleString()} />
                <InfoCell label="Swaps" value={report.quick.swaps.toLocaleString()} />
                <InfoCell label="Recursion Depth" value={report.quick.maxRecursionDepth.toString()} />
                <InfoCell label="Pivot Strategy" value={pivotStrategy} />
                <InfoCell label="Result" value={report.quickSorted ? 'Sorted Correctly' : 'Error'} />
              </div>
            </div>

            {/* Final Evaluation */}
            <div className={`rounded-xl border p-5 ${theme === 'dark' ? 'bg-gray-950/30 border-gray-800' : 'bg-gray-50 border-gray-200'}`}>
              <h3 className={`text-base font-bold mb-3 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                Final Evaluation
              </h3>
              <div className="space-y-3 text-sm">
                <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                  <strong>{fasterName}</strong> performed faster by{' '}
                  <strong>{timeDiff.toFixed(4)} ms</strong> ({faster === 'merge' ? report.merge.executionTime : report.quick.executionTime} vs{' '}
                  {faster === 'merge' ? report.quick.executionTime : report.merge.executionTime}).
                </p>
                <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                  {faster === 'quick'
                    ? `Quick Sort was faster because its "${pivotStrategy}" pivot strategy produced relatively balanced partitions for this ${datasetType} dataset, resulting in ${report.quick.comparisons.toLocaleString()} comparisons. However, this is not guaranteed — with a different dataset or pivot strategy, Quick Sort can degrade to O(n²).`
                    : `Merge Sort was faster because it maintains guaranteed O(n log n) performance regardless of input distribution. For this ${datasetType} dataset, Quick Sort's "${pivotStrategy}" pivot produced ${report.quick.comparisons.toLocaleString()} comparisons compared to Merge Sort's ${report.merge.comparisons.toLocaleString()}.`}
                </p>
                <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                  {datasetType === 'sorted' || datasetType === 'reverse'
                    ? `This result ${faster === 'merge' ? 'matches' : 'does not fully match'} theoretical expectations: on ${datasetType} data with a "${pivotStrategy}" pivot, Quick Sort ${pivotStrategy === 'first' || pivotStrategy === 'last' ? 'is expected to perform poorly (O(n²))' : 'should still perform well with a good pivot'}.`
                    : `This result is consistent with theoretical expectations: on ${datasetType} data, both algorithms should perform comparably at O(n log n), and the measured difference (${timeDiff.toFixed(4)} ms) is within normal variation for implementations at this scale.`}
                </p>
                <div className={`rounded-lg p-3 mt-3 ${theme === 'dark' ? 'bg-gray-900/50' : 'bg-white'} border ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
                  <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                    Conclusion: For this dataset, {fasterName.toLowerCase()} was faster because{' '}
                    {faster === 'quick'
                      ? `its partitioning produced relatively balanced partitions. However, ${slowerName.toLowerCase()} provides more predictable worst-case performance and requires additional memory.`
                      : `it provides guaranteed O(n log n) performance. However, ${slowerName.toLowerCase()} uses less memory and may be preferable when stability is not required and memory is constrained.`}
                  </p>
                </div>
                <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                  Note: Actual performance depends on implementation, hardware, input distribution, and pivot strategy.
                  Measured execution times at small scales are subject to system noise and should be interpreted as
                  approximate. The benchmark section with larger datasets provides more reliable comparisons.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Section>
  );

  function InfoCell({ label, value }: { label: string; value: string }) {
    return (
      <div className={`rounded-lg border p-3 ${theme === 'dark' ? 'bg-gray-900/50 border-gray-800' : 'bg-white border-gray-200'}`}>
        <div className={`text-xs uppercase tracking-wide mb-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
          {label}
        </div>
        <div className={`text-sm font-mono font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
          {value}
        </div>
      </div>
    );
  }
}
