export type PivotStrategy = 'first' | 'last' | 'middle' | 'random';

export type DatasetType = 'random' | 'sorted' | 'reverse' | 'duplicates';

export interface SortStats {
  comparisons: number;
  swaps: number;
  arrayAccesses: number;
  recursionDepth: number;
  maxRecursionDepth: number;
  merges: number;
  executionTime: number;
}

export interface SortResult {
  stats: SortStats;
  output: number[];
  sorted: boolean;
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
