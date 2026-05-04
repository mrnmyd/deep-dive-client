# Advanced DSA

These structures and techniques rarely lead an interview, but they unlock problems that linear / tree / graph approaches cannot solve cleanly. They are differentiators at the senior level.

## Union-Find / DSU: path compression, union by rank, Kruskal, connectivity

Union-Find tracks disjoint sets and answers "are these in the same group?" in near-constant time. It powers Kruskal's MST, dynamic connectivity, account merging, and percolation problems.

```java
class DSU {
    int[] parent, rank;

    DSU(int n) {
        parent = new int[n];
        rank = new int[n];
        for (int i = 0; i < n; i++) parent[i] = i;
    }

    int find(int x) {                       // path compression
        if (parent[x] != x) parent[x] = find(parent[x]);
        return parent[x];
    }

    boolean union(int x, int y) {           // union by rank
        int rx = find(x), ry = find(y);
        if (rx == ry) return false;
        if (rank[rx] < rank[ry]) { parent[rx] = ry; }
        else if (rank[rx] > rank[ry]) { parent[ry] = rx; }
        else { parent[ry] = rx; rank[rx]++; }
        return true;
    }
}
```

| Operation     | Amortized        | Without optimisations |
| ------------- | ---------------- | --------------------- |
| `find(x)`     | `O(α(n))` ≈ O(1) | `O(n)`                |
| `union(x, y)` | `O(α(n))`        | `O(n)`                |

**Common pitfalls**

- Forgetting path compression makes `find` linear under adversarial input.
- Union by rank or size is required for the inverse Ackermann bound; without it, complexity is `O(log n)` per operation.
- Tracking component count: decrement on every successful `union`.

**Interview answers**

_Q: When would you reach for DSU?_
A: Whenever the problem is "are these things in the same group?" with no edge weights or with edges streaming in, or when implementing Kruskal. Examples: number of connected components, accounts merge, redundant connection.

_Q: How do you handle weighted union or rollback?_
A: Add a parallel `weight[]` array updated during `find`/`union`; for rollback, store unions in a stack and undo by reverting parent + rank.

---

## Segment Trees & Fenwick (BIT): range queries, lazy propagation

Segment trees answer range queries (sum, min, max, gcd) and apply range updates in `O(log n)`. Fenwick (Binary Indexed) trees do the same for invertible operations using less code and memory.

**Fenwick tree (point update, prefix sum)**

```java
class BIT {
    int[] tree;
    BIT(int n) { tree = new int[n + 1]; }

    void update(int i, int delta) {        // 1-indexed
        for (; i < tree.length; i += i & -i) tree[i] += delta;
    }

    int prefix(int i) {
        int sum = 0;
        for (; i > 0; i -= i & -i) sum += tree[i];
        return sum;
    }

    int range(int l, int r) { return prefix(r) - prefix(l - 1); }
}
```

**Segment tree skeleton (sum, point update)**

```java
int[] seg;
int n;

void build(int[] a) {
    n = a.length;
    seg = new int[4 * n];
    build(1, 0, n - 1, a);
}
void build(int node, int l, int r, int[] a) {
    if (l == r) { seg[node] = a[l]; return; }
    int m = (l + r) >>> 1;
    build(2 * node, l, m, a);
    build(2 * node + 1, m + 1, r, a);
    seg[node] = seg[2 * node] + seg[2 * node + 1];
}
int query(int node, int l, int r, int ql, int qr) {
    if (qr < l || r < ql) return 0;
    if (ql <= l && r <= qr) return seg[node];
    int m = (l + r) >>> 1;
    return query(2 * node, l, m, ql, qr) + query(2 * node + 1, m + 1, r, ql, qr);
}
```

| Structure           | Build        | Query      | Update           | Memory  |
| ------------------- | ------------ | ---------- | ---------------- | ------- |
| Fenwick             | `O(n log n)` | `O(log n)` | `O(log n)`       | `O(n)`  |
| Segment tree        | `O(n)`       | `O(log n)` | `O(log n)`       | `O(4n)` |
| Segment tree + lazy | `O(n)`       | `O(log n)` | `O(log n)` range | `O(4n)` |

**When to pick which**

- Fenwick when the operation is invertible (sum, xor) and updates are point-style.
- Segment tree for non-invertible aggregates (min, max, gcd) or range updates with lazy propagation.

---

## Bit Manipulation: tricks, XOR patterns, bitmask DP, set operations

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

## Greedy: when greedy is provably correct

Greedy picks the locally best option at each step. It works only when the **exchange argument** holds: any optimal solution can be transformed into the greedy one without losing optimality.

**Classic greedy problems**

- Activity selection: sort by end time, take earliest-ending compatible.
- Huffman coding: build a min-heap of frequencies, repeatedly merge the two smallest.
- Jump Game II: track `farthest` reachable in current jump and `currentEnd`; jump when index passes `currentEnd`.
- Gas station circuit: if total gas ≥ total cost, the answer is the index after the position where cumulative deficit was lowest.

**When greedy fails**

- 0/1 knapsack: greedy by value-density does not work; need DP.
- Coin change with arbitrary denominations: greedy fails for `{1, 3, 4}` and target 6.

**Interview answers**

_Q: How do you justify a greedy choice in an interview?_
A: State the invariant the choice preserves, then sketch the exchange argument: assume an optimal solution differs at the first greedy choice; swap in the greedy pick without loss. If you cannot articulate the invariant, fall back to DP.

_Q: How is Huffman optimal?_
A: It is optimal for prefix codes given symbol frequencies. The proof uses the lemma that the two least-frequent symbols are siblings at maximum depth in some optimal tree.
