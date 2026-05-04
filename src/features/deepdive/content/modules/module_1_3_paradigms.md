# Algorithm Paradigms

Paradigms are reusable ways of thinking. In interviews, naming the paradigm is less important than explaining _why_ it applies and _which invariant_ the algorithm preserves.

## Searching & Sorting: binary search on answer, quick sort, merge sort

Binary search is not limited to sorted arrays. It applies whenever there is a monotonic predicate — "false false false true true true" — and you want the boundary.

**Classic binary search template**

```java
int binarySearch(int[] a, int target) {
    int lo = 0, hi = a.length - 1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;          // avoid overflow
        if (a[mid] == target) return mid;
        if (a[mid] < target) lo = mid + 1;
        else                  hi = mid - 1;
    }
    return -1;
}
```

**Binary search on the answer**

When the question is "smallest x such that property holds", search the value space, not the index space.

```java
// Koko eating bananas: minimum integer eating speed to finish in h hours
int minEatingSpeed(int[] piles, int h) {
    int lo = 1, hi = Arrays.stream(piles).max().getAsInt();
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        long hours = 0;
        for (int p : piles) hours += (p + mid - 1) / mid;     // ceil
        if (hours <= h) hi = mid;                             // feasible — try smaller
        else            lo = mid + 1;
    }
    return lo;
}
```

The trick is writing `can(x)` (the feasibility check) correctly. Once that is right, the binary search itself is mechanical.

**Quick sort vs merge sort**

| Property     | Quick sort                          | Merge sort                                   |
| ------------ | ----------------------------------- | -------------------------------------------- |
| Average time | `O(n log n)`                        | `O(n log n)`                                 |
| Worst case   | `O(n²)` (mitigated by random pivot) | `O(n log n)`                                 |
| Space        | `O(log n)` recursion                | `O(n)`                                       |
| Stable       | No                                  | Yes                                          |
| In-place     | Yes                                 | No                                           |
| Best for     | Arrays in cache                     | Linked lists, external sort, inversion count |

---

## Backtracking: choose, explore, unchoose

Backtracking is depth-first search through a solution space, with pruning when a partial solution becomes invalid.

**N-Queens**

```java
List<List<String>> solveNQueens(int n) {
    List<List<String>> result = new ArrayList<>();
    int[] cols = new int[n];                           // cols[row] = column of queen
    Arrays.fill(cols, -1);
    boolean[] colUsed = new boolean[n];
    boolean[] diag1 = new boolean[2 * n];              // r + c
    boolean[] diag2 = new boolean[2 * n];              // r - c + n

    backtrack(0, n, cols, colUsed, diag1, diag2, result);
    return result;
}

void backtrack(int row, int n, int[] cols, boolean[] cu, boolean[] d1, boolean[] d2,
               List<List<String>> result) {
    if (row == n) { result.add(format(cols, n)); return; }
    for (int c = 0; c < n; c++) {
        if (cu[c] || d1[row + c] || d2[row - c + n]) continue;
        cols[row] = c; cu[c] = d1[row + c] = d2[row - c + n] = true;
        backtrack(row + 1, n, cols, cu, d1, d2, result);
        cu[c] = d1[row + c] = d2[row - c + n] = false;     // unchoose
    }
}
```

**Backtracking checklist**

- What is the decision at each step? (Pick a column for this row.)
- What state do you mutate? (Used columns, diagonals.)
- What invalidates a partial solution? (Conflict on column or diagonal.)
- When do you record an answer? (Reached the last row.)
- Do you mutate-and-undo, or copy state? Copying is safer but quadratic.

**Pruning is the difference between accepted and TLE.** Verify constraints before recursing, not after.

---

## Dynamic Programming

DP applies when there are overlapping subproblems and optimal substructure. Two variants: top-down memoisation (recursion + cache) and bottom-up tabulation (iterative).

**Define state in plain English first.** Then transition, base case, and answer.

### 0/1 Knapsack

State: `dp[i][c]` = best value using the first `i` items with capacity `c`.
Transition: skip item `i` (`dp[i-1][c]`) or take item `i` (`dp[i-1][c - w[i]] + v[i]`).
Answer: `dp[n][W]`.

```java
int knapsack(int W, int[] w, int[] v) {
    int n = w.length;
    int[][] dp = new int[n + 1][W + 1];
    for (int i = 1; i <= n; i++) {
        for (int c = 0; c <= W; c++) {
            dp[i][c] = dp[i - 1][c];
            if (c >= w[i - 1])
                dp[i][c] = Math.max(dp[i][c], dp[i - 1][c - w[i - 1]] + v[i - 1]);
        }
    }
    return dp[n][W];
}
```

**Space optimisation**: only the previous row matters, so `dp` can be `O(W)`. Iterate capacity backward to avoid using `dp[i]` mid-row.

### Longest Common Subsequence

```java
int lcs(String a, String b) {
    int n = a.length(), m = b.length();
    int[][] dp = new int[n + 1][m + 1];
    for (int i = 1; i <= n; i++)
        for (int j = 1; j <= m; j++)
            dp[i][j] = a.charAt(i - 1) == b.charAt(j - 1)
                ? dp[i - 1][j - 1] + 1
                : Math.max(dp[i - 1][j], dp[i][j - 1]);
    return dp[n][m];
}
```

### Longest Increasing Subsequence

`O(n²)` DP: `dp[i] = 1 + max(dp[j])` for `j < i, a[j] < a[i]`.

`O(n log n)` patience sort: maintain `tails[k]` = smallest tail of any increasing subsequence of length `k + 1`. On each `a[i]`, binary-search the leftmost `tails[k] >= a[i]` and replace it; final length of `tails` is the answer.

```java
int lengthOfLIS(int[] nums) {
    int[] tails = new int[nums.length];
    int len = 0;
    for (int x : nums) {
        int idx = Arrays.binarySearch(tails, 0, len, x);
        if (idx < 0) idx = -(idx + 1);
        tails[idx] = x;
        if (idx == len) len++;
    }
    return len;
}
```

### Edit Distance

State `dp[i][j]` = min ops to convert `a[0..i)` to `b[0..j)`.
Transition: insert (`dp[i][j-1] + 1`), delete (`dp[i-1][j] + 1`), replace (`dp[i-1][j-1] + (a[i] == b[j] ? 0 : 1)`).

### DP complexity table

| Problem       | Time         | Space (compressed) |
| ------------- | ------------ | ------------------ |
| 0/1 Knapsack  | `O(nW)`      | `O(W)`             |
| LCS           | `O(nm)`      | `O(min(n, m))`     |
| LIS           | `O(n log n)` | `O(n)`             |
| Edit Distance | `O(nm)`      | `O(min(n, m))`     |
| Matrix Chain  | `O(n³)`      | `O(n²)`            |

### How to recognise a DP problem

- "Maximum / minimum / count of ways" + a recursive structure.
- The brute-force solution has overlapping subproblems.
- Future choices depend only on a small piece of past state (the DP state).

If you cannot articulate the state, you don't have a DP solution yet — keep restating until you can.

---

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
