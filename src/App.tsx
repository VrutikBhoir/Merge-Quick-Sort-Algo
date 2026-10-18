import { useState } from 'react';
import { generateDataset } from '@/utils/dataset';
import type { DatasetType, PivotStrategy } from '@/types';
import { Dashboard } from '@/components/sections/Dashboard';
import { DatasetInput } from '@/components/sections/DatasetInput';
import { MergeSortPanel } from '@/components/sections/MergeSortPanel';
import { QuickSortPanel } from '@/components/sections/QuickSortPanel';
import { Comparison } from '@/components/sections/Comparison';
import { WorstCase } from '@/components/sections/WorstCase';
import { Complexity } from '@/components/sections/Complexity';

const NAV_ITEMS = [
  { id: 'dataset', label: 'Dataset' },
  { id: 'merge-sort', label: 'Merge Sort' },
  { id: 'quick-sort', label: 'Quick Sort' },
  { id: 'comparison', label: 'Compare' },
  { id: 'worst-case', label: 'Worst Case' },
  { id: 'complexity', label: 'Complexity' },
];

function App() {
  const [dataset, setDataset] = useState<number[]>(() => generateDataset('random', 20));
  // The selected type is only ever written, never read, so only the setter is kept.
  // DatasetInput still receives onDatasetTypeChange and fires it exactly as before.
  const [, setDatasetType] = useState<DatasetType>('random');
  const [pivotStrategy, setPivotStrategy] = useState<PivotStrategy>('last');

  const handleDatasetChange = (data: number[]) => setDataset(data);
  const handleDatasetTypeChange = (type: DatasetType) => setDatasetType(type);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14">
            <h1
              className="text-base font-bold tracking-tight text-gray-900 cursor-pointer"
              onClick={() => scrollToSection('dashboard')}
            >
              Merge Sort vs Quick Sort
            </h1>
            <nav className="flex items-center gap-1 overflow-x-auto">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="rounded-lg px-3 py-1.5 text-sm font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100 whitespace-nowrap transition-colors"
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 md:py-10 space-y-6 md:space-y-8">
        <div id="dashboard">
          <Dashboard onStart={() => scrollToSection('dataset')} />
        </div>

        <DatasetInput
          dataset={dataset}
          onDatasetChange={handleDatasetChange}
          onDatasetTypeChange={handleDatasetTypeChange}
        />

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 md:gap-8">
          <MergeSortPanel dataset={dataset} />
          <QuickSortPanel
            dataset={dataset}
            pivotStrategy={pivotStrategy}
            onPivotStrategyChange={setPivotStrategy}
          />
        </div>

        <Comparison dataset={dataset} pivotStrategy={pivotStrategy} />

        <WorstCase />

        <Complexity />
      </main>

      <footer className="border-t border-gray-200 py-4">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-xs text-gray-400">
            Merge Sort vs Quick Sort — Algorithm Efficiency Analyzer · Educational DSA Project
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
