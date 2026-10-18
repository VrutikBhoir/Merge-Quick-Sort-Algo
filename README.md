# Merge Sort vs Quick Sort

An interactive React + TypeScript app for evaluating and comparing the efficiency of
Merge Sort and Quick Sort under various input conditions.

You can pick a dataset, step through both algorithms while they sort it, and then run a
headless benchmark that reports measured operation counts and median wall-clock timings
side by side.

## Features

- **Dataset builder** — random, sorted, reverse and duplicates-heavy generators, preset or
  custom sizes (up to 100,000), plus free-form manual number entry.
- **Step-by-step visualizers** for Merge Sort and Quick Sort with play / pause / step /
  restart, a playback-speed slider, and live operation counts per step.
- **Quick Sort pivot strategies** — first, last, middle and random.
- **Side-by-side benchmark** — warm-up runs followed by repeated timed runs, reporting the
  **median** time plus the min–max range, operation counts, recursion depth and a
  correctness check, with measured values clearly separated from theoretical bounds.
- **Worst-case pivot demo** — comparison counts on pre-sorted data across all four pivot
  strategies.
- **Complexity reference** — best / average / worst-case time, space, stability and
  in-place behaviour.

## Getting started

```bash
npm install
npm run dev        # start the dev server (http://localhost:5173)
```

Other scripts:

| Command | What it does |
| --- | --- |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | ESLint (flat config) |
| `npm run typecheck` | `tsc --noEmit` against `tsconfig.app.json` |

## How it is measured

Measurement rules the app follows, so the numbers can be read correctly:

- Copying the input, recording visualization steps and validating the output all happen
  **outside** the timed region.
- Each algorithm is warmed up and then run several times; the **median** is reported rather
  than a single sample.
- Every repetition receives its own copy of the dataset, so runs cannot influence each
  other and both algorithms see equivalent input.
- Operation counts and recursion depth come from the single run whose time was closest to
  the reported median, so the counts and the time describe the same execution.
- **Auxiliary space is a complexity bound, not measured memory.** It is labelled as theory
  everywhere it appears.
- With the `random` pivot strategy the counters legitimately differ between runs; the UI
  says so.

## Project structure

```
src/
├─ algorithms/mergeSort.ts   mergeSortSteps (animation) + benchmarkMergeSort (headless)
├─ algorithms/quickSort.ts   3-way partition; quickSortSteps + benchmarkQuickSort
├─ utils/dataset.ts          generators, manual-input parsing, validation helpers
├─ utils/benchmark.ts        warm-up / repeat / median harness
├─ hooks/useStepAnimation.ts timer-driven step player
├─ constants/                shared UI limits (MAX_ANIMATED_SIZE)
├─ types/                    shared TypeScript types
└─ components/
   ├─ sections/              Dashboard, DatasetInput, MergeSortPanel, QuickSortPanel,
   │                         Comparison, WorstCase, Complexity
   └─ shared/                Section, ArrayVisualization, AlgorithmControls,
                             ProgressBar, StatCard
```

`@/` is aliased to `src/` in both `vite.config.ts` and `tsconfig.app.json`.

## Implementation notes

- Quick Sort uses a **3-way (Dutch National Flag) partition**. This keeps duplicate-heavy
  and all-equal inputs from degenerating into O(n²); equal values are collected into one
  contiguous block. It does more comparisons per pass than a plain Lomuto partition, which
  is the expected trade-off.
- Merge Sort always splits evenly, so it has no input that degrades it past O(n log n).
- Animation is capped at `MAX_ANIMATED_SIZE` (50) elements because each recorded step
  stores a full copy of the array, making the step history O(n² log n) in memory. Larger
  datasets remain fully benchmarkable.
- The animated and benchmarked versions of each algorithm are separate implementations.
  They must be kept in sync by hand.

## Testing

**There is currently no automated test framework in this project.** Correctness has only
been checked manually and by ad-hoc scripts. A minimal setup is proposed below but has
deliberately not been added, because it requires a dependency.

### Proposed setup — Vitest (recommended)

One dev dependency. Vitest reuses the existing Vite pipeline, so the `@/` alias and
TypeScript configuration keep working with no extra config, and it runs in Node with no
browser environment because the algorithms are pure functions.

```bash
npm install -D vitest
```

Add to `package.json` scripts:

```json
"test": "vitest run",
"test:watch": "vitest"
```

Suggested file, `src/algorithms/__tests__/sorting.test.ts`, covering:

| Case | Assertions |
| --- | --- |
| Empty array | output `[]`, `sorted === true`, no steps |
| Single element | output unchanged |
| Already sorted | output unchanged, sorting still correct |
| Reverse sorted | output ascending |
| Random | output matches a reference `sort` |
| Heavy duplicates / all equal | output correct **and** comparison count stays O(n) rather than O(n²) |
| Every pivot strategy | `first`, `last`, `middle`, `random` all produce the reference-sorted output |
| Step recorder | timeline is non-empty, final frame equals the sorted array |
| Recorder cap | `*Steps()` returns `[]` above `MAX_ANIMATED_SIZE` |
| Input immutability | the source array is unchanged after benchmarking |
| Benchmark harness | median of a known sample set is correct |

### Alternative — Node's built-in test runner (zero dependencies)

`node --test` needs no new package, but TypeScript requires the experimental
`--experimental-strip-types` flag on Node 22, and the `@/` alias would need either subpath
imports in `package.json` or a resolution hook. More fragile, but adds nothing to the
dependency tree.

## Known limitations

- No automated tests (see above).
- Timings are wall-clock measurements from the browser tab and remain sensitive to JIT
  state, garbage collection and machine load. Small differences should be treated as noise.
- With the `random` pivot strategy, operation counts are one observed run, not an average.
- Benchmarks run synchronously; very large datasets block the tab while the runs execute.
- The step recorder and the benchmark are separate copies of the same algorithm.