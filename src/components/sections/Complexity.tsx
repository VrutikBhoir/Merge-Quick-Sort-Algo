import { useTheme } from '@/context/ThemeContext';
import { Section } from '@/components/shared/Section';

export function Complexity() {
  const { theme } = useTheme();

  const cellBase = `px-4 py-3 text-sm`;
  const headerCell = `${cellBase} font-semibold`;

  const rows = [
    { label: 'Best Case', merge: 'O(n log n)', quick: 'O(n log n)', mergeNote: 'Always divides evenly', quickNote: 'Pivot splits evenly' },
    { label: 'Average Case', merge: 'O(n log n)', quick: 'O(n log n)', mergeNote: 'Independent of input', quickNote: 'Good pivot on average' },
    { label: 'Worst Case', merge: 'O(n log n)', quick: 'O(n²)', mergeNote: 'No worst case!', quickNote: 'Poor pivot (e.g., sorted + first)' },
    { label: 'Space', merge: 'O(n)', quick: 'O(log n)', mergeNote: 'Auxiliary array for merging', quickNote: 'Recursion stack only' },
    { label: 'Stable', merge: 'Yes', quick: 'No', mergeNote: 'Equal elements keep order', quickNote: 'Swaps can reorder equals' },
    { label: 'In-Place', merge: 'No', quick: 'Yes', mergeNote: 'Needs extra memory', quickNote: 'Sorts within the array' },
  ];

  return (
    <Section
      id="complexity"
      title="Complexity Analysis"
      subtitle="What each complexity means in plain language — and how it connects to the performance you observed above."
    >
      <div className="space-y-6">
        <div className={`overflow-x-auto rounded-xl border ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
          <table className="w-full">
            <thead>
              <tr className={theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-50'}>
                <th className={`${headerCell} text-left`}>Metric</th>
                <th className={`${headerCell} text-left text-emerald-500`}>Merge Sort</th>
                <th className={`${headerCell} text-left text-blue-500`}>Quick Sort</th>
                <th className={`${headerCell} text-left ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Explanation</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={row.label} className={`border-t ${theme === 'dark' ? 'border-gray-800' : 'border-gray-100'} ${i % 2 === 0 ? '' : theme === 'dark' ? 'bg-gray-900/30' : 'bg-gray-50/50'}`}>
                  <td className={`${cellBase} font-medium`}>{row.label}</td>
                  <td className={`${cellBase} font-mono text-emerald-500`}>{row.merge}</td>
                  <td className={`${cellBase} font-mono text-blue-500`}>{row.quick}</td>
                  <td className={`${cellBase} ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    <div className="text-xs">
                      <span className="text-emerald-500">Merge: {row.mergeNote}</span>
                      <br />
                      <span className="text-blue-500">Quick: {row.quickNote}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className={`rounded-xl border p-5 ${theme === 'dark' ? 'bg-emerald-950/20 border-emerald-900/40' : 'bg-emerald-50 border-emerald-200'}`}>
            <h3 className="text-lg font-bold mb-3 text-emerald-500">Merge Sort Complexity</h3>
            <ul className="space-y-2 text-sm">
              <li><strong>O(n log n) all cases:</strong> Merge Sort always divides the array in half regardless of input. The division tree has exactly log₂(n) levels, and each level does n comparisons during merging. This is why it never degrades.</li>
              <li><strong>O(n) space:</strong> The merge step copies elements into a temporary array of size n. This is the main trade-off — predictable time at the cost of memory.</li>
              <li><strong>Stable:</strong> When merging, if two elements are equal, the one from the left half comes first — preserving original order.</li>
            </ul>
          </div>
          <div className={`rounded-xl border p-5 ${theme === 'dark' ? 'bg-blue-950/20 border-blue-900/40' : 'bg-blue-50 border-blue-200'}`}>
            <h3 className="text-lg font-bold mb-3 text-blue-500">Quick Sort Complexity</h3>
            <ul className="space-y-2 text-sm">
              <li><strong>O(n log n) average:</strong> With a good pivot, the partition splits roughly in half, giving log n levels of recursion with n work each — same as Merge Sort.</li>
              <li><strong>O(n²) worst case:</strong> If the pivot is always the smallest or largest element, partitions are maximally unbalanced. The recursion tree has n levels instead of log n, each doing O(n) work.</li>
              <li><strong>O(log n) space:</strong> Quick Sort sorts in-place — no auxiliary array. Only the recursion stack uses extra memory, which is O(log n) on average but O(n) in the worst case.</li>
              <li><strong>Not stable:</strong> The partitioning step swaps non-adjacent elements, which can reorder equal elements.</li>
            </ul>
          </div>
        </div>

        <div className={`rounded-lg p-4 text-sm ${theme === 'dark' ? 'bg-gray-950/50 text-gray-400' : 'bg-gray-50 text-gray-600'}`}>
          <p>
            <strong>Connecting theory to observation:</strong> When you ran the benchmark above, you likely saw Quick Sort
            perform comparably to or faster than Merge Sort on random data — that's the O(n log n) average case with
            excellent cache locality. But on sorted or reverse-sorted data with a "first" or "last" pivot, Quick Sort's
            comparisons exploded — that's the O(n²) worst case. Merge Sort stayed consistent across all dataset types
            because its complexity is input-independent.
          </p>
        </div>
      </div>
    </Section>
  );
}
