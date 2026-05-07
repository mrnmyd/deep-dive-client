# Collections: HashMap internals, ConcurrentHashMap, CopyOnWriteArrayList, BlockingQueue

**HashMap**

- Buckets indexed by `hash(key) & (capacity - 1)` (capacity is always a power of two).
- Collisions stored in a singly linked list; once a bucket reaches the **treeify threshold** (8 entries with capacity ≥ 64), it converts to a red-black tree, dropping worst-case to `O(log n)`.
- Resizing doubles capacity; entries either stay in the same bucket or move to `bucket + oldCapacity`.
- **Not thread-safe.** Concurrent mutation can produce a corrupted bucket chain or an infinite loop in older JDKs.

**ConcurrentHashMap**

- Lock-free reads in most cases.
- Mutations lock per-bucket (CAS for empty, `synchronized` on the head node otherwise).
- Bulk operations (`forEach`, `reduce`) accept a parallelism threshold.
- **No null keys or values** — null would be ambiguous in concurrent reads.

**CopyOnWriteArrayList**

- Mutations copy the entire backing array. Reads are wait-free.
- Use for tiny, read-heavy collections (listener lists). Wrong for frequent writes — every `add` is `O(n)`.

**BlockingQueue**

```java
BlockingQueue<Task> queue = new ArrayBlockingQueue<>(1000);

// producer
queue.put(task);                       // blocks if full → backpressure

// consumer
Task task = queue.take();              // blocks if empty
```

Use a bounded queue. Unbounded queues hide overload until memory fails.

---
