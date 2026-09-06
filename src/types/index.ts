export type PivotStrategy = 'first' | 'last' | 'middle' | 'random';

export type DatasetType =
  | 'random'
  | 'sorted'
  | 'reverse'
  | 'nearly'
  | 'duplicates';

export type Theme = 'light' | 'dark';

export interface SortStats {
  comparisons: number;
  swaps: number;
  arrayAccesses: number;
  recursionDepth: number;
  maxRecursionDepth: number;
  merges: number;
  executionTime: number;
}

export interface MergeStep {
  array: number[];
  left: number;
  mid: number;
  right: number;
  phase: 'divide' | 'merge' | 'compare' | 'done';
  comparing?: [number, number];
  writing?: number;
  sortedRanges: [number, number][];
  description: string;
  stats: SortStats;
}

export interface QuickStep {
  array: number[];
  low: number;
  high: number;
  pivotIndex: number;
  phase: 'select-pivot' | 'partition' | 'compare' | 'swap' | 'recurse' | 'done';
  comparing?: [number, number];
  swapping?: [number, number];
  sortedRanges: [number, number][];
  partitionRange?: [number, number];
  description: string;
  stats: SortStats;
}

export interface BenchmarkResult {
  algorithm: 'merge' | 'quick';
  datasetType: DatasetType;
  size: number;
  stats: SortStats;
  sorted: boolean;
}

export interface BenchmarkRow {
  size: number;
  mergeTime: number;
  quickTime: number;
  mergeComparisons: number;
  quickComparisons: number;
  mergeSwaps: number;
  quickSwaps: number;
  mergeDepth: number;
  quickDepth: number;
}

export interface Problem {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  complexity: string;
}
