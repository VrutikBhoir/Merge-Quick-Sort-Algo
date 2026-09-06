import { GitMerge, Zap, Scale } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { Section } from '@/components/shared/Section';

export function Conclusion() {
  const { theme } = useTheme();

  return (
    <Section
      id="conclusion"
      title="Final Conclusion"
      subtitle="Both algorithms have their strengths — the right choice depends on your problem."
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className={`rounded-xl border p-6 ${theme === 'dark' ? 'bg-emerald-950/20 border-emerald-900/40' : 'bg-emerald-50 border-emerald-200'}`}>
            <div className="flex items-center gap-3 mb-3">
              <div className="rounded-lg p-2 bg-emerald-500/20">
                <GitMerge className="w-5 h-5 text-emerald-500" />
              </div>
              <h3 className="text-lg font-bold text-emerald-500">Merge Sort</h3>
            </div>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Best when stable sorting and predictable O(n log n) worst-case performance are important.
              It guarantees consistent behavior across all input types, at the cost of O(n) extra memory.
            </p>
          </div>
          <div className={`rounded-xl border p-6 ${theme === 'dark' ? 'bg-blue-950/20 border-blue-900/40' : 'bg-blue-50 border-blue-200'}`}>
            <div className="flex items-center gap-3 mb-3">
              <div className="rounded-lg p-2 bg-blue-500/20">
                <Zap className="w-5 h-5 text-blue-500" />
              </div>
              <h3 className="text-lg font-bold text-blue-500">Quick Sort</h3>
            </div>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Best when average-case speed and low extra memory usage are important, especially with a good pivot strategy.
              It sorts in-place and is typically faster in practice due to cache locality, but can degrade to O(n²).
            </p>
          </div>
        </div>

        <div className={`rounded-xl border p-6 text-center ${theme === 'dark' ? 'bg-gray-900/50 border-gray-800' : 'bg-gray-50 border-gray-200'}`}>
          <div className="flex items-center justify-center gap-3 mb-3">
            <Scale className="w-6 h-6 text-violet-500" />
            <h3 className="text-xl md:text-2xl font-bold">
              There is no universally best sorting algorithm.
            </h3>
          </div>
          <p className={`text-sm md:text-base max-w-2xl mx-auto ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            The right choice depends on your problem's requirements: dataset size, input distribution,
            stability needs, memory constraints, and pivot strategy. Use the tools above to analyze your
            specific scenario and make an informed decision.
          </p>
        </div>
      </div>
    </Section>
  );
}
