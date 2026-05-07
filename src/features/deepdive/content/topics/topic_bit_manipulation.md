# Bit Manipulation: tricks, XOR patterns, bitmask DP, set operations

Bit operations are constant-time tools for set membership, parity, and pruning.

| Trick               | Expression                                | Use                   |
| ------------------- | ----------------------------------------- | --------------------- |
| Test bit `i`        | `(x >> i) & 1`                            | Read flag             |
| Set bit `i`         | `x \| (1 << i)`                           | Add to set            |
| Clear bit `i`       | `x & ~(1 << i)`                           | Remove from set       |
| Toggle bit `i`      | `x ^ (1 << i)`                            | Flip flag             |
| Lowest set bit      | `x & -x`                                  | Iterate bits, Fenwick |
| Drop lowest set bit | `x & (x - 1)`                             | Hamming weight        |
| Power of two        | `x > 0 && (x & (x - 1)) == 0`             | Validation            |
| Count set bits      | `Integer.bitCount(x)`                     | Hamming weight        |
| Iterate subsets     | `for (int s = m; s > 0; s = (s - 1) & m)` | Subset DP             |

**XOR identities**

- `a ^ a = 0`, `a ^ 0 = a`. Used in single-number / two-numbers problems.
- XOR of `[1..n]` is `n` when `n % 4 == 0`, `1` when `n % 4 == 1`, `n + 1` when `n % 4 == 2`, `0` when `n % 4 == 3`.

**Bitmask DP** is the workhorse for "visit every subset" problems where `n ≤ 20` (TSP, assignment).

```java
int n = costs.length;          // assignment problem
int[][] dp = new int[1 << n][n + 1];
// dp[mask][k] = min cost to assign people indicated by mask to first k tasks
```

**Common pitfalls**

- Java integer overflow: `1 << 31` is negative. Use `1L << bit` for bits ≥ 31.
- Operator precedence: parenthesise `(x >> i) & 1`. The `&` binds looser than `==`.
- Sign extension on right shift: prefer `>>>` for unsigned shifts.

**Interview answers**

_Q: How does bitmask DP scale?_
A: `O(2^n × n)` typical. Practical only for `n ≤ 20` (about 20M states). State definition is the hard part — usually "subset visited so far" plus a position.

_Q: How do you find the only number that appears once when others appear three times?_
A: Track bit counts mod 3 across all numbers. Each bit accumulates `count % 3`, leaving the unique number's bit pattern. Or use two registers `ones` and `twos` updated together.

---
