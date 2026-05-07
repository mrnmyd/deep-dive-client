# Multithreading: JMM, locks, synchronizers, ThreadLocal, ForkJoinPool, virtual threads

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
