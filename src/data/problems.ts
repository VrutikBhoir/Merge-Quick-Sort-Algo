import type { Problem } from '@/types';

export const problems: Problem[] = [
  {
    id: 1,
    question:
      'You are processing 1 million records and need guaranteed O(n log n) performance in the worst case. Which algorithm should you choose?',
    options: ['Quick Sort', 'Merge Sort', 'Both are equally good', 'Neither can guarantee it'],
    correctIndex: 1,
    explanation:
      'Merge Sort guarantees O(n log n) time complexity in all cases — best, average, and worst. Quick Sort can degrade to O(n²) in the worst case (e.g., poor pivot selection on sorted data). For 1 million records where predictable performance is critical, Merge Sort is the safer choice.',
    complexity: 'Merge Sort: O(n log n) worst-case | Quick Sort: O(n²) worst-case',
  },
  {
    id: 2,
    question:
      'You need an in-place sorting algorithm and average-case performance is the main concern. Which algorithm is more suitable?',
    options: ['Merge Sort', 'Quick Sort', 'Both sort in-place', 'Neither sorts in-place'],
    correctIndex: 1,
    explanation:
      'Quick Sort sorts in-place, using only O(log n) extra space for the recursion stack on average. Merge Sort requires O(n) additional memory for the temporary array used during merging. When memory efficiency and average-case speed matter, Quick Sort is preferred.',
    complexity: 'Quick Sort: O(log n) space | Merge Sort: O(n) space',
  },
  {
    id: 3,
    question:
      'The input data is already sorted and Quick Sort always chooses the first element as the pivot. What problem can occur?',
    options: [
      'No problem — it runs faster',
      'It degrades to O(n²) due to maximally unbalanced partitions',
      'It runs out of disk space',
      'The sort produces incorrect results',
    ],
    correctIndex: 1,
    explanation:
      'When the input is already sorted and the first element is always the pivot, every partition splits into an empty left side and n-1 elements on the right. This creates n levels of recursion, each doing O(n) work — resulting in O(n²) time. Using a random or middle-element pivot avoids this.',
    complexity: 'Worst-case Quick Sort: O(n²) | With random pivot: O(n log n) average',
  },
  {
    id: 4,
    question:
      'You are sorting objects where the original relative order of equal elements must be preserved. Which algorithm is preferable?',
    options: ['Quick Sort', 'Merge Sort', 'Both are stable', 'Neither is stable'],
    correctIndex: 1,
    explanation:
      'Merge Sort is a stable sorting algorithm — equal elements retain their original relative order. Quick Sort is not stable because swapping during partitioning can reorder equal elements. When stability matters (e.g., sorting records by a secondary key), Merge Sort is the correct choice.',
    complexity: 'Merge Sort: stable | Quick Sort: not stable',
  },
  {
    id: 5,
    question:
      'Which pivot strategy for Quick Sort helps avoid the O(n²) worst case on already-sorted data?',
    options: ['First element', 'Last element', 'Random or middle element', 'It does not matter'],
    correctIndex: 2,
    explanation:
      'Choosing a random or middle-element pivot avoids the systematic selection of the smallest (or largest) element on sorted data. This produces balanced partitions on average, keeping Quick Sort at O(n log n). First or last element pivots on sorted data guarantee the worst case.',
    complexity: 'Random/middle pivot: O(n log n) average | First/last on sorted: O(n²)',
  },
  {
    id: 6,
    question:
      'A dataset has many duplicate values. Which statement is most accurate?',
    options: [
      'Merge Sort handles duplicates better because it is stable',
      'Quick Sort with naive partitioning may create unbalanced partitions with many duplicates',
      'Duplicates have no effect on either algorithm',
      'Quick Sort always fails with duplicates',
    ],
    correctIndex: 1,
    explanation:
      'With many duplicates and a simple partition scheme (elements ≤ pivot go left), Quick Sort can create unbalanced partitions because many equal elements pile on one side. Three-way partitioning (Dutch National Flag) fixes this. Merge Sort is unaffected by duplicates in terms of balance, and remains stable.',
    complexity: 'Merge Sort: O(n log n) regardless | Quick Sort: can degrade with naive partitioning',
  },
  {
    id: 7,
    question:
      'What is the space complexity of Merge Sort (auxiliary array implementation)?',
    options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
    correctIndex: 2,
    explanation:
      'Merge Sort requires a temporary array of size n during the merge step, giving O(n) auxiliary space. The recursion stack adds O(log n), but the dominant term is O(n). This is the main memory disadvantage compared to Quick Sort.',
    complexity: 'Merge Sort space: O(n)',
  },
  {
    id: 8,
    question:
      'Under what condition does Quick Sort achieve its best-case O(n log n) performance?',
    options: [
      'When the array is sorted',
      'When the pivot always divides the array into nearly equal halves',
      'When there are many duplicates',
      'When the array has one element',
    ],
    correctIndex: 1,
    explanation:
      'Quick Sort performs best when each pivot divides the current partition into two nearly equal subarrays. This gives recursion depth log n with O(n) work per level — O(n log n) total. Good pivot strategies (random, median-of-three) make this likely on average.',
    complexity: 'Best case: O(n log n) when partitions are balanced',
  },
  {
    id: 9,
    question:
      'Why is Merge Sort preferred for sorting linked lists?',
    options: [
      'It does not require random access',
      'It uses less memory',
      'It is faster for all data structures',
      'Quick Sort cannot sort linked lists',
    ],
    correctIndex: 0,
    explanation:
      'Merge Sort does not need random access to elements — it sequentially traverses sublists during merging. Quick Sort relies heavily on random access for partitioning (swapping elements at arbitrary indices), which is inefficient on linked lists. Merge Sort can also merge linked lists in-place without extra memory.',
    complexity: 'Merge Sort on linked lists: O(n log n) time, O(1) extra space',
  },
  {
    id: 10,
    question:
      'Which statement about the two algorithms is most accurate?',
    options: [
      'Quick Sort is always faster than Merge Sort',
      'Merge Sort is always faster than Quick Sort',
      'There is no universally best algorithm — the choice depends on the problem requirements',
      'Both algorithms have the same worst-case complexity',
    ],
    correctIndex: 2,
    explanation:
      'Neither algorithm is universally superior. Merge Sort offers guaranteed O(n log n) and stability at the cost of O(n) memory. Quick Sort offers excellent average-case speed and in-place sorting but can degrade to O(n²). The right choice depends on dataset size, ordering, stability needs, memory constraints, and pivot strategy.',
    complexity: 'Merge Sort: O(n log n) all cases, O(n) space, stable | Quick Sort: O(n log n) avg, O(n²) worst, O(log n) space, not stable',
  },
];
