# Searching & Sorting: binary search on answer, quick sort, merge sort

Paradigms are reusable ways of thinking. In interviews, naming the paradigm is less important than explaining _why_ it applies and _which invariant_ the algorithm preserves.

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
