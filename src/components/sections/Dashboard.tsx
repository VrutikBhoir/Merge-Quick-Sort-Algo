interface DashboardProps {
  onStart: () => void;
}

export function Dashboard({ onStart }: DashboardProps) {
  return (
    <div className="space-y-6">
      <div className="text-center py-8">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-3">
          Merge Sort vs Quick Sort
        </h1>
        <p className="max-w-2xl mx-auto text-base text-gray-600">
          Evaluate and compare the efficiency of Merge Sort and Quick Sort under various
          input conditions — visualize the algorithms, benchmark their performance, and
          understand when to choose one over the other.
        </p>
        <button
          onClick={onStart}
          className="mt-6 inline-flex items-center gap-2 rounded-lg px-5 py-2.5 font-medium text-white bg-blue-600 hover:bg-blue-500 transition-colors"
        >
          Start Analysis
          <span aria-hidden>→</span>
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <InfoCard label="Best Case" merge="O(n log n)" quick="O(n log n)" />
        <InfoCard label="Average Case" merge="O(n log n)" quick="O(n log n)" />
        <InfoCard label="Worst Case" merge="O(n log n)" quick="O(n²)" />
        <InfoCard label="Space" merge="O(n)" quick="O(log n)" />
        <InfoCard label="Stable" merge="Yes" quick="No" />
        <InfoCard label="In-Place" merge="No" quick="Yes" />
      </div>
    </div>
  );
}

function InfoCard({ label, merge, quick }: { label: string; merge: string; quick: string }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-3">
      <div className="text-xs font-medium uppercase tracking-wide text-gray-500 mb-1.5">{label}</div>
      <div className="flex justify-between text-sm">
        <span className="text-emerald-600 font-mono">{merge}</span>
        <span className="text-gray-300">·</span>
        <span className="text-blue-600 font-mono">{quick}</span>
      </div>
      <div className="flex justify-between text-[10px] text-gray-400 mt-0.5">
        <span>Merge</span>
        <span>Quick</span>
      </div>
    </div>
  );
}
