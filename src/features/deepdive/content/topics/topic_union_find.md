# Union-Find / DSU: path compression, union by rank, Kruskal, connectivity

These structures and techniques rarely lead an interview, but they unlock problems that linear / tree / graph approaches cannot solve cleanly. They are differentiators at the senior level.

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
