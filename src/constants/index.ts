/**
 * Shared UI limits.
 *
 * The bar visualization can only meaningfully render the values it is given, and the
 * step recorders store a full array copy per step (O(n^2 log n) memory). Both only
 * make sense for small arrays, so the step recorders are capped at this size and the
 * panels fall back to benchmarking-only behaviour above it.
 *
 * This is a design limit chosen to keep the browser responsive. It is NOT a
 * measurement of how much memory the app actually uses.
 */
export const MAX_ANIMATED_SIZE = 50;