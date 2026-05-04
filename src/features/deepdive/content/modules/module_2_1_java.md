# Advanced Java

Senior Java interviews test runtime behaviour: memory model, concurrency, collection internals, and modern language features. Syntax recall is not enough.

## JVM: class loaders, memory, JIT, GC algorithms

The JVM loads bytecode, verifies it, executes it, and optimises hot paths.

**Class loaders** form a delegation hierarchy: bootstrap → platform → application → custom. Delegation prevents duplicate loading of core classes and supports isolation in containers, app servers, or plugin systems.

**Memory areas**

| Area               | Holds                             | Lifetime            |
| ------------------ | --------------------------------- | ------------------- |
| Stack (per thread) | Method frames, locals, references | Lives with the call |
| Heap               | All objects                       | GC-managed          |
| Metaspace          | Class metadata, method bytecode   | Until class unload  |
| Code cache         | JIT-compiled native code          | JIT-managed         |
| Native memory      | Direct buffers, JNI allocations   | Outside Java heap   |

OutOfMemoryError can come from any of these. `Metaspace` errors usually indicate classloader leaks (often from frameworks or hot-redeploys).

**JIT compilation** identifies hot methods (counter-based) and compiles bytecode to optimised machine code. Tiered compilation (C1 then C2) balances startup with peak. Escape analysis can stack-allocate or scalarise objects.

**GC algorithms**

| Collector        | Goal                    | When to choose             |
| ---------------- | ----------------------- | -------------------------- |
| Serial           | Simple, single-threaded | Tiny services, single-core |
| Parallel         | Throughput              | Batch jobs, no latency SLO |
| G1               | Predictable pauses      | Default modern choice      |
| ZGC / Shenandoah | Sub-millisecond pauses  | Latency-sensitive APIs     |

**Tuning intuition**

- Long pauses with G1: increase heap or reduce live set; check humongous allocations.
- Frequent young-gen collections: enlarge young gen.
- Always enable GC logging (`-Xlog:gc*`) before tuning. Do not change collectors without baseline numbers.

---

## Multithreading

The Java Memory Model defines visibility and ordering across threads. Without a **happens-before** relationship, one thread may not see another thread's writes when you expect.

**Visibility primitives**

| Tool                 | Provides                                    | Doesn't provide                               |
| -------------------- | ------------------------------------------- | --------------------------------------------- |
| `volatile`           | Visibility, ordering of single read/write   | Atomicity of compound ops                     |
| `synchronized`       | Mutual exclusion + visibility               | Try-lock, fairness, conditions                |
| `ReentrantLock`      | Above + try-lock, interruptible, conditions | Auto-release on exception (use `try/finally`) |
| `AtomicInteger` etc. | Atomic CAS without locks                    | Composite invariants across multiple atomics  |

**Common bug: double-checked locking, fixed**

```java
class Singleton {
    private static volatile Singleton instance;        // volatile is required

    public static Singleton get() {
        Singleton local = instance;
        if (local == null) {
            synchronized (Singleton.class) {
                local = instance;
                if (local == null) {
                    local = new Singleton();
                    instance = local;
                }
            }
        }
        return local;
    }
}
```

Without `volatile`, another thread can observe a partially constructed object because the assignment to `instance` can be reordered relative to the constructor.

**Synchronizers**

```java
CountDownLatch start = new CountDownLatch(1);
CountDownLatch done  = new CountDownLatch(workers);

for (int i = 0; i < workers; i++) {
    new Thread(() -> {
        try { start.await(); } catch (InterruptedException e) { ... }
        // do work
        done.countDown();
    }).start();
}
start.countDown();   // release all workers at once
done.await();        // wait for all to finish
```

| Synchronizer     | Use                                                     |
| ---------------- | ------------------------------------------------------- |
| `Semaphore`      | Limit concurrent access to a resource                   |
| `CountDownLatch` | Wait for N events, single-use                           |
| `CyclicBarrier`  | Repeating rendezvous of N threads                       |
| `Phaser`         | Like CyclicBarrier but parties can register/deregister  |
| `ThreadLocal`    | Per-thread state — call `remove()` in pools or you leak |
| `ForkJoinPool`   | Work-stealing pool for recursive parallelism            |

**Virtual threads (JDK 21+)** unmount from the carrier thread on blocking calls, so blocking IO is cheap. Create them eagerly:

```java
try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
    var futures = orders.stream()
        .map(o -> executor.submit(() -> process(o)))
        .toList();
    for (var f : futures) f.get();
}
```

Virtual threads do **not** make CPU-bound work faster — those still need a small platform-thread pool.

**Common pitfalls**

- `synchronized` self-invocation does not deadlock (locks are reentrant) but `@Transactional` does not apply across self-invocation because the proxy is bypassed.
- `ThreadLocal` in pooled threads leaks unless you call `remove()` in a `finally` block.
- Holding locks while calling user code (callbacks) invites deadlocks.

---

## Collections internals

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

## Modern Java

**Streams**

```java
Map<Department, List<Employee>> byDept = employees.stream()
    .filter(e -> e.salary() > 50_000)
    .collect(groupingBy(Employee::department));

double averageBySeniority = employees.stream()
    .collect(averagingDouble(e -> e.tenureYears()));
```

Streams are best for clear pipelines. Imperative code is sometimes clearer; do not force a stream.

**Optional**

```java
return repo.findById(id)
    .filter(Order::isActive)
    .map(this::toDto)
    .orElseThrow(() -> new NotFoundException(id));
```

Use `Optional` as a return type to communicate possible absence. Avoid as a field, parameter, or in collections — `null` plus a `@Nullable` annotation reads better.

**Records, sealed classes, pattern matching**

```java
sealed interface Result<T> permits Ok, Err {}
record Ok<T>(T value) implements Result<T> {}
record Err<T>(String message) implements Result<T> {}

String describe(Result<Integer> r) {
    return switch (r) {
        case Ok<Integer> ok    -> "ok: " + ok.value();
        case Err<Integer> err  -> "err: " + err.message();
    };
}
```

Sealed types make exhaustiveness real. The compiler enforces that every subtype is handled in a switch.

---

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
