# Dynamic Programming: knapsack, LCS, LIS, edit distance, MCM

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
