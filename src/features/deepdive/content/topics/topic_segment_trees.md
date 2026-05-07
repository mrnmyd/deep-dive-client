# Segment Trees & Fenwick (BIT): range queries, lazy propagation

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
