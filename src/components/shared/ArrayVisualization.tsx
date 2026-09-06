import { useTheme } from '@/context/ThemeContext';

interface ArrayVisualizationProps {
  array: number[];
  comparing?: [number, number];
  swapping?: [number, number];
  pivotIndex?: number;
  writing?: number;
  sortedRanges?: [number, number][];
  partitionRange?: [number, number];
  maxHeight?: number;
  showValues?: boolean;
}

export function ArrayVisualization({
  array,
  comparing,
  swapping,
  pivotIndex,
  writing,
  sortedRanges = [],
  partitionRange,
  maxHeight = 240,
  showValues = true,
}: ArrayVisualizationProps) {
  const { theme } = useTheme();
  const max = Math.max(...array, 1);
  const min = Math.min(...array, 0);
  const range = max - min || 1;

  const isInSortedRange = (idx: number): boolean =>
    sortedRanges.some(([l, r]) => idx >= l && idx <= r);

  const isInPartition = (idx: number): boolean =>
    partitionRange ? idx >= partitionRange[0] && idx <= partitionRange[1] : false;

  const getBarColor = (idx: number): string => {
    if (swapping && (idx === swapping[0] || idx === swapping[1])) {
      return theme === 'dark' ? 'bg-amber-400' : 'bg-amber-500';
    }
    if (comparing && (idx === comparing[0] || idx === comparing[1])) {
      return theme === 'dark' ? 'bg-red-400' : 'bg-red-500';
    }
    if (pivotIndex === idx) {
      return theme === 'dark' ? 'bg-violet-400' : 'bg-violet-500';
    }
    if (writing === idx) {
      return theme === 'dark' ? 'bg-teal-400' : 'bg-teal-500';
    }
    if (isInSortedRange(idx)) {
      return theme === 'dark' ? 'bg-emerald-500' : 'bg-emerald-600';
    }
    if (isInPartition(idx)) {
      return theme === 'dark' ? 'bg-blue-400/60' : 'bg-blue-500/70';
    }
    return theme === 'dark' ? 'bg-gray-600' : 'bg-gray-400';
  };

  if (array.length === 0) {
    return (
      <div className={`flex items-center justify-center rounded-lg border-2 border-dashed h-48 ${theme === 'dark' ? 'border-gray-700 text-gray-500' : 'border-gray-300 text-gray-400'}`}>
        <span className="text-sm">No data to display</span>
      </div>
    );
  }

  const showValuesForBars = showValues && array.length <= 50;

  return (
    <div className={`flex items-end justify-center gap-0.5 rounded-lg p-3 overflow-x-auto ${theme === 'dark' ? 'bg-gray-950/50' : 'bg-gray-50'}`} style={{ minHeight: maxHeight + 20 }}>
      {array.map((val, idx) => {
        const heightPct = ((val - min) / range) * 100;
        const height = Math.max(4, (heightPct / 100) * maxHeight);
        return (
          <div
            key={idx}
            className="flex flex-col items-center justify-end flex-shrink-0"
            style={{ minWidth: array.length > 100 ? 3 : array.length > 50 ? 6 : 24 }}
          >
            {showValuesForBars && (
              <span className={`text-[10px] mb-0.5 font-mono ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                {val}
              </span>
            )}
            <div
              className={`w-full rounded-t-sm transition-all duration-200 ${getBarColor(idx)}`}
              style={{
                height: `${height}px`,
                width: array.length > 100 ? '3px' : array.length > 50 ? '6px' : '20px',
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
