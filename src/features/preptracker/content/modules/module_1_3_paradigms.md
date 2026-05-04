# Algorithm Paradigms

Paradigms are reusable ways of thinking. In interviews, naming the paradigm is less important than explaining why it applies.

## Searching & Sorting: binary search on answer, quick sort, merge sort

Binary search is not limited to sorted arrays. It applies whenever there is a monotonic predicate: false false false true true true. "Binary search on answer" asks you to search the smallest or largest feasible value.

Examples include minimum ship capacity, Koko eating speed, maximum minimum distance, and allocation problems. The key is writing `can(x)` correctly.

Quick sort partitions around a pivot and recursively sorts both sides. Average time is `O(n log n)`, worst case is `O(n^2)`. Randomized pivot or median-of-three reduces bad cases.

Merge sort splits, sorts halves, and merges. It is stable and always `O(n log n)`, but usually needs `O(n)` extra space. It is useful for linked lists and inversion count.

## Backtracking: N-Queens, Sudoku, subset sum, rat in a maze

Backtracking is controlled brute force. The structure is: choose, explore, unchoose. The power comes from pruning invalid paths early.

N-Queens tracks used columns and diagonals. Sudoku tracks row, column, and box constraints. Subset sum explores include/exclude choices. Maze problems explore directions while marking visited cells.

Strong backtracking explanations include:

- What is the decision at each step?
- What state must be updated?
- What makes a partial solution invalid?
- When do we record a complete answer?

Avoid copying large state on every recursion unless needed. Mutate and undo when safe.

## Dynamic Programming: knapsack, LCS, LIS, edit distance, MCM

Dynamic programming applies when a problem has overlapping subproblems and optimal substructure. First define the state in plain English. Then define transition, base cases, and answer extraction.

0/1 knapsack state can be `dp[i][capacity]`: best value using first `i` items and capacity `capacity`. Transition is choose or skip.

LCS state is `dp[i][j]`: longest common subsequence between prefixes `a[0..i)` and `b[0..j)`. If characters match, extend; otherwise take max of skipping one character.

LIS can be `O(n^2)` DP or `O(n log n)` patience sorting. The faster version tracks the smallest tail for each subsequence length.

Edit distance state is min operations to convert prefixes. Operations are insert, delete, replace.

Matrix Chain Multiplication is interval DP. State `dp[i][j]` is minimum cost to multiply matrices `i..j`; try every split `k`.
