import { Section } from '@/components/shared/Section';

export function Complexity() {
  const cellBase = 'px-4 py-3 text-sm';
  const headerCell = `${cellBase} font-semibold`;

  const rows = [
    { label: 'Best Case', merge: 'O(n log n)', quick: 'O(n log n)', mergeNote: 'Always divides evenly', quickNote: 'Pivot splits evenly' },
    { label: 'Average Case', merge: 'O(n log n)', quick: 'O(n log n)', mergeNote: 'Independent of input', quickNote: 'Good pivot on average' },
    { label: 'Worst Case', merge: 'O(n log n)', quick: 'O(n²)', mergeNote: 'No worst case', quickNote: 'Poor pivot (e.g., sorted + first)' },
    { label: 'Space', merge: 'O(n)', quick: 'O(log n)', mergeNote: 'Auxiliary array for merging', quickNote: 'Recursion stack only' },
    { label: 'Stable', merge: 'Yes', quick: 'No', mergeNote: 'Equal elements keep order', quickNote: 'Swaps can reorder equals' },
    { label: 'In-Place', merge: 'No', quick: 'Yes', mergeNote: 'Needs extra memory', quickNote: 'Sorts within the array' },
  ];

  return (
    <Section
      id="complexity"
      title="Complexity Analysis"
    >
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className={`${headerCell} text-left text-gray-700`}>Metric</th>
              <th className={`${headerCell} text-left text-emerald-600`}>Merge Sort</th>
              <th className={`${headerCell} text-left text-blue-600`}>Quick Sort</th>
              <th className={`${headerCell} text-left text-gray-500`}>Explanation</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={row.label} className={`border-t border-gray-100 ${i % 2 === 0 ? '' : 'bg-gray-50/50'}`}>
                <td className={`${cellBase} font-medium text-gray-700`}>{row.label}</td>
                <td className={`${cellBase} font-mono text-emerald-600`}>{row.merge}</td>
                <td className={`${cellBase} font-mono text-blue-600`}>{row.quick}</td>
                <td className={`${cellBase} text-gray-600`}>
                  <div className="text-xs">
                    <span className="text-emerald-600">Merge: {row.mergeNote}</span>
                    <br />
                    <span className="text-blue-600">Quick: {row.quickNote}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-gray-400">
        application. Nothing here is timed, counted or verified at runtime.
      </p>
    </Section>
  );
}
