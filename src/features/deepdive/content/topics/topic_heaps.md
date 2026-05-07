# Heaps: binary heap, heapify, heap sort, median in a stream

A heap is a complete binary tree usually stored in an array. For a zero-indexed array, children are `2i + 1` and `2i + 2`; parent is `(i - 1) / 2`.

Min-heaps expose the smallest element; max-heaps expose the largest. Push bubbles up. Pop replaces root with the last element and bubbles down.

Heapify builds a heap in `O(n)` by sinking nodes from the last parent backward. This is faster than inserting each element separately, which is `O(n log n)`.

Heap sort repeatedly extracts the heap root. It is `O(n log n)` and in-place, but not stable.

Median in a stream uses two heaps:

- Max-heap for lower half.
- Min-heap for upper half.
- Keep sizes balanced so the median is either one root or the average of both roots.
