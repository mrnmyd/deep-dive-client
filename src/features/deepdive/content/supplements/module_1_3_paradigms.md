# Algorithm Paradigms — supplement

## Common pitfalls

- Off-by-one in DP indices. Use `[i]` for prefix-of-length-i and shift array access by one.
- Backtracking without pruning timing-out. Validate constraints before recursing.
- Binary search infinite loops from `lo = mid` instead of `lo = mid + 1`. Pick a template and stick to it.
- Quick sort worst case from sorted input. Always randomise the pivot or use median-of-three.

---

## Interview answers

_Q: How do you decide between top-down and bottom-up DP?_
A: Top-down is faster to write and natural when the state graph is sparse (you only visit reachable states). Bottom-up wins on cache locality and avoids recursion overhead — important when `n` is large or stack depth matters. Both have the same time complexity.

_Q: How would you reduce knapsack from `O(nW)` space to `O(W)`?_
A: Iterate items in the outer loop and capacity from `W` down to `w[i]` in the inner loop. Iterating capacity in reverse means `dp[c - w[i]]` still refers to the previous row's value, which is what 0/1 knapsack requires.

_Q: When does greedy beat DP?_
A: When the exchange argument holds — any optimal solution can be locally transformed into the greedy one without loss. Greedy is `O(n log n)` typically (sorting + scan); DP is at least quadratic. If you can prove the greedy choice is safe, prefer it.
