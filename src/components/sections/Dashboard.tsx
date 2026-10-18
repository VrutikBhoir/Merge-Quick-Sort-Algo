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
    </div>
  );
}
