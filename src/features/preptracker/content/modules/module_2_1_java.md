# Advanced Java

Senior Java interviews test whether you understand how Java behaves at runtime, not just syntax. Focus on memory, concurrency, collection internals, and modern language features.

## JVM: class loaders, memory, JIT, GC algorithms

The JVM loads bytecode, verifies it, executes it, and optimizes hot paths. Class loaders form a delegation hierarchy: bootstrap, platform, application, and custom loaders. Delegation prevents duplicate loading of core classes and supports isolation in containers or app servers.

Memory areas matter for debugging. The stack stores method frames, local variables, and references. The heap stores objects. Metaspace stores class metadata. Native memory is outside the Java heap and can still cause process-level memory pressure.

JIT compilation identifies hot methods and compiles bytecode into optimized machine code. This is why JVM performance can improve after warmup. Escape analysis may remove allocations or enable scalar replacement.

Garbage collectors differ by goal:

- Serial GC is simple and stop-the-world.
- Parallel GC optimizes throughput.
- G1 splits heap into regions and targets predictable pauses.
- ZGC and Shenandoah focus on very low pause times.

In interviews, connect GC to real systems: latency-sensitive APIs care about pause time; batch jobs often care more about throughput.

## Multithreading: JMM, locks, synchronizers, ThreadLocal, virtual threads

The Java Memory Model defines visibility and ordering. Without a happens-before relationship, one thread may not see another thread's writes when you expect.

`volatile` gives visibility and ordering for a variable, but it does not make compound operations atomic. `synchronized` provides mutual exclusion and establishes happens-before between unlock and subsequent lock. `ReentrantLock` provides explicit locking, try-lock, interruptible lock acquisition, and conditions.

Common synchronizers:

- `Semaphore` controls permits.
- `CountDownLatch` waits until a count reaches zero.
- `CyclicBarrier` lets a fixed group meet repeatedly.
- `ThreadLocal` stores per-thread state, but can leak in thread pools if not removed.
- `ForkJoinPool` supports work stealing for recursive parallel tasks.

Virtual threads make blocking code cheaper by decoupling Java tasks from OS threads. They are excellent for high-concurrency blocking IO, but they do not make CPU-bound work faster.

## Collections: HashMap, ConcurrentHashMap, CopyOnWriteArrayList, BlockingQueue

`HashMap` stores buckets by hash. In modern JDKs, long collision chains can treeify into red-black trees. Important points: keys need stable `equals` and `hashCode`, iteration order is not guaranteed, and it is not thread-safe.

`ConcurrentHashMap` supports concurrent access with finer-grained synchronization and lock-free reads in many cases. It does not allow null keys or values, which avoids ambiguity in concurrent reads.

`CopyOnWriteArrayList` copies the backing array on mutation. It is good for many reads and rare writes, such as listener lists. It is bad for frequent writes.

`BlockingQueue` coordinates producers and consumers. Use bounded queues to apply backpressure; unbounded queues can hide overload until memory fails.

## Modern Java: lambdas, streams, Optional, records, sealed classes, pattern matching

Lambdas let behavior be passed as values. Streams express transformations, filtering, grouping, and reductions. They are best for clear data pipelines, not every loop.

`Optional` models possible absence in return values. Avoid using it for fields or parameters unless there is a strong reason.

Records are concise immutable data carriers with generated constructor, accessors, equals, hashCode, and toString. Sealed classes restrict which classes can extend a type, helping model finite hierarchies.

Pattern matching reduces boilerplate when checking and extracting types. The senior-level answer is to use these features where they improve domain clarity without hiding complexity.
