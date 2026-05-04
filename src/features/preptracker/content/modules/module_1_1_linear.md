# Linear Data Structures

This module is about using ordered data correctly under pressure. Most senior interview problems that look complex still reduce to arrays, strings, lists, stacks, or queues plus a clear invariant. The goal is not to memorize tricks; the goal is to recognize what property must stay true as you scan or mutate data.

## Arrays: static vs dynamic, Kadane, Boyer-Moore, Dutch National Flag

Arrays are contiguous sequences. Static arrays have fixed capacity and give `O(1)` indexed access. Dynamic arrays wrap a backing array and grow by allocating a larger array and copying old elements. Appending is amortized `O(1)`, but a resize is `O(n)`.

For interviews, arrays are usually about **state while scanning**. Kadane's algorithm tracks the best subarray ending at the current index. The invariant is: at every index, either extend the previous subarray or start fresh at the current element. The global best is updated from that local best.

```text
current = max(nums[i], current + nums[i])
best = max(best, current)
```

Boyer-Moore voting solves majority element when one value appears more than `n / 2` times. Think of it as cancellation: every non-majority value can cancel one majority value, but the majority still survives. The candidate pass finds a possible majority; if the problem does not guarantee one, run a second validation pass.

Dutch National Flag partitions values into three regions: low, mid, and high. The invariant is that everything before `low` is 0, everything after `high` is 2, and `mid` scans the unknown region. When `mid` sees a 2, swap with `high` but do not advance `mid`, because the swapped-in value is still unknown.

- Use arrays when random access and compact memory matter.
- Use prefix sums when repeated range queries appear.
- Use two pointers when the array is sorted or when you maintain a valid window.
- Be careful with empty arrays, all-negative arrays, duplicate values, and off-by-one boundaries.

## Strings: KMP, Rabin-Karp, Z-Algorithm, Manacher

Strings are arrays with domain-specific matching concerns. Simple substring search is `O(nm)` in the worst case. Pattern algorithms exist to avoid rechecking characters.

KMP builds an LPS table, where `lps[i]` is the length of the longest proper prefix of the pattern ending at `i` that is also a suffix. During matching, when a mismatch happens, KMP does not move the text pointer backward; it shifts the pattern using LPS. The interview explanation should focus on **reusing previous comparisons**.

Rabin-Karp uses rolling hash. It is useful when searching many patterns or when comparing windows cheaply. Hash collisions are possible, so production-grade logic verifies actual string equality when hashes match.

The Z-algorithm builds `z[i]`, the length of the substring starting at `i` that matches the prefix. It is useful for pattern search, prefix matching, and string periodicity. The mental model is maintaining a rightmost known matching box `[L, R]`.

Manacher's algorithm finds palindromic radii in linear time by mirroring around centers. It is harder to derive live, so know the concept: previously computed palindrome spans let you skip symmetric work.

- For most interviews, clearly explaining KMP or rolling hash is enough.
- Normalize assumptions: ASCII vs Unicode, case sensitivity, whitespace handling.
- For palindromes, decide early whether you need odd/even centers or transformed strings.

## Linked Lists: singly, doubly, circular, Floyd cycle, LRU cache

Linked lists trade indexed access for cheap pointer updates. Singly linked lists move forward only. Doubly linked lists allow removal when you already have the node. Circular lists connect tail back to head and need careful termination conditions.

Floyd's cycle-finding algorithm uses slow and fast pointers. If a cycle exists, the fast pointer eventually catches the slow pointer. To find the cycle start, reset one pointer to head and move both one step at a time; their meeting point is the entry.

LRU cache is the canonical linked-list design problem. Use:

- A hash map from key to node for `O(1)` lookup.
- A doubly linked list for recency ordering.
- Dummy head and tail nodes to simplify insert/remove.

Every `get` and `put` should move the accessed node to the most-recent side. On capacity overflow, remove the least-recent node from the other side and delete its key from the map.

## Stacks: expression evaluation, monotonic stack, min-stack

A stack models last-in-first-out work. In interviews, stacks often encode "the last unresolved thing".

Expression evaluation uses stacks for operators and operands. Infix expressions require precedence handling; postfix expressions are simpler because operators appear after operands. Parentheses push context and force evaluation boundaries.

Monotonic stacks keep values increasing or decreasing. They solve "next greater", "previous smaller", stock span, histogram area, and similar problems. The invariant is the sorted order of the stack. When the invariant breaks, pop and resolve answers for popped elements.

Min-stack supports `push`, `pop`, `top`, and `getMin` in `O(1)`. Either store pairs `(value, currentMin)` or keep a second stack of minimum values.

## Queues: priority queues, deques, sliding window maximum

A queue models first-in-first-out processing. BFS uses a queue because nodes are processed by distance from the start.

Priority queues process by priority instead of insertion time. They are usually implemented with heaps and give `O(log n)` insertion/removal. Use them for top-k, scheduling, merge-k-sorted lists, and shortest-path frontiers.

Deque supports push/pop at both ends. Sliding window maximum uses a monotonic deque of indices. The deque stores candidate maximum indices in decreasing value order. Remove indices that leave the window from the front. Remove smaller values from the back before adding a new index.

The key invariant: the front of the deque is always the maximum for the current window.
