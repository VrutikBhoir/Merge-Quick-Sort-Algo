import { useState } from 'react';
import { Section } from '@/components/shared/Section';
import { ArrayVisualization } from '@/components/shared/ArrayVisualization';
import { generateDataset, parseManualInput } from '@/utils/dataset';
import type { DatasetType } from '@/types';

const PRESET_SIZES = [10, 20, 50, 100, 500, 1000];
const VIZ_CAP = 50;

interface DatasetInputProps {
  dataset: number[];
  onDatasetChange: (data: number[]) => void;
  onDatasetTypeChange: (type: DatasetType) => void;
}

const datasetButtons: { type: DatasetType; label: string }[] = [
  { type: 'random', label: 'Random' },
  { type: 'sorted', label: 'Sorted' },
  { type: 'reverse', label: 'Reverse' },
  { type: 'duplicates', label: 'Duplicates' },
];

export function DatasetInput({ dataset, onDatasetChange, onDatasetTypeChange }: DatasetInputProps) {
  const [size, setSize] = useState(20);
  const [customSize, setCustomSize] = useState('');
  const [manualInput, setManualInput] = useState('38, 27, 43, 3, 9, 82, 10');
  const [activeType, setActiveType] = useState<DatasetType | null>('random');

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
    if (n > 0 && n <= 100000) setSize(n);
  };

  const vizArray = dataset.length > VIZ_CAP ? dataset.slice(0, VIZ_CAP) : dataset;

  return (
    <Section
      id="dataset"
      title="Input Dataset"
      subtitle="Create a dataset to analyze. Choose a type and size, or enter your own numbers."
    >
      <div className="space-y-5">
        <div>
          <label className="text-sm font-medium mb-2 block text-gray-700">Dataset Type</label>
          <div className="flex flex-wrap gap-2">
            {datasetButtons.map(({ type, label }) => (
              <button
                key={type}
                onClick={() => handleGenerate(type, size)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  activeType === type
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block text-gray-700">Dataset Size</label>
          <div className="flex flex-wrap items-center gap-2">
            {PRESET_SIZES.map((s) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                className={`rounded-lg px-3 py-1.5 text-sm font-mono transition-colors ${
                  size === s ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
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
                className="w-24 rounded-lg px-3 py-1.5 text-sm font-mono border border-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleCustomSize}
                className="rounded-lg px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                Set
              </button>
            </div>
            <span className="text-sm text-gray-500">Current: {size.toLocaleString()}</span>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block text-gray-700">Manual Input</label>
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="text"
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value)}
              placeholder="Enter numbers separated by commas"
              className="flex-1 min-w-[200px] rounded-lg px-4 py-2 text-sm border border-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleManual}
              className="rounded-lg px-4 py-2 text-sm font-medium bg-blue-600 text-white hover:bg-blue-500"
            >
              Use Manual
            </button>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">
              Current Dataset ({dataset.length.toLocaleString()} elements)
            </label>
            {dataset.length > VIZ_CAP && (
              <span className="text-xs text-gray-400">Showing first {VIZ_CAP} as bars</span>
            )}
          </div>
          <ArrayVisualization
            array={vizArray}
            maxHeight={180}
            showValues={dataset.length <= 50}
          />
          {dataset.length <= 50 && (
            <div className="mt-2 rounded-lg p-3 font-mono text-xs overflow-x-auto bg-gray-50 text-gray-600">
              [{dataset.join(', ')}]
            </div>
          )}
        </div>
      </div>
    </Section>
  );
}
