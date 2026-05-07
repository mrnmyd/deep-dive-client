# Queues: priority queues, deques, sliding window maximum

A queue models first-in-first-out processing. BFS uses a queue because nodes are processed by distance from the start.

Priority queues process by priority instead of insertion time. They are usually implemented with heaps and give `O(log n)` insertion/removal. Use them for top-k, scheduling, merge-k-sorted lists, and shortest-path frontiers.

Deque supports push/pop at both ends. Sliding window maximum uses a monotonic deque of indices. The deque stores candidate maximum indices in decreasing value order. Remove indices that leave the window from the front. Remove smaller values from the back before adding a new index.

The key invariant: the front of the deque is always the maximum for the current window.
