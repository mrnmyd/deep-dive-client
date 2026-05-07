# Advanced Java — supplement

## Common pitfalls

- Catching `InterruptedException` and ignoring it. At minimum, restore the flag with `Thread.currentThread().interrupt()`.
- Using `==` instead of `equals` on `Long`, `Integer` etc. above the cache range (-128 to 127). Always use `equals` for boxed numbers.
- Forgetting to close resources. Use try-with-resources for `AutoCloseable`.
- Mutating shared `HashMap` from multiple threads. Replace with `ConcurrentHashMap`.

---

## Interview answers

_Q: Difference between `synchronized` and `ReentrantLock`?_
A: `synchronized` is simpler, automatically released on exception, and supports condition variables only via `wait/notify` on the lock object. `ReentrantLock` adds try-lock with timeout, interruptible acquisition, fairness, multiple `Condition` instances, and explicit lock/unlock. Use `synchronized` by default; switch when you need its specific features.

_Q: How does `ConcurrentHashMap` work without a global lock?_
A: It splits writes per-bucket. An empty bucket gets a CAS install. A non-empty bucket synchronises on the head node so only one writer touches that chain at a time. Resizing is collaborative — multiple threads help migrate entries to a new table.

_Q: When would you reach for a virtual thread?_
A: Blocking IO at high concurrency. A REST handler that calls a database and a third-party API spends most of its time waiting. With virtual threads, the carrier pool stays small and you can run tens of thousands concurrently. Avoid for CPU-bound work — use a small fixed-size platform-thread pool.

_Q: How would you debug a `ThreadLocal` leak?_
A: Take a heap dump under load. Look for unusually large `Thread[]`-rooted retention paths into the leaking class. The culprit is almost always a thread-pool thread holding a reference set in the prior request that nobody cleared.
