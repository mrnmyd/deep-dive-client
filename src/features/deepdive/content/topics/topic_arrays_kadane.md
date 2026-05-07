# Arrays: static vs dynamic, Kadane, Boyer-Moore, Dutch National Flag

This module is about using ordered data correctly under pressure. Most senior interview problems that look complex still reduce to arrays, strings, lists, stacks, or queues plus a clear invariant. The goal is not to memorize tricks; the goal is to recognize what property must stay true as you scan or mutate data.

Arrays are contiguous sequences. Static arrays have fixed capacity and give `O(1)` indexed access. Dynamic arrays wrap a backing array and grow by allocating a larger array and copying old elements. Appending is amortized `O(1)`, but a resize is `O(n)`.

For interviews, arrays are usually about **state while scanning**. Kadane's algorithm tracks the best subarray ending at the current index. The invariant is: at every index, either extend the previous subarray or start fresh at the current element. The global best is updated from that local best.

```text
current = max(nums[i], current + nums[i])
best = max(best, current)
```

Boyer-Moore voting solves majority element when one value appears more than `n / 2` times. Think of it as cancellation: every non-majority value can cancel one majority value, but the majority still survives. The candidate pass finds a possible majority; if the problem does not guarantee one, run a second validation pass.

Dutch National Flag partitions values into three regions: low, mid, and high. The invariant is that everything before `low` is 0, everything after `high` is 2, and `mid` scans the unknown region. When `mid` sees a 2, swap with `high` but do not advance `mid`, because the swapped-in value is still unknown.

- Use arrays when random access and compact memory matter.
- Use prefix sums when repeated range queries appear.
- Use two pointers when the array is sorted or when you maintain a valid window.
- Be careful with empty arrays, all-negative arrays, duplicate values, and off-by-one boundaries.
