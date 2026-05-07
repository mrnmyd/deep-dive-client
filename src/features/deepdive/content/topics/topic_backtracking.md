# Backtracking: N-Queens, Sudoku, subset sum, rat in a maze

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
