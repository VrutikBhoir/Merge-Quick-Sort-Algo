import { useState } from 'react';
import { Shuffle, ArrowUpAZ, ArrowDownAZ, Wand2, Copy, Check } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { Section } from '@/components/shared/Section';
import { ArrayVisualization } from '@/components/shared/ArrayVisualization';
import { generateDataset, parseManualInput } from '@/utils/dataset';
import type { DatasetType } from '@/types';

interface DatasetInputProps {
  dataset: number[];
  onDatasetChange: (data: number[]) => void;
  onDatasetTypeChange: (type: DatasetType) => void;
}

const PRESET_SIZES = [10, 50, 100, 500, 1000, 5000, 10000, 50000];

const datasetButtons: { type: DatasetType; label: string; icon: typeof Shuffle }[] = [
  { type: 'random', label: 'Random', icon: Shuffle },
  { type: 'sorted', label: 'Sorted', icon: ArrowUpAZ },
  { type: 'reverse', label: 'Reverse', icon: ArrowDownAZ },
  { type: 'nearly', label: 'Nearly Sorted', icon: Wand2 },
  { type: 'duplicates', label: 'Duplicate-Heavy', icon: Copy },
];

export function DatasetInput({ dataset, onDatasetChange, onDatasetTypeChange }: DatasetInputProps) {
  const { theme } = useTheme();
  const [size, setSize] = useState(20);
  const [customSize, setCustomSize] = useState('');
  const [manualInput, setManualInput] = useState('38, 27, 43, 3, 9, 82, 10');
  const [activeType, setActiveType] = useState<DatasetType | null>(null);

  const handleGenerate = (type: DatasetType, n: number) => {
    onDatasetChange(generateDataset(type, n));
    setActiveType(type);
    onDatasetTypeChange(type);
  };

  const handleManual = () => {
    const parsed = parseManualInput(manualInput);
    if (parsed.length > 0) {
      onDatasetChange(parsed);
      setActiveType(null);
      onDatasetTypeChange('random');
    }
  };

  const handleCustomSize = () => {
    const n = parseInt(customSize);
    if (n > 0 && n <= 100000) {
      setSize(n);
    }
  };

  return (
    <Section
      id="dataset"
      title="Input Dataset"
      subtitle="Create a dataset to analyze. Choose from preset types, specify a size, or enter your own numbers."
    >
      <div className="space-y-6">
        {/* Dataset type buttons */}
        <div>
          <label className={`text-sm font-medium mb-3 block ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            Dataset Type
          </label>
          <div className="flex flex-wrap gap-2">
            {datasetButtons.map(({ type, label, icon: Icon }) => (
              <button
                key={type}
                onClick={() => handleGenerate(type, size)}
                className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all hover:scale-105 ${
                  activeType === type
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                    : theme === 'dark'
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Size selection */}
        <div>
          <label className={`text-sm font-medium mb-3 block ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            Dataset Size
          </label>
          <div className="flex flex-wrap items-center gap-2">
            {PRESET_SIZES.map((s) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                className={`rounded-lg px-3 py-1.5 text-sm font-mono transition-all ${
                  size === s
                    ? 'bg-blue-600 text-white'
                    : theme === 'dark'
                    ? 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {s.toLocaleString()}
              </button>
            ))}
            <div className="flex items-center gap-1.5">
              <input
                type="number"
                value={customSize}
                onChange={(e) => setCustomSize(e.target.value)}
                placeholder="Custom"
                className={`w-24 rounded-lg px-3 py-1.5 text-sm font-mono border ${
                  theme === 'dark'
                    ? 'bg-gray-800 border-gray-700 text-gray-200'
                    : 'bg-white border-gray-300 text-gray-700'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              <button
                onClick={handleCustomSize}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium ${theme === 'dark' ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                Set
              </button>
            </div>
            <span className={`text-sm ml-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              Current: {size.toLocaleString()} elements
            </span>
          </div>
        </div>

        {/* Manual input */}
        <div>
          <label className={`text-sm font-medium mb-3 block ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            Manual Input
          </label>
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="text"
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value)}
              placeholder="Enter numbers separated by commas"
              className={`flex-1 min-w-[200px] rounded-lg px-4 py-2 text-sm border ${
                theme === 'dark'
                  ? 'bg-gray-800 border-gray-700 text-gray-200'
                  : 'bg-white border-gray-300 text-gray-700'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            <button
              onClick={handleManual}
              className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium bg-blue-600 text-white hover:bg-blue-500 transition-all"
            >
              <Check className="w-4 h-4" />
              Use Manual
            </button>
          </div>
        </div>

        {/* Current dataset display */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Current Dataset ({dataset.length.toLocaleString()} elements)
            </label>
            <span className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
              {dataset.length > 50 ? 'Showing as bars' : 'Showing values and bars'}
            </span>
          </div>
          <ArrayVisualization array={dataset} maxHeight={200} showValues={dataset.length <= 50} />
          {dataset.length <= 50 && (
            <div className={`mt-3 rounded-lg p-3 font-mono text-xs overflow-x-auto ${theme === 'dark' ? 'bg-gray-950/50 text-gray-400' : 'bg-gray-50 text-gray-600'}`}>
              [{dataset.join(', ')}]
            </div>
          )}
        </div>
      </div>
    </Section>
  );
}
