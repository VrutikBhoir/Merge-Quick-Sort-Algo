import type { DatasetType, PivotStrategy, SortStats } from '@/types';
import { countDuplicates } from '@/utils/dataset';

export interface RecommendationInput {
  dataset: number[];
  datasetType: DatasetType;
  size: number;
  pivotStrategy: PivotStrategy;
  mergeStats: SortStats;
  quickStats: SortStats;
  requiresStability: boolean;
  limitedMemory: boolean;
}

export interface RecommendationResult {
  algorithm: 'merge' | 'quick';
  title: string;
  explanation: string;
  reasons: string[];
}

export function recommend(input: RecommendationInput): RecommendationResult {
  const {
    dataset,
    datasetType,
    size,
    pivotStrategy,
    mergeStats,
    quickStats,
    requiresStability,
    limitedMemory,
  } = input;

  const duplicates = countDuplicates(dataset);
  const dupRatio = dataset.length > 0 ? duplicates / dataset.length : 0;

  const reasons: string[] = [];
  let mergeScore = 0;
  let quickScore = 0;

  if (requiresStability) {
    mergeScore += 3;
    reasons.push('Stable sorting is required — Merge Sort preserves the relative order of equal elements.');
  } else {
    quickScore += 1;
    reasons.push('Stability is not required, so Quick Sort is viable.');
  }

  if (limitedMemory) {
    quickScore += 2;
    reasons.push('Memory is limited — Quick Sort sorts in-place with O(log n) stack space.');
  } else {
    mergeScore += 1;
    reasons.push('Extra memory is available, so Merge Sort\'s O(n) space overhead is acceptable.');
  }

  if (size >= 10000) {
    mergeScore += 1;
    reasons.push('The dataset is large, making predictable performance valuable.');
  }

  if (datasetType === 'sorted' || datasetType === 'reverse') {
    if (pivotStrategy === 'first' || pivotStrategy === 'last') {
      mergeScore += 3;
      reasons.push(`The dataset is ${datasetType === 'sorted' ? 'already sorted' : 'reverse-sorted'} and the pivot strategy is "${pivotStrategy}", which produces maximally unbalanced partitions — Quick Sort degrades toward O(n²).`);
    } else {
      quickScore += 1;
      reasons.push(`The dataset is ${datasetType === 'sorted' ? 'sorted' : 'reverse-sorted'}, but the "${pivotStrategy}" pivot strategy avoids the worst case.`);
    }
  }

  if (dupRatio > 0.5) {
    mergeScore += 1;
    reasons.push('The dataset has many duplicates, which can cause uneven Quick Sort partitions depending on implementation.');
  }

  if (quickStats.executionTime < mergeStats.executionTime && quickStats.comparisons <= mergeStats.comparisons * 1.5) {
    quickScore += 1;
    reasons.push(`Measured execution time favors Quick Sort (${quickStats.executionTime.toFixed(3)} ms vs ${mergeStats.executionTime.toFixed(3)} ms).`);
  } else {
    mergeScore += 1;
    reasons.push(`Measured execution time favors Merge Sort (${mergeStats.executionTime.toFixed(3)} ms vs ${quickStats.executionTime.toFixed(3)} ms).`);
  }

  const algorithm = mergeScore >= quickScore ? 'merge' : 'quick';

  return {
    algorithm,
    title: algorithm === 'merge' ? 'Merge Sort' : 'Quick Sort',
    explanation:
      algorithm === 'merge'
        ? 'The dataset characteristics and requirements favor Merge Sort. It guarantees O(n log n) time in all cases and provides stable sorting, at the cost of O(n) extra memory.'
        : 'The dataset characteristics and requirements favor Quick Sort. It offers excellent average-case performance with low memory overhead, especially when a good pivot strategy is used.',
    reasons,
  };
}
