import { useState } from 'react';
import { Moon, Sun, Menu, X } from 'lucide-react';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';
import { generateDataset } from '@/utils/dataset';
import type { DatasetType, PivotStrategy } from '@/types';
import { Dashboard } from '@/components/sections/Dashboard';
import { DatasetInput } from '@/components/sections/DatasetInput';
import { MergeSortPanel } from '@/components/sections/MergeSortPanel';
import { QuickSortPanel } from '@/components/sections/QuickSortPanel';
import { Comparison } from '@/components/sections/Comparison';
import { Benchmark } from '@/components/sections/Benchmark';
import { WorstCase } from '@/components/sections/WorstCase';
import { Complexity } from '@/components/sections/Complexity';
import { Recommendation } from '@/components/sections/Recommendation';
import { ProblemSolving } from '@/components/sections/ProblemSolving';
import { AnalysisReport } from '@/components/sections/AnalysisReport';
import { Conclusion } from '@/components/sections/Conclusion';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'dataset', label: 'Dataset' },
  { id: 'merge-sort', label: 'Merge Sort' },
  { id: 'quick-sort', label: 'Quick Sort' },
  { id: 'comparison', label: 'Compare' },
  { id: 'benchmark', label: 'Benchmark' },
  { id: 'worst-case', label: 'Worst Case' },
  { id: 'complexity', label: 'Complexity' },
  { id: 'recommendation', label: 'Recommend' },
  { id: 'problem-solving', label: 'Problems' },
  { id: 'report', label: 'Report' },
  { id: 'conclusion', label: 'Conclusion' },
];

function AppContent() {
  const { theme, toggleTheme } = useTheme();
  const [dataset, setDataset] = useState<number[]>(() => generateDataset('random', 20));
  const [datasetType, setDatasetType] = useState<DatasetType>('random');
  const [pivotStrategy, setPivotStrategy] = useState<PivotStrategy>('last');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const handleDatasetChange = (data: number[]) => {
    setDataset(data);
  };

  const handleDatasetTypeChange = (type: DatasetType) => {
    setDatasetType(type);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setMobileNavOpen(false);
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className={`sticky top-0 z-50 border-b backdrop-blur-md transition-colors ${
        theme === 'dark'
          ? 'bg-gray-950/80 border-gray-800'
          : 'bg-white/80 border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setMobileNavOpen(!mobileNavOpen)}
                className={`lg:hidden rounded-lg p-2 ${theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
              >
                {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              <h1 className="text-base md:text-lg font-bold tracking-tight cursor-pointer" onClick={() => scrollToSection('dashboard')}>
                Merge Sort <span className="text-gray-400 font-normal">vs</span> Quick Sort
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <span className={`hidden md:inline text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                Algorithm Efficiency Analyzer
              </span>
              <button
                onClick={toggleTheme}
                className={`rounded-lg p-2 transition-all hover:scale-105 ${theme === 'dark' ? 'bg-gray-800 text-amber-400 hover:bg-gray-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                title="Toggle theme"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1 pb-3 overflow-x-auto">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-all ${
                  theme === 'dark'
                    ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
                    : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Mobile Nav */}
        {mobileNavOpen && (
          <nav className={`lg:hidden border-t px-4 py-3 ${theme === 'dark' ? 'border-gray-800 bg-gray-950' : 'border-gray-200 bg-white'}`}>
            <div className="grid grid-cols-2 gap-1">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`rounded-lg px-3 py-2 text-sm font-medium text-left transition-all ${
                    theme === 'dark'
                      ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
                      : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </nav>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-10 space-y-8 md:space-y-10">
        <Dashboard onStart={() => scrollToSection('dataset')} />

        <DatasetInput dataset={dataset} onDatasetChange={handleDatasetChange} onDatasetTypeChange={handleDatasetTypeChange} />

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 md:gap-10">
          <MergeSortPanel dataset={dataset} />
          <QuickSortPanel
            dataset={dataset}
            pivotStrategy={pivotStrategy}
            onPivotStrategyChange={setPivotStrategy}
          />
        </div>

        <Comparison dataset={dataset} pivotStrategy={pivotStrategy} />

        <Benchmark pivotStrategy={pivotStrategy} />

        <WorstCase />

        <Complexity />

        <Recommendation
          dataset={dataset}
          datasetType={datasetType}
          pivotStrategy={pivotStrategy}
        />

        <ProblemSolving />

        <AnalysisReport
          dataset={dataset}
          datasetType={datasetType}
          pivotStrategy={pivotStrategy}
        />

        <Conclusion />
      </main>

      {/* Footer */}
      <footer className={`border-t py-6 ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
            Merge Sort vs Quick Sort — Algorithm Efficiency Analyzer · Educational DSA Project
          </p>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
