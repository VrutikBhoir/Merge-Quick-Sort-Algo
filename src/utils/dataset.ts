import type { DatasetType } from '@/types';

export function generateDataset(
  type: DatasetType,
  size: number,
  seed?: number
): number[] {
  const n = Math.max(1, Math.min(size, 100000));
  let rng = seed ?? Math.floor(Math.random() * 1000000);
  const rand = () => {
    rng = (rng * 1103515245 + 12345) & 0x7fffffff;
    return rng;
  };

  switch (type) {
    case 'random': {
      const arr: number[] = [];
      for (let i = 0; i < n; i++) arr.push(rand() % (n * 3) + 1);
      return arr;
    }
    case 'sorted': {
      const arr: number[] = [];
      let val = 1;
      for (let i = 0; i < n; i++) {
        arr.push(val);
        val += (rand() % 3) + 1;
      }
      return arr;
    }
    case 'reverse': {
      const arr: number[] = [];
      let val = n * 3;
      for (let i = 0; i < n; i++) {
        arr.push(val);
        val -= (rand() % 3) + 1;
      }
      return arr;
    }
    case 'nearly': {
      const arr: number[] = [];
      let val = 1;
      for (let i = 0; i < n; i++) {
        arr.push(val);
        val += (rand() % 3) + 1;
      }
      const swaps = Math.max(1, Math.floor(n * 0.05));
      for (let s = 0; s < swaps; s++) {
        const i = rand() % n;
        const j = rand() % n;
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    }
    case 'duplicates': {
      const pool = n > 20 ? 5 : 3;
      const arr: number[] = [];
      for (let i = 0; i < n; i++) arr.push((rand() % pool) + 1);
      return arr;
    }
    default:
      return [];
  }
}

export function parseManualInput(input: string): number[] {
  return input
    .split(/[,\s\n\t]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
    .map((s) => Number(s))
    .filter((n) => !isNaN(n));
}

export function countDuplicates(arr: number[]): number {
  const seen = new Map<number, number>();
  for (const v of arr) seen.set(v, (seen.get(v) ?? 0) + 1);
  let dup = 0;
  for (const count of seen.values()) if (count > 1) dup += count;
  return dup;
}

export function isSorted(arr: number[]): boolean {
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] < arr[i - 1]) return false;
  }
  return true;
}
